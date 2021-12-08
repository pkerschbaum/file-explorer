import { useMediaQuery } from '@mui/material';
import { useProgressBar } from '@react-aria/progress';
import { mergeProps } from '@react-aria/utils';
import { AriaProgressBarProps } from '@react-types/progress';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { Box } from '@app/ui/components-library/Box';
import { MoveLeftToRight1, MoveLeftToRight2 } from '@app/ui/utils/animations';

type LinearProgressProps = Pick<
  AriaProgressBarProps,
  'value' | 'isIndeterminate' | 'minValue' | 'maxValue'
> &
  Pick<React.HTMLProps<HTMLDivElement>, 'className'>;

const LinearProgressBase = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  function LinearProgressBaseWithRef(props, ref) {
    const {
      /* react-aria props */
      value = 0,
      isIndeterminate,
      minValue = 0,
      maxValue = 100,

      /* html props */
      ...htmlProps
    } = props;
    const reactAriaProps = {
      value,
      isIndeterminate,
      minValue,
      maxValue,
    };

    const { progressBarProps } = useProgressBar(reactAriaProps);

    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    const percentage = (value - minValue) / (maxValue - minValue);
    const barWidthPercentage = Math.round(percentage * 100);

    return (
      <ProgressContainer ref={ref} {...mergeProps(htmlProps, progressBarProps)}>
        {!prefersReducedMotion ? (
          <ProgressBarBackground>
            {!isIndeterminate ? (
              <ProgressBarDeterminate barWidthPercentage={barWidthPercentage} />
            ) : (
              <>
                <ProgressBarIndeterminate animationVariant="variant-1" />
                <ProgressBarIndeterminate animationVariant="variant-2" />
              </>
            )}
          </ProgressBarBackground>
        ) : (
          <ProgressMessageBox>In Progress...</ProgressMessageBox>
        )}
        {check.isNonEmptyString(progressBarProps['aria-valuetext']) && (
          <ProgressValueBox>{progressBarProps['aria-valuetext']}</ProgressValueBox>
        )}
      </ProgressContainer>
    );
  },
);

export const LinearProgress = styled(LinearProgressBase)``;

const ProgressContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

const ProgressBarBackground = styled(Box)`
  height: 4px;
  flex-grow: 1;

  /* set position:relative and hide overflow for absolutely-positioned (and animated) linear progress bar foreground */
  position: relative;
  overflow: hidden;

  background: var(--color-primary-dark-0);
`;

const ProgressBarForeground = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;

  background: var(--color-primary-main);
`;

const ProgressBarDeterminate = styled(ProgressBarForeground)<{
  barWidthPercentage: number;
}>`
  width: ${({ barWidthPercentage }) => barWidthPercentage}%;
`;

const ProgressBarIndeterminate = styled(ProgressBarForeground)<{
  animationVariant: 'variant-1' | 'variant-2';
}>`
  width: auto;

  /* animations are taken from https://mui.com/components/progress/#linear-indeterminate */
  ${({ animationVariant }) => {
    if (animationVariant === 'variant-1') {
      return css`
        animation: 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite normal none running
          ${MoveLeftToRight1};
      `;
    } else {
      return css`
        animation: 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite normal none running
          ${MoveLeftToRight2};
      `;
    }
  }}
`;

const ProgressMessageBox = styled(Box)`
  flex-grow: 1;
  text-transform: uppercase;
`;

const ProgressValueBox = styled(Box)``;
