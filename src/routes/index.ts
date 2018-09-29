import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    components: {
      default: () => import(/* webpackChunkName: 'home' */ './HomePage'),
      fab: () => import(/* webpackChunkName: 'home' */ '@/components/AddItem'),
    },
  },
];

export default routes;
