import { CwdSegmentDerivedValuesContextProvider } from '#pkg/ui/cwd-segment-context/CwdSegmentDerivedValues.context';
import { CwdSegmentOperationsContextProvider } from '#pkg/ui/cwd-segment-context/CwdSegmentOperations.context';
import { CwdSegmentRootContextProvider } from '#pkg/ui/cwd-segment-context/CwdSegmentRoot.context';
import { CwdSegmentStateContextProvider } from '#pkg/ui/cwd-segment-context/CwdSegmentState.context';

export * from '#pkg/ui/cwd-segment-context/CwdSegmentOperations.context';
export * from '#pkg/ui/cwd-segment-context/CwdSegmentDerivedValues.context';
export * from '#pkg/ui/cwd-segment-context/CwdSegmentRoot.context';
export * from '#pkg/ui/cwd-segment-context/CwdSegmentState.context';

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
