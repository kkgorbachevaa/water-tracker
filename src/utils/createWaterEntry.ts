import type { WaterEntry, WaterEntrySource } from "../types/waterTracker";

export function createWaterEntry(
  amountMl: number,
  source: WaterEntrySource,
): WaterEntry {
  return {
    id: crypto.randomUUID(),
    amountMl,
    addedAt: new Date().toISOString(),
    source,
  };
}
