import path from 'path';
import fs from 'fs';
import { inspect } from 'util';
import { app, shell, ipcMain, BrowserWindow, IpcMessageEvent } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import modules, { State } from './store';

Vue.config.productionTip = __DEV__;

Vue.use(Vuex);

const statePath = path.join(app.getPath('userData'), 'state.json');

const store = new Vuex.Store<State>({
  modules,
  strict: __DEV__,
});

let writeStatePromise = Promise.resolve();

store.subscribe((mutation, state) => {
  console.info(
    `* ${mutation.type} ${inspect(mutation.payload, {
      colors: true,
      compact: true,
    })}`,
  );

  writeStatePromise = new Promise(resolve =>
    fs.writeFile(statePath, JSON.stringify(state), err => {
      if (err) console.error(`Failed to write state: ${err}`);
      resolve();
    }),
  );
});

const initialStatePromise = new Promise<void>((resolve, reject) =>
  fs.readFile(statePath, 'utf8', (err, content) => {
    if (err) {
      // No file
      if (err.code === 'ENOENT') return resolve();

      console.error(`Failed to read state: ${err}`);
      return reject(err);
    }

    try {
      const initialState = JSON.parse(content);
      console.info(
        `* __INITIAL_STATE__ ${inspect(initialState, {
          colors: true,
          compact: true,
        })}`,
      );
      store.replaceState(initialState);
      resolve();
    } catch (err) {
      console.error(`Failed to read state: ${err}`);
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

  await initialStatePromise;

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

  if (__DEV__) {
    mainWindow.webContents.openDevTools();
  }

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

app.once('will-quit', async event => {
  event.preventDefault();
  console.info('Waiting for writing state...');
  await writeStatePromise;
  console.info('Complete writing state.');
  app.quit();
});
