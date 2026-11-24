import { afterEach, describe, expect, it, vi } from "vitest";
import type { WaterContainer } from "../types/waterTracker";
import { createContainerEntry } from "./createContainerEntry";

describe("Создание записи по емкости", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    { portion: 0.25, amountMl: 75 },
    { portion: 0.5, amountMl: 150 },
    { portion: 0.75, amountMl: 225 },
    { portion: 1, amountMl: 300 },
  ] as const)("рассчитывает объем для доли $portion", (testCase) => {
    const container: WaterContainer = {
      type: "bottle",
      volumeMl: 300,
    };

    const entry = createContainerEntry(container, testCase.portion);

    expect(entry.amountMl).toBe(testCase.amountMl);
  });

  it("сохраняет идентификатор, время и источник добавления", () => {
    const expectedId = "11111111-1111-4111-8111-111111111111";
    const addedAt = "2026-11-24T09:00:00.000Z";

    // Фиксируем время и идентификатор для предсказуемой проверки
    vi.useFakeTimers();
    vi.setSystemTime(new Date(addedAt));
    vi.spyOn(crypto, "randomUUID").mockReturnValue(expectedId);

    const container: WaterContainer = {
      type: "cup",
      volumeMl: 200,
    };

    const entry = createContainerEntry(container, 0.5);

    expect(entry).toEqual({
      id: expectedId,
      amountMl: 100,
      addedAt,
      source: {
        method: "container",
        container: {
          type: "cup",
          volumeMl: 200,
        },
        portion: 0.5,
      },
    });
  });

  it("создает новый идентификатор для каждого добавления", () => {
    const container: WaterContainer = {
      type: "glass",
      volumeMl: 200,
    };

    const firstEntry = createContainerEntry(container, 1);
    const secondEntry = createContainerEntry(container, 1);

    expect(firstEntry.id).not.toBe(secondEntry.id);
  });
});
