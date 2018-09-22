import Vuex, { Store, Dispatch } from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import LoginPage from './LoginPage.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('LoginPage', () => {
  let store: Store<any>;
  let dispatch: jest.Mock<Dispatch>;

  beforeEach(() => {
    store = new Vuex.Store({});
    dispatch = store.dispatch = jest.fn<Dispatch>();
  });

  it('should render correctly when loading', () => {
    const wrapper = mount(LoginPage, {
      localVue,
      store,
      stubs: {
        VContainer: true,
        VProgressCircular: true,
        VLayout: true,
        VFlex: true,
        VTextField: true,
        VBtn: true,
      },
      computed: {
        loading: () => true,
      },
    });

    expect(wrapper.element).toMatchSnapshot();
    expect(dispatch.mock.calls[0][0]).toEqual('document/setTitle');
  });

  it('should render correctly when not loading', () => {
    const wrapper = mount(LoginPage, {
      localVue,
      store,
      stubs: {
        VContainer: true,
        VProgressCircular: true,
        VLayout: true,
        VFlex: true,
        VTextField: true,
        VBtn: true,
      },
      computed: {
        loading: () => false,
      },
    });

    expect(wrapper.element).toMatchSnapshot();
    expect(dispatch.mock.calls[0][0]).toEqual('document/setTitle');
  });

  it('should dispatch auth/signInWithEmailAndPassword when button is clicked', () => {
    const wrapper = mount(LoginPage, {
      localVue,
      store,
      stubs: {
        VContainer: true,
        VProgressCircular: true,
        VLayout: true,
        VFlex: true,
        VTextField: true,
        VBtn: true,
      },
      computed: {
        loading: () => false,
      },
    });

    wrapper.vm.$data.email = 'user@example.com';
    wrapper.vm.$data.password = 'secret';
    wrapper.find('vbtn-stub').trigger('click');
    expect(dispatch).toHaveBeenLastCalledWith(
      'auth/signInWithEmailAndPassword',
      {
        email: 'user@example.com',
        password: 'secret',
      },
    );
  });
});
