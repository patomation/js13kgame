import Array2D from './Array2D'
import { crossDirections } from './directions'
// Source borrowed and converted to typescript, modularized and modified by @patomation
// https://www.freecodecamp.org/news/how-to-make-your-own-procedural-dungeon-map-generator-using-the-random-walk-algorithm-e0085c8aa9a/
// https://codepen.io/anon/pen/aLpORx

/**
 * procedurally generate tile map dungeon
 * @param dimensions width and height of the map
 * @param maxTunnels max number of tunnels possible
 * @param maxLength  max length each tunnel can have
 */
export function createMap(
  dimensions: number,
  maxTunnels: number,
  maxLength: number
): {
  startX: number
  startY: number
  map: Array2D<number>
} {
  const startX = Math.floor(Math.random() * dimensions)
  const startY = Math.floor(Math.random() * dimensions)

  let map = new Array2D(dimensions, dimensions, 1), // create a 2d array full of 1's
    currentRow = startY, // our current row - start at a random spot
    currentColumn = startX, // our current column - start at a random spot
    directions = crossDirections, // array to get a random direction from (left,right,up,down)
    lastDirection: number[] = [], // save the last direction we went
    randomDirection // next turn/direction - holds a value from directions

  // lets create some tunnels - while maxTunnels, dimensions, and maxLength  is greater than 0.
  while (maxTunnels && dimensions && maxLength) {

    // lets get a random direction - until it is a perpendicular to our lastDirection
    // if the last direction = left or right,
    // then our new direction has to be up or down,
    // and vice versa
    do {
       randomDirection = directions[Math.floor(Math.random() * directions.length)]
    } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]))

    var randomLength = Math.ceil(Math.random() * maxLength), //length the next tunnel will be (max of maxLength)
      tunnelLength = 0 //current length of tunnel being created

    // lets loop until our tunnel is long enough or until we hit an edge
    while (tunnelLength < randomLength) {

      //break the loop if it is going out of the map
      if (((currentRow === 0) && (randomDirection[0] === -1)) ||
          ((currentColumn === 0) && (randomDirection[1] === -1)) ||
          ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
          ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
        break
      } else {
        map[currentRow][currentColumn] = 0 //set the value of the index in map to 0 (a tunnel, making it one longer)
        currentRow += randomDirection[0] //add the value from randomDirection to row and col (-1, 0, or 1) to update our location
        currentColumn += randomDirection[1]
        tunnelLength++ //the tunnel is now one longer, so lets increment that variable
      }
    }

    if (tunnelLength) { // update our variables unless our last loop broke before we made any part of a tunnel
      lastDirection = randomDirection //set lastDirection, so we can remember what way we went
      maxTunnels-- // we created a whole tunnel so lets decrement how many we have left to create
    }
  }
  return {
    startX,
    startY,
    map
  }
}