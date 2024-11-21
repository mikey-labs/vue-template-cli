<script setup>
import { useUserStore } from '@/store/useUserStore.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  links: Array,
  title: String,
  showBack: {
    type: Boolean,
    default: false
  }
});
const useStore = useUserStore();
const handleBack = () => {
  router.back();
};
const handleConfirm = () => {
  useStore.clear();
  router.replace('/login');
};
</script>

<template>
  <header class="bg-white border-b px-4 py-3">
    <div class="flex items-center justify-between">
      <el-breadcrumb
        class=""
        separator="/"
      >
        <el-breadcrumb-item
          :to="link.to"
          v-for="(link, i) in links"
          :key="i"
          >{{ link.text }}</el-breadcrumb-item
        >
      </el-breadcrumb>
      <div class="flex text-sm items-center">
        <span>您好，</span>
        <span class="font-medium pr-2.5">{{ useStore.user.name }}</span>
        <el-popconfirm
          width="200px"
          @confirm="handleConfirm"
          title="您确定需要退出登录吗?"
        >
          <template #reference>
            <div class="flex items-center cursor-pointer">
              <el-icon>
                <img
                  src="@/assets/exit.svg"
                  alt=""
                />
              </el-icon>
            </div>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
