import { app, BrowserWindow } from 'electron';

//
// Main window
// ---------------------------------------------------------------------

let mainWindow: BrowserWindow | null = null;
function createWindow() {
  if (mainWindow) {
    return;
  }

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
  });
  mainWindow.on('close', () => {
    mainWindow = null;
  });
  mainWindow.loadFile('public/index.html');
}

app.on('ready', createWindow);
app.on('activate', createWindow);

//
// Quit
// ---------------------------------------------------------------------

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
