export enum PRINTED_KEY {
  A = 'A',
  C = 'C',
  N = 'N',
  R = 'R',
  T = 'T',
  X = 'X',
  V = 'V',
  ARROW_UP = 'ARROW_UP',
  ARROW_RIGHT = 'ARROW_RIGHT',
  ARROW_DOWN = 'ARROW_DOWN',
  ARROW_LEFT = 'ARROW_LEFT',
  PAGE_UP = 'PAGE_UP',
  PAGE_DOWN = 'PAGE_DOWN',
  DELETE = 'DELETE',
  ENTER = 'ENTER',
  ESC = 'ESC',
  TAB = 'TAB',
  ALT = 'ALT',
}

const PRINTED_KEY_TO_KEYBOARDEVENT_KEYS_MAP: { [key in PRINTED_KEY]: string[] } = {
  [PRINTED_KEY.A]: ['a', 'A'],
  [PRINTED_KEY.C]: ['c', 'C'],
  [PRINTED_KEY.N]: ['n', 'N'],
  [PRINTED_KEY.R]: ['r', 'R'],
  [PRINTED_KEY.T]: ['t', 'T', '†'],
  [PRINTED_KEY.X]: ['x', 'X'],
  [PRINTED_KEY.V]: ['v', 'V'],
  [PRINTED_KEY.ARROW_UP]: ['ArrowUp'],
  [PRINTED_KEY.ARROW_RIGHT]: ['ArrowRight'],
  [PRINTED_KEY.ARROW_DOWN]: ['ArrowDown'],
  [PRINTED_KEY.ARROW_LEFT]: ['ArrowLeft'],
  [PRINTED_KEY.PAGE_UP]: ['PageUp'],
  [PRINTED_KEY.PAGE_DOWN]: ['PageDown'],
  [PRINTED_KEY.DELETE]: ['Delete'],
  [PRINTED_KEY.ENTER]: ['Enter'],
  [PRINTED_KEY.ESC]: ['Escape'],
  [PRINTED_KEY.TAB]: ['Tab'],
  [PRINTED_KEY.ALT]: ['Alt'],
};

export function doesKeyboardEventKeyMatchPrintedKey({
  printedKey,
  keyboardEventKey,
}: {
  printedKey: PRINTED_KEY;
  keyboardEventKey: KeyboardEvent['key'];
}) {
  return PRINTED_KEY_TO_KEYBOARDEVENT_KEYS_MAP[printedKey].includes(keyboardEventKey);
}

// https://javascript.info/mouse-events-basics#mouse-button
export enum MOUSE_BUTTONS {
  BACK = 3,
  FORWARD = 4,
}
