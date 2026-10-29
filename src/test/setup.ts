import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// После каждого теста удаляем отрисованные компоненты
afterEach(cleanup)