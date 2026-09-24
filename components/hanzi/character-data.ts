import type { CharacterJson } from "hanzi-writer";

// Replace this adapter with a server-backed loader when the experiment graduates.
// Only the selected character is fetched, never the complete dataset.
export async function loadCharacterData(character: string, signal: AbortSignal): Promise<CharacterJson> {
  const response = await fetch(
    `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(character)}.json`,
    { signal },
  );
  if (!response.ok) throw new Error(`Character data: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.strokes) || !data.strokes.length || !Array.isArray(data.medians) || data.strokes.length !== data.medians.length) {
    throw new Error("Invalid character data");
  }
  return data as CharacterJson;
}
