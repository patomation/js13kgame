import { Item } from '../classes/Item'

export interface Computer {
  playerOver: boolean
  interactProgress: number,
  status: '404' | 'off' | '200'
}

export interface State {
  arrowUp: boolean
  arrowDown: boolean
  arrowLeft: boolean
  arrowRight: boolean
  coins: Array<Array<string | null>>
  computers: Computer[][]
  gameOver: boolean
  gameStarted: boolean
  interacting: boolean
  inventory: Item[]
  score: number
  showInventoryScreen: boolean
  showMenuScreen: boolean
  showTitleScreen: boolean
}

export let state: State = {
  arrowUp: false,
  arrowDown: false,
  arrowLeft: false,
  arrowRight: false,
  coins: [],
  computers: [],
  gameOver: false,
  gameStarted: false,
  interacting: false,
  inventory: [
    new Item('helm'),
    new Item('light sword'),
    new Item('health'),
    new Item('dungeon key')
  ],
  score: 0,
  showInventoryScreen: false,
  showMenuScreen: false,
  showTitleScreen: false
}

export type NewState = {
  [S in keyof State]?: State[S]
}
export function setState (newState: NewState): void {
  state = { ...state, ...newState }
  stateChange()
}

type Callback = () => void
let stateChangedCallback: Callback

export function onStateChange (callback: Callback): void {
  stateChangedCallback = callback
}

function stateChange (): void {
  if (stateChangedCallback !== undefined) stateChangedCallback()
}
