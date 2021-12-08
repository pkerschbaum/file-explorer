import { keyframes } from 'styled-components';

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

// taken from https://mui.com/components/progress/#linear-indeterminate
export const MoveLeftToRight1 = keyframes`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {    
    left: 100%;
    right: -90%;
  }
`;

// taken from https://mui.com/components/progress/#linear-indeterminate
export const MoveLeftToRight2 = keyframes`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`;

// taken from https://mui.com/components/skeleton/#pulsate-example
export const Pulsate = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`;
