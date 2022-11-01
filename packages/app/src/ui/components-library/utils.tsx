import useMediaMatch from '@rooks/use-media-match';
import type { MotionProps } from 'framer-motion';

import { config } from '@app/config';

export const componentLibraryUtils = {
  generateMotionLayoutId,
  isRunningInPlaywright,
  useIsAnimationAllowed,
};

const MOTION_LAYOUTID_PREFIX = `${config.productName}-motion-layoutid`;
let lastId = 0;
function generateMotionLayoutId() {
  lastId++;
  return `${MOTION_LAYOUTID_PREFIX}-${lastId}`;
}

export type DataAttributes = Partial<{
  [attribute: `data-${string}`]: string;
}>;

export type ReactMotionProps<
  T extends React.ElementType,
  U extends HTMLElement,
> = React.ComponentPropsWithoutRef<T> &
  React.RefAttributes<U> &
  Pick<
    MotionProps,
    'layout' | 'layoutId' | 'initial' | 'animate' | 'exit' | 'transition' | 'variants'
  >;

function isRunningInPlaywright(): boolean {
  return (window as any).playwright !== undefined;
}

function useIsAnimationAllowed(): boolean {
  const prefersReducedMotion = useMediaMatch('(prefers-reduced-motion: reduce)');
  return !prefersReducedMotion;
}
