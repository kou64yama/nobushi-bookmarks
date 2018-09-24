import path from 'path';
import fs from 'fs';
import { inspect } from 'util';
import { app, shell, ipcMain, BrowserWindow, IpcMessageEvent } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import modules, { State } from './store';

Vue.config.productionTip = __DEV__;

Vue.use(Vuex);

//
// Store
// ---------------------------------------------------------------------

const store = new Vuex.Store<State>({
  modules,
  strict: __DEV__,
});

const statePath = path.join(app.getPath('userData'), 'state.json');

store.subscribe((mutation, state) => {
  console.info(
    `* ${inspect(mutation.type, { colors: true })} ${inspect(mutation.payload, {
      colors: true,
      compact: true,
    })}`,
  );

  fs.writeFile(
    statePath,
    JSON.stringify(state),
    err => err && console.error(err),
  );
});

const initialStatePromise = new Promise<State | null>((resolve, reject) =>
  fs.readFile(statePath, 'utf8', (err, content) => {
    // No file
    if (err && err.code === 'ENOENT') return resolve(null);
    // Other error
    if (err) return reject(err);

    try {
      const initialState = JSON.parse(content);
      console.info(
        `initialState = ${inspect(initialState, {
          colors: true,
          compact: true,
        })}`,
      );
      resolve(initialState);
    } catch (err) {
      reject(err);
    }
  }),
);

//
// IPC event listeners
// ---------------------------------------------------------------------

ipcMain.on(
  'dispatch',
  async (event: IpcMessageEvent, id: string, type: string, payload?: any) => {
    try {
      const value = await store.dispatch(type, payload);
      event.sender.send(`dispatch:${id}`, null, value);
    } catch (err) {
      event.sender.send(`dispatch:${id}`, err);
    }
  },
);

//
// Ready
// ---------------------------------------------------------------------

let mainWindow: BrowserWindow | null = null;
let unsubscribe: (() => void) | null = null;

ipcMain.on('connect', (event: IpcMessageEvent) => {
  if (!mainWindow || event.sender !== mainWindow.webContents) return;
  console.info('connected.');

  event.sender.send('initialState', store.state);

  if (unsubscribe) unsubscribe();
  unsubscribe = store.subscribe(mutation =>
    event.sender.send('commit', mutation),
  );
});

async function createWindow() {
  if (mainWindow) return mainWindow.show();

  const initialState = await initialStatePromise;
  if (initialState) {
    store.replaceState(initialState);
  }

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

  mainWindow.on('close', () => {
    mainWindow = null;
    if (unsubscribe) unsubscribe();
    console.info('disconnected.');
  });
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
