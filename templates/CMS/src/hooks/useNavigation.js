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
