import { loadImage } from "./loadImage"

export type Degrees = 0 | 90 | 180 | 270 | 360

export async function scaleImage (
  image: HTMLImageElement,
  scale: number
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.canvas.width = image.width * scale
  ctx.canvas.height = image.height * scale
  ctx.imageSmoothingEnabled = false // preserve pixels
  // ctx.translate(canvas.width, 0)
  ctx.scale(scale, scale)
  ctx.drawImage(image, 0, 0)
  return loadImage(ctx.canvas.toDataURL('image/png'))
}