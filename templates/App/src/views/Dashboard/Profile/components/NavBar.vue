<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/useUserStore.js';

const router = useRouter();
const props = defineProps({
  isFollow: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 0
  },
  user: Object
});
const userStore = useUserStore();
const route = useRoute();
const notTabPage = route.name === 'CustomProfile';
const isSelf = userStore.user.customerId.toString() === props.user.customerId;
const emit = defineEmits(['onShareIconClick', 'onFollowClick']);
const handleFollowClick = (value) => {
  emit('onFollowClick', value);
};
const imgHeight = computed(() => {
  return props.height * 28;
});
const opacity = computed(() => {
  return 1 - props.height;
});
const handleSettingIconClick = () => {
  router.push('/setting');
};
const loading = ref(true);
watch(
  () => props.user.name,
  () => {
    loading.value = false;
  }
);
</script>

<template>
  <div class="navbar-safe-area">
    <div
      :class="notTabPage ? 'px-3' : 'px-4'"
      class="fixed left-0 z-10 h-[2.75rem] flex items-center right-0"
    >
      <div class="flex items-center flex-1 text-white">
        <img
          v-if="notTabPage"
          @click="router.back()"
          src="assets/back-white.svg"
          class="mr-1"
          alt=""
        />
        <span
          :style="{
            opacity: opacity
          }"
        >
          {{ user.name }}
        </span>
        <div class="absolute left-1/2 translate-x-[-50%]">
          <img
            v-error
            :style="{
              width: `${imgHeight}px`,
              height: `${imgHeight}px `
            }"
            class="rounded-full will-change-[height,width] object-cover max-w-7 max-h-7"
            :src="user.image"
            alt=""
          />
        </div>
      </div>
      <template v-if="!loading">
        <template v-if="notTabPage">
          <template v-if="!isSelf">
            <van-button
              v-if="user.isFocus"
              style="
                --van-button-normal-padding: 0 1rem;
                --van-button-default-height: 1.75rem;
                --van-button-plain-background: transparent;
              "
              color="#ddd"
              round
              plain
              @click="handleFollowClick(false)"
            >
              <span class="text-sm">Remove</span>
            </van-button>
            <van-button
              v-else
              style="
                --van-button-normal-padding: 0 1rem;
                --van-button-default-height: 1.75rem;
              "
              round
              @click="handleFollowClick(true)"
              type="danger"
            >
              <span class="text-sm">Follow</span>
            </van-button>
          </template>
        </template>
        <template v-else>
          <img
            @click="handleSettingIconClick"
            class="ml-2 press"
            src="assets/profile/setting.svg"
            alt=""
          />
        </template>
      </template>
    </div>
  </div>
</template>
