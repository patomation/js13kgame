import { state, setState } from './state'

export function gameStarted (value: boolean): void {
  setState({ gameStarted: value })
}

export function incrementComputerInteractProgress (index: number, amount: number): void {
  const computers = [...state.computers]
  computers[index].interactProgress += amount
  setState({ computers })
}

export function incrementScore (amount: number): void {
  setState({ score: state.score + amount })
}

export function removeCoin (x: number, y: number): void {
  // todo better deep clone
  const coins = [...state.coins]
  coins[y][x] = null
  setState({ coins })
}

export function setCoins (coins: Array<Array<string | null>>): void {
  setState({ coins })
}

export function setComputerStatusOk (index: number): void {
  const computers = [...state.computers]
  computers[index].status = '200'
  setState({ computers })
}

export function setComputerPlayerOver (index: number, value: boolean): void {
  const computers = [...state.computers]
  computers[index].playerOver = value
  setState({ computers })
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
