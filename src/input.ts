import { hotkey } from '@patomation/hotkey'
import { escape, inventory, arrowLeft, arrowDown, arrowUp, arrowRight, interactKeyUp, interactKeyDown } from './store/actions'

export function initInput (): void {
  hotkey('arrowup')
    .down(arrowUp)
    .up(arrowUp)

  hotkey('arrowdown')
    .down(arrowDown)
    .up(arrowDown)

  hotkey('arrowleft')
    .down(arrowLeft)
    .up(arrowLeft)

  hotkey('arrowright')
    .down(arrowRight)
    .up(arrowRight)

  hotkey('w')
    .down(arrowUp)
    .up(arrowUp)

  hotkey('s')
    .down(arrowDown)
    .up(arrowDown)

  hotkey('a')
    .down(arrowLeft)
    .up(arrowLeft)

  hotkey('d')
    .down(arrowRight)
    .up(arrowRight)

  hotkey('escape', escape)

  hotkey('i', inventory)

  hotkey('e')
    .down(interactKeyDown)
    .up(interactKeyUp)
}
