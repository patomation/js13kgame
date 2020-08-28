import { hotkey } from '@patomation/hotkey'
import { escape, inventory, arrowLeft, arrowDown, arrowUp, arrowRight } from './store/actions'

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

  hotkey('escape', escape)

  hotkey('i', inventory)
}
