import { ipcRenderer, IpcMessageEvent } from 'electron';
import Vue from 'vue';
import Router from 'vue-router';
import Vuex, { Payload, MutationPayload } from 'vuex';
import createLogger from 'vuex/dist/logger';
import Vuetify from 'vuetify';
import routes from './routes';
import App from './App.vue';
import modules, { State } from './store';

Vue.config.productionTip = __DEV__;

Vue.use(Router);
Vue.use(Vuex);
Vue.use(Vuetify);

const router = new Router({
  routes,
});

const store = new Vuex.Store<State>({
  modules,
  strict: __DEV__,
  getters: {
    platform: () => process.platform,
    close: () => () => window.close(),
  },
  plugins: __DEV__ ? [createLogger({ collapsed: true })] : [],
});

const vm = new Vue({
  router,
  store,
  render: h => h(App),
});

store.watch(state => state.document.title, title => (document.title = title));

let currentId = 0;
store.dispatch = async (type: string | Payload, payload?: any) =>
  new Promise<any>((resolve, reject) => {
    if (typeof type === 'object') {
      payload = { ...type }; // tslint:disable-line no-parameter-reassignment
      type = type.type; // tslint:disable-line no-parameter-reassignment
      delete payload.type;
    }

    const id = (currentId += 1);
    ipcRenderer.send('dispatch', id, type, payload);
    ipcRenderer.once(
      `dispatch:${id}`,
      (_: IpcMessageEvent, err: any, value: any) =>
        err ? reject(err) : resolve(value),
    );
  });

ipcRenderer.on('initialState', (_: IpcMessageEvent, initialState: State) => {
  store.replaceState(initialState);
});

ipcRenderer.on('commit', (_: IpcMessageEvent, mutation: MutationPayload) => {
  store.commit(mutation.type, mutation.payload);
});

ipcRenderer.send('connect');

//
// Mount
// ---------------------------------------------------------------------

router.onReady(async () => {
  vm.$mount('#app');
});
