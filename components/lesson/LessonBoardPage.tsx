"use client";

import dynamic from "next/dynamic";
import type { LessonBoardSnapshot } from "@/lib/lesson-board";

const ExcalidrawBoard = dynamic(
  () => import("./ExcalidrawBoard").then((module) => module.ExcalidrawBoard),
  { ssr: false },
);

export function LessonBoardPage({ lessonId, initialBoard, canEdit }: { lessonId: string; initialBoard: LessonBoardSnapshot; canEdit: boolean }) {
  return <ExcalidrawBoard lessonId={lessonId} initialBoard={initialBoard} canEdit={canEdit} />;
}
