export const isWall = (tileMap: number[][], xCoord: number, yCoord: number): boolean => {
  return tileMap[yCoord] !== undefined ? tileMap[yCoord][xCoord] === 1 : false
}
