import arrayEquals, { Arr } from './arrayEquals'

// Check if two array of arrays are equals
const array2dEquals = (
  arr1: Arr[],
  arr2: Arr[]
): boolean => {
  let result = true
  arr1.forEach((arr, index) => {
    if (!arrayEquals(arr, arr2[index])) {
      result = false
    }
  })
  return result
}

export default array2dEquals
