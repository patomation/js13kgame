import { state, setState } from './state'

export function gameStarted (value: boolean): void {
  setState({ gameStarted: value })
}

export function incrementScore (amount: number): void {
  setState({ score: state.score + amount })
}

export function removeCoin (index: number): void {
  const coins = [...state.coins]
  coins.splice(index, 1)
  setState({ coins })
}

export function setScore (value: number): void {
  setState({ score: value })
}

export function toggleArrowUp (): void {
  setState({ arrowUp: !state.arrowUp })
}
export function toggleArrowDown (): void {
  setState({ arrowDown: !state.arrowDown })
}
export function toggleArrowLeft (): void {
  setState({ arrowLeft: !state.arrowLeft })
}
export function toggleArrowRight (): void {
  setState({ arrowRight: !state.arrowRight })
}

export function toggleGameOver (): void {
  setState({ gameOver: !state.gameOver })
}

export function toggleInteract (): void {
  setState({ interacting: !state.interacting })
}

export function toggleInventory (): void {
  setState({ showInventoryScreen: !state.showInventoryScreen })
}

export function toggleMenu (): void {
  setState({ showMenuScreen: !state.showMenuScreen })
}

export function toggleTitle (): void {
  setState({ showTitleScreen: !state.showTitleScreen })
}
