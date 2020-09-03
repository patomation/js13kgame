/**
 * 
 */
export default class Array2D<Item extends (Record<string, unknown> | string | number | boolean | null)> extends Array {
  constructor (rows: number, cols: number, value: Item) {
    super(rows)
    this.fill(null)
    Object.assign(this, this.map(() =>
      new Array(cols).fill(value)
    ))
  }
}
