import { createRouter, createWebHistory } from 'vue-router';
import OverviewView from '../views/OverviewView.vue';
import ActionsView from '../views/ActionsView.vue';
import PrimitivesView from '../views/PrimitivesView.vue';
import PresentationView from '../views/PresentationView.vue';
import ControlView from '../views/ControlView.vue';
import AdaptersView from '../views/AdaptersView.vue';
import AuthFlowView from '../views/AuthFlowView.vue';
import FactoriesView from '../views/FactoriesView.vue';
import ComposablesView from '../views/ComposablesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: OverviewView },
    { path: '/actions', component: ActionsView },
    { path: '/primitives', component: PrimitivesView },
    { path: '/presentation', component: PresentationView },
    { path: '/control', component: ControlView },
    { path: '/adapters', component: AdaptersView },
    { path: '/auth-flow', component: AuthFlowView },
    { path: '/factories', component: FactoriesView },
    { path: '/composables', component: ComposablesView },
  ],
});

export default router;
