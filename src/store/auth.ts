import { Module } from 'vuex';
import firebase from '@/firebase';
import { State as RootState } from './index';

export interface State {
  currentUser: firebase.UserInfo | null;
  loading: boolean;
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const CLEAR_CURRENT_USER = 'CLEAR_CURRENT_USER';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export default {
  namespaced: true,

  state: () => ({
    currentUser: null,
    loading: true,
  }),

  mutations: {
    [SET_CURRENT_USER](state, currentUser: firebase.UserInfo) {
      state.currentUser = currentUser;
      state.loading = false;
    },
    [CLEAR_CURRENT_USER](state) {
      state.currentUser = null;
      state.loading = false;
    },
    [SIGN_IN](state) {
      state.loading = true;
    },
    [SIGN_OUT](state) {
      state.loading = true;
    },
  },

  actions: {
    init({ commit }) {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          return commit(CLEAR_CURRENT_USER);
        }

        commit(SET_CURRENT_USER, {
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          providerId: user.providerId,
          uid: user.uid,
        });
      });
    },

    signInWithEmailAndPassword({ commit }, payload) {
      commit(SIGN_IN);
      return firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password);
    },

    signOut({ commit }) {
      commit(SIGN_OUT);
      return firebase.auth().signOut();
    },
  },
} as Module<State, RootState>;
