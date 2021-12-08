import CancelIcon from '@mui/icons-material/Cancel';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { Icon } from '@app/ui/components-library/Icon';
import { IconButton } from '@app/ui/components-library/IconButton';

type ChipProps = Pick<React.HTMLProps<HTMLDivElement>, 'style'> & {
  label: React.ReactNode;
  onDelete: () => void;
  deleteTooltipContent: React.ReactChild;
};

export const Chip: React.FC<ChipProps> = ({
  label,
  onDelete,
  deleteTooltipContent,
  ...htmlProps
}) => {
  return (
    <ChipContainer {...htmlProps}>
      <ChipLabel>{label}</ChipLabel>
      <ChipDeleteButton tooltipContent={deleteTooltipContent} onPress={onDelete}>
        <Icon Component={CancelIcon} />
      </ChipDeleteButton>
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
