/**
 * simple rectangle collision detection
 * see: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 * @param ax rectangle a x in px
 * @param ay rectangle a y in px
 * @param aw rectangle a width in px
 * @param ah rectangle a height in px
 * @param bx rectangle b x in px
 * @param by rectangle b y in px
 * @param bw rectangle b width in px
 * @param bh rectangle b height in px
 * RETURNS boolean true if collision between rectangles
 */
export const collision = (
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean => (
  ax < bx + bw &&
  ax + aw > bx &&
  ay < by + bh &&
  ay + ah > by
)
