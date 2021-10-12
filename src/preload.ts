import { bootstrapModule as bootstrapFileServiceModule } from '@app/platform/file-service/file-service';
import {
  bootstrapModule as bootstrapFileIconThemeModule,
  FileIconTheme,
} from '@app/platform/file-icon-theme/file-icon-theme';

declare global {
  interface Window {
    preload: {
      initializationPromise: Promise<void>;
      fileService: ReturnType<typeof bootstrapFileServiceModule>['fileService'];
      fileIconTheme: FileIconTheme;
    };
  }
}

window.preload = {} as any;
window.preload.initializationPromise = (async function preloadScriptEntryPoint() {
  const { fileService } = bootstrapFileServiceModule();
  const fileIconTheme = await bootstrapFileIconThemeModule(fileService);

  window.preload = { ...window.preload, fileService, fileIconTheme };
})();
