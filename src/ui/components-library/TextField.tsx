import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import React from 'react';

// Set an ID for MUI TextFields so that the TextField is accessible (https://mui.com/components/text-fields/#accessibility)
const ID_PREFIX = 'TextField';
let lastId = 0;
function generateId() {
  lastId++;
  return `${ID_PREFIX}-${lastId}`;
}

export const TextField: React.FC<MuiTextFieldProps> = (props) => {
  return <MuiTextField id={generateId()} {...props} />;
};
