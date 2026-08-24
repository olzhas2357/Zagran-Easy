"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

// framer-motion's useReducedMotion() reads matchMedia synchronously at module load
// on the client, which differs from its always-null SSR value and causes a hydration
// mismatch. useSyncExternalStore keeps the server/first-paint snapshot consistent
// (always false) and only applies the real value once subscribed on the client.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
