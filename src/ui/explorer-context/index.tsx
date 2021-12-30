import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { ExplorerOperationsContextProvider } from '@app/ui/explorer-context/ExplorerOperations.context';
import { ExplorerRootContextProvider } from '@app/ui/explorer-context/ExplorerRoot.context';
import { ExplorerStateContextProvider } from '@app/ui/explorer-context/ExplorerState.context';

export * from '@app/ui/explorer-context/ExplorerOperations.context';
export * from '@app/ui/explorer-context/ExplorerDerivedValues.context';
export * from '@app/ui/explorer-context/ExplorerRoot.context';
export * from '@app/ui/explorer-context/ExplorerState.context';

type ExplorerContextProviderProps = {
  explorerId: string;
  children: React.ReactNode;
};

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = ({
  explorerId,
  children,
}) => (
  <ExplorerRootContextProvider explorerId={explorerId}>
    <ExplorerStateContextProvider>
      <ExplorerDerivedValuesContextProvider>
        <ExplorerOperationsContextProvider>{children}</ExplorerOperationsContextProvider>
      </ExplorerDerivedValuesContextProvider>
    </ExplorerStateContextProvider>
  </ExplorerRootContextProvider>
);
