import { useFocus } from '@react-aria/interactions';
import {
  AriaMenuItemProps,
  AriaMenuOptions,
  useMenu as useReactAriaMenu,
  useMenuItem,
  useMenuTrigger,
} from '@react-aria/menu';
import { useOverlayPosition } from '@react-aria/overlays';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { Item as ReactAriaItem } from '@react-stately/collections';
import { MenuTriggerState, useMenuTriggerState } from '@react-stately/menu';
import { TreeProps, TreeState, useTreeState } from '@react-stately/tree';
import { AriaButtonProps } from '@react-types/button';
import { MenuTriggerProps } from '@react-types/menu';
import { PositionProps } from '@react-types/overlays';
import { ItemProps as ReactAriaItemProps, Node } from '@react-types/shared';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Paper } from '@app/ui/components-library/Paper';
import { Popover, PopoverInstance } from '@app/ui/components-library/Popover';

type UseMenuArgs<TriggerHTMLElement extends HTMLElement> = {
  triggerRef: React.RefObject<TriggerHTMLElement>;
  menu?: {
    triggerProps?: MenuTriggerProps;
  };
};

type UseMenuReturnType = {
  triggerProps: AriaButtonProps<any>;
  menuInstance: MenuInstance;
};

export type MenuInstance = {
  popoverInstance: PopoverInstance;
  menuDomProps: React.HTMLAttributes<HTMLElement>;
  state: MenuTriggerState;
};

const HORIZONTAL_DIRECTIONS = ['left', 'right', 'start', 'end'];

export function useMenu<TriggerHTMLElement extends HTMLElement>(
  props: UseMenuArgs<TriggerHTMLElement>,
): UseMenuReturnType {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const state = useMenuTriggerState(props.menu?.triggerProps ?? {});
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, props.triggerRef);

  // derive overlay placement from menu trigger props
  const direction = props.menu?.triggerProps?.direction ?? 'bottom';
  const align = props.menu?.triggerProps?.align;
  let placement: PositionProps['placement'] = direction;
  if (align !== undefined) {
    if (HORIZONTAL_DIRECTIONS.includes(direction)) {
      if (align === 'start') {
        placement += ' top';
      } else if (align === 'end') {
        placement += ' bottom';
      }
    } else {
      placement += ` ${align}`;
    }
  }

  const { overlayProps: popoverPositionProps } = useOverlayPosition({
    targetRef: props.triggerRef,
    overlayRef: popoverRef,
    placement: placement as PositionProps['placement'],
    offset: 0,
    isOpen: state.isOpen,
  });

  return {
    triggerProps: menuTriggerProps,
    menuInstance: {
      popoverInstance: {
        popoverRef,
        popoverDomProps: popoverPositionProps,
        state,
      },
      menuDomProps: menuProps,
      state,
    },
  };
}

type MenuPopupProps<T extends object> = Pick<TreeProps<T>, 'children'> &
  Required<Pick<AriaMenuOptions<unknown>, 'aria-label'>> &
  Pick<MenuTriggerProps, 'closeOnSelect'> &
  MenuPopupComponentProps;

type MenuPopupComponentProps = {
  menuPopupInstance: MenuInstance;
};

export function MenuPopup<T extends object>(props: MenuPopupProps<T>) {
  const { menuPopupInstance } = props;

  return <>{menuPopupInstance.state.isOpen && <MenuPopupInner {...props} />}</>;
}

function MenuPopupInner<T extends object>(props: MenuPopupProps<T>) {
  const {
    /* react-aria props */
    children,
    'aria-label': ariaLabel,
    closeOnSelect,

    /* component props */
    menuPopupInstance,
  } = props;
  const reactAriaProps = {
    children,
    'aria-label': ariaLabel,
    closeOnSelect,
  };

  const menuRef = React.useRef<HTMLUListElement>(null);
  const state = useTreeState<T>({ ...reactAriaProps, selectionMode: 'none' });
  const { menuProps } = useReactAriaMenu<T>(
    {
      ...reactAriaProps,
      autoFocus: menuPopupInstance.state.focusStrategy,
    },
    state,
    menuRef,
  );

  function onClose() {
    menuPopupInstance.state.close();
  }

  return (
    <Popover popoverInstance={menuPopupInstance.popoverInstance} hideBackdrop>
      <PopupPaper>
        <MenuContainer {...mergeProps(menuProps, menuPopupInstance.menuDomProps)} ref={menuRef}>
          {[...state.collection].map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              state={state}
              onClose={onClose}
              closeOnSelect={reactAriaProps.closeOnSelect}
            />
          ))}
        </MenuContainer>
      </PopupPaper>
    </Popover>
  );
}

const PopupPaper = styled(Paper)`
  padding-block: var(--spacing-2);
`;

const MenuContainer = styled.ul`
  margin: 0;
  padding: 0;
`;

type MenuItemProps<T extends object> = Pick<AriaMenuItemProps, 'onClose'> &
  Pick<MenuTriggerProps, 'closeOnSelect'> &
  MenuItemComponentProps<T>;

type MenuItemComponentProps<T extends object> = {
  item: Node<T>;
  state: TreeState<T>;
};

function MenuItem<T extends object>(props: MenuItemProps<T>) {
  const { item, state, onClose, closeOnSelect } = props;
  const { onAction, itemRef, itemDomProps = {} } = item.props as ItemProps<T>;

  const ref = useObjectRef(itemRef);
  const [isFocused, setFocused] = React.useState(false);

  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      onAction,
      onClose,
      closeOnSelect,
    },
    state,
    ref,
  );
  const { focusProps } = useFocus({ onFocusChange: setFocused });

  const styleProps: MenuItemStyleProps<T> = {
    ...props,
    isFocused,
  };

  return (
    <MenuItemRoot
      {...mergeProps(menuItemProps, focusProps, itemDomProps)}
      ref={ref}
      styleProps={styleProps}
    >
      {item.rendered}
    </MenuItemRoot>
  );
}

type MenuItemStyleProps<T extends object> = MenuItemProps<T> & {
  isFocused: boolean;
};

const MenuItemRoot = styled.li<{ styleProps: MenuItemStyleProps<any> }>`
  padding: var(--padding-button-md-block) var(--padding-button-md-inline);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  cursor: pointer;

  ${({ styleProps }) =>
    styleProps.isFocused &&
    css`
      border-color: var(--color-bg-2);
      background-color: var(--color-bg-2);
    `}
`;

type ItemProps<T> = ReactAriaItemProps<T> & {
  onAction: () => void;
  itemRef?: React.RefObject<HTMLLIElement>;
  itemDomProps?: AriaButtonProps<'li'>;
};
export const Item = ReactAriaItem as <T>(props: ItemProps<T>) => JSX.Element;
