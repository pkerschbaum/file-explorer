import { TableRow, TableRowProps } from '@mui/material';

export const ROW_HEIGHT = '2rem';

type RowProps = TableRowProps;

export function Row(props: RowProps) {
  const { onClick, onDoubleClick, children, ...rest } = props;

  const rowIsClickable = !!onClick || !!onDoubleClick;

  return (
    <TableRow
      hover={rowIsClickable}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      tabIndex={-1}
      {...rest}
      style={{ height: ROW_HEIGHT, ...rest.style }}
    >
      {children}
    </TableRow>
  );
}
