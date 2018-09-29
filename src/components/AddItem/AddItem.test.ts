import Vuex, { Dispatch } from 'vuex';
import { shallowMount, createLocalVue, Stubs } from '@vue/test-utils';
import AddItem from './AddItem.vue';
import Vue from 'vue';

const localVue = createLocalVue();

localVue.use(Vuex);

const stubs: Stubs = {
  VDialog: true,
  VBtn: true,
  VIcon: true,
  VCard: true,
  VCardText: true,
  VTextField: true,
  VTextarea: true,
  VCardActions: true,
  VSpacer: true,
};

describe('AddItem', () => {
  const createStore = (dispatch: Dispatch = jest.fn()) =>
    Object.assign(
      new Vuex.Store({
        getters: {
          'auth/uid': () => 'test user',
        },
      }),
      {
        dispatch,
      },
    );

  it('should render correctly', () => {
    const store = createStore();
    const wrapper = shallowMount(AddItem, {
      localVue,
      store,
      stubs,
      computed: {
        loading: () => false,
        getFieldErrors: () => () => [],
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    const store = createStore();
    const wrapper = shallowMount(AddItem, {
      localVue,
      store,
      stubs,
      computed: {
        loading: () => true,
        getFieldErrors: () => () => [],
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should dispatch items/add when add button is clicked', () => {
    const store = createStore();
    const wrapper = shallowMount(AddItem, {
      localVue,
      store,
      stubs,
      computed: {
        loading: () => false,
        getFieldErrors: () => () => [],
      },
    });

    wrapper.vm.$data.name = 'Test Name';
    wrapper.vm.$data.url = 'https://example.com';
    wrapper.vm.$data.description = 'Test Description';
    wrapper.find({ ref: 'add' }).trigger('click');
    expect(store.dispatch).toHaveBeenLastCalledWith('items/add', {
      name: 'Test Name',
      url: 'https://example.com',
      description: 'Test Description',
      owner: 'test user',
    });
  });
});
