import CancelIcon from '@mui/icons-material/Cancel';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { Icon } from '@app/ui/components-library/Icon';
import { IconButton } from '@app/ui/components-library/IconButton';
import { Tooltip, useTooltip } from '@app/ui/components-library/Tooltip';

type ChipProps = Pick<React.HTMLProps<HTMLDivElement>, 'style'> & {
  label: React.ReactNode;
  onDelete: () => void;
  deleteTooltipContent?: React.ReactNode;
};

export const Chip: React.FC<ChipProps> = ({
  label,
  onDelete,
  deleteTooltipContent,
  ...htmlProps
}) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { triggerProps, tooltipProps } = useTooltip({ triggerRef, anchorRef: triggerRef });

  return (
    <ChipContainer {...htmlProps}>
      <ChipLabel>{label}</ChipLabel>
      <ChipDeleteButton ref={triggerRef} {...(triggerProps as any)} onClick={onDelete}>
        <Icon Component={CancelIcon} />
      </ChipDeleteButton>

      {deleteTooltipContent && <Tooltip {...tooltipProps}>{deleteTooltipContent}</Tooltip>}
    </ChipContainer>
  );
};

const ChipContainer = styled(Box)`
  padding-left: var(--spacing-2);
  display: flex;
  gap: var(--spacing-1);

  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-8);
`;

const ChipLabel = styled(Box)`
  display: flex;
  align-items: center;
`;

const ChipDeleteButton = styled(IconButton)`
  padding: 0;
`;
