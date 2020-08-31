import { loadImage } from "./loadImage"

export type Degrees = 0 | 90 | 180 | 270 | 360

export async function flipImage (
  image: HTMLImageElement
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.canvas.width = image.width
  ctx.canvas.height = image.height
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(image, 0, 0)
  return loadImage(ctx.canvas.toDataURL('image/png'))
}