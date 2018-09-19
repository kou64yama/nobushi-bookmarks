import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: 'home' */ './HomePage'),
  },
];

export default routes;
