import { createRouter, createWebHashHistory } from 'vue-router';
import { TransactionType, USER_TOKEN } from '../constant/Constant.js';
import { useUserStore } from '@/store/useUserStore.js';
import { TokenController } from '@/store/TokenController.js';
import { useStorage } from '@zhengxy/use';
import { apiGetSettingInfo } from 'api/Setting.js';
import { useRouterStore } from '@/store/useRouterStore.js';
import { nativeSetStatusBarStyle } from 'api/Native.js';
import _dsbridge from 'dsbridge';

import HomeViewLayout from '@/views/Dashboard/HomeViewLayout.vue';
import Login from '@/views/User/Login/Login.vue';
import Home from '@/views/Dashboard/Home/Home.vue';
import Profile from '@/views/Dashboard/Profile/Profile.vue';
import PostDetail from '@/views/Post/Post.vue';
import Workout from '@/views/Workout/Workout.vue';
import WorkoutFinish from '@/views/WorkoutFinish/WorkoutFinish.vue';
import WithDraw from '@/views/WithDraw/WithDraw.vue';
import Search from '@/views/Search/Search.vue';
import SearchResult from '@/views/SearchResult/SearchResult.vue';
import Notifications from '@/views/Notifications/Notifications.vue';
import Followers from '@/views/Followers/Followers.vue';
import CreatePost from '@/views/CreatePosts/CreatePosts.vue';
import CreatePostsAddExercise from '@/views/AddExercise/AddExercise.vue';
import Setting from '@/views/Setting/Setting.vue';
import SettingEditProfile from '@/views/Setting/EditProfile.vue';
import SettingUsername from '@/views/Setting/UserName.vue';
import SettingGender from '@/views/Setting/SetGender.vue';
import SettingPreferences from '@/views/Setting/Preference.vue';
import SettingNotification from '@/views/Setting/Notification.vue';
import SettingAccountPrivacy from '@/views/Setting/AccountPrivacy.vue';
import SettingBalance from '@/views/Balance/Balance.vue';
import SettingGeneral from '@/views/Setting/General.vue';
import SettingContactUs from '@/views/Setting/ContactUs.vue';
import SettingAboutUs from '@/views/Setting/AboutUs.vue';
import WorkoutDetail from '@/views/WorkoutDetail/WorkoutDetail.vue';
import ExerciseDetail from '@/views/ExerciseDetail/ExerciseDetail.vue';
import Report from '@/views/Report/Report.vue';
import {
  getRedirection,
  setRedirection,
  useNavigation
} from '@/hooks/useNavigation.js';
import Deposit from '@/views/Protocol/Deposit.vue';
import AddPayMethod from '@/views/AddPayMethod/AddPayMethod.vue';
import PayMethodDetail from '@/views/PayMethodDetail/PayMethodDetail.vue';
import VerifyCode from '@/views/User/VerifyCode/VerifyCode.vue';
import LoginNickname from '@/views/User/NickName/NickName.vue';
import LoginGender from '@/views/User/Gender/Gender.vue';
import LoginWeight from '@/views/User/Weight/Weight.vue';
import LoginHeight from '@/views/User/Height/Height.vue';
import LoginPreferences from '@/views/User/Preferences/Preferences.vue';

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
//处理物理键回退
window.addEventListener('popstate', () => {
  setRedirection('back', 1, false);
});

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
