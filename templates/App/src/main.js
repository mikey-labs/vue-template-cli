import { createApp } from 'vue';
import pinia from '@/plugin/CreatePinia.js';
import router from './router';
import './style.css';
import App from './App.vue';
import Page from 'atom/Page.vue';
import Anchor from 'atom/Anchor.vue';
import { Dialog, setToastDefaultOptions, Toast } from 'vant';
import 'vant/es/toast/style/index.mjs';
import 'vant/es/dialog/style/index.mjs';
import 'wc-waterfall';
import ImageErrorHandler from '@/directive/ImageErrorHandler.js';

setToastDefaultOptions({
  position: 'middle'
});
createApp(App)
  .component('Page', Page)
  .component('Anchor', Anchor)
  .use(router)
  .use(Toast)
  .use(Dialog)
  .use(pinia)
  .directive('error', ImageErrorHandler)
  .mount('#app');
