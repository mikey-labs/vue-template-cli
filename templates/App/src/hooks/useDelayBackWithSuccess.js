import { showSuccessToast } from 'vant';

export const useDelayBackWithSuccess = (callback, message = 'Successfully') => {
  showSuccessToast({
    message: message,
    icon: 'passed',
    duration: 1000
  });
  setTimeout(() => {
    callback && callback();
  }, 1200);
};
