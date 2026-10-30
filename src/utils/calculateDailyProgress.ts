import type { WaterTrackerSession } from "../types/waterTracker";

export function calculateDailyProgress(session: WaterTrackerSession) {
  const consumedMl = session.entries.reduce(
    (totalMl, entry) => totalMl + entry.amountMl,
    0,
  );

  // После превышения цели остаток сохраняется равным нулю
  const remainingMl = Math.max(0, session.dailyGoalMl - consumedMl);

  const progressPercent = (consumedMl / session.dailyGoalMl) * 100;

  // Бутылка опустошается по мере выполнения цели
  const bottleLevelPercent = Math.min(100, Math.max(0, 100 - progressPercent));

  return {
    consumedMl,
    remainingMl,
    progressPercent,
    bottleLevelPercent,
  };
}
