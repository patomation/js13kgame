import { isOdd } from "./isOdd"
import { loadImage } from "./loadImage"
import { getTile } from "./getTile"
import { isWall } from "./isWall"
import { rotateImage, Degrees } from "./rotateImage"
import { Base02, Base03, Cyan } from "./solarized"

export async function generateMap (
  width: number, 
  height: number,
  tileMap: number[][],
  tileSet: HTMLImageElement
): Promise<HTMLImageElement> {
  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D
  const cellSize = 64
  const rows = Math.round(height / cellSize)
  const columns = Math.round(width / cellSize)

  const color1 = Base03
  const color2 = Base02
  let color = color1
  ctx.imageSmoothingEnabled = false // preserve pixels
  ctx.save()
  ctx.canvas.width = width
  ctx.canvas.height = height
  for (let y = 0; y < rows; y++) {
    color = isOdd(y) ? color1 : color2
    for (let x = 0; x < columns; x++) {
      color = color === color1 ? color2 : color1
      const drawTile = async (tileNumber: number, degrees?: Degrees) => {
        let tile = await getTile(tileSet, tileNumber)
        if(degrees !== 0) tile = await rotateImage(tile, degrees as Degrees)
        ctx.drawImage(tile, x * 64, y * 64)
      }
      const corners = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ]
      if(!isWall(tileMap, x, y)) {
        // Draw Dev Squares
        ctx.beginPath()
        ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize)
        // wall color
        ctx.fillStyle = color
        // only fill spaces that are not walls
        ctx.fill()
        ctx.closePath()
        
        // Dev coords
        ctx.fillStyle = Cyan
        ctx.font = 'bold 18px Arial'
        ctx.fillText(`${x},${y}`, x * 64, y * 64 + 15)
        ctx.font = 'bold 10px Arial'
        ctx.fillText(`${x * 64},${y * 64}`, x * 64 + 10, y * 64 + 50)
        
        // check corners
        const check = [
          [0, -1], // Up
          [1, -1], // Up/Right
          [1, 0],  // Right
          [1, 1],  // Right/Down
          [0, 1],  // Down
          [-1, 1],  // Down/Left
          [-1, 0], // Left
          [-1, -1]  // Left/up
        ]
        check.forEach(([cx, cy]) => {
          const px = x + cx
          const py = y + cy
          const isOffMap = px < 0 || px >= columns || py < 0 || py >= rows
          if(isOffMap || isWall(tileMap, px, py)) {
            corners[cy+1][cx+1] = 1
          }
        })

        const top = corners[0][1]
        const topRight = corners[0][2]
        const right = corners[1][2]
        const bottomRight = corners[2][2]
        const bottom = corners[2][1]
        const bottomLeft = corners[2][0]
        const left = corners[1][0]
        const topLeft = corners[0][0]
        // const center = corners[1][1] // I still want this for later. Hording.

        // detect all right angles aka 90s
        if (
          top === 1 &&
          right === 1 &&
          bottom  === 0 &&
          left === 0
        ) {
          await drawTile(0, 90)
        } else if (
          top === 0 &&
          right === 1 &&
          bottom  === 1 &&
          left === 0
        ) {
          await drawTile(0, 180)
        } else if (
          top === 0 &&
          right === 0 &&
          bottom  === 1 &&
          left === 1
        ) {
          await drawTile(0, 270)
        } else if (
          top === 1 &&
          right === 0 &&
          bottom  === 0 &&
          left === 1
        ) {
          await drawTile(0)
        }
        // Handle Flat spots
        if (
          top === 1 &&
          right === 0 &&
          bottom  === 0 &&
          left === 0
        ) {
          await drawTile(1)
        } else if (
          top === 0 &&
          right === 1 &&
          bottom  === 0 &&
          left === 0
        ) {
          await drawTile(1, 90)
        } else if (
          top === 0 &&
          right === 0 &&
          bottom  === 1 &&
          left === 0
        ) {
          await drawTile(1, 180)
        } else if (
          top === 0 &&
          right === 0 &&
          bottom  === 0 &&
          left === 1
        ) {
          await drawTile(1, 270)
        }

        // handle double flat spots
        if (
          top === 1 &&
          right === 0 &&
          bottom  === 1 &&
          left === 0
        ) {
          await drawTile(1)
          await drawTile(1, 180)
        }
        if (
          top === 0 &&
          right === 1 &&
          bottom  === 0 &&
          left === 1
        ) {
          await drawTile(1, 90)
          await drawTile(1, 270)
        }

        // Deal with corners - but try to make the overlap the other stuff above
        if (
          topLeft === 1 &&
          // but don't add it to spots where the is already a 90
          top === 0 &&
          left === 0
        ) {
          await drawTile(2)
        }
        if (
          topRight === 1 &&
          // but don't add it to spots where the is already a 90
          top === 0 &&
          right === 0
        ) {
          await drawTile(2, 90)
        }
        if (
          bottomRight === 1 &&
          // but don't add it to spots where the is already a 90
          bottom === 0 &&
          right === 0
        ) {
          await drawTile(2, 180)
        }
        if (
          bottomLeft === 1 &&
          // but don't add it to spots where the is already a 90
          bottom === 0 &&
          left === 0
        ) {
          await drawTile(2, 270)
        }

        // handle dead ends
        if (
          left === 1 &&
          top === 1 &&
          right === 1
        ) {
          await drawTile(3, 0)
        }
        if (
          top === 1 &&
          right === 1 &&
          bottom === 1
        ) {
          await drawTile(3, 90)
        }
        if (
          right === 1 &&
          bottom === 1 &&
          left === 1
        ) {
          await drawTile(3, 180)
        }
        if (
          bottom === 1 &&
          left === 1 &&
          top === 1
        ) {
          await drawTile(3, 270)
        }
      }
    }
  }
  ctx.restore()

  return loadImage(ctx.canvas.toDataURL('image/png'))
}