import { afterEach, expect, it, vi } from "vitest";
import { createWaterEntry } from "./createWaterEntry";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("создает ручную запись с переданным объемом", () => {
  const id = "11111111-1111-4111-8111-111111111111";
  const addedAt = "2026-11-24T09:00:00.000Z";

  // Фиксируем время и идентификатор, чтобы проверить запись целиком
  vi.useFakeTimers();
  vi.setSystemTime(new Date(addedAt));
  vi.spyOn(crypto, "randomUUID").mockReturnValue(id);

  expect(createWaterEntry(275, { method: "manual" })).toEqual({
    id,
    amountMl: 275,
    addedAt,
    source: { method: "manual" },
  });
});
