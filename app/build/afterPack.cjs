const { execSync } = require('node:child_process');
const path = require('node:path');

// Ad-hoc sign the macOS .app. A completely unsigned app, once downloaded (and
// therefore quarantined), fails to launch on Apple Silicon with a hard
// "app is damaged" error. An ad-hoc signature turns that into the normal
// "unidentified developer" prompt, which opens via right-click → Open.
// This is NOT notarization (that needs a paid Apple Developer ID).
exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);
  execSync(`codesign --deep --force --sign - "${appPath}"`, { stdio: 'inherit' });
  console.log(`[afterPack] ad-hoc signed ${appPath}`);
};
