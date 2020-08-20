import { incrementScore, toggleTitle, toggleMenu, gameStarted, toggleGameOver, setScore } from './mutations'

export function newGame (): void {
  toggleGameOver()
  setScore(0)
}

export function pauseGame (): void {
  toggleMenu()
}

export function resumeGame (): void {
  toggleMenu()
}

export function scoreButtonClick (): void {
  incrementScore(1000)
}

export function startGame (): void {
  gameStarted(true)
  toggleTitle()
}
