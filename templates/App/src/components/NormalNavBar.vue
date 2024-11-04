<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  title: {
    type: String
  },
  transparent: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  backCallback: Function
});
const style = {
  '--van-nav-bar-background': props.transparent ? 'transparent' : '#fff',
  '--van-padding-md': '0.625rem',
  '--van-border-color': '#eee',
  top: 'auto'
};
const handleBack = () => {
  if (props.backCallback) {
    props.backCallback();
  } else {
    router.back();
  }
};
</script>

<template>
  <div
    :class="{ 'bg-white': !transparent }"
    class="navbar-safe-area"
  >
    <van-nav-bar
      :style="style"
      fixed
      :title="title"
      :border="border"
      :clickable="false"
    >
      <template #left>
        <img
          @click="handleBack"
          src="assets/back.svg"
          alt=""
        />
      </template>
      <template #right>
        <slot name="right"></slot>
      </template>
    </van-nav-bar>
  </div>
</template>
<style scoped>
:deep(.van-nav-bar__title) {
  font-weight: 500;
}
</style>
