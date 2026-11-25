import { useState } from "react";
import type { SubmitEvent } from "react";
import type {
  ContainerType,
  ContainerVolumeMl,
  ContainerPortion,
  WaterContainer,
} from "../types/waterTracker";
import {
  containerTypeOptions,
  containerVolumeOptions,
  containerPortionOptions,
} from "../data/waterOptions";
import styles from "../App.module.css";

type AddWaterFormProps = {
  onAddWater: (container: WaterContainer, portion: ContainerPortion) => void;
};

export default function AddWaterForm({ onAddWater }: AddWaterFormProps) {
  const [containerType, setContainerType] = useState<ContainerType>("glass");
  const [volumeMl, setVolumeMl] = useState<ContainerVolumeMl>(200);
  const [portion, setPortion] = useState<ContainerPortion>(1);

  // Объем всегда соответствует текущему выбору
  const amountMl = volumeMl * portion;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddWater(
      {
        type: containerType,
        volumeMl,
      },
      portion,
    );
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

      <p>К добавлению: {amountMl} мл</p>

      <button className={styles.startButton} type="submit">
        Добавить запись
      </button>
    </form>
  );
}
