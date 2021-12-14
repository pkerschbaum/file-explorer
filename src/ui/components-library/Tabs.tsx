import { mergeProps } from '@react-aria/utils';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { componentLibraryUtils } from '@app/ui/components-library/utils';
import { createContext } from '@app/ui/utils/react.util';

const INDICATOR_MOTION_LAYOUT_ID = componentLibraryUtils.generateMotionLayoutId();

type TabsContext = {
  selectedValue?: string;
  setSelectedValue: (newValue: string) => void;
};

const tabsContext = createContext<TabsContext>('TabsContext');
const useTabsContext = tabsContext.useContextValue;
const TabsContextProvider = tabsContext.Provider;

type TabsProps = TabsComponentProps & Pick<React.ComponentPropsWithoutRef<'div'>, 'className'>;

type TabsComponentProps = {
  selectedValue?: string;
  setSelectedValue: (newValue: string) => void;
  children: React.ReactNode;
};

const TabsBase: React.FC<TabsProps> = (props) => {
  const {
    /* component props */
    selectedValue,
    setSelectedValue,
    children,

    /* other props */
    ...delegatedProps
  } = props;

  return (
    <TabsContextProvider value={{ selectedValue, setSelectedValue }}>
      <Box role="tablist" {...delegatedProps}>
        {children}
      </Box>
    </TabsContextProvider>
  );
};

export const Tabs = styled(TabsBase)`
  isolation: isolate;

  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

type TabProps = TabComponentProps & Pick<React.ComponentPropsWithoutRef<'div'>, 'className'>;

type TabComponentProps = {
  value: string;
  children: React.ReactNode;
};

const TabBase: React.FC<TabProps> = (props) => {
  const {
    /* component props */
    value,
    children,

    /* other props */
    ...delegatedProps
  } = props;

  const { tabProps } = useTab({ value });

  return (
    <Box {...mergeProps(delegatedProps, tabProps)}>
      {children}
      {tabProps['aria-selected'] && <TabIsActiveIndicator layoutId={INDICATOR_MOTION_LAYOUT_ID} />}
    </Box>
  );
};

export const Tab = styled(TabBase)`
  position: relative;
`;

const TabIsActiveIndicator = styled(Box)`
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin-block: auto;

  height: 50%;
  width: 3px;
  background-color: var(--color-primary-main);
  border-radius: 4px;
`;

export function useTab({ value }: { value: string }) {
  const tabContext = useTabsContext();
  const isSelected = value === tabContext.selectedValue;

  return {
    onSelect: () => {
      tabContext.setSelectedValue(value);
    },
    tabProps: {
      role: 'tab',
      'aria-selected': isSelected,
      tabIndex: isSelected ? 0 : -1,
    },
  };
}
