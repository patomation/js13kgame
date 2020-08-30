import { loadImage } from "./loadImage"


export async function getTileByCoord (
  tileSet: HTMLImageElement,
  x: number,
  y: number,
  cellSize = 64
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.save()
  ctx.canvas.width = cellSize
  ctx.canvas.height = cellSize
  // crop tile
  ctx.drawImage(tileSet, -(x * cellSize), -(y * cellSize), tileSet.width, tileSet.height)
  return loadImage(ctx.canvas.toDataURL('image/png'))
}

export async function getTile (
  tileSet: HTMLImageElement,
  index: number,
  cellSize = 64
): Promise<HTMLImageElement> {
  // get x and y from index somehow
  const columns = Math.floor(tileSet.width / 64)
  const y = Math.floor(index / columns)
  const x = index < columns
    ? index // use index as is y is 0
    : index % columns // remainder 
  return getTileByCoord(tileSet, x, y, cellSize)
}