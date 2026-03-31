import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createApp(App)
  .use(router)
  .mount('#app');