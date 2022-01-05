export enum KEY {
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

export const KEY_TO_KEYBOARDEVENT_KEYS_MAP: { [key in KEY]: string[] } = {
  [KEY.A]: ['a', 'A'],
  [KEY.C]: ['c', 'C'],
  [KEY.N]: ['n', 'N'],
  [KEY.R]: ['r', 'R'],
  [KEY.T]: ['t', 'T', '†'],
  [KEY.X]: ['x', 'X'],
  [KEY.V]: ['v', 'V'],
  [KEY.ARROW_UP]: ['ArrowUp'],
  [KEY.ARROW_RIGHT]: ['ArrowRight'],
  [KEY.ARROW_DOWN]: ['ArrowDown'],
  [KEY.ARROW_LEFT]: ['ArrowLeft'],
  [KEY.PAGE_UP]: ['PageUp'],
  [KEY.PAGE_DOWN]: ['PageDown'],
  [KEY.DELETE]: ['Delete'],
  [KEY.ENTER]: ['Enter'],
  [KEY.ESC]: ['Escape'],
  [KEY.TAB]: ['Tab'],
  [KEY.ALT]: ['Alt'],
};

// https://javascript.info/mouse-events-basics#mouse-button
export enum MOUSE_BUTTONS {
  BACK = 3,
  FORWARD = 4,
}
