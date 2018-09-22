import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Vuetify from 'vuetify';
import routes from '@/routes';
import App from '@/App.vue';
import modules, { State } from '@/store';

Vue.config.productionTip = __DEV__;

Vue.use(Router);
Vue.use(Vuex);
Vue.use(Vuetify);

//
// Router
// ---------------------------------------------------------------------

const router = new Router({
  routes,
});

//
// Store
// ---------------------------------------------------------------------

const store = new Vuex.Store<State>({
  modules,
  strict: __DEV__,
  plugins: __DEV__ ? [createLogger({ collapsed: true })] : [],
});

store.subscribe(mutation => {
  if (mutation.type === 'document/SET_TITLE') {
    document.title = mutation.payload;
  }
});

//
// Mount
// ---------------------------------------------------------------------

const vm = new Vue({
  router,
  store,
  render: h => h(App),
});

store.dispatch('auth/init');
router.onReady(async () => {
  vm.$mount('#app');
});
