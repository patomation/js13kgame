import { incrementScore, toggleTitle, toggleMenu, gameStarted, toggleGameOver, setScore, toggleInventory, toggleArrowUp, toggleArrowDown, toggleArrowLeft, toggleArrowRight, toggleInteract, removeCoin } from './mutations'
import { state } from './state'
import { VNode } from 'snabbdom/build/package/vnode'

export function arrowUp (): void {
  toggleArrowUp()
}
export function arrowDown (): void {
  toggleArrowDown()
}
export function arrowLeft (): void {
  toggleArrowLeft()
}
export function arrowRight (): void {
  toggleArrowRight()
}

export function collideWithCoin (index: number): void {
  incrementScore(1000)
  removeCoin(index)
}

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

export function inventoryItemClick (event: MouseEvent, vnode: VNode): void {
  if (vnode.data !== undefined) {
    console.log('vnode', vnode.data.index)
  }
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

export function interactKeyDown (): void {
  toggleInteract()
}

export function interactKeyUp (): void {
  toggleInteract()
}
