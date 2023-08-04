import * as d3 from 'd3-color';
import invariant from 'tiny-invariant';

export const uiUtils = { darken, getScrollParent };

function darken(color: string, coefficient: number) {
  const parsedColor = d3.color(color);
  invariant(parsedColor, `could not parse color! color=${color}`);
  return parsedColor.darker(coefficient).formatHsl();
}

/**
 * based on https://stackoverflow.com/a/35940276/1700319 and its comments
 */
function getScrollParent(node: unknown): Element | null {
  if (!(node instanceof HTMLElement)) {
    return null;
  }

  const overflowY = window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY && !overflowY.includes('visible') && !overflowY.includes('hidden');

  if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  } else if (node.parentNode === null) {
    return document.scrollingElement;
  } else {
    return getScrollParent(node.parentNode) ?? document.body;
  }
}
