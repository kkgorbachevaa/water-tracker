import type { WaterTrackerSession } from "../types/waterTracker";
import styles from "../App.module.css";
import { calculateDailyProgress } from "../utils/calculateDailyProgress";

type TrackerScreenProps = {
  session: WaterTrackerSession;
};

// Сессией управляет App, а экран получает ее для отображения
export default function TrackerScreen({ session }: TrackerScreenProps) {
  const progress = calculateDailyProgress(session);

  // Округляем только отображение, сохраняя точность самих расчетов
  const formattedProgress = progress.progressPercent.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
  });
  return (
    <main className={styles.page}>
      <section
        className={`${styles.startScreen} ${styles.trackerScreen}`}
        aria-labelledby="tracker-title"
      >
        <h1 id="tracker-title" className={styles.title}>
          Сегодня <span aria-hidden="true">💧</span>
        </h1>

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

          <p>Выпито: {progress.consumedMl} мл</p>
          <p>Осталось: {progress.remainingMl} мл</p>
          <p>Выполнение цели: {formattedProgress}%</p>
        </section>
      </section>
    </main>
  );
}
