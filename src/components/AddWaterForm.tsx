import { useState } from "react";
import type { SubmitEvent } from "react";
import type {
  ContainerType,
  ContainerVolumeMl,
  ContainerPortion,
  WaterEntry,
} from "../types/waterTracker";
import {
  containerTypeOptions,
  containerVolumeOptions,
  containerPortionOptions,
} from "../data/waterOptions";
import styles from "../App.module.css";
import { createContainerEntry } from "../utils/createContainerEntry";
import { createWaterEntry } from "../utils/createWaterEntry";
import { parsePositiveSafeInteger } from "../utils/parsePositiveSafeInteger";

type AddWaterFormProps = {
  onAddWater: (entry: WaterEntry) => void;
};

export default function AddWaterForm({ onAddWater }: AddWaterFormProps) {
  const [method, setMethod] = useState<"container" | "manual">("container");
  const [containerType, setContainerType] = useState<ContainerType>("glass");
  const [volumeMl, setVolumeMl] = useState<ContainerVolumeMl>(200);
  const [portion, setPortion] = useState<ContainerPortion>(1);
  const [manualAmount, setManualAmount] = useState("");
  const [showManualError, setShowManualError] = useState(false);

  const isManual = method === "manual";

  // Проверяем цифры до преобразования, чтобы дробь не округлилась до целого.
  const manualAmountMl = /^\d+$/.test(manualAmount.trim())
    ? parsePositiveSafeInteger(manualAmount)
    : null;

  const amountMl = isManual ? manualAmountMl : volumeMl * portion;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isManual) {
      if (manualAmountMl === null) {
        setShowManualError(true);
        return;
      }

      onAddWater(createWaterEntry(manualAmountMl, { method: "manual" }));
      return;
    }

    const entry = createContainerEntry(
      { type: containerType, volumeMl },
      portion,
    );

    onAddWater(entry);
  }

  return (
    <form
      className={styles.goalCard}
      aria-labelledby="add-water-title"
      onSubmit={handleSubmit}
    >
      <h2 id="add-water-title" className={styles.sectionTitle}>
        Добавить воду
      </h2>

      <fieldset className={styles.waterOptions}>
        <legend>Способ добавления</legend>

        <label>
          <input
            type="radio"
            name="add-water-method"
            value="container"
            checked={!isManual}
            onChange={() => {
              setMethod("container");
              setShowManualError(false);
            }}
          />
          По емкости
        </label>

        <label>
          <input
            type="radio"
            name="add-water-method"
            value="manual"
            checked={isManual}
            onChange={() => setMethod("manual")}
          />
          Вручную
        </label>
      </fieldset>

      {isManual ? (
        <>
          <label htmlFor="manual-water-amount">Выпитый объем, мл</label>

          <input
            id="manual-water-amount"
            className={styles.goalInput}
            type="text"
            inputMode="numeric"
            value={manualAmount}
            aria-invalid={showManualError}
            aria-describedby={
              showManualError ? "manual-water-error" : undefined
            }
            onChange={(event) => {
              setManualAmount(event.target.value);
              setShowManualError(false);
            }}
          />

          {showManualError && (
            <p id="manual-water-error" className={styles.error} role="alert">
              Укажи объем в миллилитрах — целое число больше нуля
            </p>
          )}
        </>
      ) : (
        <>
          <fieldset className={styles.waterOptions}>
            <legend>Тип емкости</legend>

            {containerTypeOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="container-type"
                  value={option.value}
                  checked={containerType === option.value}
                  onChange={() => setContainerType(option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.waterOptions}>
            <legend>Объем емкости</legend>

            {containerVolumeOptions.map((volume) => (
              <label key={volume}>
                <input
                  type="radio"
                  name="container-volume"
                  value={volume}
                  checked={volumeMl === volume}
                  onChange={() => setVolumeMl(volume)}
                />
                {volume} мл
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.waterOptions}>
            <legend>Выпитая доля</legend>

            {containerPortionOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="container-portion"
                  value={option.value}
                  checked={portion === option.value}
                  onChange={() => setPortion(option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </>
      )}

      <p>К добавлению: {amountMl === null ? "—" : `${amountMl} мл`}</p>

      <button className={styles.startButton} type="submit">
        Добавить запись
      </button>
    </form>
  );
}
