import { createRouter, createWebHashHistory } from 'vue-router';
import { TransactionType } from '../constant/Constant.js';
import { useUserStore } from '@/store/useUserStore.js';
import { autoLogin } from '@/store/TokenController.js';

import HomeViewLayout from '@/views/Dashboard/HomeViewLayout.vue';
import Login from '@/views/Login/Login.vue';
import Home from '@/views/Dashboard/Home/Home.vue';
import Profile from '@/views/Dashboard/Profile/Profile.vue';
import { checkKeepAlive, useNavigation } from '@/hooks/useNavigation.js';
import { useSetPageAnimation } from '@/hooks/useSetPageAnimation.js';

const userStore = useUserStore();
const routes = [
  {
    path: '/login',
    redirect: '/',
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    component: HomeViewLayout,
    name: 'HomeViewLayout',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          transition: TransactionType.None
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          transition: TransactionType.None
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
useNavigation(router);

let isCheckAutoLogin = false;
router.beforeEach(async (to, from, next) => {
  checkKeepAlive(from, to);
  //第二次自动登录，页面刷新触发一次
  //登录成功跳转到首页
  if (!isCheckAutoLogin) {
    isCheckAutoLogin = true;
    await autoLogin();
  }
  if (to.path === '/login' || userStore.token.access_token) {
    return next();
  } else {
    return next('/login');
  }
});

router.afterEach((to, from) => {
  useSetPageAnimation(to);
});
export default router;
