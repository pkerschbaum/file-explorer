import { initializePrivilegedPlatformModules } from '@app/platform/electron-preload/initialize-privileged-platform-modules';

declare global {
  interface Window {
    preload: {
      initializationPromise: Promise<void>;
    };
  }
}

window.preload = { initializationPromise: initializePrivilegedPlatformModules() };
