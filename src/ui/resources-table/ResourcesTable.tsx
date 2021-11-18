import { Skeleton } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { DataTable, DataTableProps } from '@app/ui/elements/DataTable/DataTable';
import { HeadCell } from '@app/ui/elements/DataTable/HeadCell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { TableHead } from '@app/ui/elements/DataTable/TableHead';
import { useDataAvailable } from '@app/ui/explorer-context';
import {
  IconWrapper,
  ResourceRowContent,
  ResourcesTableBody,
} from '@app/ui/resources-table/ResourcesTableBody';

export const ResourcesTable: React.FC = () => {
  const dataAvailable = useDataAvailable();

  return (
    <StyledDataTable>
      <StyledTableHead>
        <Row>
          <StyledHeadCell>Name</StyledHeadCell>
          <StyledHeadCell>Size</StyledHeadCell>
          <StyledHeadCell>Last Modified</StyledHeadCell>
        </Row>
      </StyledTableHead>

      <TableBody>
        {dataAvailable ? (
          <ResourcesTableBody />
        ) : (
          <>
            <SkeletonRow />
            <SkeletonRow opacity={0.66} />
            <SkeletonRow opacity={0.33} />
          </>
        )}
      </TableBody>
    </StyledDataTable>
  );
};

const StyledTableHead = styled(TableHead)`
  user-select: none;
`;

const StyledHeadCell = styled(HeadCell)`
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.bold};
`;

const ForwardClassNameTable: React.FC<DataTableProps & { className?: string }> = ({
  className,
  ...delegated
}) => <DataTable {...delegated} classes={{ ...delegated.classes, table: className }} />;

const StyledDataTable = styled(ForwardClassNameTable)`
  & thead th:nth-of-type(1),
  & tbody td:nth-of-type(1) {
    width: 100%;
  }
  & thead th,
  & thead th *,
  & tbody td,
  & tbody td * {
    white-space: nowrap;
  }
`;

type SkeletonRowProps = {
  opacity?: number;
};

const SkeletonRow: React.FC<SkeletonRowProps> = ({ opacity }) => (
  <Row sx={{ opacity }}>
    <ResourceRowContent
      iconSlot={<IconWrapper />}
      resourceNameSlot={<Skeleton variant="text" width={160} />}
      sizeSlot={<Skeleton variant="text" width={40} />}
      mtimeSlot={<Skeleton variant="text" width={40} />}
    />
  </Row>
);
