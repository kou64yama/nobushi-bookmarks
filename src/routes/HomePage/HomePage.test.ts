import Vuex, { Store, Dispatch } from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import HomePage from './HomePage.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('HomePage', () => {
  const createStore = () =>
    Object.assign(new Vuex.Store({}), {
      dispatch: jest.fn(),
    });

  it('should render correctly', () => {
    const store = createStore();
    const wrapper = shallowMount(HomePage, {
      localVue,
      store,
      stubs: {
        VContainer: true,
      },
    });

    expect(wrapper.element).toMatchSnapshot();
    expect(store.dispatch.mock.calls[0][0]).toEqual('document/setTitle');
  });
});
