import { TableHead as MuiTableHead, TableRow } from '@mui/material';
import * as React from 'react';

type TableHeadProps = {
  children: React.ReactNode[];
};

export function TableHead({ children }: TableHeadProps) {
  return (
    <MuiTableHead>
      <TableRow>{children}</TableRow>
    </MuiTableHead>
  );
}
