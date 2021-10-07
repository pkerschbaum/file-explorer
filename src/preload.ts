import { bootstrapModule as bootstrapFileServiceModule } from '@app/platform/file-service/electron-preload/file-service';
import { bootstrapModule as bootstrapFileIconThemeModule } from '@app/platform/file-icon-theme/electron-preload/file-icon-theme';

async function preloadScriptEntryPoint() {
  await Promise.all([bootstrapFileServiceModule(), bootstrapFileIconThemeModule()]);
}

void preloadScriptEntryPoint();
