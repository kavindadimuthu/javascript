import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { AsgardeoPlugin } from '@asgardeo/vue';

// createApp(App).mount('#app')
const app = createApp(App);
app.use(AsgardeoPlugin);
app.mount('#app');
