import { TableRow, TableRowProps } from '@mui/material';

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
    >
      {children}
    </TableRow>
  );
}
