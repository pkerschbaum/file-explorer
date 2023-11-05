// taken from https://github.com/microsoft/TypeScript/issues/1897#issuecomment-710744173
type primitive = null | boolean | number | string;

type DefinitelyNotJsonable = (...args: unknown[]) => unknown;

export type JsonObject<T> = { [prop: string]: IsJsonable<T> };
export type IsJsonable<T> =
  /*
   * Check if there are any non-jsonable types represented in the union
   * Note: use of tuples in this first condition side-steps distributive conditional types
   * (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
   */
  [Extract<T, DefinitelyNotJsonable>] extends [never]
    ? // Non-jsonable type union was found empty
      T extends primitive
      ? // Primitive is acceptable
        T
      : // check if undefined
      T extends undefined
      ? // undefined is acceptable (will just get removed)
        T
      : // Otherwise check if array
      T extends (infer U)[]
      ? // Arrays are special; just check array element type
        IsJsonable<U>[]
      : // Otherwise check if object
      // eslint-disable-next-line @typescript-eslint/ban-types
      T extends object
      ? // It's an object
        {
          // Iterate over keys in object case
          [P in keyof T]: IsJsonable<T[P]>; // Recursive call for children
        }
      : // Otherwise any other non-object no bueno
        never
    : // Otherwise non-jsonable type union was found not empty
      never;

/*
 * merge and flatten unions
 * https://www.roryba.in/programming/2019/10/12/flattening-typescript-union-types.html#flattenunion
 */
/**
 * Converts a union of two types into an intersection
 * i.e. A | B -> A & B
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/**
 * Flattens two union types into a single type with optional values
 * i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
 */
export type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K] extends unknown[]
      ? T[K]
      : // eslint-disable-next-line @typescript-eslint/ban-types
      T[K] extends object
      ? FlattenUnion<T[K]>
      : T[K]
    : UnionToIntersection<T>[K] | undefined;
};

/**
 * This function allows to build a property path, in a strongly-typed way.
 *
 * First, the caller has to provide a Shape. The returned function allows to pass properties (up to
 * a depth of 5) to step into the provided shape.
 * The path is compatible with https://final-form.org/docs/final-form/field-names.
 *
 * Unions are flattened so that property accesses are easier. This softens the strict typing of
 * a union type - properties which are only present in one type of the union will be present in the
 * result (but optional).
 * This is convenient for final-form (final-form can handle undefined values well, this does not make
 * any problems.
 */
export function typedPath<Shape>() {
  return function <
    A extends keyof FlattenUnion<Shape>,
    B extends keyof FlattenUnion<FlattenUnion<Shape>[A]>,
    C extends keyof FlattenUnion<FlattenUnion<FlattenUnion<Shape>[A]>[B]>,
    D extends keyof FlattenUnion<FlattenUnion<FlattenUnion<FlattenUnion<Shape>[A]>[B]>[C]>,
    E extends keyof FlattenUnion<
      FlattenUnion<FlattenUnion<FlattenUnion<FlattenUnion<Shape>[A]>[B]>[C]>[D]
    >,
  >(...props: [A, B?, C?, D?, E?]) {
    return props.join('.');
  };
}
