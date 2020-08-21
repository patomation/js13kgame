import { Item } from '../classes/Item'

export interface State {
  gameOver: boolean
  gameStarted: boolean
  inventory: Item[],
  score: number
  showInventoryScreen: boolean
  showMenuScreen: boolean
  showTitleScreen: boolean
}

export let state: State = {
  gameOver: false,
  gameStarted: false,
  inventory: [
    new Item('helm'),
    new Item('light sword'),
    new Item('health'),
    new Item('dungeon key')
  ],
  score: 5000,
  showInventoryScreen: false,
  showMenuScreen: false,
  showTitleScreen: true
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
  if (stateChangedCallback) stateChangedCallback()
}
