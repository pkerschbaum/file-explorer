import { Skeleton } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { Cell } from '@app/ui/elements/DataTable/Cell';
import { DataTable, DataTableProps } from '@app/ui/elements/DataTable/DataTable';
import { HeadCell } from '@app/ui/elements/DataTable/HeadCell';
import { Row } from '@app/ui/elements/DataTable/Row';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { TableHead } from '@app/ui/elements/DataTable/TableHead';
import { TextBox } from '@app/ui/elements/TextBox';
import { useDataAvailable } from '@app/ui/explorer-context';
import { ResourcesTableBody } from '@app/ui/resources-table/ResourcesTableBody';

export const ResourcesTable: React.FC = () => {
  const dataAvailable = useDataAvailable();

  return (
    <StyledDataTable>
      <TableHead sx={{ userSelect: 'none' }}>
        <Row>
          <HeadCell>
            <TextBox fontSize="sm" fontBold>
              Name
            </TextBox>
          </HeadCell>
          <HeadCell>
            <TextBox fontSize="sm" fontBold>
              Size
            </TextBox>
          </HeadCell>
          <HeadCell>
            <TextBox fontSize="sm" fontBold>
              Last Modified
            </TextBox>
          </HeadCell>
        </Row>
      </TableHead>

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
    <Cell>
      <TextBox fontSize="sm">
        <Skeleton variant="text" width={160} />
      </TextBox>
    </Cell>
    <Cell>
      <TextBox fontSize="sm">
        <Skeleton variant="text" width={40} />
      </TextBox>
    </Cell>
  </Row>
);
