import type { ObjectLiteral } from '@pkerschbaum/commons-ecma/util/types';

// https://stackoverflow.com/a/48342359/1700319
export class CustomError extends Error {
  public readonly data: ObjectLiteral;

  constructor(message: string, data: ObjectLiteral) {
    // 'Error' breaks prototype chain here
    super(message);
    this.data = data;

    // restore prototype chain
    const actualProto = new.target.prototype;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      (this as any).__proto__ = actualProto;
    }
  }
}
