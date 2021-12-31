import { CwdSegmentDerivedValuesContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentDerivedValues.context';
import { CwdSegmentOperationsContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentOperations.context';
import { CwdSegmentRootContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentRoot.context';
import { CwdSegmentStateContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentState.context';

export * from '@app/ui/cwd-segment-context/CwdSegmentOperations.context';
export * from '@app/ui/cwd-segment-context/CwdSegmentDerivedValues.context';
export * from '@app/ui/cwd-segment-context/CwdSegmentRoot.context';
export * from '@app/ui/cwd-segment-context/CwdSegmentState.context';

type CwdSegmentContextProviderProps = {
  segmentIdx: number;
  children: React.ReactNode;
};

export const CwdSegmentContextProvider: React.FC<CwdSegmentContextProviderProps> = ({
  segmentIdx,
  children,
}) => (
  <CwdSegmentRootContextProvider segmentIdx={segmentIdx}>
    <CwdSegmentStateContextProvider>
      <CwdSegmentDerivedValuesContextProvider>
        <CwdSegmentOperationsContextProvider>{children}</CwdSegmentOperationsContextProvider>
      </CwdSegmentDerivedValuesContextProvider>
    </CwdSegmentStateContextProvider>
  </CwdSegmentRootContextProvider>
);
