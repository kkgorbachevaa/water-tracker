import { describe, expect, it } from "vitest";
import type { WaterTrackerSession } from "../types/waterTracker";
import { calculateDailyProgress } from "./calculateDailyProgress";

describe("Расчеты дневного прогресса", () => {
  it("возвращает начальные показатели при пустой истории", () => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 2000,
      entries: [],
      lastSelectedContainer: null,
    };

    const result = calculateDailyProgress(session);

    expect(result).toEqual({
      consumedMl: 0,
      remainingMl: 2000,
      progressPercent: 0,
      bottleLevelPercent: 100,
    });
  });

  it("суммирует записи и рассчитывает прогресс до достижения цели", () => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 2000,
      entries: [
        {
          id: "entry-1",
          amountMl: 200,
          addedAt: "2026-10-30T08:00:00.000Z",
          source: { method: "manual" },
        },
        {
          id: "entry-2",
          amountMl: 300,
          addedAt: "2026-10-30T09:00:00.000Z",
          source: { method: "manual" },
        },
      ],
      lastSelectedContainer: null,
    };

    const result = calculateDailyProgress(session);

    expect(result).toEqual({
      consumedMl: 500,
      remainingMl: 1500,
      progressPercent: 25,
      bottleLevelPercent: 75,
    });
  });

  it.each([
    {
      description: "при достижении цели",
      amountMl: 2000,
      progressPercent: 100,
    },
    {
      description: "при превышении цели",
      amountMl: 2500,
      progressPercent: 125,
    },
  ])("рассчитывает показатели $description", (testCase) => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 2000,
      entries: [
        {
          id: "entry-1",
          amountMl: testCase.amountMl,
          addedAt: "2026-10-30T08:00:00.000Z",
          source: { method: "manual" },
        },
      ],
      lastSelectedContainer: null,
    };

    const result = calculateDailyProgress(session);

    expect(result).toEqual({
      consumedMl: testCase.amountMl,
      remainingMl: 0,
      progressPercent: testCase.progressPercent,
      bottleLevelPercent: 0,
    });
  });

  it("рассчитывает дробные проценты для другой дневной цели", () => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 1500,
      entries: [
        {
          id: "entry-1",
          amountMl: 500,
          addedAt: "2026-10-30T08:00:00.000Z",
          source: { method: "manual" },
        },
      ],
      lastSelectedContainer: null,
    };

    const result = calculateDailyProgress(session);

    expect(result.consumedMl).toBe(500);
    expect(result.remainingMl).toBe(1000);
    expect(result.progressPercent).toBeCloseTo(33.3333, 4);
    expect(result.bottleLevelPercent).toBeCloseTo(66.6667, 4);
  });
});
