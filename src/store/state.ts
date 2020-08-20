export interface State {
  gameOver: boolean
  gameStarted: boolean
  score: number
  showMenuScreen: boolean
  showTitleScreen: boolean
}

export let state: State = {
  gameOver: false,
  gameStarted: false,
  score: 5000,
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
