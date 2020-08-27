import { initCanvas, resizeCanvas, ctx, clearCanvas } from './lib/canvas'

import playerSpriteSheet from '../assets/sprites/ufo.png'

import { render } from './render'
import { hotkey } from '@patomation/hotkey'
import { escape, inventory, arrowLeft, arrowDown, arrowUp, arrowRight } from './store/actions'
import { state } from './store/state'
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

const mapWidth = 64 * 50
const mapHeight = 64 * 20
const map = generateMap(mapWidth, mapHeight)
const player = new Image()
player.src = playerSpriteSheet

let mapX = 0
let mapY = 0
let playerX = width / 2
let playerY = height / 2

function update (): void {
  if (state.arrowLeft) {
    console.log('left')
    if (mapX > 0 && playerX <= width / 2) {
      mapX -= 10
    } else if (playerX > 0) {
      playerX -= 10
    }
  }

  if (state.arrowRight) {
    console.log({ playerX, width })
    if (mapX < mapWidth - width && playerX >= width / 2) {
      mapX += 10
    } else if (playerX < width - 64) {
      playerX += 10
    }
  }

  if (state.arrowUp) {
    if (mapY > 0 && playerY <= height / 2) {
      mapY -= 10
    } else if (playerY > 0) {
      playerY -= 10
    }
  }

  if (state.arrowDown) {
    if (mapY < mapHeight - height && playerY >= height / 2) {
      mapY += 10
    } else if (playerY < height - 64) {
      playerY += 10
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw (): void {
  clearCanvas()
  ctx.drawImage(map, -mapX, -mapY)
  ctx.drawImage(player, playerX, playerY)
}
