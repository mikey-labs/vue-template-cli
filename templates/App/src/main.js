import { createApp } from 'vue';
import pinia from '@/plugin/CreatePinia.js';
import router from './router';
import './style.css';
import App from './App.vue';
import Page from 'components/Atom/Page.vue';
import Anchor from 'components/Atom/Anchor.vue';
import { Dialog, setToastDefaultOptions, Toast } from 'vant';
import 'vant/es/toast/style/index.mjs';
import 'vant/es/dialog/style/index.mjs';
//图片加载失败指令
import ImageErrorHandler from '@/directive/ImageErrorHandler.js';

//toast 默认位置在中间
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
