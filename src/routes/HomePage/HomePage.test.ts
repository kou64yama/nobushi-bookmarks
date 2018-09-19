import Vuex, { Store } from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Component from './HomePage.vue';
import { HomePage } from './HomePage';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('HomePage', () => {
  let store: Store<any>;

  beforeEach(() => {
    store = new Vuex.Store({});
    store.dispatch = jest.fn();
  });

  describe('#mounted()', () => {
    it('should dispatch document/setTitle', () => {
      const page = Object.assign(new HomePage(), { $store: store });
      page.mounted();
      expect(store.dispatch).toBeCalledWith('document/setTitle', 'Home');
    });
  });

  describe('#render()', () => {
    it('should render correctly', () => {
      const wrapper = mount(Component, {
        localVue,
        store,
        stubs: {
          VContainer: true,
        },
      });

      expect(wrapper.element).toMatchSnapshot();
      expect(store.dispatch).toBeCalledWith('document/setTitle', 'Home');
    });
  });
});
