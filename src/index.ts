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

window.onresize = () => resizeCanvas(window.innerWidth, window.innerHeight)

const mapWidth = 64 * 30
const mapHeight = 64 * 20
const tileMap = [
  [1, 1, 1, 1],
  [1, 0, 0, 0],
  [1, 0, 1, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
]
const isWall = (tileMap: number[][], x: number, y: number): boolean => {
  const pxToCord = (px: number): number => px / 64
  const cx = Math.floor(pxToCord(x))
  const cy = Math.floor(pxToCord(y))
  console.log({ cx, cy })

  return tileMap[cy] !== undefined ? tileMap[cy][cx] === 1 : false
}
const map = generateMap(mapWidth, mapHeight, tileMap)
const player = new Image()
player.src = playerSpriteSheet

let mapX = 0
let mapY = 0
let playerX = width / 2
let playerY = height / 2
const cellSize = 64

const collusion = (x: number, y: number, dx: number, dy: number): boolean =>
  (
    x < dx + cellSize &&
    x + cellSize > dx &&
    y < dy + cellSize &&
    y + cellSize > dy
  )

function update (): void {
  const px = mapX + playerX
  const py = mapY + playerY
  if (collusion(px, py, 4 * 64, 5 * 64)) {
    console.log('collision detected!')
  }

  if (state.arrowLeft && !isWall(tileMap, mapX + playerX - 10, mapY + playerY)) {
    if (mapX > 0 && playerX <= width / 2) {
      mapX -= 10
    } else if (playerX > 0) {
      playerX -= 10
    }
  }

  if (state.arrowRight && !isWall(tileMap, mapX + playerX + 64 + 10, mapY + playerY)) {
    if (mapX < mapWidth - width && playerX >= width / 2) {
      mapX += 10
    } else if (playerX < width - 64) {
      playerX += 10
    }
  }

  if (state.arrowUp && !isWall(tileMap, mapX + playerX, mapY + playerY - 10)) {
    if (mapY > 0 && playerY <= height / 2) {
      mapY -= 10
    } else if (playerY > 0) {
      playerY -= 10
    }
  }

  if (state.arrowDown && !isWall(tileMap, mapX + playerX, mapY + playerY + 64 + 10)) {
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
  ctx.drawImage(player, 4 * 64, 5 * 64)
}
