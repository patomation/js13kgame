import { initCanvas, resizeCanvas, ctx, clearCanvas } from './lib/canvas'

import playerSpriteSheet from '../assets/sprites/ufo.png'

import { render } from './render'
import { hotkey } from '@patomation/hotkey'
import { escape, inventory, arrowLeft, arrowDown, arrowUp, arrowRight } from './store/actions'
import { state } from './store/state'
import { isNegative } from './lib/isNegative'
import { generateMap } from './lib/generateMap'

const width = window.innerWidth
const height = window.innerHeight

window.addEventListener('DOMContentLoaded', () => {
  render()

  initCanvas()
  resizeCanvas(width, height)

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

window.onresize = () => resizeCanvas(width, height)

const roomWidth = 500
const roomHeight = 300
const map = generateMap(roomWidth, roomHeight)
const player = new Image()
player.src = playerSpriteSheet
let velocityX = 0
let velocityY = 0
let playerX = 0
let playerY = 0
function handleMove (): void {
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

  playerX += velocityX / 10
  playerY += velocityY / 10
}

function update (): void {
  handleMove()
  draw()
  window.requestAnimationFrame(update)
}

function draw (): void {
  clearCanvas()
  ctx.drawImage(map, -playerX, -playerY)
  ctx.drawImage(player, width / 2, height / 2)
}
