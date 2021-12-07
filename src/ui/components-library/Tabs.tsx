import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { uiUtils } from '@app/ui/components-library/utils';
import { createContext } from '@app/ui/utils/react.util';

const INDICATOR_MOTION_LAYOUT_ID = uiUtils.generateMotionLayoutId();

type TabsContext = {
  selectedValue?: string;
  setSelectedValue: (newValue: string) => void;
};

const tabsContext = createContext<TabsContext>('TabsContext');
const useTabsContext = tabsContext.useContextValue;
const TabsContextProvider = tabsContext.Provider;

type TabsProps = {
  selectedValue?: string;
  setSelectedValue: (newValue: string) => void;
  children: React.ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({ selectedValue, setSelectedValue, children }) => {
  return (
    <TabsContextProvider value={{ selectedValue, setSelectedValue }}>
      <TabsListContainer role="tablist">{children}</TabsListContainer>
    </TabsContextProvider>
  );
};

const TabsListContainer = styled(Box)`
  isolation: isolate;

  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

type TabProps = {
  value: string;
  children: React.ReactNode;
};

export const Tab: React.FC<TabProps> = ({ value, children }) => {
  const { tabProps } = useTab({ value });

  return (
    <TabContainer {...tabProps}>
      {children}
      {tabProps['aria-selected'] && <TabIsActiveIndicator layoutId={INDICATOR_MOTION_LAYOUT_ID} />}
    </TabContainer>
  );
};

const TabContainer = styled(Box)`
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
