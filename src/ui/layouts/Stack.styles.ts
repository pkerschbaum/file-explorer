import { css, Theme } from '@emotion/react';
import { Property } from 'csstype';

type StyleParams = {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  wrap?: true | 'nowrap' | 'wrap-reverse';
  growItems?: boolean;
  shrinkItems?: boolean;
  itemsBasis?: Property.FlexBasis<string | 0>;
  spacing: number;
};

export const styles = {
  stack: (params: StyleParams) => (theme: Theme) => {
    const flexGrow = !!params.growItems ? 1 : undefined;
    const flexShrink = !!params.shrinkItems ? 1 : undefined;
    const flexBasis = params.itemsBasis !== undefined ? params.itemsBasis : undefined;

    return css({
      display: 'flex',
      flexDirection: params.direction,
      justifyContent: params.justifyContent,
      alignItems: params.alignItems,
      flexWrap: typeof params.wrap === 'string' ? params.wrap : !!params.wrap ? 'wrap' : undefined,
      gap: theme.spacing(params.spacing),

      '& > *': {
        flexGrow,
        flexShrink,
        flexBasis,
      },
    });
  },
};
