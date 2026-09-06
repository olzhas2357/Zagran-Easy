"use client";

import { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { saveLessonBoard } from "@/lib/teacher-actions";
import type { LessonBoardSnapshot } from "@/lib/lesson-board";

export function ExcalidrawBoard({ lessonId, initialBoard, canEdit }: { lessonId: string; initialBoard: LessonBoardSnapshot; canEdit: boolean }) {
  const versionRef = useRef(initialBoard.version);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  function queueSave(elements: readonly unknown[], appState: unknown, files: unknown) {
    if (!canEdit) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveState("saving");
    saveTimerRef.current = setTimeout(async () => {
      const result = await saveLessonBoard(
        lessonId,
        { elements: Array.from(elements), appState: sanitizeAppState(appState), files },
        versionRef.current,
      );
      if (!result.success || result.version === undefined) {
        setSaveState("error");
        return;
      }
      versionRef.current = result.version;
      setSaveState("saved");
    }, 700);
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-ze-border bg-white">
      <div className="flex items-center justify-between border-b border-ze-border px-4 py-3">
        <div className="text-[14px] font-bold text-ze-ink">Доска урока</div>
        <div className="text-[12px] text-ze-muted">
          {!canEdit ? "Только просмотр" : saveState === "saving" ? "Сохраняем..." : saveState === "error" ? "Ошибка сохранения" : "Сохранено"}
        </div>
      </div>
      <div className="h-[min(72vh,760px)] min-h-[480px]">
        <Excalidraw
          initialData={{
            elements: (initialBoard.boardData.elements as never[]) || [],
            appState: sanitizeAppState(initialBoard.boardData.appState),
            files: (initialBoard.boardData.files as Record<string, never>) || {},
          }}
          viewModeEnabled={!canEdit}
          onChange={canEdit ? (elements, appState, files) => queueSave(elements, appState, files) : undefined}
          UIOptions={{ canvasActions: { changeViewBackgroundColor: false } }}
        />
      </div>
    </div>
  );
}

function sanitizeAppState(value: unknown): Record<string, unknown> {
  const appState = value && typeof value === "object" ? { ...(value as Record<string, unknown>) } : {};
  // Excalidraw expects collaborators to be a Map; JSON storage turns Map into {}.
  appState.collaborators = new Map();
  return appState;
}
