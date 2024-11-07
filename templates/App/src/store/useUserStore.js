import { defineStore } from 'pinia';
import { useStorage } from '@zhengxy/use';
import { computed, ref } from 'vue';
import pinia from '@/plugin/CreatePinia.js';
import { USER_PROFILE, USER_TOKEN } from '@/constant/Constant.js';

const Storage = useStorage();

const useUserStoreWithOut = defineStore('UserStore', () => {
  const tokenState = {
    access_token: '',
    expires_in: 600,
    refresh_token: ''
  };
  const userState = {
    customerId: null,
    name: '',
    mobile: '',
    image: '',
    gender: 0,
    height: null,
    heightUnit: null,
    weight: null,
    weightUnit: null,
    preferenceIds: []
  };
  const token = ref({ ...tokenState });
  const user = ref({ ...userState });

  const setUser = (newUser = {}, storeToLocal = false) => {
    for (const key in newUser) {
      if (Object.prototype.hasOwnProperty.call(user.value, key)) {
        user.value[key] = newUser[key];
      }
    }
    if (storeToLocal) Storage.setLocal(USER_PROFILE, user.value);
  };
  const setTokenInfo = (newToken = {}, storeToLocal = false) => {
    for (const key in newToken) {
      if (Object.prototype.hasOwnProperty.call(token.value, key)) {
        token.value[key] = newToken[key];
      }
    }
    if (storeToLocal) {
      Storage.setLocal(USER_TOKEN, token.value);
    }
  };
  const resetTokenInfo = () => {
    setTokenInfo(tokenState);
  };
  const clear = () => {
    user.value = { ...userState };
    token.value = { ...tokenState };
    Storage.removeLocal(USER_TOKEN);
    Storage.removeLocal(USER_PROFILE);
  };

  return {
    token: token,
    user: user,
    setUser,
    setTokenInfo,
    resetTokenInfo,
    clear: clear
  };
});

export const useUserStore = function () {
  return useUserStoreWithOut(pinia);
};
