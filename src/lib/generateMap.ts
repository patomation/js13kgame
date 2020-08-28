import { isOdd } from "./isOdd"


export function generateMap (
  width: number, 
  height: number,
  tileMap: number[][]
): HTMLImageElement {
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
    }
  }
  ctx.restore()

  const image = new Image()
  image.src = ctx.canvas.toDataURL('image/png')
  return image
}