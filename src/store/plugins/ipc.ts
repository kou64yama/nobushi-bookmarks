import { Plugin, MutationPayload, Payload, Dispatch } from 'vuex';
import { IpcRenderer, IpcMessageEvent } from 'electron';

export const DISPATCH = 'dispatch';
export const INITIAL_STATE = 'initialState';
export const COMMIT = 'commit';
export const CONNECT = 'connect';

export function createDispatch(ipcRenderer: IpcRenderer): Dispatch {
  let currentId = 0;

  return (typeOrPayloadWithType: string | Payload, payload?: any) =>
    new Promise<any>((resolve, reject) => {
      const id = (currentId += 1);

      if (typeof typeOrPayloadWithType === 'object') {
        const { type, ...rest } = typeOrPayloadWithType;
        ipcRenderer.send(DISPATCH, id, type, rest);
      } else {
        ipcRenderer.send(DISPATCH, id, typeOrPayloadWithType, payload);
      }

      ipcRenderer.once(
        `${DISPATCH}:${id}`,
        (_: IpcMessageEvent, err: any, value?: any) =>
          err ? reject(err) : resolve(value),
      );
    });
}

/**
 * Send dispatcher to main-process via IPC.
 *
 * * Replace own state with the received state on 'initialState' channel
 * * Commit the received mutation on 'commit' channel
 * * Replace dispatch method
 * * Send a first event on 'connect' channel
 *
 * @param ipcRenderer IpcRenderer
 * @returns Vuex's plugin
 */
export default function createIpcSync<S>(ipcRenderer: IpcRenderer): Plugin<S> {
  return store => {
    ipcRenderer.once(INITIAL_STATE, (_: IpcMessageEvent, initialState: S) =>
      store.replaceState(initialState),
    );

    ipcRenderer.on(COMMIT, (_: IpcMessageEvent, mutation: MutationPayload) =>
      store.commit(mutation.type, mutation.payload),
    );

    store.dispatch = createDispatch(ipcRenderer);
    ipcRenderer.send(CONNECT);
  };
}
