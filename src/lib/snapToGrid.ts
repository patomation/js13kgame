import { pxToCord } from "./pxToCoord";

export const snapToGrid = (pixel: number, cellSize = 64): number => (pxToCord(pixel)) * cellSize