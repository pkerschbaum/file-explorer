import { css, Theme } from '@emotion/react';

export const commonStyles = {
  grid: {
    entireRow: css`
      grid-column: 1 / -1;
    `,

    entireRowExceptLastColumn: css`
      grid-column: 1 / -2;
    `,

    stickToStart: css`
      justify-self: start;
    `,

    stickToEnd: css`
      justify-self: end;
    `,

    horizontalCenter: css`
      justify-self: center;
    `,

    verticalCenter: css`
      align-self: center;
    `,
  },

  flex: {
    shrinkAndFitHorizontal: css`
      min-width: 0;
      flex-basis: 0;
      flex-shrink: 1;
      flex-grow: 1;
    `,

    shrinkAndFitVertical: css`
      min-height: 0;
      flex-basis: 0;
      flex-shrink: 1;
      flex-grow: 1;
    `,

    shrinkContainerHorizontal: css`
      width: min-content;
    `,

    disableShrink: css`
      flex-shrink: 0;
    `,

    disableShrinkChildren: css`
      & > * {
        flex-shrink: 0;
      }
    `,
  },

  text: {
    stickToStart: css`
      text-align: start;
    `,

    stickToEnd: css`
      text-align: end;
    `,

    colorPrimary: (theme: Theme) =>
      css`
        color: ${theme.palette.text.primary};
      `,

    noTransform: css`
      text-transform: none;
    `,

    overflowEllipsis: css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,

    breakAll: css`
      word-break: break-all;
    `,
  },

  borderBoxSizing: css`
    box-sizing: border-box;
  `,

  fullHeight: css`
    height: 100%;
  `,

  fullWidth: css`
    width: 100%;
  `,

  maxContainerHeight: css`
    max-height: 100%;
  `,

  maxContainerWidth: css`
    max-width: 100%;
  `,

  horizontalCenter: css`
    justify-self: center;
    text-align: center;
  `,

  uppercase: css`
    text-transform: uppercase;
  `,

  preserveNewlines: css`
    white-space: pre-wrap;
  `,

  noNewLines: css`
    white-space: nowrap;
  `,

  transparent: css`
    opacity: 0;
  `,

  hidden: css`
    display: none;
  `,

  overlayContainer: css`
    display: grid;
    justify-items: center;
  `,

  overlayChild: css`
    grid-column: 1;
    grid-row: 1;
  `,

  transparentBackground: css`
    background-color: transparent;
  `,

  cursorPointer: css`
    cursor: pointer;
  `,

  noUserSelectionAllowed: css`
    user-select: none;
  `,
};
