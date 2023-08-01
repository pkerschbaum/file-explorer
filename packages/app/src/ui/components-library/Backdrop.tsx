import styled from 'styled-components';

import { Box } from '#pkg/ui/components-library/Box';
import { useFramerMotionAnimations } from '#pkg/ui/components-library/DesignTokenContext';

type BackdropProps = BackdropComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof BackdropComponentProps
  >;

type BackdropComponentProps = {
  children: React.ReactNode;
  onBackdropClick?: () => void;
};

export const Backdrop = styled((props: BackdropProps) => {
  const {
    /* component props */
    children,
    onBackdropClick,

    /* other props */
    ...delegatedProps
  } = props;

  const framerMotionAnimations = useFramerMotionAnimations();

  return (
    <BackdropContainer {...delegatedProps}>
      <VisualBackdrop onClick={onBackdropClick} {...framerMotionAnimations.fadeInOut} />
      {children}
    </BackdropContainer>
  );
})``;

const BackdropContainer = styled(Box)`
  z-index: 1;
`;

const VisualBackdrop = styled(Box)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.34);
`;
