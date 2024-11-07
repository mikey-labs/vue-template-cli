import { createRouter, createWebHashHistory } from 'vue-router';
import { TransactionType, USER_TOKEN } from '../constant/Constant.js';
import { useUserStore } from '@/store/useUserStore.js';
import { TokenController } from '@/store/TokenController.js';
import { useStorage } from '@zhengxy/use';
import { useRouterStore } from '@/store/useRouterStore.js';
import _dsbridge from 'dsbridge';

import HomeViewLayout from '@/views/Dashboard/HomeViewLayout.vue';
import Login from '@/views/Login/Login.vue';
import Home from '@/views/Dashboard/Home/Home.vue';
import {
  getRedirection,
  setRedirection,
  useNavigation
} from '@/hooks/useNavigation.js';

const Storage = useStorage();
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
          keepAlive: false
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
          transition: TransactionType.None,
          statusBar: 'dark'
        }
      }
    ]
  }
];

/**
 * notificationPush 推送跳转
 */
console.log('notificationPush 注册');
_dsbridge.register('notificationPush', function (param) {
  if (!param) return;
  //todo 监听通知消息
});
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
useNavigation(router);

//第二次登录
const autoLogin = async () => {
  const token = Storage.getLocal(USER_TOKEN);
  if (token) {
    //只设置rt
    userStore.setTokenInfo({ refresh_token: token.refresh_token });
    const controller = new TokenController(token);
    //如果token刷新异常则跳转到登录
    controller.on('error', async (err) => {
      console.log('token refresh:', err);
      userStore.clear();
      await router.push('/login');
    });
    //更新成功设置token
    controller.on('update', async (tokenInfo) => {
      console.log('update refresh success');
      userStore.setTokenInfo(tokenInfo, true);
    });
    //开始刷新token，并且启动timer
    return controller.bootstrap().then(async () => {
      //获取用户信息
      const [err, user] = await apiGetSettingInfo();
      //失败返回false，交给router处理
      if (err) {
        controller.stopRefreshTokenTimer();
        userStore.clear();
        return false;
      }
      //成功设置user信息
      if (user) {
        userStore.setUser(user);
      }
      return true;
    });
  } else {
    return false;
  }
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
  // if (!isCheckAutoLogin) {
  //   isCheckAutoLogin = true;
  //   const isLogin = await autoLogin();
  //   //登录成功跳转到首页
  //   if (isLogin) {
  //     return next();
  //   } else {
  //     //失败跳转到登录页面
  //     return next('/login');
  //   }
  // }
  if (to.path === '/login' || userStore.token.access_token) {
    return next();
  } else {
    return next('/login');
  }
});

router.afterEach((to, from) => {
  // nativeSetStatusBarStyle(to.meta.statusBar || 'light');
  if (to.meta.transition === TransactionType.None) return;
  // const [fromDepth, toDepth] = getDepth(from, to);
  // to.meta.transition =
  //   toDepth < fromDepth ? TransactionType.SlideOut : TransactionType.SlideIn;
  const redirection = getRedirection();
  to.meta.transition =
    redirection.type === 'push' ||
    redirection.type === 'replace' ||
    (redirection.type === 'go' && redirection.step > 0)
      ? TransactionType.SlideIn
      : TransactionType.SlideOut;
});
export default router;
