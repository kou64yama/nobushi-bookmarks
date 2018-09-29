import fs from 'fs';
import { Plugin } from 'vuex';

interface IOPromise {
  /**
   * The promise of reading.
   */
  read(): Promise<void>;

  /**
   * The promise of writing.
   */
  write(): Promise<void>;
}

type FileStatePlugin<S> = Plugin<S> & IOPromise;

/**
 * Read a state from the file.
 *
 * @param path The file path
 */
export function readState<S>(path: string): Promise<S | null> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, content) => {
      if (err) {
        return reject(err);
      }

      try {
        const initialState: S = JSON.parse(content);
        resolve(initialState);
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * Write a state into file.
 *
 * @param path The file path
 * @param state The store's state
 */
export function writeState<S>(path: string, state: S): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path,
      JSON.stringify(state, null, 2),
      err => (err ? reject(err) : resolve()),
    );
  });
}

/**
 * Store state in filesystem.
 *
 * * Read an initial state from the file
 * * Write a state to the file when every mutations is commited
 *
 * @param path The path to state file
 */
export default function createFileState<S>(path: string): FileStatePlugin<S> {
  const readPromise = readState<S>(path).catch(err => {
    if (err.code === 'ENOENT') return null;
    throw err;
  });

  const plugin: FileStatePlugin<S> = Object.assign<Plugin<S>, IOPromise>(
    async store => {
      readPromise.then(initialState => {
        if (initialState) store.replaceState(initialState);
      });

      store.subscribe(async (_, state) => {
        await readPromise;
        const writePromise = writeState(path, state).catch(err =>
          console.error(err),
        );
        plugin.write = () => writePromise;
      });
    },
    {
      read: () => readPromise.then(() => {}),
      write: () => Promise.resolve(),
    },
  );
  return plugin;
}
