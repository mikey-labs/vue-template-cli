import { createApp } from 'vue';
import pinia from '@/plugin/CreatePinia.js';
import router from './router';
import './style.css';
import ElementPlus from 'element-plus';
import App from './App.vue';
import Page from 'components/Page.vue';
import ImageErrorHandler from '@/directive/ImageErrorHandler.js';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/es/components/notification/style/css.mjs';
import Schema from 'async-validator';

Schema.messages.required = () => {
  return '该项为必填项';
};

createApp(App)
  .component('Page', Page)
  .use(ElementPlus, { zIndex: 3000, locale: zhCn, size: 'default' })
  .use(router)
  .use(pinia)
  .directive('error', ImageErrorHandler)
  .mount('#app');
