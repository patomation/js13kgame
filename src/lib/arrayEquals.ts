export type Arr = Array<(string | number | boolean | Record<string, unknown> | null)>
export default function arrayEquals (a: Arr, b: Arr): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
