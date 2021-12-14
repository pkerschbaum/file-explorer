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

const BreadcrumbsBase: React.FC<BreadcrumbsProps> = (props) => {
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
    <nav {...mergeProps(delegatedProps, navProps)}>
      <BreadcrumbsList>{children}</BreadcrumbsList>
    </nav>
  );
};

export const Breadcrumbs = styled(BreadcrumbsBase)``;

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

const BreadcrumbItemBase: React.FC<BreadcrumbItemProps> = (props) => {
  const {
    /* react-aria props */
    isCurrent,
    children,

    /* other props */
    ...delegatedProps
  } = props;

  return (
    <>
      <li {...delegatedProps}>{children}</li>
      {!isCurrent && <BreadcrumbSeparator aria-hidden="true">/</BreadcrumbSeparator>}
    </>
  );
};

export const BreadcrumbItem = styled(BreadcrumbItemBase)``;

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
