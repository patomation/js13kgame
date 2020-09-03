import { initCanvas, resizeCanvas, ctx, clearCanvas } from './lib/canvas'

import tileSetImage from '../assets/tilemaps/tileSet.png'

import { render } from './render'
import { state } from './store/state'
import { generateMap } from './lib/generateMap'
import { initInput } from './input'
import { loadImage } from './lib/loadImage'
import { isWall } from './lib/isWall'
import { getTile } from './lib/getTile'
import { flipImage } from './lib/flipImage'
import { scaleImage } from './lib/scaleImage'
import { getPixelRatio } from './lib/getPixelRatio'
import { getBox } from './lib/getBox'
import { Base03, Orange } from './lib/solarized'
import { getTileRangeAsArray } from './lib/getTileRangeAsArray'
import { collision } from './lib/collision'
import { collideWithCoin, playerOverComputer, playerNotOverComputer, generateCoins } from './store/actions'
import { pxToCord } from './lib/pxToCoord'
import { coordToPx } from './lib/coordToPx'
import { createMap } from './lib/createMap'
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
let computerTiles: HTMLImageElement[]
let player: HTMLImageElement
let playerTiles: HTMLImageElement[] = []
let coin: HTMLImageElement[]
async function getPlayerTiles (tileSet: HTMLImageElement): Promise<HTMLImageElement[]> {
  // Build player animated tile set
  const tiles = []
  // Idle animation
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))

  // left
  tiles.push(await scaleImage(await flipImage(await getTile(tileSet, 2, 16)), 4))
  tiles.push(await scaleImage(await flipImage(await getTile(tileSet, 2, 16)), 4))
  tiles.push(await scaleImage(await flipImage(await getTile(tileSet, 2, 16)), 4))
  tiles.push(await scaleImage(await flipImage(await getTile(tileSet, 2, 16)), 4))

  // Right
  tiles.push(await scaleImage(await getTile(tileSet, 2, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 2, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 2, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 2, 16), 4))

  // up
  tiles.push(await scaleImage(await getTile(tileSet, 1, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 1, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 1, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 1, 16), 4))

  // down
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(tileSet, 0, 16), 4))
  return tiles
}

let helpBox: HTMLImageElement

// Await for things that need to load like images then start
async function load (): Promise<void> {
  const tileSet = await loadImage(tileSetImage)
  // computerTiles = await getTilesAsArray(await loadImage(computerSpriteSheet))
  const misc16TileSet = await getTile(tileSet, 13)
  computerTiles = [
    await scaleImage(await getTile(misc16TileSet, 0, 16), 4),
    await scaleImage(await getTile(misc16TileSet, 1, 16), 4)
  ]
  coin = await getTileRangeAsArray(misc16TileSet, 4, 7, 16)
  const playerTileSet = await getTile(tileSet, 14)
  playerTiles = await getPlayerTiles(playerTileSet)
  map = await generateMap(mapWidth, mapHeight, tileMap, tileSet)
  helpBox = await getBox(await getTile(tileSet, 12), 60, 17)

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
const dimensions = 10
const mapWidth = cellSize * dimensions
const mapHeight = cellSize * dimensions
const { map: tileMap, startX, startY } = createMap(dimensions, 30, 3)

// Put coins everywhere
generateCoins(tileMap)

// provide an initial player offset that will prevent them from spawning off the screen
const playerOffsetY = coordToPx(startY) + 64 > height / scale
  ? coordToPx(startY) + 64 - (height / scale) : 0
const playerOffsetX = coordToPx(startX) + 64 > width / scale
  ? coordToPx(startX) + 64 - (width / scale) : 0

let playerX = coordToPx(startX) - playerOffsetX
let playerY = coordToPx(startY) - playerOffsetY

// Handle maps that are smaller than the viewport width
const mapOffSetX = mapWidth * scale < width
  ? ((width - (mapWidth * scale)) / 2) / scale : 0
const mapOffSetY = mapHeight * scale < height
  ? ((height - (mapHeight * scale)) / 2) / scale : 0

// center if map is smaller than viewport otherwise be 0
let mapX = mapOffSetX - playerOffsetX // 0 if mapWidth > width
let mapY = mapOffSetY - playerOffsetY // 0 if mapHeight > height

const speed = 64 / 12

const fps = 10
const fpsInterval = 1000 / fps
let then: number
let now: number
let frame: 0 | 1 | 2 | 3 = 0

/**
 * Get px from coordinate relative to map position
 * @param x coordinate
 */
function cX (x: number): number {
  return mapX + (x * cellSize)
}
/**
 * Get px from coordinate relative to map position
 * @param y coordinate
 */
function cY (y: number): number {
  return mapY + (y * cellSize)
}

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
    if (state.interacting) {
      player = playerTiles[12]
    } else {
      player = playerTiles[0 + frame]
    }
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

  state.computers.forEach(({ coords, playerOver, interactProgress }, index) => {
    const [x, y] = coords
    // handle top overlap
    if ((ax === x && ay === y) || (bx === x && by === y)) {
      const overlap = 20
      // but allow overlap so guy can walk up to computer from the bottom
      if (py < y * cellSize + overlap) revertMove()
      playerOverComputer(index)
    } else if (
      (cx === x && cy === y) ||
      (dx === x && dy === y)
    ) {
      revertMove()
    } else {
      playerNotOverComputer(index)
    }
  })
  // player collides with coins
  const checkCoinCollision = (x: number, y: number): boolean => {
    let result = false
    if (state.coins[y] !== undefined && state.coins[y][x] === 'c') {
      if (collision(
        // remember that coins are 16x16 and centered
        cX(x) + 32 - 8, cY(y) + 32 - 8, 16, 16,
        playerX, playerY, 64, 64
      )) {
        result = true
      }
    }
    return result
  }
  if (checkCoinCollision(ax, ay)) collideWithCoin(ax, ay)
  if (checkCoinCollision(bx, by)) collideWithCoin(bx, by)
  if (checkCoinCollision(cx, cy)) collideWithCoin(cx, cy)
  if (checkCoinCollision(dx, dy)) collideWithCoin(dx, dy)

  draw()
  window.requestAnimationFrame(update)
}

function draw (): void {
  clearCanvas()
  ctx.drawImage(map, mapX, mapY)
  state.computers.forEach(({ coords, playerOver, interactProgress, status }) => {
    const [x, y] = coords
    const px = mapX + (x * cellSize)
    const py = mapY + (y * cellSize)
    if (status === '404') {
      ctx.drawImage(computerTiles[0], px, py)
    } else if (status === '200') {
      ctx.drawImage(computerTiles[1], px, py)
    }
    if (playerOver && status === '404') {
      ctx.save()
      ctx.drawImage(helpBox, px + 2, py + 2)
      ctx.fillStyle = Orange
      ctx.fillRect(px + 2, py + 19, (60 / 100) * interactProgress, 5)
      ctx.fillStyle = Base03
      ctx.font = 'bold 12px Arial'
      ctx.fillText('hold e', px + 13, py + 15)
      ctx.restore()
    }
  })
  state.coins.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 'c') {
        ctx.drawImage(coin[frame], cX(x) + 32 - 8, cY(y) + 32 - 8)
      }
    })
  })
  ctx.drawImage(player, playerX, playerY)
}
