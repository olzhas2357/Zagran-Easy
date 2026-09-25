import { getTaskFolders, getTasks } from "@/lib/teacher-data";
import { TaskLibrary } from "@/components/teacher/TaskLibrary";

export default async function TeacherTasksPage() {
  const [tasks, folders] = await Promise.all([getTasks(), getTaskFolders()]);
  return <div className="flex flex-col gap-6 p-5 sm:p-8">
    <div><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">База знаний</h1>
      <p className="mt-2 text-sm text-ze-muted">Собирайте задания в папки по темам и выбирайте их для уроков и домашних работ.</p></div>
    <TaskLibrary folders={folders} tasks={tasks} />
  </div>;
}
