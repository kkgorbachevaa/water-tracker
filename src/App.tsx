import waterBottleImage from './assets/water-bottle.png'
import styles from './App.module.css'

function App() {
  return (
    <main className={styles.page}>
      <section
        className={styles.startScreen}
        aria-labelledby="start-screen-title"
      >
        <div className={styles.hero}>
          <img
            className={styles.illustration}
            src={waterBottleImage}
            alt="Бутылка с водой"
          />

          <div className={styles.intro}>
            <h1 id="start-screen-title" className={styles.title}>
              Water Tracker <span aria-hidden="true">💧</span>
            </h1>

            <p className={styles.description}>
              Установи цель на сегодня и следи за тем, сколько воды осталось
              выпить
            </p>
          </div>
        </div>

        <section
          className={styles.goalCard}
          aria-labelledby="daily-goal-title"
        >
          <h2 id="daily-goal-title" className={styles.sectionTitle}>
            Моя цель на сегодня
          </h2>

          {/* Логику сохранения выбранной цели вынесу в отдельную задачу */}
          <select
            id="daily-goal"
            className={styles.goalSelect}
            defaultValue="2000"
          >
            <option value="1500">1500 мл</option>
            <option value="2000">2000 мл</option>
            <option value="2500">2500 мл</option>
            <option value="3000">3000 мл</option>
          </select>
        </section>

        <aside
          className={styles.infoCard}
          aria-labelledby="water-info-title"
        >
          <span className={styles.infoIcon} aria-hidden="true">
            i
          </span>

          <div>
            <h2 id="water-info-title" className={styles.infoTitle}>
              Сколько воды нужно пить?
            </h2>

            <p className={styles.infoText}>
              Потребность в воде индивидуальна и зависит от активности, климата
              и самочувствия. Выбери комфортную цель на сегодня, а приложение
              поможет следить за прогрессом
            </p>
          </div>
        </aside>

        <button className={styles.startButton} type="button">
          Начать
        </button>
      </section>
    </main>
  )
}

export default App