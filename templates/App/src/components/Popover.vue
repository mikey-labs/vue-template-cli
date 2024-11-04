<script setup>
import { defineModel } from 'vue';

const show = defineModel({ required: true, type: Boolean });
const props = defineProps({
  height: {
    type: String,
    default: '78.8%'
  },
  overlay: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <van-popup
    v-model:show="show"
    round
    lazy-render
    :overlay="overlay"
    closeable
    close-on-click-overlay
    position="bottom"
    :style="{
      height: height,
      '--van-popup-close-icon-size': '1.5rem',
      '--van-popup-close-icon-color': '#666'
    }"
  >
    <div class="h-full overflow-hidden flex flex-col">
      <div class="py-3 px-4">
        <span class="font-medium text-title">{{ title }}</span>
      </div>
      <slot name="bar"></slot>
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </van-popup>
</template>
