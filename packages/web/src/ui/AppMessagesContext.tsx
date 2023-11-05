import { AnimatePresence } from 'framer-motion';
import * as React from 'react';

import type { SnackbarAction } from '#pkg/ui/components-library';
import { Snackbar, SNACKBAR_SEVERITY } from '#pkg/ui/components-library';
import { createContext } from '#pkg/ui/utils/react.util';

export const APP_MESSAGE_SEVERITY = SNACKBAR_SEVERITY;
export type APP_MESSAGE_SEVERITY = SNACKBAR_SEVERITY;

type AppMessage = {
  severity: APP_MESSAGE_SEVERITY;
  label: string;
  detail?: string;
  retryAction?: {
    label: string;
    onPress: () => void | Promise<void>;
  };
};

type PushAppMessages = (message: AppMessage) => void;

const context = createContext<PushAppMessages>('PushAppMessageContext');
export const usePushAppMessage = context.useContextValue;
const PushAppMessageContextProvider = context.Provider;

type AppMessagesContextProps = {
  children: React.ReactNode;
};

export const AppMessagesContext: React.FC<AppMessagesContextProps> = ({ children }) => {
  const [messages, setMessages] = React.useState<AppMessage[]>([]);
  const [currentMessageIdx, setCurrentMessageIdx] = React.useState(0);

  const pushAppMessage: PushAppMessages = React.useCallback((message) => {
    setMessages((oldVal) => [...oldVal, message]);
  }, []);

  function removeCurrentMessage() {
    setCurrentMessageIdx((oldVal) => oldVal + 1);
  }

  const currentMessage: AppMessage | undefined = messages[currentMessageIdx];
  const snackbarActions: SnackbarAction[] = [
    {
      label: 'Dismiss',
      onPress: removeCurrentMessage,
    },
  ];
  if (currentMessage.retryAction) {
    const retry = currentMessage.retryAction.onPress;
    // eslint-disable-next-line no-inner-declarations
    async function retryAndDismiss() {
      await retry();
      removeCurrentMessage();
    }

    snackbarActions.push({
      label: currentMessage.retryAction.label,
      onPress: retryAndDismiss,
    });
  }

  return (
    <PushAppMessageContextProvider value={pushAppMessage}>
      {children}
      <AnimatePresence mode="wait">
        {currentMessage && (
          <Snackbar
            key={currentMessageIdx}
            severity={currentMessage.severity}
            label={currentMessage.label}
            detail={currentMessage.detail}
            actions={snackbarActions}
          />
        )}
      </AnimatePresence>
    </PushAppMessageContextProvider>
  );
};
