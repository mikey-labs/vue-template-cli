<script setup>
import { reactive } from 'vue';
import { useRouterStore } from '@/store/useRouterStore.js';

const routerStore = useRouterStore();
const themeVars = reactive({
  primaryColor: '#0F77F0',
  dangerColor: '#F85B59',
  fieldInputTextColor: '#333333',
  cellVerticalPadding: '8px',
  buttonDefaultHeight: '40px',
  buttonNormalFontSize: '16px',
  overlayBackground: 'rgba(51, 51, 51, 0.7)',
  navBarHeight: '2.75rem',
  floatingPanelBarHeight: '4px',
  floatingPanelBarWidth: '6.25rem',
  floatingPanelBarColor: '#333',
  floatingPanelBackground: '#F5F6FA',
  floatingPanelHeaderHeight: '24px',
  floatingPanelZIndex: '99',
  dialogRadius: '8px',
  dialogHeaderFontWeight: 'normal',
  fieldPlaceholderTextColor: '#999999',
  dropdownMenuShadow: 'none',
  actionSheetItemIconSize: '24px',
  actionSheetItemTextColor: '#333',
  actionSheetItemFontSize: '14px',
  actionSheetItemIconMarginRight: '4px',
  uploaderBorderRadius: '4px',
  switchWidth: '60px',
  toastBackground: 'rgba(51, 51, 51, 0.8)',
  gridItemContentPadding: '0.5rem',
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

  <van-config-provider
    theme="light"
    :theme-vars="themeVars"
    theme-vars-scope="global"
    tag="var"
  />
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
