declare global {
  interface Window {
    privileged: Privileged;
  }
}

type Privileged = {
  processEnv: NodeJS.ProcessEnv;
};

export function initializePrivilegedPlatformModules() {
  window.privileged = {
    // eslint-disable-next-line node/no-process-env
    processEnv: process.env,
  };
}
