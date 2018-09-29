import { ipcRenderer } from 'electron';
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Vuetify from 'vuetify';
import routes from './routes';
import App from './App.vue';
import modules, { State } from './store';
import createIpcSync from './store/plugins/ipc';

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
  plugins: [
    createIpcSync(ipcRenderer),
    ...(__DEV__ ? [createLogger({ collapsed: true })] : []),
  ],
});

const vm = new Vue({
  router,
  store,
  render: h => h(App),
});

router.onReady(async () => {
  vm.$mount('#app');
});

store.watch(state => state.document.title, title => (document.title = title));
