import { TableCell, TableCellProps, TableSortLabel } from '@mui/material';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

type HeadCellProps = Omit<TableCellProps, 'sortDirection'> & {
  sortDirection?: SortDirection;
  onSortDirectionChange?: (sortDirection?: SortDirection) => void;
};

export function HeadCell(props: HeadCellProps) {
  const { sortDirection, onSortDirectionChange, children, ...rest } = props;

  let currentSortDirection: 'asc' | 'desc' | undefined;
  let nextSortDirection: SortDirection | undefined;

  if (sortDirection === undefined) {
    currentSortDirection = undefined;
    nextSortDirection = SortDirection.ASC;
  } else if (sortDirection === SortDirection.ASC) {
    currentSortDirection = 'asc';
    nextSortDirection = SortDirection.DESC;
  } else {
    currentSortDirection = 'desc';
    nextSortDirection = undefined;
  }

  return (
    <TableCell sortDirection={currentSortDirection} {...rest}>
      {onSortDirectionChange === undefined ? (
        children
      ) : (
        <TableSortLabel
          active={currentSortDirection !== undefined}
          direction={currentSortDirection}
          onClick={() => {
            if (onSortDirectionChange) {
              onSortDirectionChange(nextSortDirection);
            }
          }}
        >
          {children}
        </TableSortLabel>
      )}
    </TableCell>
  );
}
