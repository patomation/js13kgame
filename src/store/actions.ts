import { incrementScore, toggleTitle, toggleMenu, gameStarted, toggleGameOver, setScore, toggleInventory } from './mutations'
import { state } from './state'

export function escape (): void {
  if (state.showInventoryScreen) {
    toggleInventory()
  } else if (!state.gameStarted) {
    startGame()
  } else if (state.gameStarted && !state.showMenuScreen) {
    pauseGame()
  } else if (state.gameStarted && state.showMenuScreen) {
    resumeGame()
  }
}

export function inventory (): void {
  toggleInventory()
}

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
