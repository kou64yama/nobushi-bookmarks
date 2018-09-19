import { Module } from 'vuex';
import { State as RootState } from './index';

const SET_TITLE = 'SET_TITLE';

export interface State {
  title: string;
}

export default {
  namespaced: true,

  state: () => ({
    title: '',
  }),

  mutations: {
    [SET_TITLE](state, title: string) {
      state.title = title;
    },
  },

  actions: {
    setTitle({ commit }, title: string) {
      commit(SET_TITLE, title);
    },
  },
} as Module<State, RootState>;
