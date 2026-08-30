"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiGet, apiPost } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-900 outline-none transition-colors focus:border-blue-600";
const textareaClass = `${inputClass} resize-none`;

type Role = "admin" | "manager" | "teacher" | "student" | "parent";

const ROLES: { value: Role; label: string }[] = [
  { value: "student", label: "Студент" },
  { value: "teacher", label: "Учитель" },
  { value: "parent", label: "Родитель" },
  { value: "manager", label: "Менеджер" },
  { value: "admin", label: "Админ" },
];

const EXAM_TYPES = ["ielts", "hsk", "sat"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[13px] font-semibold text-slate-600">{label}</div>
      {children}
    </label>
  );
}

function randomPassword() {
  return Math.random().toString(36).slice(-10) + "A1!";
}

interface TeacherOption {
  id: string;
  profiles?: { full_name: string | null };
}

export function UserForm() {
  const router = useRouter();
  const { token } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [examType, setExamType] = useState("ielts");
  const [currentLevel, setCurrentLevel] = useState("");
  const [targetLevel, setTargetLevel] = useState("");
  const [targetCountry, setTargetCountry] = useState("");

  const [specializations, setSpecializations] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (role !== "student" || !token) return;
    apiGet<TeacherOption[]>("/teachers?limit=100", token).then((res) => setTeachers(res.data || []));
  }, [role, token]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Укажите имя");
    if (!email.trim()) return setError("Укажите email");
    if (password.length < 6) return setError("Пароль минимум 6 символов");

    startTransition(async () => {
      const userRes = await apiPost<{ id: string }>(
        "/users",
        { email: email.trim(), password, full_name: fullName.trim(), role, phone: phone.trim() || undefined },
        token
      );
      if (userRes.error || !userRes.data) {
        setError(userRes.error || "Не удалось создать пользователя");
        return;
      }

      const userId = userRes.data.id;

      if (role === "student") {
        const studentRes = await apiPost(
          "/students",
          {
            user_id: userId,
            teacher_id: teacherId || undefined,
            current_exam: examType || undefined,
            current_level: currentLevel.trim() || undefined,
            target_level: targetLevel.trim() || undefined,
            target_country: targetCountry.trim() || undefined,
          },
          token
        );
        if (studentRes.error) {
          setError(`Пользователь создан, но не удалось сохранить данные студента: ${studentRes.error}`);
          return;
        }
      }

      if (role === "teacher") {
        const specs = specializations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const teacherRes = await apiPost("/teachers", { user_id: userId, specializations: specs, bio: bio.trim() || undefined }, token);
        if (teacherRes.error) {
          setError(`Пользователь создан, но не удалось сохранить данные учителя: ${teacherRes.error}`);
          return;
        }
      }

      router.push("/admin/users");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-4">
      <Field label="Роль">
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputClass}>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Имя">
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Email">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Телефон">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 ___ ___ ____" className={inputClass} />
      </Field>

      <Field label="Пароль">
        <div className="flex gap-2">
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          <button
            type="button"
            onClick={() => setPassword(randomPassword())}
            className="whitespace-nowrap rounded-xl border border-slate-200 px-3.5 py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            Сгенерировать
          </button>
        </div>
      </Field>

      {role === "student" && (
        <>
          <Field label="Учитель">
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={inputClass}>
              <option value="">— не выбран —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.profiles?.full_name || t.id}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Экзамен">
            <select value={examType} onChange={(e) => setExamType(e.target.value)} className={inputClass}>
              {EXAM_TYPES.map((e) => (
                <option key={e} value={e}>
                  {e.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Текущий уровень">
              <input value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Целевой уровень">
              <input value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Целевая страна">
            <input value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)} className={inputClass} />
          </Field>
        </>
      )}

      {role === "teacher" && (
        <>
          <Field label="Специализации (через запятую)">
            <input value={specializations} onChange={(e) => setSpecializations(e.target.value)} placeholder="ielts, hsk" className={inputClass} />
          </Field>
          <Field label="Описание (bio)">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={textareaClass} />
          </Field>
        </>
      )}

      {role === "parent" && (
        <div className="rounded-xl bg-amber-50 px-3.5 py-3 text-[13px] leading-relaxed text-amber-700">
          Привязку детей к родителю нужно будет сделать отдельно — API пока не поддерживает это при создании.
        </div>
      )}

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(37,99,235,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Создаём…" : "Создать пользователя"}
      </button>
    </form>
  );
}
