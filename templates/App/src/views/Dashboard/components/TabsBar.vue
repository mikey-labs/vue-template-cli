<script setup>
import add_icon from 'assets/tabs/add.svg';
import HomeIcon from '@/views/Dashboard/components/HomeIcon.vue';
import { useUserStore } from '@/store/useUserStore.js';
import { useRoute } from 'vue-router';
import useNavbarHeight from '@/hooks/useNavbarHeight.js';

const userStore = useUserStore();
const emit = defineEmits(['onAddButtonClick']);
const handleAddButtonClick = () => {
  emit('onAddButtonClick');
};
const route = useRoute();
const safeBottomStyle = useNavbarHeight();
</script>

<template>
  <van-tabbar
    route
    :safe-area-inset-bottom="false"
    :z-index="999"
    active-color="#565656"
    inactive-color="#565656"
  >
    <van-tabbar-item
      replace
      to="/home"
    >
      <span class="text-xs">Home</span>
      <template #icon="props">
        <HomeIcon :active="props.active" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item>
      <template #icon>
        <div
          class="w-20 press h-[3.125rem] rounded-lg flex justify-center items-center"
          @click.stop="handleAddButtonClick"
          style="
            background: linear-gradient(
              90deg,
              rgba(96, 170, 255, 1) 0%,
              rgba(15, 92, 240, 1) 100%
            );
          "
        >
          <img
            alt=""
            :src="add_icon"
          />
        </div>
      </template>
    </van-tabbar-item>
    <van-tabbar-item
      replace
      :to="'/profile?customerId=' + userStore.user.customerId"
    >
      <span class="text-xs">Profile</span>
      <template #icon="props">
        <div
          class="border overflow-hidden rounded-full"
          :class="route.path === '/profile' ? 'border-primary' : 'border-white'"
        >
          <div class="border border-white rounded-full overflow-hidden">
            <img
              class="!h-8 w-8 rounded-full object-cover"
              alt=""
              v-error
              :src="userStore.user.image"
            />
          </div>
        </div>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<style scoped>
:deep(.van-tabbar-item__icon .van-badge) {
  border: 2px solid #f9f9fb;
  width: 12px;
  height: 12px;
}
</style>
