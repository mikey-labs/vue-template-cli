import { createRouter, createWebHashHistory } from 'vue-router';
import { USER_PROFILE, USER_TOKEN } from '../constant/Constant.js';
import Login from '@/views/Login/Login.vue';
import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import { useUserStore } from '@/store/useUserStore.js';
import { useStorage } from '@zhengxy/use';
import { useRouterStore } from '@/store/useRouterStore.js';
import {
  getRedirection,
  setRedirection,
  useNavigation
} from '@/hooks/useNavigation.js';
import AccountList from '@/views/AccountList/AccountList.vue';

const Storage = useStorage();
const userStore = useUserStore();
const routes = [
  {
    path: '/login',
    redirect: '',
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      }
    ]
  },
  {
    path: '/',
    redirect: 'account-list',
    component: DashboardLayout,
    children: [
      {
        path: '/account-list',
        name: 'AccountList',
        component: AccountList
      }
    ]
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
useNavigation(router);
//第二次登录
const autoLogin = async () => {
  return new Promise((resolve, reject) => {
    const token = Storage.getSession(USER_TOKEN);
    const profile = Storage.getSession(USER_PROFILE);
    if (token && profile) {
      userStore.setTokenInfo(token);
      userStore.setUser(profile);
      resolve(true);
    }
    resolve(false);
  });

  // const controller = new TokenController(token);
  //如果token刷新异常则跳转到登录
  // controller.on('error', async (err) => {
  //   console.log('token refresh:', err);
  //   userStore.clear();
  //   await router.push('/login');
  // });
  // //更新成功设置token
  // controller.on('update', async (tokenInfo) => {
  //   console.log('update refresh success');
  //   userStore.setTokenInfo(tokenInfo, true);
  // });
  //开始刷新token，并且启动timer
  // return controller.bootstrap().then(async () => {
  //获取用户信息
  // const [err, user] = await apiGetSettingInfo();
  //失败返回false，交给router处理
  // if (err) {
  //   controller.stopRefreshTokenTimer();
  //   userStore.resetTokenInfo();
  //   return false;
  // }
  // //成功设置user信息
  // if (user) {
  //   userStore.setUser(user);
  // }
  //     return true;
  //   });
  // } else {
  //   return false;
};

const checkKeepAlive = (from, to) => {
  const routerStore = useRouterStore();
  const redirection = getRedirection();
  if (typeof from.meta.keepAlive === 'boolean') {
    setRedirection(redirection.type, redirection.step, from.meta.keepAlive);
  }
  //简单的从path判断是前进后退，如果是前进，传入from name缓存from路由，后退传入 to name删除缓存的路由
  routerStore.addOrDelete(from.name || to.name, getRedirection());
};

let isCheckAutoLogin = false;
router.beforeEach(async (to, from, next) => {
  checkKeepAlive(from, to);
  //第二次自动登录，页面刷新触发一次
  if (!isCheckAutoLogin) {
    isCheckAutoLogin = true;
    const isLogin = await autoLogin();
    //登录成功跳转到首页
    if (isLogin) {
      return next();
    } else {
      //失败跳转到登录页面
      return next('/login');
    }
  }
  if (to.path === '/login' || userStore.token.accessToken) {
    return next();
  } else {
    return next('/login');
  }
});

router.afterEach((to, from) => {});
export default router;
