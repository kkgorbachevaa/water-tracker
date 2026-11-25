import styles from "./WaterBottle.module.css";

type WaterBottleProps = {
  levelPercent: number;
};

export default function WaterBottle({ levelPercent }: WaterBottleProps) {
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
      <div className={styles.cap} />
    </div>
  );
}
