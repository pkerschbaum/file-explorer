import type { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import React from 'react';
import styled from 'styled-components';

import { uriHelper } from '@app/base/utils/uri-helper';
import { commonStyles } from '@app/ui/common-styles';
import { Box, InfoOutlinedIcon, Tooltip, useTooltip } from '@app/ui/components-library';

const CUTOFF_INDEX = 2;

type ProcessResourcesListProps = {
  uris: UriComponents[];
};

export const ProcessResourcesList: React.FC<ProcessResourcesListProps> = ({ uris }) => {
  const tooltipTriggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipAnchorRef = React.useRef<HTMLDivElement>(null);
  const { triggerProps, tooltipInstance } = useTooltip({
    triggerRef: tooltipTriggerRef,
    anchorRef: tooltipAnchorRef,
    tooltip: {
      offset: { mainAxis: 12 },
      placement: 'right',
    },
  });

  let urisToShowImmediately: UriComponents[] = [];
  let urisToShowInTooltip: UriComponents[] = [];
  if (uris.length <= CUTOFF_INDEX + 1) {
    urisToShowImmediately = uris;
  } else {
    urisToShowImmediately = uris.slice(0, CUTOFF_INDEX);
    urisToShowInTooltip = uris.slice(CUTOFF_INDEX);
  }

  return (
    <ResourcesList ref={tooltipTriggerRef} {...triggerProps}>
      <Box>Files/Folders:</Box>

      {urisToShowImmediately.map((uri) => (
        <ResourceBox key={uriHelper.getComparisonKey(uri)}>
          {uriHelper.extractBasename(uri)}
        </ResourceBox>
      ))}

      {urisToShowInTooltip.length > 0 && (
        <>
          <ResourceBox>
            <Box>+ {urisToShowInTooltip.length} files/folders</Box>
            <IconContainer ref={tooltipAnchorRef}>
              <InfoOutlinedIcon fontSize="sm" />
            </IconContainer>
          </ResourceBox>

          <Tooltip tooltipInstance={tooltipInstance}>
            <TooltipResourcesList>
              {urisToShowInTooltip.map((uri) => (
                <ResourceBox key={uriHelper.getComparisonKey(uri)}>
                  {uriHelper.extractBasename(uri)}
                </ResourceBox>
              ))}
            </TooltipResourcesList>
          </Tooltip>
        </>
      )}
    </ResourcesList>
  );
};

const ResourcesList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
`;

const ResourceBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  font-weight: var(--font-weight-bold);
  word-break: break-all;
`;

const IconContainer = styled(Box)`
  display: flex;
`;

const TooltipResourcesList = styled(ResourcesList)`
  ${commonStyles.layout.flex.shrinkAndFitVertical}
  max-height: 100%;
  display: flex;
  overflow-y: auto;
`;
