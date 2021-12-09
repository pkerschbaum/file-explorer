import { useBreadcrumbItem, useBreadcrumbs } from '@react-aria/breadcrumbs';
import { mergeProps } from '@react-aria/utils';
import { AriaBreadcrumbItemProps, AriaBreadcrumbsProps } from '@react-types/breadcrumbs';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type BreadcrumbsProps = Pick<AriaBreadcrumbsProps<unknown>, 'children'> &
  Pick<React.HTMLProps<HTMLElement>, 'className'>;

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
  const childrenArray = React.Children.toArray(children);

  return (
    <nav {...mergeProps(htmlProps, navProps)}>
      <BreadcrumbsList>
        {childrenArray.map((child, i) =>
          React.cloneElement(child as React.ReactElement, {
            isCurrent: i === childrenArray.length - 1,
          }),
        )}
      </BreadcrumbsList>
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

type BreadcrumbItemProps = Pick<AriaBreadcrumbItemProps, 'children' | 'isCurrent'> &
  Pick<React.HTMLProps<HTMLLIElement>, 'className'>;

const BreadcrumbItemBase: React.FC<BreadcrumbItemProps> = (props) => {
  const {
    /* react-aria props */
    children,
    isCurrent,

    /* html props */
    ...htmlProps
  } = props;
  const reactAriaProps = {
    children,
    isCurrent,
  };

  const ref = React.useRef<HTMLDivElement>(null);
  const { itemProps } = useBreadcrumbItem({ ...reactAriaProps, elementType: 'div' }, ref);

  return (
    <>
      <li {...htmlProps}>
        <BreadcrumbElem {...itemProps} ref={ref}>
          {props.children}
        </BreadcrumbElem>
      </li>

      {!props.isCurrent && <BreadcrumbSeparator aria-hidden="true">/</BreadcrumbSeparator>}
    </>
  );
};

export const BreadcrumbItem = styled(BreadcrumbItemBase)``;

const BreadcrumbElem = styled(Box)``;
const BreadcrumbSeparator = styled(Box)``;
