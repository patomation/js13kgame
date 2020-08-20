import { state, setState } from './state'

export function incrementScore (amount: number): void {
  setState({ score: state.score + amount })
}

export function toggleTitleScreen (): void {
  setState({ showTitleScreen: !state.showTitleScreen })
}
