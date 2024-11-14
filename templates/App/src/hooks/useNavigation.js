import { useRouterStore } from '@/store/useRouterStore.js';

/**@type {{type:null|'push'|'replace'|'back'|'go',step:number,keepAlive:boolean}}*/
const redirection = {
  type: 'replace',
  step: 1,
  keepAlive: false
};
export const setRedirection = (type, step, keepAlive) => {
  redirection.type = type;
  redirection.step = step;
  redirection.keepAlive = keepAlive;
};
export const getRedirection = () => {
  return redirection;
};
export const useNavigation = (router) => {
  const originalPush = router.push;
  const originalReplace = router.replace;
  const originalBack = router.back;
  const originalGo = router.go;

  router.push = function (...args) {
    setRedirection('push', 1, true);
    return originalPush.call(this, ...args);
  };

  router.replace = function (...args) {
    setRedirection('replace', 1, false);
    return originalReplace.call(this, ...args);
  };

  router.back = function (...args) {
    setRedirection('back', 1, false);
    return originalBack.call(this, ...args);
  };

  router.go = function (n) {
    setRedirection('go', n, n > 0);
    return originalGo.call(this, n);
  };
};
//处理物理键回退
window.addEventListener('popstate', () => {
  setRedirection('back', 1, false);
});
export const checkKeepAlive = (from, to) => {
  const routerStore = useRouterStore();
  const redirection = getRedirection();
  if (typeof from.meta.keepAlive === 'boolean') {
    setRedirection(redirection.type, redirection.step, from.meta.keepAlive);
  }
  //简单的从path判断是前进后退，如果是前进，传入from name缓存from路由，后退传入 to name删除缓存的路由
  routerStore.addOrDelete(from.name || to.name, getRedirection());
};
