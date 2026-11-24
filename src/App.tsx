import waterBottleImage from "./assets/water-bottle.png";
import styles from "./App.module.css";
import { useState } from "react";
import type {
  WaterTrackerSession,
  WaterContainer,
  ContainerPortion,
} from "./types/waterTracker";
import type { SubmitEvent } from "react";
import TrackerScreen from "./components/TrackerScreen";
import { createContainerEntry } from "./utils/createContainerEntry";

function App() {
  // Храним ввод строкой, чтобы пользователь мог полностью очистить поле
  const [dailyGoal, setDailyGoal] = useState("2000");
  // состояние ошибки
  const [error, setError] = useState<string | null>(null);

  // состояние сессии
  const [session, setSession] = useState<WaterTrackerSession | null>(null);

  function handleStart(event: SubmitEvent<HTMLFormElement>) {
    // Обрабатываем отправку формы в React без перезагрузки страницы
    event.preventDefault();

    // Преобразуем строку в число только перед проверкой цели
    const dailyGoalMl = Number(dailyGoal);

    if (!Number.isSafeInteger(dailyGoalMl) || dailyGoalMl <= 0) {
      setError("Укажи цель в миллилитрах — целое число больше нуля");
      return;
    }

    setError(null);

    // новая сессия начинается с выбранной цели и пустой истории
    setSession({
      dailyGoalMl,
      entries: [],
      lastSelectedContainer: null,
    });
  }

  function handleAddWater(
    container: WaterContainer,
    portion: ContainerPortion,
  ) {
    // Создаем запись один раз на отправку формы
    const entry = createContainerEntry(container, portion);

    setSession((currentSession) => {
      if (currentSession === null) {
        return currentSession;
      }

      return {
        ...currentSession,
        entries: [...currentSession.entries, entry],
        lastSelectedContainer: container,
      };
    });
  }

  if (session !== null) {
    return <TrackerScreen session={session} onAddWater={handleAddWater} />;
  }

  return (
    <main className={styles.page}>
      <form
        className={`${styles.startScreen} ${styles.startLayout}`}
        aria-labelledby="start-screen-title"
        onSubmit={handleStart}
        noValidate
      >
        <img
          className={styles.illustration}
          src={waterBottleImage}
          alt="Бутылка с водой"
        />

        <div className={styles.startContent}>
          <div className={styles.intro}>
            <h1 id="start-screen-title" className={styles.title}>
              Water Tracker <span aria-hidden="true">💧</span>
            </h1>

            <p className={styles.description}>
              Установи дневную цель и следи за прогрессом.
            </p>
          </div>

          <section
            className={styles.goalCard}
            aria-labelledby="daily-goal-title"
          >
            <h2 id="daily-goal-title" className={styles.sectionTitle}>
              Моя цель на сегодня
            </h2>

            <label htmlFor="daily-goal">Дневная цель, мл</label>

            <input
              id="daily-goal"
              className={styles.goalInput}
              type="number"
              min="1"
              step="1"
              value={dailyGoal}
              aria-invalid={error !== null}
              aria-describedby={error ? "daily-goal-error" : undefined}
              onChange={(event) => {
                setDailyGoal(event.target.value);
                setError(null);
              }}
            />

            {error && (
              <p id="daily-goal-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
          </section>

          <aside className={styles.infoCard} aria-labelledby="water-info-title">
            <span className={styles.infoIcon} aria-hidden="true">
              i
            </span>

            <div>
              <h2 id="water-info-title" className={styles.infoTitle}>
                Сколько воды нужно пить?
              </h2>

              <p className={styles.infoText}>
                Потребность в воде индивидуальна и зависит от активности,
                климата и самочувствия. Выбери комфортную цель на сегодня, а
                приложение поможет следить за прогрессом
              </p>
            </div>
          </aside>

          <button className={styles.startButton} type="submit">
            Начать
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
