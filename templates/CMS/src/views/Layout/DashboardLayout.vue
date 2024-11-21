<script setup>
import { useRouterStore } from '@/store/useRouterStore.js';
import NavHeader from '@/views/Layout/components/NavHeader.vue';
import SideBar from '@/views/Layout/components/SideBar.vue';

const routerStore = useRouterStore();
defineOptions({ name: 'DashboardLayout' });
</script>

<template>
  <Page class="!flex-row">
    <el-container>
      <SideBar />
      <el-container direction="vertical">
        <NavHeader />
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="routerStore.keepAlive.join(',')">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-container>
    </el-container>
  </Page>
</template>
