<script setup>
const style = {
  '--van-badge-dot-color': '#ED3250',
  '--van-badge-background': '#ED3250',
  '--van-background-2': '#F4F4F4',
  '--van-badge-font-weight': 'normal'
};
</script>

<template>
  <van-badge
    :offset="[-7, 6]"
    :style="style"
  >
    <slot />
  </van-badge>
</template>

