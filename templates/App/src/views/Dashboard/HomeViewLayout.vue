<script setup>
import TabsBar from './components/TabsBar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRouterStore } from '@/store/useRouterStore.js';

defineOptions({ name: 'HomeViewLayout' });
const routerStore = useRouterStore();
const router = useRouter();

const cacheKey = ref(0);
const includeRouter = ref(routerStore.homeKeepAlive.join(','));
routerStore.$subscribe((event, state) => {
  includeRouter.value = state.homeKeepAlive.join(',');
});
watch(includeRouter, (n) => {
  ++cacheKey.value;
});
</script>
<template>
  <Page>
    <router-view v-slot="{ Component, route }">
      <keep-alive
        :include="includeRouter"
        :key="cacheKey"
      >
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </keep-alive>
    </router-view>

    <TabsBar />
  </Page>
</template>
