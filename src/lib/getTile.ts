import { loadImage } from "./loadImage"


export async function getTile (
  tileSet: HTMLImageElement,
  x: number,
  y: number,
  rotate?: 90 | 180 | 230 | 360,
  cellSize = 64
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.save()
  ctx.canvas.width = cellSize
  ctx.canvas.height = cellSize
  // crop tile
  ctx.drawImage(tileSet, -(x * cellSize), -(y * cellSize), tileSet.width, tileSet.height)
  let image = await loadImage(ctx.canvas.toDataURL('image/png'))
  
  // Dumb hack to get rotation working, I need to crop before rotating... if I rotate at all...
  if(rotate) {
    ctx.restore()
    ctx.clearRect(0, 0, canvas.width, canvas.width)
    ctx.translate(canvas.width/2, canvas.height/2)
    ctx.rotate(rotate * Math.PI / 180)
    ctx.drawImage(image, -canvas.width/2, -canvas.width/2)
    image = await loadImage(ctx.canvas.toDataURL('image/png'))
  }

  return image
}