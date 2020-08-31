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
import { getPixelRatio } from './lib/getPixelRatio'

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('DOMContentLoaded', load)
window.onresize = () => {
  resizeCanvas(window.innerWidth, window.innerHeight)
  ctx.scale(scale, scale)
}
const width = window.innerWidth
const height = window.innerHeight
const scale = 3
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
  const ratio = getPixelRatio()
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.scale(scale, scale)
  ctx.imageSmoothingEnabled = false // preserve pixels
  update() // canvas
}

const cellSize = 64
const mapWidth = cellSize * 10
const mapHeight = cellSize * 10
const tileMap = [[0]]
const pxToCord = (px: number): number => Math.floor(px / cellSize)
const snapToGrid = (pixel: number): number => (pxToCord(pixel)) * cellSize

// Handle maps that are smaller than the viewport width
const mapOffSetX = mapWidth * scale < width
  ? ((width - (mapWidth * scale)) / 2) / scale : 0
const mapOffSetY = mapHeight * scale < height
  ? ((height - (mapHeight * scale)) / 2) / scale : 0
// center if map is smaller than viewport otherwise be 0
let mapX = mapOffSetX // 0 if mapWidth > width
let mapY = mapOffSetY // 0 if mapHeight > height
let playerX = snapToGrid((width / 2) / scale)
let playerY = snapToGrid((height / 2) / scale)

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
    // move player or camera/map
    if (mapY < mapOffSetY && playerY <= (height / scale) / 2) {
      mapY += speed
    } else {
      playerY -= speed
    }
    player = playerTiles[12 + frame]
  }

  if (state.arrowDown) {
    // move player or camera/map
    if (-(mapY) < mapHeight - (height / scale) && playerY >= (height / scale) / 2) {
      mapY -= speed
    } else {
      playerY += speed
    }
    player = playerTiles[16 + frame]
  }

  if (state.arrowLeft) {
    // move player or camera/map
    if (mapX < mapOffSetX && playerX <= (width / scale) / 2) {
      mapX += 10
    } else {
      playerX -= speed
    }
    player = playerTiles[4 + frame]
  }

  if (state.arrowRight) {
    // move player or camera/map
    if (-(mapX) < mapWidth - (width / scale) && playerX >= (width / scale) / 2) {
      mapX -= 10
    } else {
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

  // Center-ish Player-ish position
  const px = playerX - mapX
  const py = playerY - mapY

  const tolerance = 5
  // All  the Player Corners and what coords they are over...
  // a - b
  // |   |
  // c - d
  const ax = pxToCord(px + tolerance)
  const ay = pxToCord(py + tolerance)
  const bx = pxToCord(px + 64 - tolerance)
  const by = pxToCord(py + tolerance)
  const cx = pxToCord(px + tolerance)
  const cy = pxToCord(py + 64 - tolerance)
  const dx = pxToCord(px + 64 - tolerance)
  const dy = pxToCord(py + 64 - tolerance)

  const revertMove = (): void => {
    mapX = oldMapX
    mapY = oldMapY
    playerX = oldPlayerX
    playerY = oldPlayerY
  }

  // collides with walls
  if (isWall(tileMap, ax, ay)) revertMove()
  if (isWall(tileMap, bx, by)) revertMove()
  if (isWall(tileMap, cx, cy)) revertMove()
  if (isWall(tileMap, dx, dy)) revertMove()

  // collides with map boundary
  if ((ay * cellSize) < 0) revertMove()
  if ((ax * cellSize) < 0) revertMove()
  if ((bx * cellSize) >= mapWidth) revertMove()
  if ((dy * cellSize) >= mapHeight) revertMove()

  draw()
  window.requestAnimationFrame(update)
}

function draw (): void {
  clearCanvas()
  ctx.drawImage(map, mapX, mapY)
  ctx.drawImage(player, playerX, playerY)
}
