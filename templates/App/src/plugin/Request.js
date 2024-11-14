import { useHttpRequest } from '@zhengxy/use';
import { useUserStore } from '@/store/useUserStore.js';

const Request = useHttpRequest({
  base: import.meta.env.VITE_API_PREFIX
});
const dataFilter = (res) => {
  if (res.code === '200') {
    return [null, res.result];
  } else {
    showError(res.message);
    return [Error(res.message), res];
  }
};
const showError = (message) => {
  // showToast({
  //   overlay: true,
  //   closeOnClickOverlay: true,
  //   duration: 0,
  //   message: message
  // });
};
const handlePromiseException = (promise) => {
  return promise.then(dataFilter).catch((error) => {
    showError(error.message);
    return [error, null];
  });
};
const signParam = (args) => {
  const [url, data = {}, options = { headers: {} }] = args;
  const userStore = useUserStore();
  const { access_token } = userStore.token;
  if (access_token) {
    options.headers.access_token = access_token;
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
