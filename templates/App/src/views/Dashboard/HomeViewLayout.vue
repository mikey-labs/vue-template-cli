<script setup>
import TabsBar from './components/TabsBar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRouterStore } from '@/store/useRouterStore.js';

defineOptions({ name: 'HomeViewLayout' });
const routerStore = useRouterStore();
const router = useRouter();
const showAddPopover = ref(false);
const handlePostItemClick = async () => {
  showAddPopover.value = false;
  await router.push('/create-posts');
};
const handleWorkoutItemClick = () => {
  showAddPopover.value = false;
  router.push('/create-workouts');
};
const handleAddButtonClick = () => {
  showAddPopover.value = true;
};
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
  <Page
    :theme-vars="{
      tabbarHeight: '5.125rem',
      tabbarItemIconSize: '2rem',
      fontBold: '500',
      tabFontSize: '16px'
    }"
  >
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

    <TabsBar @on-add-button-click="handleAddButtonClick" />
    <van-action-sheet
      overlay
      :duration="0.2"
      overlay-class="!animate-none"
      v-model:show="showAddPopover"
      :closeable="false"
    >
      <div class="bg-[#F9F9F9] py-11">
        <div class="flex items-center justify-center">
          <img
            src="assets/workout/hand.svg"
            alt=""
          />
          <span class="text-xl text-black font-medium">Publish</span>
          <img
            class="-scale-x-100"
            src="assets/workout/hand.svg"
            alt=""
          />
        </div>
        <div class="flex justify-center space-x-8 mt-10">
          <div
            class="rounded press flex items-center flex-col py-8 bg-white w-[7.875rem]"
            @click="handlePostItemClick"
            style="box-shadow: 0 0 16px rgba(0, 0, 0, 0.04)"
          >
            <img
              src="assets/workout/post.svg"
              alt=""
            />
            <span>POST</span>
          </div>
          <!--          <div-->
          <!--            @click="handleWorkoutItemClick"-->
          <!--            class="rounded flex items-center press flex-col bg-white w-[7.875rem] py-8"-->
          <!--            style="box-shadow: 0 0 16px rgba(0, 0, 0, 0.04)"-->
          <!--          >-->
          <!--            <img-->
          <!--              src="assets/workout/workout.svg"-->
          <!--              alt=""-->
          <!--            />-->
          <!--            <span>WORK OUT</span>-->
          <!--          </div>-->
        </div>
        <div class="flex justify-center mt-6">
          <img
            @click="showAddPopover = false"
            class="press"
            src="assets/workout/close.svg"
            alt=""
          />
        </div>
      </div>
    </van-action-sheet>
  </Page>
</template>
