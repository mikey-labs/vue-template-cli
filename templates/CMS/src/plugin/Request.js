import { useHttpRequest } from '@zhengxy/use';
import { CLIENT_ID } from '@/constant/Constant.js';
import { useUserStore } from '@/store/useUserStore.js';
import { ElNotification } from 'element-plus';
import router from '@/router/index.js';

const userStore = useUserStore();
const Request = useHttpRequest({
  base: import.meta.env.VITE_API_PREFIX
});
const dataFilter = (res) => {
  if (res.errorCode === 0) {
    return [null, res];
  } else {
    showError(new Error(res.message));
    return [new Error(res.message), null];
  }
};
const showError = (err) => {
  ElNotification({
    title: '错误',
    dangerouslyUseHTMLString: true,
    message: err.message,
    type: 'error',
    showClose: false,
    duration: 3000
  });
  if (err.status === 401) {
    userStore.clear();
    router.replace('/login');
  }
};
const handlePromiseException = (promise) => {
  return promise.then(dataFilter).catch((error) => {
    showError(JSON.parse(error.message));
    return [error, null];
  });
};
const signParam = (args) => {
  const [url, data = {}, options = { headers: {} }] = args;
  // console.log('call api:' + url, 'params:', toValue(data));
  options.headers.clientId = CLIENT_ID;
  const userStore = useUserStore();
  const { accessToken } = userStore.token;
  if (accessToken) {
    options.headers.accessToken = accessToken;
  }
  return [url, data, options];
};
export default {
  get(...args) {
    return handlePromiseException(Request.get.apply(Request, signParam(args)));
  },
  post(...args) {
    return handlePromiseException(Request.post.apply(Request, signParam(args)));
  },
  put(...args) {
    return handlePromiseException(Request.put.apply(Request, signParam(args)));
  },
  delete(...args) {
    return handlePromiseException(
      Request.delete.apply(Request, signParam(args))
    );
  }
};
