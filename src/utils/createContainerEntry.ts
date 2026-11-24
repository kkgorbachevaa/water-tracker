import type {
  WaterContainer,
  ContainerPortion,
  WaterEntry,
} from "../types/waterTracker";

export function createContainerEntry(
  container: WaterContainer,
  portion: ContainerPortion,
): WaterEntry {
  return {
    id: crypto.randomUUID(),
    amountMl: container.volumeMl * portion,
    addedAt: new Date().toISOString(),
    source: {
      method: "container",
      container,
      portion,
    },
  };
}
