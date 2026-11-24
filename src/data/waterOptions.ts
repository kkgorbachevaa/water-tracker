import type {
  ContainerType,
  ContainerVolumeMl,
  ContainerPortion,
} from "../types/waterTracker";

type ContainerTypeOption = {
  value: ContainerType;
  label: string;
};

type ContainerPortionOption = {
  value: ContainerPortion;
  label: string;
};

export const containerTypeOptions: ContainerTypeOption[] = [
  { value: "glass", label: "Стакан" },
  { value: "cup", label: "Чашка" },
  { value: "tumbler", label: "Термостакан" },
  { value: "bottle", label: "Бутылка" },
];

export const containerVolumeOptions: ContainerVolumeMl[] = [200, 300, 400, 500];

export const containerPortionOptions: ContainerPortionOption[] = [
  { value: 0.25, label: "Четверть" },
  { value: 0.5, label: "Половина" },
  { value: 0.75, label: "Три четверти" },
  { value: 1, label: "Вся емкость" },
];
