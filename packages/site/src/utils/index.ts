/**
 * Type narrowing function.
 *
 * @param obj
 * @param prop
 * @returns
 */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}
