export interface State {
  score: number,
  showTitleScreen: boolean
}

export type NewState = {
  [S in keyof State]?: State[S]
}

export let state: State = {
  score: 5000,
  showTitleScreen: true
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
