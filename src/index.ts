import { initCanvas, resizeCanvas, addImage } from './lib/canvas'
import { Sprite } from './classes/Sprite'
import ufo from '../assets/sprites/ufo.png'

import { render } from './render'
import { hotkey } from '@patomation/hotkey'
import { escape, inventory, arrowLeft, arrowDown, arrowUp, arrowRight } from './store/actions'
import { state } from './store/state'
import { isNegative } from './lib/isNegative'

let ufoSprite: Sprite
window.addEventListener('DOMContentLoaded', () => {
  render()

  initCanvas()
  resizeCanvas(window.innerWidth, window.innerHeight)

  ufoSprite = addImage(ufo, window.innerWidth / 2, window.innerHeight / 2)

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

  update()
})

window.onresize = () => resizeCanvas(window.innerWidth, window.innerHeight)

let velocityY = 0
let velocityX = 0
function update (): void {
  const maxVelocity = 100
  const acceleration = 10
  const friction = 5

  if (state.arrowUp && velocityY > -maxVelocity) velocityY -= acceleration
  if (state.arrowDown && velocityY < maxVelocity) velocityY += acceleration
  if (!state.arrowUp && !state.arrowDown) {
    if (isNegative(velocityY)) {
      velocityY += friction
    } else if (velocityY !== 0) {
      velocityY -= friction
    } else {
      velocityY = 0
    }
  }
  if (state.arrowLeft && velocityX > -maxVelocity) velocityX -= acceleration
  if (state.arrowRight && velocityX < maxVelocity) velocityX += acceleration
  if (!state.arrowLeft && !state.arrowRight) {
    if (isNegative(velocityX)) {
      velocityX += friction
    } else if (velocityX !== 0) {
      velocityX -= friction
    } else {
      velocityX = 0
    }
  }

  // boundaries
  if (ufoSprite.x < 0 - 64) {
    // velocityX = 0
    ufoSprite.x = window.innerWidth
  } else if (ufoSprite.x > window.innerWidth) {
    // velocityX = 0
    ufoSprite.x = 0 - 64
  } else if (ufoSprite.y < 0) {
    ufoSprite.y = window.innerHeight
  } else if (ufoSprite.y > window.innerHeight) {
    ufoSprite.y = 0
  }

  ufoSprite.x += velocityX / 10
  ufoSprite.y += velocityY / 10
  window.requestAnimationFrame(update)
}
