import MuiAddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MuiArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import MuiArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import MuiArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import MuiAutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import MuiCancelIcon from '@mui/icons-material/Cancel';
import MuiCircleIcon from '@mui/icons-material/Circle';
import MuiCircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import MuiClearAllIcon from '@mui/icons-material/ClearAll';
import MuiCloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MuiContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import MuiContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import MuiContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import MuiCreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import MuiDeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MuiDeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MuiDoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import MuiEditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MuiErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MuiFolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import MuiFullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import MuiInfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MuiKeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MuiKeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import MuiKeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import MuiKeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MuiKeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import MuiKeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';
import MuiLaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import MuiMinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import MuiSettingsIcon from '@mui/icons-material/Settings';
import MuiViewComfyIcon from '@mui/icons-material/ViewComfy';
import { motion } from 'framer-motion';
import type * as React from 'react';
import styled, { css } from 'styled-components';

type MuiIconComponent = typeof MuiContentCopyOutlinedIcon;
type MuiIconComponentProps = Parameters<MuiIconComponent>[0];

export type IconProps = IconComponentProps & Pick<MuiIconComponentProps, 'className'>;

type IconComponentProps = {
  Component: MuiIconComponent;
  fontSize?: 'inherit' | 'sm';
};

const IconBase: React.FC<IconProps> = (props) => {
  const {
    /* component props */
    Component,
    fontSize: _ignored,

    /* other props */
    ...delegatedProps
  } = props;

  return <Component {...delegatedProps} component={motion.svg} fontSize="inherit" />;
};

const Icon = styled(IconBase)`
  font-size: ${({ fontSize }) => fontSize === 'sm' && 'var(--icon-size-sm)'};
`;

export const AddCircleOutlineOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiAddCircleOutlineOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const ArrowCircleDownOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiArrowCircleDownOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const ArrowCircleUpOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiArrowCircleUpOutlinedIcon} {...delegatedProps} />;
})``;
export const ArrowRightAltOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiArrowRightAltOutlinedIcon} {...delegatedProps} />;
})``;
export const AutorenewOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiAutorenewOutlinedIcon} {...delegatedProps} />;
})``;
export const CancelIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiCancelIcon} {...delegatedProps} />;
})``;
export const CircleIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiCircleIcon} {...delegatedProps} />;
})``;
export const CircleOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiCircleOutlinedIcon} {...delegatedProps} />;
})``;
export const ClearAllIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiClearAllIcon} {...delegatedProps} />;
})``;
export const CloseOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiCloseOutlinedIcon} {...delegatedProps} />;
})``;
export const ContentCopyOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiContentCopyOutlinedIcon} {...delegatedProps} />;
})``;
export const ContentCutOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiContentCutOutlinedIcon} {...delegatedProps} />;
})``;
export const ContentPasteOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiContentPasteOutlinedIcon} {...delegatedProps} />;
})``;
export const CreateNewFolderOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiCreateNewFolderOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const DeleteForeverOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiDeleteForeverOutlinedIcon} {...delegatedProps} />;
})``;
export const DeleteOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiDeleteOutlinedIcon} {...delegatedProps} />;
})``;
export const DoubleArrowIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiDoubleArrowIcon} {...delegatedProps} />;
})``;
export const EditOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiEditOutlinedIcon} {...delegatedProps} />;
})``;
export const ErrorOutlineOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiErrorOutlineOutlinedIcon} {...delegatedProps} />;
})``;
export const FolderOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiFolderOutlinedIcon} {...delegatedProps} />;
})``;
export const FullscreenOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiFullscreenOutlinedIcon} {...delegatedProps} />;
})``;
export const InfoOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiInfoOutlinedIcon} {...delegatedProps} />;
})``;
export const KeyboardArrowDownOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiKeyboardArrowDownOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const KeyboardArrowLeftOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiKeyboardArrowLeftOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const KeyboardArrowRightOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiKeyboardArrowRightOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const KeyboardArrowUpOutlinedIcon = styled(
  (delegatedProps: Omit<IconProps, 'Component'>) => {
    return <Icon Component={MuiKeyboardArrowUpOutlinedIcon} {...delegatedProps} />;
  },
)``;
export const KeyboardReturnOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiKeyboardReturnOutlinedIcon} {...delegatedProps} />;
})``;
export const KeyboardTabOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiKeyboardTabOutlinedIcon} {...delegatedProps} />;
})``;
export const LaunchOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiLaunchOutlinedIcon} {...delegatedProps} />;
})``;
export const MinimizeOutlinedIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiMinimizeOutlinedIcon} {...delegatedProps} />;
})``;
export const RotatingAutorenewOutlinedIcon = styled(AutorenewOutlinedIcon)`
  animation: var(--animation-rotate);
  ${({ theme }) =>
    !theme.isAnimationAllowed &&
    css`
      display: none;
    `}
`;
export const SettingsIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiSettingsIcon} {...delegatedProps} />;
})``;
export const ViewComfyIcon = styled((delegatedProps: Omit<IconProps, 'Component'>) => {
  return <Icon Component={MuiViewComfyIcon} {...delegatedProps} />;
})``;
