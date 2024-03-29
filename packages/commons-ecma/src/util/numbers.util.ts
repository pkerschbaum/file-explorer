/**
 * taken from https://github.com/microsoft/vscode/blob/be022daa1af42dcc6edc257df152a6fd29325c32/src/vs/base/common/uint.ts#L6
 */
enum Constants {
  /**
   * MAX SMI (SMall Integer) as defined in v8.
   * one bit is lost for boxing/unboxing flag.
   * one bit is lost for sign flag.
   * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
   */
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  MAX_SAFE_SMALL_INTEGER = 1 << 30,

  /**
   * MIN SMI (SMall Integer) as defined in v8.
   * one bit is lost for boxing/unboxing flag.
   * one bit is lost for sign flag.
   * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
   */
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  MIN_SAFE_SMALL_INTEGER = -(1 << 30),

  /**
   * Max unsigned integer that fits on 8 bits.
   */
  MAX_UINT_8 = 255, // 2^8 - 1

  /**
   * Max unsigned integer that fits on 16 bits.
   */
  MAX_UINT_16 = 65_535, // 2^16 - 1

  /**
   * Max unsigned integer that fits on 32 bits.
   */
  MAX_UINT_32 = 4_294_967_295, // 2^32 - 1

  UNICODE_SUPPLEMENTARY_PLANE_BEGIN = 0x01_00_00,
}

export const numbers = { Constants, roundToDecimals };

// like https://stackoverflow.com/a/11832950/1700319, but we use Math.floor to round down
function roundToDecimals(num: number, countOfDecimals: number): number {
  const factor = Math.pow(10, countOfDecimals);
  return Math.floor((num + Number.EPSILON) * factor) / factor;
}
