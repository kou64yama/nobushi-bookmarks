import Vuex, { ActionContext, Mutation } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import firebase from '@/firebase';
import { State as RootState } from '@/store';
import auth, {
  State,
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  SIGN_IN,
  SIGN_OUT,
} from './auth';

const authMock = firebase.auth();
const localVue = createLocalVue();

localVue.use(Vuex);

type ActionHandler<S, R> = (
  injectee: ActionContext<S, R>,
  payload?: any,
) => any;

const mockUser = {
  displayName: 'mockDisplayName',
  email: 'mockEmail',
  phoneNumber: 'mockPhoneNumber',
  photoURL: 'mockPhotoURL',
  providerId: 'mockProviderId',
  uid: 'mockUid',
};

const createInitialState = auth.state as () => State;

describe('mutations', () => {
  const mutations = auth.mutations || {};

  describe(`#${SET_CURRENT_USER}()`, () => {
    const setCurrentUser = mutations[SET_CURRENT_USER] as Mutation<State>;

    it('should set currentUser and clear loading', () => {
      const state = Object.assign(createInitialState(), {
        currentUser: null,
        loading: true,
      });

      setCurrentUser(state, mockUser);

      expect(state.currentUser).toEqual(mockUser);
      expect(state.loading).toBeFalsy();
    });
  });

  describe(`#${CLEAR_CURRENT_USER}()`, () => {
    const clearCurrentUser = mutations[CLEAR_CURRENT_USER] as Mutation<State>;

    it('should clear currentUser and loading', () => {
      const state = Object.assign(createInitialState(), {
        currentUser: mockUser,
        loading: true,
      });

      clearCurrentUser(state, undefined);

      expect(state.currentUser).toBeNull();
      expect(state.loading).toBeFalsy();
    });
  });

  describe(`#${SIGN_IN}()`, () => {
    const signIn = mutations[SIGN_IN] as Mutation<State>;

    it('should set loading true', () => {
      const state = Object.assign(createInitialState(), {
        currentUser: null,
        loading: false,
      });

      signIn(state, undefined);

      expect(state.loading).toBeTruthy();
    });
  });

  describe(`#${SIGN_OUT}()`, () => {
    const signOut = mutations[SIGN_OUT] as Mutation<State>;

    it('should set loading true', () => {
      const state = Object.assign(createInitialState(), {
        currentUser: null,
        loading: false,
      });

      signOut(state, undefined);

      expect(state.loading).toBeTruthy();
    });
  });
});

describe('actions', () => {
  const actions = auth.actions || {};

  describe('#init()', () => {
    const init = actions.init as ActionHandler<State, RootState>;
    const mockOnAuthStateChanged = authMock.onAuthStateChanged as jest.Mock;

    beforeEach(() => {
      mockOnAuthStateChanged.mockClear();
    });

    it(`should commit ${SET_CURRENT_USER} when sign inned`, () => {
      const injectee: ActionContext<State, RootState> = {
        commit: jest.fn(),
      } as any;

      init(injectee);

      mockOnAuthStateChanged.mock.calls[0][0](mockUser);
      expect(injectee.commit).toBeCalledWith(SET_CURRENT_USER, mockUser);
    });

    it(`should commit ${CLEAR_CURRENT_USER} when sign outed`, () => {
      const injectee: ActionContext<State, RootState> = {
        commit: jest.fn(),
      } as any;

      init(injectee);

      mockOnAuthStateChanged.mock.calls[0][0](null);
      expect(injectee.commit).toBeCalledWith(CLEAR_CURRENT_USER);
    });
  });

  describe('#signInWithEmailAndPassword()', () => {
    const signInWithEmailAndPassword = actions.signInWithEmailAndPassword as ActionHandler<
      State,
      RootState
    >;
    const mockSignInWithEmailAndPassword = authMock.signInWithEmailAndPassword as jest.Mock;

    beforeEach(() => {
      mockSignInWithEmailAndPassword.mockClear();
    });

    it('should call firebase.Auth#signInWithEmailAndPassword()', () => {
      const injectee: ActionContext<State, RootState> = {
        commit: jest.fn(),
      } as any;

      const email = 'user@example.com';
      const password = 'secret';
      signInWithEmailAndPassword(injectee, { email, password });

      expect(injectee.commit).toBeCalledWith(SIGN_IN);
      expect(mockSignInWithEmailAndPassword).toBeCalledWith(email, password);
    });
  });

  describe('#signOut()', () => {
    const signOut = actions.signOut as ActionHandler<State, RootState>;
    const mockSignOut = authMock.signOut as jest.Mock;

    beforeEach(() => {
      mockSignOut.mockClear();
    });

    it('should call firebase.Auth#signOut()', () => {
      const injectee: ActionContext<State, RootState> = {
        commit: jest.fn(),
      } as any;

      const email = 'user@example.com';
      const password = 'secret';
      signOut(injectee, { email, password });

      expect(injectee.commit).toBeCalledWith(SIGN_OUT);
      expect(mockSignOut).toBeCalled();
    });
  });
});
