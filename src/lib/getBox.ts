import { loadImage } from "./loadImage"
import { getTile } from "./getTile"

/**
 * 
 * @param dBox a 64 x 64 image element
 * @param bw // width of rendered box image
 * @param bh // height of rendered box image
 */
export async function getBox (
  dBox: HTMLImageElement,
  bw: number,
  bh: number
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.canvas.width = bw
  ctx.canvas.height = bh


  const dBoxTL = await getTile(dBox, 0, 16)
  const dBoxTR = await getTile(dBox, 3, 16)
  const dBoxBL = await getTile(dBox, 12, 16)
  const dBoxBR = await getTile(dBox, 15, 16)
  const dBoxT = await getTile(dBox, 1, 16)
  const dBoxB = await getTile(dBox, 13, 16)
  const dBoxL = await getTile(dBox, 4, 16)
  const dBoxR = await getTile(dBox, 7, 16)
  const dBoxC = await getTile(dBox, 5, 16)

  const bx = 0
  const by = 0

  // Draw top and bottoms
  for (let wr = 1; wr <= Math.round((bw - (16 * 2)) / 16); wr++) {
    ctx.drawImage(dBoxT, bx + (16 * wr), by)
    ctx.drawImage(dBoxB, bx + (16 * wr), by + bh - 16)
  }
  // Draw left and right sides
  for (let hr = 1; hr <= Math.round((bh - (16 * 2)) / 16); hr++) {
    ctx.drawImage(dBoxL, bx, by + (16 * hr))
    ctx.drawImage(dBoxR, bx + bw - 16, by + (16 * hr))
  }
  // Draw Center
  for (let hr = 1; hr <= Math.round((bh - (16 * 2)) / 16); hr++) {
    for (let wr = 1; wr <= Math.round((bw - (16 * 2)) / 16); wr++) {
      ctx.drawImage(dBoxC, bx + (16 * wr), by + (16 * hr))
    }
  }
  // Draw corners
  ctx.drawImage(dBoxTL, bx, by)
  ctx.drawImage(dBoxTR, bx + bw - 16, by)
  ctx.drawImage(dBoxBL, bx, by + bh - 16)
  ctx.drawImage(dBoxBR, bx + bw - 16, by + bh - 16)

  return loadImage(ctx.canvas.toDataURL('image/png'))
}