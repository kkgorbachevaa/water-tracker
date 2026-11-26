import styles from "./WaterBottle.module.css";

type WaterBottleProps = {
  levelPercent: number;
  goalReached: boolean;
};

export default function WaterBottle({
  levelPercent,
  goalReached,
}: WaterBottleProps) {
  return (
    <div className={styles.bottle} aria-hidden="true">
      <div className={styles.neck} />
      <div className={styles.body}>
        <div
          className={styles.water}
          data-testid="bottle-water"
          style={{ height: `${levelPercent}%` }}
        />
      </div>
      <div className={styles.cap}>
        {goalReached && (
          <div className={styles.goalSplash}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </div>
  );
}
