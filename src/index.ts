import { initCanvas, resizeCanvas, ctx, clearCanvas } from './lib/canvas'

import playerSpriteSheet from '../assets/sprites/ufo.png'

import { render } from './render'
import { state } from './store/state'
import { generateMap } from './lib/generateMap'
import { initInput } from './input'
import { loadImage } from './lib/loadImage'

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('DOMContentLoaded', load)
window.onresize = () => resizeCanvas(window.innerWidth, window.innerHeight)

const width = window.innerWidth
const height = window.innerHeight

let map: HTMLImageElement
let player: HTMLImageElement

async function load (): Promise<void> {
  // Await for things that need to load like images then start
  map = generateMap(mapWidth, mapHeight, tileMap)
  player = await loadImage(playerSpriteSheet)
  start()
}

function start (): void {
  initInput()
  render() // snabbdom
  initCanvas()
  resizeCanvas(width, height)
  update() // canvas
}

const mapWidth = 64 * 30
const mapHeight = 64 * 20
const tileMap = [
  [1, 1, 1, 1],
  [1, 0, 0, 0],
  [1, 0, 1, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
]
const pxToCord = (px: number): number => Math.floor(px / 64)
const cellSize = 64
const snapToGrid = (pixel: number): number => {
  console.log(pixel)
  console.log(pxToCord(pixel))

  console.log(pxToCord(pixel) * cellSize)
  return (pxToCord(pixel)) * cellSize
}

let mapX = 0
let mapY = 0
let playerX = snapToGrid(width / 2)
let playerY = snapToGrid(height / 2)

const speed = 64 / 6

const isWall = (xCoord: number, yCoord: number): boolean => {
  return tileMap[yCoord] !== undefined ? tileMap[yCoord][xCoord] === 1 : false
}

function update (): void {
  const oldMapX = mapX
  const oldMapY = mapY
  const oldPlayerX = playerX
  const oldPlayerY = playerY

  if (state.arrowUp) {
    if (mapY > 0 && playerY <= height / 2) {
      mapY -= speed
    } else if (playerY > 0) {
      playerY -= speed
    }
  }

  if (state.arrowDown) {
    if (mapY < mapHeight - height && playerY >= height / 2) {
      mapY += speed
    } else if (playerY < height - 64) {
      playerY += speed
    }
  }

  if (state.arrowLeft) {
    if (mapX > 0 && playerX <= width / 2) {
      mapX -= 10
    } else if (playerX > 0) {
      playerX -= speed
    }
  }

  if (state.arrowRight) {
    if (mapX < mapWidth - width && playerX >= width / 2) {
      mapX += 10
    } else if (playerX < width - 64) {
      playerX += speed
    }
  }

  // console.log('resolve collisions');
  const px = mapX + playerX
  const py = mapY + playerY
  const buffer = 5
  // All  the Player Corners and what coords they are over...
  const ax = pxToCord(px + buffer)
  const ay = pxToCord(py + buffer)
  const bx = pxToCord(px + 64 - buffer)
  const by = pxToCord(py + buffer)
  const cx = pxToCord(px + buffer)
  const cy = pxToCord(py + 64 - buffer)
  const dx = pxToCord(px + 64 - buffer)
  const dy = pxToCord(py + 64 - buffer)

  const revertMove = (): void => {
    mapX = oldMapX
    mapY = oldMapY
    playerX = oldPlayerX
    playerY = oldPlayerY
  }

  if (isWall(ax, ay)) revertMove()
  if (isWall(bx, by)) revertMove()
  if (isWall(cx, cy)) revertMove()
  if (isWall(dx, dy)) revertMove()

  draw()
  window.requestAnimationFrame(update)
}

function draw (): void {
  clearCanvas()
  ctx.drawImage(map, -mapX, -mapY)
  ctx.drawImage(player, playerX, playerY)
}
