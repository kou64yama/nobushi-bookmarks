import Vue from 'vue';
import { mount, Stubs } from '@vue/test-utils';
import AppTitleBar from './AppTitleBar.vue';

const stubs: Stubs = {
  VSystemBar: true,
  VSpacer: true,
  VMenu: true,
  VBtn: true,
  VList: true,
  VListTile: true,
  VListTileAvatar: true,
  VListTileContent: true,
  VListTileTitle: true,
  VListTileSubTitle: true,
  VListTileAction: true,
  VIcon: true,
  VDivider: true,
};

const currentUser = {
  displayName: 'mockDisplayName',
  email: 'mockEmail',
  phoneNumber: 'mockPhoneNumber',
  photoURL: 'mockPhotoURL',
  providerId: 'mockProviderId',
  uid: 'mockUid',
};

describe('AppTitleBar', () => {
  it('should render correctly with currentUser', () => {
    const wrapper = mount(AppTitleBar, {
      stubs,
      computed: {
        platform: () => 'win32',
        title: () => 'Test Title',
        currentUser: () => currentUser,
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly without currentUser', () => {
    const wrapper = mount(AppTitleBar, {
      stubs,
      computed: {
        platform: () => 'win32',
        title: () => 'Test Title',
        currentUser: () => null,
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render close button when platform is win32', () => {
    const wrapper = mount(AppTitleBar, {
      stubs,
      computed: {
        platform: () => 'win32',
        title: () => 'Test Title',
        currentUser: () => currentUser,
      },
    });

    expect(wrapper.vm.$refs.close).toBeDefined();
  });

  it('should not render close button when platform is darwin', () => {
    const wrapper = mount(AppTitleBar, {
      stubs,
      computed: {
        platform: () => 'darwin',
        title: () => 'Test Title',
        currentUser: () => currentUser,
      },
    });

    expect(wrapper.vm.$refs.close).toBeUndefined();
  });

  it('should call close when close button is clicked', () => {
    const close = jest.fn();
    const wrapper = mount(AppTitleBar, {
      stubs,
      computed: {
        platform: () => 'win32',
        title: () => 'Test Title',
        currentUser: () => currentUser,
      },
      methods: {
        close,
      },
    });

    (wrapper.vm.$refs.close as Vue).$emit('click');

    expect(close).toBeCalled();
  });

  it('should call signOut when sign out list item is clicked', () => {
    const signOut = jest.fn();
    const wrapper = mount(AppTitleBar, {
      stubs,
      computed: {
        platform: () => 'win32',
        title: () => 'Test Title',
        currentUser: () => currentUser,
      },
      methods: {
        signOut,
      },
    });

    (wrapper.vm.$refs.signOut as Vue).$emit('click');

    expect(signOut).toBeCalled();
  });
});
