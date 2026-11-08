import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadModule(path, dependencies = {}, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const code = ts.transpileModule(source, {
    fileName: path,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  const context = {
    exports,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    process,
    console,
    ...globals,
  };
  vm.runInNewContext(code, context, { filename: path });
  return exports;
}

const cacheTags = loadModule("../lib/cache-tags.ts");
const normalized = (value) => JSON.parse(JSON.stringify(value));

test("API caches only explicitly opted-in public GET requests", async () => {
  const requests = [];
  const api = loadModule("../lib/api.ts", {}, {
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ success: true, data: {} }) };
    },
  });
  await api.apiGet("/personal");
  await api.apiGet("/public", null, { revalidate: 3600, tags: ["catalog"] });
  await api.apiGet("/public", null, { tags: ["catalog"] });
  await api.apiGet("/personal", "secret", { revalidate: 3600, tags: ["catalog"] });
  await api.apiGet("/offer/token", null, { cache: "no-store" });
  await api.apiPost("/public", {}, null);
  await api.apiGet("/public", null, { revalidate: 0, tags: ["catalog"] });
  await api.apiGet("/public", null, { revalidate: false, tags: ["catalog"] });
  assert.equal(requests[0].options.cache, "no-store");
  assert.deepEqual(normalized(requests[1].options.next), { revalidate: 3600, tags: ["catalog"] });
  assert.equal(requests[2].options.cache, "force-cache");
  assert.deepEqual(normalized(requests[2].options.next.tags), ["catalog"]);
  for (const index of [3, 4, 5, 6]) {
    assert.equal(requests[index].options.cache, "no-store");
    assert.equal(requests[index].options.next, undefined);
  }
  assert.equal(requests[7].options.next.revalidate, false);
});

test("public catalog requests opt into a one-hour cache and matching tags", async () => {
  const calls = [];
  const data = loadModule("../lib/data.ts", {
    react: { cache: (fn) => fn },
    "./api": { apiGet: async (...args) => { calls.push(args); return { data: [] }; } },
    "./cache-tags": cacheTags,
    "@/data/content": {},
    "@/data/tours": {},
  });
  await data.fetchEducationCountries();
  await data.fetchEducationPackages();
  await data.fetchAllUniversities();
  await data.fetchUniversityBySlug("old-name");
  await data.fetchUniversityCatalogBySlug("old-name");
  await data.fetchPublicTeachers();
  await data.fetchPublicCourses();
  await data.getCourseModules("course-id");
  assert.ok(calls.every(([, token, options]) => token === null && options.revalidate === 3600 && options.tags.length));
  assert.ok(calls[2][2].tags.includes(cacheTags.CACHE_TAGS.universityLists));
  assert.ok(calls[3][2].tags.includes(cacheTags.CACHE_TAGS.university("old-name")));
  assert.ok(calls[4][2].tags.includes(cacheTags.CACHE_TAGS.university("old-name")));
  assert.ok(calls[6][2].tags.includes(cacheTags.CACHE_TAGS.courses));
  assert.ok(calls[7][2].tags.includes(cacheTags.CACHE_TAGS.courseSections("course-id")));
});

function actionsHarness(path, extraDependencies = {}) {
  const paths = [];
  const tags = [];
  const calls = [];
  let lookup = { data: { slug: "old-slug" } };
  let mutation = { data: { id: "created" } };
  const api = {
    apiGet: async (...args) => { calls.push(["GET", ...args]); return lookup; },
    apiPatch: async (...args) => { calls.push(["PATCH", ...args]); return mutation; },
    apiPost: async (...args) => { calls.push(["POST", ...args]); return mutation; },
    apiDelete: async (...args) => { calls.push(["DELETE", ...args]); return mutation; },
  };
  const actions = loadModule(path, {
    "next/cache": {
      revalidatePath: (...args) => paths.push(args),
      revalidateTag: (...args) => tags.push(args),
    },
    "next/navigation": { redirect: (url) => { throw new Error(`redirect:${url}`); } },
    "./api": api,
    "./session-data": { getToken: async () => "token" },
    "./staff-data": {},
    "./course-syllabus": {},
    "./cache-tags": cacheTags,
    ...extraDependencies,
  });
  return {
    actions, paths, tags, calls,
    setLookup: (value) => { lookup = value; },
    setMutation: (value) => { mutation = value; },
  };
}

test("university update invalidates old and new slugs and public lists", async () => {
  const h = actionsHarness("../lib/staff-actions.ts");
  const input = {
    slug: "new-slug", name: "Name", nameLocal: "", countryId: "country", city: "City",
    address: "", googleMapsUrl: "", grantDetails: "", description: "", websiteUrl: "",
    youtubeUrl: "", virtualTourUrl: "", contactEmail: "", contactPhone: "", deadlineLabel: "",
    informationSource: "", programList: [],
  };
  await assert.rejects(h.actions.updateUniversity("id", input), /redirect:\/admin\/universities/);
  assert.deepEqual(normalized(h.tags), [
    [cacheTags.CACHE_TAGS.universityLists, { expire: 0 }],
    [cacheTags.CACHE_TAGS.university("old-slug"), { expire: 0 }],
    [cacheTags.CACHE_TAGS.university("new-slug"), { expire: 0 }],
  ]);
  assert.ok(h.paths.some(([path]) => path === "/education/old-slug"));
  assert.ok(h.paths.some(([path]) => path === "/education/new-slug"));
  assert.ok(h.paths.some(([path]) => path === "/education/quiz"));
});

