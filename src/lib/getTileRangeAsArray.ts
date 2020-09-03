import { getTile } from "./getTile"

export async function getTileRangeAsArray (
  tileSet: HTMLImageElement,
  from: number,
  to: number,
  cellSize = 64
): Promise<HTMLImageElement[]> {
  const tiles: HTMLImageElement[] = []
  for (let c = from; c <= to; c++) {
    tiles.push(await getTile(tileSet, c, cellSize))
  }
  return tiles
}