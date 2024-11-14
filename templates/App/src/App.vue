<script setup>
import { reactive } from 'vue';
import { useRouterStore } from '@/store/useRouterStore.js';

/**
 *主题定制，根据需求配置
 * @type {Store<"RouterStore", {homeKeepAlive: string[], keepAlive: [string]}, {}, {resetCache(): void, clearCache(): void, addOrDelete(*, *): void}>}
 */
const routerStore = useRouterStore();
const themeVars = reactive({
  primaryColor: '#0F77F0',
  dangerColor: '#F85B59',
  overlayBackground: 'rgba(51, 51, 51, 0.7)',
  toastBackground: 'rgba(51, 51, 51, 0.8)',
  toastRadius: '0.25rem'
});
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="route.meta.transition"
      type="animation"
    >
      <keep-alive :include="routerStore.keepAlive.join(',')">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style>
.slide-in-enter-active {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  animation: slide-in-enter 0.2s ease-out;
}
.slide-in-leave-active {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  animation: slide-in-leave 0.2s ease-in;
}

@keyframes slide-in-enter {
  0% {
    transform: translateX(30%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-leave {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
}

.slide-out-enter-active {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  animation: slide-out-enter 0.3s ease-out;
}
.slide-out-leave-active {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  animation: slide-out-leave 0.2s ease-in;
}
@keyframes slide-out-enter {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slide-out-leave {
  0% {
    transform: translateX(0%);
    opacity: 0.7;
  }
  100% {
    transform: translateX(30%);
    opacity: 0;
  }
}
</style>
