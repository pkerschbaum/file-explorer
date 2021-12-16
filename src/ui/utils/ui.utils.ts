import * as d3 from 'd3-color';
import invariant from 'tiny-invariant';

export const uiUtils = { darken };

function darken(color: string, coefficient: number) {
  const parsedColor = d3.color(color);
  invariant(parsedColor, `could not parse color! color=${color}`);
  return parsedColor.darker(coefficient).formatHsl();
}
