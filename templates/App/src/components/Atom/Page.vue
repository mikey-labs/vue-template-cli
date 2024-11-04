<script setup>
defineProps({
  themeVars: {
    type: Object,
    default: {}
  }
});
</script>

<template>
  <van-config-provider
    class="h-full flex flex-col overflow-hidden"
    :theme-vars="themeVars"
    tag="div"
  >
    <slot></slot>
  </van-config-provider>
</template>
