import { initCanvas, resizeCanvas, ctx, clearCanvas } from './lib/canvas'

import computerSpriteSheet from '../assets/sprites/computer.png'
import playerSpriteSheet from '../assets/sprites/player.png'
import tileSetImage from '../assets/tilemaps/tileSet.png'

import { render } from './render'
import { state, setState } from './store/state'
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
import { getTilesAsArray } from './lib/getTilesAsArray'
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

async function getPlayerTiles (): Promise<HTMLImageElement[]> {
  // Build player animated tile set
  const playerSprite = await loadImage(playerSpriteSheet)
  const tiles = []
  // Idle animation
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))

  // left
  tiles.push(await scaleImage(await flipImage(await getTile(playerSprite, 2, 16)), 4))
  tiles.push(await scaleImage(await flipImage(await getTile(playerSprite, 2, 16)), 4))
  tiles.push(await scaleImage(await flipImage(await getTile(playerSprite, 2, 16)), 4))
  tiles.push(await scaleImage(await flipImage(await getTile(playerSprite, 2, 16)), 4))

  // Right
  tiles.push(await scaleImage(await getTile(playerSprite, 2, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 2, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 2, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 2, 16), 4))

  // up
  tiles.push(await scaleImage(await getTile(playerSprite, 1, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 1, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 1, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 1, 16), 4))

  // down
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  tiles.push(await scaleImage(await getTile(playerSprite, 0, 16), 4))
  return tiles
}

let helpBox: HTMLImageElement

// Await for things that need to load like images then start
async function load (): Promise<void> {
  computerTiles = await getTilesAsArray(await loadImage(computerSpriteSheet))
  playerTiles = await getPlayerTiles()
  const tileSet = await loadImage(tileSetImage)
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

const speed = 64 / 12

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
      // show tool tip?
      const computers = [...state.computers]
      computers[index].playerOver = true
      if (state.interacting && interactProgress < 100) {
        computers[index].interactProgress++
      } else if (interactProgress > 0 && interactProgress !== 100) {
        computers[index].interactProgress--
      } else if (interactProgress >= 100) {
        computers[index].status = '200'
      }
      setState({ computers })
    } else if (
      (cx === x && cy === y) ||
      (dx === x && dy === y)
    ) {
      revertMove()
    } else if (playerOver === true) {
      // Set it back to false only once
      if (state.computers[index].playerOver === true) {
        const computers = [...state.computers]
        computers[index].playerOver = false
        setState({ computers })
      }
    }
  })

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
      ctx.drawImage(computerTiles[2], px, py)
    }
    if (playerOver === true && status === '404') {
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
  ctx.drawImage(player, playerX, playerY)
}
