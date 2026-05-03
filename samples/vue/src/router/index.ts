import {createRouter, createWebHistory} from 'vue-router';
import {createCallbackRoute, createAsgardeoGuard} from '@asgardeo/vue';
import Home from '../pages/Home.vue';
import Profile from '../pages/Profile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {
      path: '/profile',
      component: Profile,
      beforeEnter: createAsgardeoGuard({redirectTo: '/'}),
    },
    createCallbackRoute({path: '/callback'}),
  ],
});

export default router;
