<script setup>
import { UserFilled } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';

const isCollapse = ref(false);
const route = useRoute();
</script>

<template>
  <el-aside class="w-[160px] bg-white">
    <el-menu
      :collapse="isCollapse"
      router
      class="h-full"
      :default-active="route.path"
    >
      <el-menu-item
        index="/account-list"
        route="/account-list"
      >
        <el-icon><UserFilled /></el-icon>
        <span>账号管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
