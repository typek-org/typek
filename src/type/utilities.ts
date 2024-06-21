/**
 * Turns a union of types into an intersection. Avoids turning `boolean`
 * into `never`, even though it is internally represented as `true | false`.
 *
 * @see https://stackoverflow.com/q/50374908/
 */
export type UnionToIntersection<U> = boolean extends U
  ? UnionToIntersection_Helper<Exclude<U, boolean>> & boolean
  : UnionToIntersection_Helper<U>;

type UnionToIntersection_Helper<U> = (
  U extends any ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;
