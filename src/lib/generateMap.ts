import { isOdd } from "./isOdd"
import { loadImage } from "./loadImage"
import { getTile } from "./getTile"
import { isWall } from "./isWall"
import array2dEquals from "./array2dEquals"
import arrayEquals from "./arrayEquals"


const cornerScenarios = [
  {
    scenario: [
      [1,1,1],
      [0,0,0],
      [0,0,0]
    ],
    tile: [1, 0]
  },
  {
    scenario: [
      [1,1,1],
      [0,0,1],
      [0,0,1]
    ],
    tile: [2, 0]
  },
  {
    scenario: [
      [0,0,1],
      [0,0,1],
      [0,0,1]
    ],
    tile: [2, 1]
  },
  {
    scenario: [
      [0,0,1],
      [0,0,1],
      [1,1,1]
    ],
    tile: [2, 2]
  },
  {
    scenario: [
      [0,0,0],
      [0,0,0],
      [1,1,1]
    ],
    tile: [1, 2]
  },
  {
    scenario: [
      [1,0,0],
      [1,0,0],
      [1,1,1]
    ],
    tile: [0, 2]
  },
  {
    scenario: [
      [1,0,0],
      [1,0,0],
      [1,0,0]
    ],
    tile: [0, 1]
  },
  {
    scenario: [
      [1,1,1],
      [1,0,0],
      [1,0,0]
    ],
    tile: [0, 0]
  },
  // CORNERS
  {
    scenario: [
      [0,0,1],
      [0,0,0],
      [0,0,0]
    ],
    tile: [4, 2]
  },{
    scenario: [
      [0,0,0],
      [0,0,0],
      [0,0,1]
    ],
    tile: [4, 0]
  },{
    scenario: [
      [0,0,0],
      [0,0,0],
      [1,0,0]
    ],
    tile: [6, 0]
  },{
    scenario: [
      [1,0,0],
      [0,0,0],
      [0,0,0]
    ],
    tile: [6, 2]
  },
  // single digits
  {
    scenario: [
      [0,1,0],
      [0,0,0],
      [0,0,0]
    ],
    tile: [1, 0]
  },
  {
    scenario: [
      [0,0,0],
      [0,0,1],
      [0,0,0]
    ],
    tile: [2, 1]
  },
  {
    scenario: [
      [0,0,0],
      [0,0,0],
      [0,1,0]
    ],
    tile: [1, 2]
  },
  {
    scenario: [
      [0,0,0],
      [1,0,0],
      [0,0,0]
    ],
    tile: [0, 1]
  },
  // others
  {
    scenario: [
      [1,1,0],
      [0,0,0],
      [0,0,0]
    ],
    tile: [1, 0]
  },
  {
    scenario: [
      [0,1,1],
      [0,0,0],
      [0,0,0]
    ],
    tile: [1, 0]
  },
  {
    scenario: [
      [0,0,1],
      [0,0,1],
      [0,0,0]
    ],
    tile: [2, 1]
  },
  {
    scenario: [
      [0,0,0],
      [0,0,1],
      [0,0,1]
    ],
    tile: [2, 1]
  },
  {
    scenario: [
      [0,0,0],
      [0,0,0],
      [0,1,1]
    ],
    tile: [1, 2]
  },
  {
    scenario: [
      [0,0,0],
      [0,0,0],
      [1,1,0]
    ],
    tile: [1, 2]
  },
  {
    scenario: [
      [0,0,0],
      [1,0,0],
      [1,0,0]
    ],
    tile: [0, 1]
  },
  {
    scenario: [
      [1,0,0],
      [1,0,0],
      [0,0,0]
    ],
    tile: [0, 1]
  },
  // Double walls
  {
    scenario: [
      [1,0,0],
      [1,0,0],
      [0,0,0]
    ],
    tile: [0, 1]
  },
]

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

  let color = 'gray'
  ctx.save()
  ctx.canvas.width = width
  ctx.canvas.height = height
  for (let y = 0; y < rows; y++) {
    color = isOdd(y) ? 'gray' : 'silver'
    for (let x = 0; x < columns; x++) {
      color = color === 'gray' ? 'silver' : 'gray'
      ctx.beginPath()
      ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize)
      // wall color
      let wallColor = tileMap[y] ? tileMap[y][x] === 1 ? 'purple' : null : null
      ctx.fillStyle = wallColor || color
      
      ctx.fill()
      ctx.closePath()

      // Dev coords
      ctx.fillStyle = 'black'
      ctx.font = 'bold 18px Arial'
      ctx.fillText(`${x},${y}`, x * 64, y * 64 + 15)
      ctx.font = 'bold 10px Arial'
      ctx.fillText(`${x * 64},${y * 64}`, x * 64 + 10, y * 64 + 50)

      let tileXY: [number, number] | null = null
      let rotate: 90 | 180 | 230 | 360 | undefined = undefined
      const corners = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ]

      if(isWall(tileMap, x, y)) {
        tileXY = [3,0]
      } else {
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
        
        cornerScenarios.forEach( ({ scenario, tile }) => {
          if (array2dEquals(scenario, corners)) {
            tileXY = tile as [number, number]
          } 
        })
        if(tileXY === null) {
          // do some more checks
          if(corners[0][1] === 1 && corners[2][1] === 1) {
            // top and bottom
            tileXY = [3,2]
          } else if (corners[1][0] === 1 && corners[1][2] === 1) {
            // left and right
            tileXY = [3,1]
          } else if (corners[1][0] === 1 && corners[0][1] === 1 && corners[2][2] === 0) {
            tileXY = [0,0]
          } else if (
            corners[0][0] === 1 &&
            corners[1][2] === 0 &&
            corners[2][2] === 1 &&
            corners[2][1] === 0
          ) {
            tileXY = [7,1]
          } else if (
            corners[0][0] === 1 &&
            corners[2][0] === 1 &&
            corners[1][0] === 0
          ) {
            tileXY = [7,5]
            rotate = 90
          } else if (
            corners[0][0] === 1 &&
            corners[2][0] === 1 &&
            corners[1][0] === 1
          ) {
            tileXY = [7,4]
          } else if (
            corners[0][2] === 1 &&
            corners[2][2] === 1
          ) {
            tileXY = [6, 3]
            rotate = 180
          }
        }
      }

      if(tileXY !== null) {
        const tile = await getTile(tileSet, tileXY[0], tileXY[1], rotate)
        ctx.drawImage(tile, x * 64, y * 64)
      }
      
      
    }
  }
  ctx.restore()

  return loadImage(ctx.canvas.toDataURL('image/png'))
}