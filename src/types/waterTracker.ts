// варианты емкостей
export type ContainerType =
  | 'glass'
  | 'cup'
  | 'tumbler'
  | 'bottle'

export type ContainerVolumeMl = 200 | 300 | 400 | 500

// пользователь может выпить часть или всю емкость
export type ContainerPortion = 0.25 | 0.5 | 0.75 | 1

export type WaterContainer = {
  type: ContainerType
  volumeMl: ContainerVolumeMl
}

// сохраняем, как именно вода была добавлена
export type WaterEntrySource =
  | {
      method: 'container'
      container: WaterContainer
      portion: ContainerPortion
    }
  | {
      method: 'manual'
    }

// одна запись нужна для истории и отмены последнего добавления
export type WaterEntry = {
  id: string
  amountMl: number
  addedAt: string // дата и время в формате ISO
  source: WaterEntrySource
}

// здесь храним только исходные данные
// выпитый объем, остаток и процент будем вычислять из истории
export type WaterTrackerSession = {
  dailyGoalMl: number
  entries: WaterEntry[]
  lastSelectedContainer: WaterContainer | null
}