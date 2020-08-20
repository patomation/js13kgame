import { incrementScore, toggleTitleScreen } from './mutations'

export function scoreButtonClick (): void {
  incrementScore(1000)
}

export function startGame (): void {
  toggleTitleScreen()
}
