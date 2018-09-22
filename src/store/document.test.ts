import document, { State, SET_TITLE } from './document';
import { State as RootState } from './index';
import { MutationTree, Mutation, ActionTree, ActionContext } from 'vuex';

const createInitialState = document.state as () => State;

describe('mutations', () => {
  const mutations = document.mutations as MutationTree<State>;

  describe(`#${SET_TITLE}()`, () => {
    const setTitle = mutations[SET_TITLE] as Mutation<State>;

    it('should set title', () => {
      const state = {
        ...createInitialState(),
        title: 'previous title',
      };

      setTitle(state, 'next title');

      expect(state).toHaveProperty('title', 'next title');
    });
  });
});

describe('actions', () => {
  const actions = document.actions as ActionTree<State, RootState>;

  describe('#setTitle()', () => {
    const setTitle = actions.setTitle as ActionHandler<State, RootState>;

    it(`should commit ${SET_TITLE}`, () => {
      const injectee: ActionContext<State, RootState> = {
        commit: jest.fn(),
      } as any;

      setTitle(injectee, 'title');

      expect(injectee.commit).toBeCalledWith(SET_TITLE, 'title');
    });
  });
});
