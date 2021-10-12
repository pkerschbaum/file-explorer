import * as React from 'react';

import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { ExplorerContextProvider } from '@app/ui/Explorer.context';
import { ExplorerPanel } from '@app/ui/explorer-panel/ExplorerPanel';
import { useFileProviderCwd } from '@app/platform/store/file-provider/file-provider.hooks';

type ExplorerPanelContainerProps = { explorerId: string };

export const ExplorerPanelContainer = React.memo<ExplorerPanelContainerProps>(
  function ExplorerPanelContainer({ explorerId }) {
    const cwd = useFileProviderCwd(explorerId);

    return (
      <ExplorerContextProvider key={URI.from(cwd).toString()} explorerId={explorerId}>
        <MemoizedExplorerPanel explorerId={explorerId} />
      </ExplorerContextProvider>
    );
  },
);

const MemoizedExplorerPanel = React.memo<ExplorerPanelContainerProps>(
  function MemoizedExplorerPanel({ explorerId }) {
    return <ExplorerPanel explorerId={explorerId}></ExplorerPanel>;
  },
);
