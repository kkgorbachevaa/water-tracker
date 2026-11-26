import type {
  WaterContainer,
  ContainerPortion,
  WaterEntry,
} from "../types/waterTracker";
import { createWaterEntry } from "./createWaterEntry";

export function createContainerEntry(
  container: WaterContainer,
  portion: ContainerPortion,
): WaterEntry {
  return createWaterEntry(container.volumeMl * portion, {
    method: "container",
    container,
    portion,
  });
}
