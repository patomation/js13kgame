import { initCanvas, resizeCanvas, ctx, clearCanvas } from './lib/canvas'

import playerSpriteSheet from '../assets/sprites/Robot_Shooty.png'
import tileSetImage from '../assets/tilemaps/tileSet.png'

import { render } from './render'
import { state } from './store/state'
import { generateMap } from './lib/generateMap'
import { initInput } from './input'
import { loadImage } from './lib/loadImage'
import { isWall } from './lib/isWall'
import { getTile } from './lib/getTile'

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('DOMContentLoaded', load)
window.onresize = () => resizeCanvas(window.innerWidth, window.innerHeight)

const width = window.innerWidth
const height = window.innerHeight

let map: HTMLImageElement
let player: HTMLImageElement
const playerTiles: HTMLImageElement[] = []

async function load (): Promise<void> {
  // Await for things that need to load like images then start
  const playerSprite = await loadImage(playerSpriteSheet)
  for (let t = 0; t < Math.round(playerSprite.width / 64); t++) {
    const image = await getTile(playerSprite, t)
    playerTiles.push(image)
  }
  const tileSet = await loadImage(tileSetImage)
  map = await generateMap(mapWidth, mapHeight, tileMap, tileSet)
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
console.log('sup', (width - mapWidth) / 2)

// Handle maps that are smaller than the viewport width
const mapOffSetX = mapWidth < width ? (width - mapWidth) / 2 : 0
const mapOffSetY = mapHeight < height ? (height - mapHeight) / 2 : 0
// center if map is smaller than viewport otherwise be 0
let mapX = -(mapOffSetX) // 0 if mapWidth > width
let mapY = -(mapOffSetY) // 0 if mapHeight > height
let playerX = snapToGrid(width / 2)
let playerY = snapToGrid(height / 2)

const speed = 64 / 6

const fps = 10
const fpsInterval = 1000 / fps
let then: number
let now: number

let frame: 0 | 1 | 2 | 3 = 0
function update (time: number = 0): void {
  // Throttle frame rate for some stuff
  if (then === undefined) then = time
  now = time
  const elapsed = now - then
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval)

    // cycle frames used in player animation
    if (frame < 3) {
      frame++
    } else {
      frame = 0
    }
  }

  const oldMapX = mapX
  const oldMapY = mapY
  const oldPlayerX = playerX
  const oldPlayerY = playerY

  if (state.arrowUp) {
    if (mapY > 0 && playerY <= height / 2) {
      mapY -= speed
    } else if (playerY > 0 + mapOffSetY) {
      playerY -= speed
    }
    player = playerTiles[12 + frame]
  }

  if (state.arrowDown) {
    if (mapY < mapHeight - height && playerY >= height / 2) {
      mapY += speed
    } else if (playerY < height - mapOffSetY - 64) {
      playerY += speed
    }
    player = playerTiles[16 + frame]
  }

  if (state.arrowLeft) {
    if (mapX > 0 && playerX <= width / 2) {
      mapX -= 10
    } else if (playerX > 0 + mapOffSetX) {
      playerX -= speed
    }
    player = playerTiles[4 + frame]
  }

  if (state.arrowRight) {
    if (mapX < mapWidth - width && playerX >= width / 2) {
      mapX += 10
    } else if (playerX < width - mapOffSetX - 64) {
      playerX += speed
    }
    player = playerTiles[8 + frame]
  }

  // Player is idle
  if (
    !state.arrowUp &&
    !state.arrowDown &&
    !state.arrowLeft &&
    !state.arrowRight
  ) {
    player = playerTiles[0 + frame]
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

  if (isWall(tileMap, ax, ay)) revertMove()
  if (isWall(tileMap, bx, by)) revertMove()
  if (isWall(tileMap, cx, cy)) revertMove()
  if (isWall(tileMap, dx, dy)) revertMove()

  draw()
  window.requestAnimationFrame(update)
}

function draw (): void {
  clearCanvas()
  ctx.drawImage(map, -mapX, -mapY)
  ctx.drawImage(player, playerX, playerY)
}
