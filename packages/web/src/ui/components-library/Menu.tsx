import { useFocus } from '@react-aria/interactions';
import type { AriaMenuItemProps, AriaMenuOptions } from '@react-aria/menu';
import { useMenu as useReactAriaMenu, useMenuItem, useMenuTrigger } from '@react-aria/menu';
import { useOverlayPosition } from '@react-aria/overlays';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { Item as ReactAriaItem } from '@react-stately/collections';
import type { MenuTriggerState } from '@react-stately/menu';
import { useMenuTriggerState } from '@react-stately/menu';
import type { TreeProps, TreeState } from '@react-stately/tree';
import { useTreeState } from '@react-stately/tree';
import type { AriaButtonProps } from '@react-types/button';
import type { ItemProps as ReactAriaItemProps, Node } from '@react-types/shared';
import * as React from 'react';
import { styled, css } from 'styled-components';

import { Paper } from '#pkg/ui/components-library/Paper';
import type { PopoverInstance } from '#pkg/ui/components-library/Popover';
import { Popover } from '#pkg/ui/components-library/Popover';

type UseMenuArgs<TriggerHTMLElement extends HTMLElement> = {
  triggerRef: React.RefObject<TriggerHTMLElement>;
  menu?: {
    align: 'start' | 'end';
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

export function useMenu<TriggerHTMLElement extends HTMLElement>(
  props: UseMenuArgs<TriggerHTMLElement>,
): UseMenuReturnType {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const state = useMenuTriggerState({});
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, props.triggerRef);

  // derive overlay placement from menu trigger props
  const placement = `bottom ${props.menu?.align ?? 'start'}` as const;

  const { overlayProps: popoverPositionProps } = useOverlayPosition({
    targetRef: props.triggerRef,
    overlayRef: popoverRef,
    placement,
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
      menuDomProps: menuProps as React.HTMLAttributes<HTMLElement>,
      state,
    },
  };
}

type MenuPopupProps<T extends object> = Pick<TreeProps<T>, 'children'> &
  Required<Pick<AriaMenuOptions<unknown>, 'aria-label'>> &
  Pick<AriaMenuItemProps, 'closeOnSelect'> &
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
      autoFocus: 'first',
    },
    state,
    menuRef,
  );

  function onClose() {
    menuPopupInstance.state.close();
  }

  return (
    <Popover popoverInstance={menuPopupInstance.popoverInstance} disableAutoFocus hideBackdrop>
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

type MenuItemProps<T extends object> = Pick<AriaMenuItemProps, 'onClose' | 'closeOnSelect'> &
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
      $styleProps={styleProps}
    >
      {item.rendered}
    </MenuItemRoot>
  );
}

type MenuItemStyleProps<T extends object> = MenuItemProps<T> & {
  isFocused: boolean;
};

const MenuItemRoot = styled.li<{ $styleProps: MenuItemStyleProps<any> }>`
  padding: var(--padding-button-md-block) var(--padding-button-md-inline);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  cursor: pointer;

  ${({ $styleProps }) =>
    $styleProps.isFocused &&
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
