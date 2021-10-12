import * as React from 'react';
import { TableHead as MuiTableHead, TableRow } from '@mui/material';

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
