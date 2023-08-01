import { useProgressBar } from '@react-aria/progress';
import { mergeProps } from '@react-aria/utils';
import type { AriaProgressBarProps } from '@react-types/progress';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { check } from '#pkg/base/utils/assert.util';
import { Box } from '#pkg/ui/components-library/Box';
import { componentLibraryUtils } from '#pkg/ui/components-library/utils';

type LinearProgressProps = LinearProgressAriaProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof LinearProgressAriaProps
  >;

type LinearProgressAriaProps = Required<Pick<AriaProgressBarProps, 'aria-label'>> &
  Pick<AriaProgressBarProps, 'value' | 'isIndeterminate' | 'minValue' | 'maxValue'>;

export const LinearProgress = styled(
  React.forwardRef<HTMLDivElement, LinearProgressProps>(function LinearProgressWithRef(props, ref) {
    const {
      /* react-aria props */
      'aria-label': ariaLabel,
      value = 0,
      isIndeterminate,
      minValue = 0,
      maxValue = 100,

      /* other props */
      ...delegatedProps
    } = props;
    const reactAriaProps: AriaProgressBarProps = {
      'aria-label': ariaLabel,
      value,
      isIndeterminate,
      minValue,
      maxValue,
    };

    const { progressBarProps } = useProgressBar(reactAriaProps);

    const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();

    const percentage = (value - minValue) / (maxValue - minValue);
    const barWidthPercentage = Math.round(percentage * 100);

    return (
      <ProgressRoot ref={ref} {...mergeProps(delegatedProps, progressBarProps)}>
        {isAnimationAllowed ? (
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
      </ProgressRoot>
    );
  }),
)``;

const ProgressRoot = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
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
        animation: var(--animation-move-left-to-right-1);
      `;
    } else {
      return css`
        animation: var(--animation-move-left-to-right-2);
      `;
    }
  }}
`;

const ProgressMessageBox = styled(Box)`
  flex-grow: 1;
  text-transform: uppercase;
`;

const ProgressValueBox = styled(Box)``;
