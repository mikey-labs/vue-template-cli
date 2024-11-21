<script setup>
import { useUserStore } from '@/store/useUserStore.js';
import { Back } from '@element-plus/icons-vue';
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
</script>

<template>
  <div class="flex justify-between px-6 bg-white py-2">
    <div class="text-base flex items-center font-medium cursor-pointer">
      <div class="flex items-center">
        <div
          v-if="showBack"
          class="flex items-center pr-4 mr-4 border-r"
          @click="handleBack"
        >
          <el-icon>
            <Back />
          </el-icon>
          <span class="text-base pl-1">返回</span>
        </div>
        <slot name="title">
          <span class="leading-[32px]">{{ title }}</span>
        </slot>
      </div>
    </div>
    <div><slot name="toolbar"></slot></div>
  </div>
</template>

<style scoped></style>
