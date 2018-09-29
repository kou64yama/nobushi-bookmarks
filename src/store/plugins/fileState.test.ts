import fs from 'fs';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import createFileState, { readState, writeState } from './fileState';

jest.mock('fs');

const localVue = createLocalVue();

localVue.use(Vuex);

const readFile: jest.Mock<{}> = fs.readFile as any;
const writeFile: jest.Mock<{}> = fs.writeFile as any;

describe('readState()', () => {
  afterEach(() => {
    readFile.mockClear();
  });

  it('should read a state from the file', async () => {
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any | null, content?: string) => void,
      ) => {
        callback(null, '{"message":"hello, world"}');
      },
    );

    await expect(readState('path/to/state.json')).resolves.toEqual({
      message: 'hello, world',
    });
    expect(readFile).toBeCalledWith(
      'path/to/state.json',
      'utf8',
      expect.any(Function),
    );
  });

  it('should throw an error when reading throws an error', async () => {
    const err = new Error('mock error');
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any | null, content?: string) => void,
      ) => {
        callback(err);
      },
    );

    await expect(readState('path/to/state.json')).rejects.toThrow(err);
  });

  it('should throw an error when JSON is invalid', async () => {
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any | null, content?: string) => void,
      ) => {
        callback(null, 'invalid');
      },
    );

    await expect(readState('path/to/state.json')).rejects.toThrowError(
      SyntaxError,
    );
  });
});

describe('writeState()', () => {
  afterEach(() => {
    writeFile.mockClear();
  });

  it('should write a state formatted JSON', async () => {
    writeFile.mockImplementation(
      (_path: string, _state: {}, callback: (err: any) => void) => {
        callback(null);
      },
    );

    const state = { message: 'hello, world' };
    await expect(
      writeState('path/to/state.json', state),
    ).resolves.toBeUndefined();
    expect(writeFile).toBeCalledWith(
      'path/to/state.json',
      JSON.stringify(state, null, 2),
      expect.any(Function),
    );
  });

  it('should reject when a write error occurred', async () => {
    const err = new Error('mock error');
    writeFile.mockImplementation(
      (_path: string, _state: {}, callback: (err: any) => void) => {
        callback(err);
      },
    );

    await expect(writeState('path/to/state.json', {})).rejects.toThrow(err);
  });
});

describe('createStateFile()', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error');
    const error: jest.Mock<{}> = console.error as any;
    error.mockImplementation(() => {});
  });

  afterAll(() => {
    readFile.mockClear();
    writeFile.mockClear();
    jest.restoreAllMocks();
  });

  it('should read a initial state', async () => {
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any, content: string) => void,
      ) => {
        callback(null, '{"message": "hello, world"}');
      },
    );
    writeFile.mockImplementation(
      (_path: string, _state: string, callback: (err: any) => void) => {
        callback(null);
      },
    );

    const fileState = createFileState('path/to/state.json');
    const store = new Vuex.Store({
      plugins: [fileState],
    });

    await fileState.read();
    expect(store.state).toEqual({ message: 'hello, world' });
  });

  it('should write a state when mutations are commited', async () => {
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any, content: string) => void,
      ) => {
        callback(null, '{}');
      },
    );
    writeFile.mockImplementation(
      (_path: string, _state: string, callback: (err: any) => void) => {
        callback(null);
      },
    );

    const fileState = createFileState('path/to/state.json');
    const store = new Vuex.Store({
      plugins: [fileState],
      mutations: { test() {} },
    });
    await fileState.read();

    expect(writeFile).not.toBeCalled();

    store.commit('test');
    await fileState.write();
    expect(writeFile).toBeCalledTimes(1);

    store.commit('test');
    await fileState.write();
    expect(writeFile).toBeCalledTimes(2);
  });

  it('should reject when a reading error occurred', async () => {
    const err = new Error('mock error');
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any, content?: string) => void,
      ) => {
        callback(err);
      },
    );

    const fileState = createFileState('path/to/state.json');
    await expect(fileState.read()).rejects.toThrow(err);
  });

  it('should resolve when the state file does not exist', async () => {
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any, content?: string) => void,
      ) => {
        callback({ code: 'ENOENT' });
      },
    );

    const fileState = createFileState('path/to/state.json');
    await expect(fileState.read()).resolves.toBeUndefined();
  });

  it('should resolve when a writing error occurred', async () => {
    readFile.mockImplementation(
      (
        _path: string,
        _encoding: string,
        callback: (err: any, content: string) => void,
      ) => {
        callback(null, '{}');
      },
    );
    writeFile.mockImplementation(
      (_path: string, _state: string, callback: (err?: any) => void) => {
        callback(new Error('mock error'));
      },
    );

    const fileState = createFileState('path/to/state.json');
    const store = new Vuex.Store({
      plugins: [fileState],
      mutations: { test() {} },
    });
    await fileState.read();

    store.commit('test');
    await expect(fileState.write()).resolves.toBeUndefined();
  });
});
