import { IpcRenderer } from 'electron';
import Vuex, { Store, Dispatch } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import createIpcSync, {
  CONNECT,
  DISPATCH,
  INITIAL_STATE,
  COMMIT,
  createDispatch,
} from './ipc';

const localVue = createLocalVue();

localVue.use(Vuex);

const mockIpcRenderer = Object.assign({} as IpcRenderer, {
  on: jest.fn(),
  once: jest.fn(),
  send: jest.fn(),
});

describe('createIpcSync()', () => {
  let store: Store<{}> & { commit: jest.Mock };

  beforeEach(() => {
    store = Object.assign(
      new Vuex.Store({ plugins: [createIpcSync(mockIpcRenderer)] }),
      {
        commit: jest.fn(),
      },
    );
  });

  afterEach(() => {
    mockIpcRenderer.on.mockClear();
    mockIpcRenderer.once.mockClear();
    mockIpcRenderer.send.mockClear();
  });

  it(`should send '${CONNECT}' event`, () => {
    expect(mockIpcRenderer.send).lastCalledWith(CONNECT);
  });

  it(`should replace dispatch, sending '${DISPATCH}' event`, () => {
    store.dispatch('test_type', 'test_payload');

    expect(mockIpcRenderer.send).lastCalledWith(
      DISPATCH,
      expect.any(Number),
      'test_type',
      'test_payload',
    );
  });

  it(`should listen '${INITIAL_STATE}' event`, () => {
    expect(mockIpcRenderer.once).toBeCalledWith(
      INITIAL_STATE,
      expect.any(Function),
    );
  });

  it(`should listen '${COMMIT}' event`, () => {
    expect(mockIpcRenderer.on).toBeCalledWith(COMMIT, expect.any(Function));
  });

  it(`should replace own state with the received state on '${INITIAL_STATE}' event`, () => {
    const callback = mockIpcRenderer.once.mock.calls.filter(
      ([channel]) => channel === INITIAL_STATE,
    )[0][1];

    const initialState = { foo: 'bar' };
    callback({}, initialState);

    expect(store.state).toEqual(initialState);
  });

  it(`should commit the received mutation on '${COMMIT}' event`, () => {
    const callback = mockIpcRenderer.on.mock.calls.filter(
      ([channel]) => channel === COMMIT,
    )[0][1];

    callback({}, { type: 'test_type', payload: 'test_payload' });

    expect(store.commit).toBeCalledWith('test_type', 'test_payload');
  });
});

describe('createDispatch()', () => {
  let dispatch: Dispatch;

  beforeEach(() => {
    dispatch = createDispatch(mockIpcRenderer);
  });

  afterEach(() => {
    mockIpcRenderer.send.mockClear();
    mockIpcRenderer.once.mockClear();
  });

  it('should send a dispatch event on IPC (type, payload)', () => {
    dispatch('test:event', 'test message');

    expect(mockIpcRenderer.send).toBeCalledWith(
      'dispatch',
      expect.anything(),
      'test:event',
      'test message',
    );
  });

  it('should send a dispatch event on IPC (typeAndPayload)', () => {
    dispatch({
      type: 'foo',
      message: 'bar',
    });

    expect(mockIpcRenderer.send).toBeCalledWith(
      'dispatch',
      expect.anything(),
      'foo',
      { message: 'bar' },
    );
  });

  it('should resolve when receive a valid reply event', () => {
    const promise = dispatch('test:event', 'test message');

    expect(mockIpcRenderer.once).toBeCalledWith(
      expect.stringMatching(/^dispatch:\d+$/),
      expect.any(Function),
    );

    const callback = mockIpcRenderer.once.mock.calls[0][1];

    callback({}, null, 'reply message');
    expect(promise).resolves.toEqual('reply message');
  });

  it('should reject when receive an error reply event', () => {
    const promise = dispatch('test:event', 'test message');

    expect(mockIpcRenderer.once).toBeCalledWith(
      expect.stringMatching(/^dispatch:\d+$/),
      expect.any(Function),
    );

    const callback = mockIpcRenderer.once.mock.calls[0][1];

    callback({}, new Error('test error'));
    expect(promise).rejects.toThrow('test error');
  });
});
