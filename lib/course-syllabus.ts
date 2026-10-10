export interface CourseSyllabus {
  id: string;
  courseId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  comment: string | null;
  version: number;
  updatedAt: string;
  url: string;
}

export interface StudentLearningCourse {
  id: string;
  title: string;
  description: string;
  examType: string;
  levelFrom: string;
  levelTo: string;
  totalLessons: number;
  totalTasks: number;
  estimatedHours: number;
}

export function mapCourseSyllabus(row: Record<string, unknown>): CourseSyllabus {
  return {
    id: String(row.id ?? ""),
    courseId: String(row.course_id ?? ""),
    fileName: String(row.file_name ?? "Syllabus"),
    mimeType: String(row.mime_type ?? "application/pdf"),
    sizeBytes: Number(row.size_bytes ?? 0),
    comment: row.comment ? String(row.comment) : null,
    version: Number(row.version ?? 1),
    updatedAt: String(row.updated_at ?? ""),
    url: String(row.url ?? ""),
  };
}

export function mapStudentLearningCourse(row: Record<string, unknown>): StudentLearningCourse {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? "Языковой курс"),
    description: String(row.description ?? ""),
    examType: String(row.exam_type ?? ""),
    levelFrom: String(row.level_from ?? ""),
    levelTo: String(row.level_to ?? ""),
    totalLessons: Number(row.total_lessons ?? 0),
    totalTasks: Number(row.total_tasks ?? 0),
    estimatedHours: Number(row.estimated_hours ?? 0),
  };
}
