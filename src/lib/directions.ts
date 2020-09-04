export const crossDirections = [
  [0, -1], // Up
  [1, 0],  // Right
  [0, 1],  // Down
  [-1, 0], // Left
]

export const diagonalDirections = [
  [1, -1], // Up/Right
  [1, 1],  // Right/Down
  [-1, 1],  // Down/Left
  [-1, -1]  // Left/up 
]

export const directions = [
  ...crossDirections,
  ...diagonalDirections
]