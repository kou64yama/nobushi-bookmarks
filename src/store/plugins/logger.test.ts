import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import createLogger from './logger';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('createLogger()', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should write mutation logs', () => {
    const store = new Vuex.Store({
      plugins: [createLogger({})],
      mutations: {
        test() {},
      },
    });

    store.commit('test');
    expect(console.info).toBeCalled();
  });
});
