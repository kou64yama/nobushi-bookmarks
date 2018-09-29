import { State as RootState } from './index';
import { Module, Commit as VuexCommit } from 'vuex';
import { ErrorObject, ValidationErrorDetails, ValidationError } from '@/errors';

export const ADD = 'ADD';
export const CHANGE = 'CHANGE';
export const REMOVE = 'REMOVE';
export const ERROR = 'ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

interface Item {
  name: string;
  url: string;
  description: string;
}

interface DocumentReference<T> {
  id: string;
  data: T;
}

export interface State {
  currentId: 0;
  cache: DocumentReference<Item>[];
  error: ErrorObject | null;
}

export interface Commit extends VuexCommit {
  (type: typeof ADD, data: Item): void;
  (type: typeof CHANGE, doc: DocumentReference<Item>): void;
  (type: typeof REMOVE, id: string): void;
  (type: typeof ERROR, error: ErrorObject): void;
  (type: typeof CLEAR_ERROR): void;
}

export const initialState: () => State = () => ({
  currentId: 0,
  cache: [],
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

  [CHANGE](state: State, doc: DocumentReference<Item>) {
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

export function validate(data: Item): ValidationError | null {
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

  return details.length > 0
    ? {
        details,
        message: details.map(x => x.message).join(' '),
        code: 'error/validation',
      }
    : null;
}

export const actions = {
  add({ commit }: { commit: Commit }, data: Item) {
    const error = validate(data);
    if (error) {
      return commit(ERROR, error);
    }

    commit(ADD, data);
  },

  change({ commit }: { commit: Commit }, doc: DocumentReference<Item>) {
    const { data } = doc;
    const error = validate(data);
    if (error) {
      return commit(ERROR, error);
    }

    commit(CHANGE, doc);
  },

  remove({ commit }: { commit: Commit }, id: string) {
    commit(REMOVE, id);
  },

  clearError({ commit }: { commit: Commit }) {
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
