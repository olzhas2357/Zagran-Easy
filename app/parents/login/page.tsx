import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function ParentsLoginPage() {
  return <Suspense><LoginForm roleLabel="Кабинет родителя" subtitle="Следите за обучением ребёнка, расписанием и оплатой в одном месте." defaultNext="/parents" accent="navy" /></Suspense>;
}