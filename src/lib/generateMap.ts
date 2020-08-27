import { isOdd } from "./isOdd"


export function generateMap (
  width: number, 
  height: number
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
      ctx.fillStyle = color
      ctx.fill()
      ctx.closePath()
    }
  }
  ctx.restore()

  const image = new Image()
  image.src = ctx.canvas.toDataURL('image/png')
  return image
}