test("catalog mutations invalidate the university, not an unrelated slug", async () => {
  for (const action of ["saveUniversityCatalogItem", "deleteUniversityCatalogItem"]) {
    const h = actionsHarness("../lib/staff-actions.ts");
    const result = action === "saveUniversityCatalogItem"
      ? await h.actions[action]("id", "programs", {})
      : await h.actions[action]("id", "programs", "item");
    assert.equal(result.success, true);
    assert.deepEqual(normalized(h.tags), [[cacheTags.CACHE_TAGS.university("old-slug"), { expire: 0 }]]);
    assert.ok(h.paths.some(([path]) => path === "/education/old-slug"));
  }
});

test("bulk import invalidates all university records and dependent pages", async () => {
  const h = actionsHarness("../lib/staff-actions.ts");
  await h.actions.commitUniversityImport("id", {});
  assert.ok(h.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.universities));
  assert.ok(h.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.universityLists));
  assert.ok(h.paths.some(([path, type]) => path === "/education/[slug]" && type === "page"));
});

test("university verification and visibility changes invalidate list and detail data", async () => {
  for (const action of ["markUniversityVerified", "toggleUniversityActive"]) {
    const h = actionsHarness("../lib/staff-actions.ts");
    const result = await h.actions[action]("id", false);
    assert.equal(result.success, true);
    assert.ok(h.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.universityLists));
    assert.ok(h.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.university("old-slug")));
    assert.ok(h.paths.some(([path]) => path === "/education/old-slug"));
  }
});

test("creating a course invalidates the list and new public path", async () => {
  const h = actionsHarness("../lib/teacher-actions.ts");
  const result = await h.actions.createCourse({
    slug: "new-slug", title: "Course", examType: "hsk", description: "", levelFrom: "", levelTo: "", imageUrl: "",
  });
  assert.equal(result.success, true);
  assert.ok(h.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.courses));
  assert.ok(h.paths.some(([path]) => path === "/courses/new-slug"));
  assert.ok(h.paths.some(([path]) => path === "/language"));
});

test("course updates and section mutations invalidate the correct course", async () => {
  const h = actionsHarness("../lib/teacher-actions.ts");
  await h.actions.updateCourse("id", { slug: "new-slug", title: "", examType: "", description: "", levelFrom: "", levelTo: "", imageUrl: "" });
  assert.ok(h.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.courses));
  assert.ok(h.paths.some(([path]) => path === "/courses/old-slug"));
  assert.ok(h.paths.some(([path]) => path === "/courses/new-slug"));
  for (const action of ["createCourseSection", "updateCourseSection", "deleteCourseSection"]) {
    const section = actionsHarness("../lib/teacher-actions.ts");
    const input = { slug: "section-slug", title: "Section", icon: "", sortOrder: 0 };
    if (action === "createCourseSection") await section.actions[action]("id", input);
    else if (action === "updateCourseSection") await section.actions[action]("id", "section", input);
    else await section.actions[action]("id", "section");
    assert.ok(section.tags.some(([tag]) => tag === cacheTags.CACHE_TAGS.courseSections("id")));
    assert.ok(section.paths.some(([path]) => path === "/courses/old-slug"));
    assert.ok(!section.paths.some(([path]) => path === "/courses/section-slug"));
  }
});

test("failed slug lookup or mutation does not report success or invalidate caches", async () => {
  const h = actionsHarness("../lib/teacher-actions.ts");
  h.setLookup({ data: null, error: "lookup failed" });
  const result = await h.actions.deleteCourseSection("id", "section");
  assert.equal(result.success, false);
  assert.equal(result.error, "lookup failed");
  assert.equal(h.calls.length, 1);
  assert.equal(h.tags.length, 0);
  h.setLookup({ data: { slug: "old-slug" } });
  h.setMutation({ data: null, error: "mutation failed" });
  const failed = await h.actions.deleteCourseSection("id", "section");
  assert.equal(failed.error, "mutation failed");
  assert.equal(h.tags.length, 0);
});

test("compare and quiz projections omit large source data and keep required fields", () => {
  const catalog = loadModule("../lib/education-catalog.ts", { "./currency": {} });
  const u = {
    id: "id", slug: "slug", name: "Name", country: "Country", city: "City", flag: "flag",
    rankingNational: 1, tuitionFrom: 100, tuitionCurrency: "CNY", deadlineLabel: "soon",
    ieltsRequired: false, hasGrant: true, hasDormitory: true, languages: ["中文"], ratingStars: 5,
    needsVerification: false, source: { description: "x".repeat(10000) }, imageUrl: "large",
  };
  const compare = normalized(catalog.toCompareUniversity(u));
  const quiz = normalized(catalog.toQuizUniversity(u));
  assert.deepEqual(Object.keys(compare).sort(), ["city", "deadlineLabel", "flag", "hasDormitory", "hasGrant", "id", "ieltsRequired", "languages", "name", "rankingNational", "tuitionCurrency", "tuitionFrom"].sort());
  assert.deepEqual(Object.keys(quiz).sort(), ["city", "country", "flag", "id", "ieltsRequired", "name", "needsVerification", "ratingStars", "slug", "tuitionCurrency", "tuitionFrom"].sort());
  assert.ok(JSON.stringify(compare).length < JSON.stringify(u).length / 10);
  assert.ok(JSON.stringify(quiz).length < JSON.stringify(u).length / 10);
});
