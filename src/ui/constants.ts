export const KEYS = {
  C: 'c',
  X: 'x',
  V: 'v',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  DELETE: 'Delete',
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
  SHIFT: 'Shift',
  ESC: 'Escape',
  TAB: 'Tab',
  A: 'a',
  T: 't',
  F2: 'F2',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type KEYS = typeof KEYS;

// https://javascript.info/mouse-events-basics#mouse-button
export const MOUSE_BUTTONS = {
  BACK: 3,
  FORWARD: 4,
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MOUSE_BUTTONS = typeof MOUSE_BUTTONS;
