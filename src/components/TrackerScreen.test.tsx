import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WaterTrackerSession } from "../types/waterTracker";
import TrackerScreen from "./TrackerScreen";

describe("Основной экран", () => {
  it.each([2000, 1750])(
    "показывает цель в мл и начальный прогресс при пустой истории",
    (dailyGoalMl) => {
      const session: WaterTrackerSession = {
        dailyGoalMl,
        entries: [],
        lastSelectedContainer: null,
      };

      render(<TrackerScreen session={session} />);

      const goalCard = screen.getByRole("region", {
        name: "Моя цель на сегодня",
      });

      expect(
        within(goalCard).getByText(`${dailyGoalMl} мл`),
      ).toBeInTheDocument();

      const progressCard = screen.getByRole("region", {
        name: "Мой прогресс",
      });

      expect(
        within(progressCard).getByText("Выпито: 0 мл"),
      ).toBeInTheDocument();

      expect(
        within(progressCard).getByText(`Осталось: ${dailyGoalMl} мл`),
      ).toBeInTheDocument();

      expect(
        within(progressCard).getByText("Выполнение цели: 0%"),
      ).toBeInTheDocument();
    },
  );

  it("показывает прогресс по записям и форматирует дробный процент", () => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 1500,
      entries: [
        {
          id: "entry-1",
          amountMl: 500,
          addedAt: "2026-11-23T08:00:00.000Z",
          source: { method: "manual" },
        },
      ],
      lastSelectedContainer: null,
    };

    render(<TrackerScreen session={session} />);

    const goalCard = screen.getByRole("region", {
      name: "Моя цель на сегодня",
    });

    expect(within(goalCard).getByText("1500 мл")).toBeInTheDocument();

    const progressCard = screen.getByRole("region", {
      name: "Мой прогресс",
    });

    expect(
      within(progressCard).getByText("Выпито: 500 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 1000 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 33,3%"),
    ).toBeInTheDocument();
  });

  it.each([
    {
      description: "при достижении цели",
      amountMl: 2000,
      progressText: "Выполнение цели: 100%",
    },
    {
      description: "при превышении цели",
      amountMl: 2500,
      progressText: "Выполнение цели: 125%",
    },
  ])("показывает показатели $description", (testCase) => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 2000,
      entries: [
        {
          id: "entry-1",
          amountMl: testCase.amountMl,
          addedAt: "2026-11-23T08:00:00.000Z",
          source: { method: "manual" },
        },
      ],
      lastSelectedContainer: null,
    };

    render(<TrackerScreen session={session} />);

    const progressCard = screen.getByRole("region", {
      name: "Мой прогресс",
    });

    expect(
      within(progressCard).getByText(`Выпито: ${testCase.amountMl} мл`),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 0 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText(testCase.progressText),
    ).toBeInTheDocument();
  });

  it("обновляет цель и показатели при получении новой сессии", () => {
    const session: WaterTrackerSession = {
      dailyGoalMl: 2000,
      entries: [],
      lastSelectedContainer: null,
    };

    const { rerender } = render(<TrackerScreen session={session} />);

    expect(screen.getByText("Осталось: 2000 мл")).toBeInTheDocument();

    const updatedSession: WaterTrackerSession = {
      dailyGoalMl: 1000,
      entries: [
        {
          id: "entry-1",
          amountMl: 250,
          addedAt: "2026-11-23T08:00:00.000Z",
          source: { method: "manual" },
        },
      ],
      lastSelectedContainer: null,
    };

    // Обновляем props уже отрисованного компонента
    rerender(<TrackerScreen session={updatedSession} />);

    const goalCard = screen.getByRole("region", {
      name: "Моя цель на сегодня",
    });

    expect(within(goalCard).getByText("1000 мл")).toBeInTheDocument();

    const progressCard = screen.getByRole("region", {
      name: "Мой прогресс",
    });

    expect(
      within(progressCard).getByText("Выпито: 250 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Осталось: 750 мл"),
    ).toBeInTheDocument();

    expect(
      within(progressCard).getByText("Выполнение цели: 25%"),
    ).toBeInTheDocument();
  });
});
