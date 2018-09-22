import Vuex, { Store, Dispatch } from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import HomePage from './HomePage.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('HomePage', () => {
  let store: Store<any>;
  let dispatch: jest.Mock<Dispatch>;

  beforeEach(() => {
    store = new Vuex.Store({});
    dispatch = store.dispatch = jest.fn<Dispatch>();
  });

  it('should render correctly', () => {
    const wrapper = mount(HomePage, {
      localVue,
      store,
      stubs: {
        VContainer: true,
      },
    });

    expect(wrapper.element).toMatchSnapshot();
    expect(dispatch.mock.calls[0][0]).toEqual('document/setTitle');
  });
});
