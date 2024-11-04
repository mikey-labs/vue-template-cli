<script setup>
defineProps({
  data: {
    type: Array,
    default: []
  }
});
const customStyle = {
  '--van-swipe-indicator-size': '0.25rem',
  '--van-swipe-indicator-margin': '.5rem',
  '--van-swipe-indicator-inactive-opacity': 1,
  '--van-swipe-indicator-active-background': '#fff',
  '--van-swipe-indicator-inactive-background': '#898A8D'
};
</script>
<template>
  <div class="h-[14.5rem] w-full relative bg-gray-100 rounded overflow-hidden">
    <van-swipe
      lazy-render
      :style="customStyle"
      class="h-full w-full rounded"
      show-indicators
    >
      <van-swipe-item
        v-for="(item, i) in data"
        :key="i"
      >
        <img
          class="object-cover w-full h-full"
          :src="item"
          alt=""
        />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style scoped>
:deep(.van-swipe__indicators) {
  z-index: 20;
}
:deep(.van-swipe__indicator) {
  width: 0.5rem;
  border-radius: 0.5rem;
}
:deep(.van-swipe__indicator.van-swipe__indicator--active) {
  width: 1rem;
}
:deep(.van-swipe:before) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  bottom: 0;
  height: 2.9375rem;
  background: linear-gradient(
    180deg,
    rgb(51, 51, 51, 0) 0%,
    rgb(51, 51, 51, 1) 100%
  );
}
</style>
