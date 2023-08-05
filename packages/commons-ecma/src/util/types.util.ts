// taken from https://github.com/microsoft/TypeScript/issues/1897#issuecomment-710744173
type primitive = null | boolean | number | string;

type DefinitelyNotJsonable = (...args: any[]) => any;

export type JsonObject<T> = { [prop: string]: IsJsonable<T> };
export type IsJsonable<T> =
  // Check if there are any non-jsonable types represented in the union
  // Note: use of tuples in this first condition side-steps distributive conditional types
  // (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
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

export type ObjectLiteral = { [key: string]: any };

export type EmptyObject = { [prop: string]: never };

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

// https://github.com/Microsoft/TypeScript/issues/15480#issuecomment-601714262
type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A['length'] ? 0 : 1];
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

// discriminate unions
// https://stackoverflow.com/a/50499316/1700319
export type NarrowUnion<
  Union,
  DiscriminatorProperty extends keyof Union,
  DiscriminatorValue,
> = Union extends {
  [prop in DiscriminatorProperty]: DiscriminatorValue;
}
  ? Union
  : never;

// merge and flatten unions
// https://www.roryba.in/programming/2019/10/12/flattening-typescript-union-types.html#flattenunion
/**
 * Converts a union of two types into an intersection
 * i.e. A | B -> A & B
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
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
    ? T[K] extends any[]
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

export type ExtractPropertiesOfType<T, Type extends string | number | boolean> = {
  [K in keyof T]: T[K] extends Type ? K : never;
}[keyof T];

export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export type RemoveIndexSignature<T> = {
  [K in KnownKeys<T>]: T[K];
};

// identity function to show computed types
// https://github.com/microsoft/vscode/issues/94679#issuecomment-611320155
export type Id<T> = {} & { [P in keyof T]: T[P] };

// https://stackoverflow.com/a/58993872/1700319
// eslint-disable-next-line @typescript-eslint/ban-types
type ImmutablePrimitive = undefined | null | boolean | string | number | Function;
type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export type Immutable<T> = T extends ImmutablePrimitive
  ? T
  : T extends Array<infer U>
  ? ImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer M>
  ? ImmutableSet<M>
  : ImmutableObject<T>;

export type FunctionType<Args extends unknown[], ReturnType> = (...args: Args) => ReturnType;

/**
 * https://stackoverflow.com/a/43001581/1700319
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Expands object types one level deep
 * https://stackoverflow.com/a/57683652/1700319
 */
export type ExpandProps<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;
