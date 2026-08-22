"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "ze-compare-universities";
const MAX_COMPARE = 3;
const CHANGE_EVENT = "ze-compare-change";

let cache: string[] | null = null;
const EMPTY: string[] = [];

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): string[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function write(next: string[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Список сравнения вузов — хранится в localStorage (per-viewer), синхронизируется
// между компонентами/вкладками через useSyncExternalStore.
export function useCompareList() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    const current = getSnapshot();
    if (current.includes(id)) {
      write(current.filter((x) => x !== id));
    } else if (current.length < MAX_COMPARE) {
      write([...current, id]);
    }
  }, []);

  const remove = useCallback((id: string) => {
    write(getSnapshot().filter((x) => x !== id));
  }, []);

  return { ids, toggle, remove, max: MAX_COMPARE };
}
