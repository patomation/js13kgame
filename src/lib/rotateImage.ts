import { loadImage } from "./loadImage"

export type Degrees = 0 | 90 | 180 | 270 | 360

export async function rotateImage (
  image: HTMLImageElement,
  degrees: Degrees
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.canvas.width = image.width
  ctx.canvas.height = image.height
  ctx.translate(canvas.width/2, canvas.height/2)
  ctx.rotate(degrees * Math.PI / 180)
  ctx.drawImage(image, -canvas.width/2, -canvas.width/2)
  return loadImage(ctx.canvas.toDataURL('image/png'))
}