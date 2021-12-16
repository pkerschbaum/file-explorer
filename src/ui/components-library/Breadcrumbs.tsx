import {
  useBreadcrumbs,
  useBreadcrumbItem as useReactAriaBreadcrumbItem,
} from '@react-aria/breadcrumbs';
import { mergeProps } from '@react-aria/utils';
import { AriaBreadcrumbItemProps, AriaBreadcrumbsProps } from '@react-types/breadcrumbs';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type BreadcrumbsProps = BreadcrumbsAriaProps &
  Omit<React.ComponentPropsWithoutRef<'nav'>, keyof BreadcrumbsAriaProps>;

type BreadcrumbsAriaProps = Required<Pick<AriaBreadcrumbsProps<unknown>, 'children'>>;

export const Breadcrumbs = styled((props: BreadcrumbsProps) => {
  const {
    /* react-aria props */
    children,

    /* other props */
    ...delegatedProps
  } = props;
  const reactAriaProps: AriaBreadcrumbsProps<unknown> = {
    children,
  };

  const { navProps } = useBreadcrumbs(reactAriaProps);

  return (
    <BreadcrumbsRoot {...mergeProps(delegatedProps, navProps)}>
      <BreadcrumbsList>{children}</BreadcrumbsList>
    </BreadcrumbsRoot>
  );
})``;

const BreadcrumbsRoot = styled.nav``;

const BreadcrumbsList = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);

  list-style: none;
  margin: 0;
  padding: 0;
`;

type BreadcrumbItemProps = BreadcrumbItemAriaProps &
  Omit<React.ComponentPropsWithoutRef<'li'>, keyof BreadcrumbItemAriaProps>;

type BreadcrumbItemAriaProps = Required<Pick<AriaBreadcrumbItemProps, 'isCurrent' | 'children'>>;

export const BreadcrumbItem = styled((props: BreadcrumbItemProps) => {
  const {
    /* react-aria props */
    isCurrent,
    children,

    /* other props */
    ...delegatedProps
  } = props;

  return (
    <>
      <BreadcrumbRoot {...delegatedProps}>{children}</BreadcrumbRoot>
      {!isCurrent && <BreadcrumbSeparator aria-hidden="true">/</BreadcrumbSeparator>}
    </>
  );
})``;

const BreadcrumbRoot = styled.li``;

const BreadcrumbSeparator = styled(Box)``;

type UseBreadcrumbArgs<ItemHTMLElement extends HTMLElement> = {
  itemRef: React.RefObject<ItemHTMLElement>;
  itemProps: Omit<AriaBreadcrumbItemProps, 'children'>;
};

export function useBreadcrumbItem<ItemHTMLElement extends HTMLElement>({
  itemRef,
  itemProps,
}: UseBreadcrumbArgs<ItemHTMLElement>) {
  return useReactAriaBreadcrumbItem(itemProps as AriaBreadcrumbItemProps, itemRef);
}
