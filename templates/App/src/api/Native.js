import _dsbridge from 'dsbridge';
const native = (name, params, asyncCallback = false) => {
  if (_dsbridge.hasNativeMethod(name)) {
    if (asyncCallback) {
      return new Promise((resolve, reject) => {
        _dsbridge.call(name, params, resolve);
      });
    } else {
      return _dsbridge.call(name, params);
    }
  }
  return null;
};
/**
 * 同步调用，直接获取返回值
 * @param params
 * @return {Promise<unknown>|any}
 */
export const nativeSync = (params) => {
  return native('native.sync', params);
};
/**
 * 同步调用，返回值在resolve里面
 * @param params
 * @return {Promise<unknown>|any}
 */
export const nativeAsync = (params) => {
  native('native.async', params).then((resolve) => resolve);
};

/**
 * notificationPush 推送跳转
 */
console.log('notificationPush 注册');
_dsbridge.register('notificationPush', function (param) {
  //todo 监听通知消息
});
