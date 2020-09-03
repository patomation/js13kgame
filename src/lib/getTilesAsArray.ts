import { getTile } from "./getTile"

/**
 * 
 * @param tileSet single row sprite sheet
 * @param cellSize 
 */
export async function getTilesAsArray (
  spriteSheet: HTMLImageElement,
  cellSize = 64
): Promise<HTMLImageElement[]> {
  const totalTiles = spriteSheet.width / cellSize
  const tiles: HTMLImageElement[] = []
  for (let t = 0; t < totalTiles; t++) {
    tiles.push(await getTile(spriteSheet, t))
  }
  return tiles
}