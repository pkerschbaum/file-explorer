/* eslint-disable node/no-process-env, @typescript-eslint/no-var-requires, no-console -- we disable some rules since this file is only used in DEV environment */
const installer = require('electron-devtools-installer');

export async function installExtensions() {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS', 'DEVTRON'];

  try {
    await Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload)));
  } catch (err) {
    console.error(err);
  }
}
