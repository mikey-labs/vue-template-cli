<script setup>
import { useRouter } from 'vue-router';
import { getSafeAreaTopHeight } from 'plugin/Utils.js';

const router = useRouter();
const safeAreaTop = getSafeAreaTopHeight();

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
  top: safeAreaTop + 'px'
};
const placeHolderHeight = ref('');
const handleBack = () => {
  if (props.backCallback) {
    props.backCallback();
  } else {
    router.back();
  }
};

const onRefInit = (el) => {
  placeHolderHeight.value = `${(el?.$el.offsetHeight ?? 0) + safeAreaTop}px`;
};
</script>

<template>
  <div
    class="relative"
    :style="{ height: placeHolderHeight }"
  >
    <van-nav-bar
      :ref="onRefInit"
      :style="style"
      fixed
      :safe-area-inset-top="false"
      :title="title"
      :border="border"
      :clickable="false"
    >
      <template #left>
        <img
          @click="handleBack"
          src="@/assets/core/back.svg"
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
