<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/useUserStore.js';
const userStore = useUserStore();

defineOptions({ name: 'Login' });
const router = useRouter();

const handlerButtonClick = () => {
  userStore.setTokenInfo({
    access_token: 'access_token',
    expires_in: 600,
    refresh_token: 'refresh_token'
  });
  router.push('/');
};
const text = ref('');
</script>

<template>
  <Page>
    <div
      class="flex-1 flex-col space-y-6 flex p-4 justify-center items-center bg-gray-100 overflow-y-auto overflow-x-hidden"
    >
      <van-field
        autocomplete="off"
        v-model="text"
        placeholder="记住文字"
      />
      <van-button
        @click="handlerButtonClick"
        round
        block
        type="primary"
      >
        Sign In
      </van-button>
    </div>
  </Page>
</template>
