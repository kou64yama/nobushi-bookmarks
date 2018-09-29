import path from 'path';
import { app, shell, ipcMain, BrowserWindow, IpcMessageEvent } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import modules, { State } from './store';
import createLogger from './store/plugins/logger';
import createFileState from './store/plugins/fileState';
import { CONNECT, INITIAL_STATE, DISPATCH, COMMIT } from './store/plugins/ipc';

Vue.config.productionTip = __DEV__;
Vue.use(Vuex);

if (__DEV__) {
  app.setPath('userData', path.join(app.getAppPath(), '../data'));
}

console.info(
  '------------------------------------------------------------------------',
);
console.info(`App Path: ${app.getAppPath()}`);
console.info(`User Data: ${app.getPath('userData')}`);
console.info(
  '------------------------------------------------------------------------',
);

const statePath = path.join(app.getPath('userData'), 'state.json');

const fileState = createFileState<State>(statePath);
const store = new Vuex.Store<State>({
  modules,
  plugins: [
    fileState,
    ...(__DEV__ ? [createLogger({ colors: true, compact: true })] : []),
  ],
  strict: __DEV__,
});

//
// Main window
// ---------------------------------------------------------------------

let mainWindow: BrowserWindow | null = null;
let unsubscribe: (() => void) = () => {};

async function createWindow() {
  if (mainWindow) return mainWindow.show();

  await fileState.read();

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    frame: false,
    thickFrame: true,
    titleBarStyle: 'hidden',
  });
  mainWindow.loadFile('public/index.html');

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  if (__DEV__ && process.argv.includes('--inspect')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once('close', () => {
    mainWindow = null;
    unsubscribe();
  });
}

//
// IPC Event handling
// ---------------------------------------------------------------------

ipcMain.on(CONNECT, (event: IpcMessageEvent) => {
  if (!mainWindow || event.sender.id !== mainWindow.webContents.id) return;

  unsubscribe();
  event.sender.send(INITIAL_STATE, store.state);

  const unsubscribeInternal = store.subscribe(mutation => {
    event.sender.send(COMMIT, mutation);
  });
  unsubscribe = () => {
    unsubscribeInternal();
    unsubscribe = () => {};
    console.info('disconnected');
  };

  console.info('connected.');
});

ipcMain.on(
  DISPATCH,
  async (event: IpcMessageEvent, id: string, type: string, payload?: any) => {
    try {
      const value = await store.dispatch(type, payload);
      event.sender.send(`${DISPATCH}:${id}`, null, value);
    } catch (err) {
      event.sender.send(`${DISPATCH}:${id}`, err);
    }
  },
);

//
// Start
// ---------------------------------------------------------------------

app.on('ready', createWindow);
app.on('activate', createWindow);

//
// Quit
// ---------------------------------------------------------------------

app.once('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.once('will-quit', async event => {
  event.preventDefault();
  console.info('Waiting for writing state...');
  await fileState.write();
  console.info('Complete writing state.');
  app.quit();
});
