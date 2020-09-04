import { state } from './state'

export function getComputerTotals (): [number, number] {
  let total = 0
  let complete = 0
  state.computers.forEach((row) => {
    row.forEach((computer) => {
      if (computer !== undefined && computer !== null) {
        total++
        if (computer.status === '200') complete++
      }
    })
  })
  return [
    complete,
    total
  ]
}
