export const CACHE_TAGS = {
  countries: "education:countries",
  packages: "education:packages",
  universityLists: "universities:lists",
  universities: "universities:all",
  university: (slug: string) => `university:${slug}`,
  teachers: "language:teachers",
  courses: "language:courses",
  courseSections: (courseId: string) => `course-sections:${courseId}`,
} as const;

export const PUBLIC_CACHE_TTL = 3600;
