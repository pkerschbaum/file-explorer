import {
  useBreadcrumbs,
  useBreadcrumbItem as useReactAriaBreadcrumbItem,
} from '@react-aria/breadcrumbs';
import { mergeProps } from '@react-aria/utils';
import { AriaBreadcrumbItemProps, AriaBreadcrumbsProps } from '@react-types/breadcrumbs';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type BreadcrumbsAriaProps = Required<Pick<AriaBreadcrumbsProps<unknown>, 'children'>>;

type BreadcrumbsProps = BreadcrumbsAriaProps &
  Omit<React.ComponentProps<'nav'>, keyof BreadcrumbsAriaProps>;

const BreadcrumbsBase: React.FC<BreadcrumbsProps> = (props) => {
  const {
    /* react-aria props */
    children,

    /* html props */
    ...htmlProps
  } = props;
  const reactAriaProps = {
    children,
  };

  const { navProps } = useBreadcrumbs(reactAriaProps);

  return (
    <nav {...mergeProps(htmlProps, navProps)}>
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

type BreadcrumbItemAriaProps = Required<Pick<AriaBreadcrumbItemProps, 'isCurrent' | 'children'>>;

type BreadcrumbItemProps = BreadcrumbItemAriaProps;

const BreadcrumbItemBase: React.FC<BreadcrumbItemProps> = (props) => {
  const {
    /* react-aria props */
    isCurrent,
    children,

    /* html props */
    ...htmlProps
  } = props;

  return (
    <>
      <li {...htmlProps}>{children}</li>
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
