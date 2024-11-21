<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive include="DashboardLayout">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
