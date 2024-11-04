<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Follow from './Follow.vue';
import Explore from './Explore.vue';
import Badge from '../components/Badge.vue';
import { useGetTabHeight } from '@/hooks/useGetTabHeight.js';
import { apiUnreadMessageNumber } from 'api/Message.js';
import { useUserStore } from '@/store/useUserStore.js';

defineOptions({ name: 'Home' });

const useStore = useUserStore();
const TabName = {
  Explore: 'explore',
  Follow: 'follow'
};
const router = useRouter();
const handleSearchClick = () => {
  router.push('/search');
};
const handleMessageClick = () => {
  router.push('/notifications');
};
const active = ref(TabName.Explore);
const tabContainer = ref(null);
const tabContainerHeight = useGetTabHeight(tabContainer);

const data = reactive({
  hasNewMessage: false
});
const getUnreadMessageNumber = async () => {
  const [err, count] = await apiUnreadMessageNumber({
    customerId: useStore.user.customerId
  });
  if (!err) {
    data.hasNewMessage = count > 0;
  }
};
onActivated(() => {
  getUnreadMessageNumber();
});
</script>

<template>
  <div class="h-full overflow-hidden flex flex-col pb-[5.125rem]">
    <div class="bg-white navbar-safe-area-placeholder"></div>
    <van-tabs
      class="!fixed top-0 navbar-safe-area-top flex flex-col left-0 right-0 bottom-[5.125rem]"
      v-model:active="active"
      shrink
      swipeable
      lazy-render
      line-height="2"
      line-width="88"
      title-active-color="#0F77F0"
      title-inactive-color="#333"
    >
      <template #nav-left>
        <div class="flex flex-1 pl-3.5 items-center">
          <img
            class="press"
            @click="handleSearchClick"
            src="assets/home/search.svg"
            alt=""
          />
        </div>
      </template>
      <template #nav-right>
        <div class="flex flex-1 pr-3.5 justify-end items-center">
          <Badge
            :dot="data.hasNewMessage"
            @click="handleMessageClick"
          >
            <img
              class="press"
              src="assets/home/message.svg"
              alt=""
            />
          </Badge>
        </div>
      </template>
      <van-tab
        ref="tabContainer"
        title="Explore"
        :name="TabName.Explore"
      >
        <Explore
          @onRefresh="getUnreadMessageNumber"
          :height="tabContainerHeight"
        />
      </van-tab>
      <van-tab
        title="Follow"
        :name="TabName.Follow"
      >
        <Follow
          @onRefresh="getUnreadMessageNumber"
          :height="tabContainerHeight"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
:deep(.van-tab) {
  width: 6.25rem;
}
:deep(.van-tabs__content) {
  flex: 1;
}
.navbar-safe-area-placeholder {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}
</style>
