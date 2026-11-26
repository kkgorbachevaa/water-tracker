import type { WaterEntry, WaterTrackerSession } from "../types/waterTracker";
import styles from "../App.module.css";
import { calculateDailyProgress } from "../utils/calculateDailyProgress";
import AddWaterForm from "./AddWaterForm";
import WaterBottle from "./WaterBottle";

type TrackerScreenProps = {
  session: WaterTrackerSession;
  onAddWater: (entry: WaterEntry) => void;
};

// Сессией управляет App, а экран отображает данные и передает действия
export default function TrackerScreen({
  session,
  onAddWater,
}: TrackerScreenProps) {
  const progress = calculateDailyProgress(session);

  const goalDifferenceMl = progress.consumedMl - session.dailyGoalMl;
  const goalReached = goalDifferenceMl >= 0;

  // Округляем только отображение, сохраняя точность самих расчетов
  const formattedProgress = progress.progressPercent.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
  });

  return (
    <main className={styles.page}>
      <section
        className={`${styles.startScreen} ${styles.trackerScreen} ${goalReached ? styles.goalCelebration : ""}`}
        aria-labelledby="tracker-title"
      >
        <h1 id="tracker-title" className={styles.title}>
          Сегодня <span aria-hidden="true">💧</span>
        </h1>

        <div className={styles.trackerSummary}>
          <section
            className={styles.goalCard}
            aria-labelledby="session-goal-title"
          >
            <h2 id="session-goal-title" className={styles.sectionTitle}>
              Моя цель на сегодня
            </h2>

            <p>{session.dailyGoalMl} мл</p>
          </section>

          <section
            className={styles.goalCard}
            aria-labelledby="daily-progress-title"
          >
            <h2 id="daily-progress-title" className={styles.sectionTitle}>
              Мой прогресс
            </h2>

            <div className={styles.progressContent}>
              <WaterBottle
                levelPercent={progress.bottleLevelPercent}
                goalReached={goalReached}
              />

              <div className={styles.progressMetrics}>
                <p className={styles.remainingMetric}>
                  Осталось: {progress.remainingMl}&nbsp;мл
                </p>
                <p>Выпито: {progress.consumedMl}&nbsp;мл</p>
                <p>Выполнение цели: {formattedProgress}%</p>
              </div>
            </div>

            <div className={styles.goalStatus} role="status">
              {goalReached && (
                <p className={styles.goalReached}>
                  <span aria-hidden="true">✓</span> Цель достигнута
                </p>
              )}

              {goalDifferenceMl > 0 && (
                <p>На {goalDifferenceMl}&nbsp;мл больше, чем планировалось</p>
              )}
            </div>
          </section>
        </div>
        <AddWaterForm onAddWater={onAddWater} />
      </section>
    </main>
  );
}
