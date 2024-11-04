import { defineStore } from 'pinia';
import { PreferenceList } from '@/constant/Preferences.js';
import { useStorage } from '@zhengxy/use';
import { computed, ref } from 'vue';
import { USER_PROFILE, USER_TOKEN } from '@/constant/Constant.js';
import pinia from '@/plugin/CreatePinia.js';

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
  const calcUserPreferenceList = (preferenceIds, addAllItem = true) => {
    const allItem = addAllItem ? [{ text: 'All', value: -1 }] : [];
    if (preferenceIds.length > 0) {
      //如果有分类则返回全部
      return [
        ...allItem,
        ...preferenceIds.map((id) => {
          return PreferenceList.find(({ value }) => value === id);
        })
      ];
    }
    return [];
  };

  const userPreferenceList = computed(() => {
    const { preferenceIds } = user.value;
    return calcUserPreferenceList(preferenceIds);
  });
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
    calcUserPreferenceList,
    userPreferenceList,
    setUser,
    setTokenInfo,
    resetTokenInfo,
    clear: clear
  };
});

export const useUserStore = function () {
  return useUserStoreWithOut(pinia);
};
