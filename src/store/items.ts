import { State as RootState } from './index';
import { Module, ActionContext, Commit } from 'vuex';
import { ErrorObject, ValidationErrorDetails } from '@/errors';

interface Item {
  name: string;
  url: string;
  description: string;
}

interface Document {
  id: string;
  data: Item;
}

export interface State {
  currentId: 0;
  cache: Document[];
  owner: string | null;
  loading: boolean;
  error: ErrorObject | null;
}

export const ADD = 'ADD';
export const CHANGE = 'CHANGE';
export const REMOVE = 'REMOVE';
export const ERROR = 'ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const initialState: () => State = () => ({
  currentId: 0,
  cache: [],
  owner: null,
  loading: false,
  error: null,
});

export const getters = {
  getFieldErrors: (state: State) => (field: string) =>
    state.error && state.error.code === 'error/validation'
      ? state.error.details.filter(x => x.field === field).map(x => x.message)
      : [],
};

export const mutations = {
  [ADD](state: State, data: Item) {
    const id = `${(state.currentId += 1)}`;
    state.cache.push({ id, data });
  },
  [CHANGE](state: State, doc: Document) {
    const target = state.cache.find(x => x.id === doc.id);
    if (target) {
      target.data = doc.data;
    }
  },
  [REMOVE](state: State, id: string) {
    state.cache = state.cache.filter(x => x.id !== id);
  },
  [ERROR](state: State, error: ErrorObject) {
    state.error = error;
  },
  [CLEAR_ERROR](state: State) {
    state.error = null;
  },
};

export const actions = {
  add({ commit }: ActionContext<State, RootState>, data: Item) {
    const details: ValidationErrorDetails[] = [];
    if (!data.name) {
      details.push({
        message: 'The name field is required.',
        code: 'error/validation-required',
        field: 'name',
      });
    }
    if (!data.url) {
      details.push({
        message: 'The URL field is required.',
        code: 'error/validation-required',
        field: 'url',
      });
    } else if (!data.url.match(/^https?:.+/)) {
      details.push({
        message: 'The URL field is not a valid URL.',
        code: 'error/validation-url',
        field: 'url',
      });
    }

    if (details.length > 0) {
      return commit(ERROR, {
        details,
        message: details.map(x => x.message).join(', '),
        code: 'error/validation',
      });
    }

    commit(ADD, data);
  },

  change({ commit }: { commit: Commit }, doc: Document) {
    commit(CHANGE, doc);
  },

  remove({ commit }: { commit: Commit }, id: string) {
    commit(REMOVE, id);
  },

  clearError({ commit }: ActionContext<State, RootState>) {
    commit(CLEAR_ERROR);
  },
};

export default {
  getters,
  mutations,
  actions,
  state: initialState,
  namespaced: true,
} as Module<State, RootState>;
