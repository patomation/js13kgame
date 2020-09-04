import { incrementScore, toggleTitle, toggleMenu, gameStarted, toggleGameOver, setScore, toggleInventory, toggleArrowUp, toggleArrowDown, toggleArrowLeft, toggleArrowRight, toggleInteract, removeCoin, incrementComputerInteractProgress, setComputerStatusOk, setComputerPlayerOver, setCoins, setComputers } from './mutations'
import { state, Computer } from './state'
import { VNode } from 'snabbdom/build/package/vnode'
import randomNumber from '../lib/randomNumber'

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

export function collideWithCoin (x: number, y: number): void {
  incrementScore(1000)
  removeCoin(x, y)
}

export function generateCoins (tileMap: number[][]): void {
  const coins: Array<Array<(string | null)>> = tileMap.map((rows, y) => rows.map((value, x) =>
    // 40% chance of placing coin
    // don't place unless map is empty and no computer exists
    value === 0 &&
    state.computers[y][x] === null &&
    randomNumber(0, 100) > 60
      ? 'c'
      : null
  ))
  setCoins(coins)
}

export function generateComputers (tileMap: number[][]): void {
  const computers: Array<Array<Computer | null>> = tileMap.map((rows) => rows.map((value) =>
    // 10% chance of placing computer
    value === 0 && randomNumber(0, 100) <= 10 ? {
      playerOver: false,
      interactProgress: 0,
      status: '404'
    } : null
  ))
  setComputers(computers as Computer[][])
}

export function playerOverComputer (x: number, y: number): void {
  if (state.computers[y] !== undefined) {
    if (state.computers[y][x] !== null) {
      const { playerOver, interactProgress } = state.computers[y][x]
      if (!playerOver) setComputerPlayerOver(x, y, true)
      if (state.interacting && interactProgress < 100) {
        incrementComputerInteractProgress(x, y, 1)
      } else if (interactProgress > 0 && interactProgress !== 100) {
        incrementComputerInteractProgress(x, y, -1)
      } else if (interactProgress >= 100) {
        setComputerStatusOk(x, y)
      }
    }
  }
}

export function playerNotOverComputer (x: number, y: number): void {
  const { playerOver, interactProgress } = state.computers[y][x]
  if (playerOver) setComputerPlayerOver(x, y, false)
  if (interactProgress > 0 && interactProgress !== 100) {
    incrementComputerInteractProgress(x, y, -1)
  }
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
