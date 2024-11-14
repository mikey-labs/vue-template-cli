<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <van-tabbar
    route
    safe-area-inset-bottom
    :fixed="false"
  >
    <van-tabbar-item
      icon="home-o"
      replace
      to="/home"
    >
      <span class="text-xs">Home</span>
    </van-tabbar-item>

    <van-tabbar-item
      icon="user-o"
      replace
      to="/profile"
    >
      <span class="text-xs">Profile</span>
    </van-tabbar-item>
  </van-tabbar>
</template>
<style scoped></style>
