import { useBreadcrumbItem, useBreadcrumbs } from '@react-aria/breadcrumbs';
import { AriaBreadcrumbItemProps, AriaBreadcrumbsProps } from '@react-types/breadcrumbs';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type BreadcrumbsProps = Pick<AriaBreadcrumbsProps<unknown>, 'children'>;

export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const { navProps } = useBreadcrumbs(props);
  const children = React.Children.toArray(props.children);

  return (
    <BreadcrumbsNav {...navProps}>
      <BreadcrumbsList>
        {children.map((child, i) =>
          React.cloneElement(child as React.ReactElement, { isCurrent: i === children.length - 1 }),
        )}
      </BreadcrumbsList>
    </BreadcrumbsNav>
  );
};

const BreadcrumbsNav = styled.nav``;
const BreadcrumbsList = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);

  list-style: none;
  margin: 0;
  padding: 0;
`;

type BreadcrumbItemProps = Pick<AriaBreadcrumbItemProps, 'children' | 'isCurrent'>;

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { itemProps } = useBreadcrumbItem({ ...props, elementType: 'div' }, ref);

  return (
    <>
      <BreadcrumbListItem>
        <BreadcrumbElem {...itemProps} ref={ref}>
          {props.children}
        </BreadcrumbElem>
      </BreadcrumbListItem>

      {!props.isCurrent && <BreadcrumbSeparator aria-hidden="true">/</BreadcrumbSeparator>}
    </>
  );
};

const BreadcrumbListItem = styled.li``;
const BreadcrumbElem = styled(Box)``;
const BreadcrumbSeparator = styled(Box)``;
