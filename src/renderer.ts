import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import '@app/ui/App';
import '@app/platform/file-service/electron-browser/file-service';

async function readDirec() {
  const homefolder = URI.file('/home/pkerschbaum');
  const result = await window.fileService.resolve(homefolder);
  console.dir(result);
}

void readDirec();
