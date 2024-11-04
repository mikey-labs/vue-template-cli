<script setup>
import header_bg from 'assets/profile/bg.png';
import NavBar from './components/NavBar.vue';
import { reactive, ref } from 'vue';
import Posts from './components/Posts.vue';
import Collects from './components/Collects.vue';
import Workouts from './components/Workouts.vue';
import { useRoute, useRouter } from 'vue-router';
import { apiGetProfileStatistics } from 'api/Profile.js';
import { useUserStore } from '@/store/useUserStore.js';
import Confirm from '@/components/Confirm.vue';
import { showLoadingToast, showSuccessToast } from 'vant';
import { apiFocus } from 'api/Follow.js';
import MyEvent from './Event.js';
import { nativeGetStatusBarHeight } from 'api/Native.js';
import { getSafeBottomHeight } from 'plugin/Utils.js';

defineOptions({ name: 'Profile' });
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
console.log(
  window.innerHeight,
  nativeGetStatusBarHeight(),
  window.devicePixelRatio,
  getSafeBottomHeight()
);
const safeAreaHeight =
  (Number(nativeGetStatusBarHeight()) || 0) + getSafeBottomHeight();
const anchors = [
  Math.round(window.innerHeight - 44 - safeAreaHeight - 96),
  Math.round(window.innerHeight - 44 - safeAreaHeight)
];
console.log(anchors);

const { customerId } = route.query;
const isSelf = userStore.user.customerId.toString() === customerId;
const notTabPage = route.name === 'CustomProfile';
const showDialog = ref(false);

const height = ref(anchors[0]);
const navBarRef = ref(null);

const user = ref({
  name: '',
  image: '',
  customerId,
  isFocus: false
});

const handleFollowBlockClick = (type) => {
  router.push({
    state: { type, customerId: user.value.customerId },
    path: '/followers'
  });
};
const handleWorkoutsBlockClick = () => {
  data.tabActive = 'Workouts';
};
const scrollView = ref({});
const tabsRef = ref();
// const callback = (el, index) => {
//   if (scrollView.value[index]) return;
//   scrollView.value[index] = {
//     el: el,
//     init: false
//   };
//   for (let item of Object.values(scrollView.value)) {
//     if (!item.init) {
//       // useRecordScroll(item.el);
//       item.init = true;
//     }
//   }
// };

const canUseWorkTab = computed(() => {
  return (
    !notTabPage || (notTabPage && user.value.isFocus) || !permission.visibleFans
  );
});

const statistics = reactive({
  workouts: 0,
  followers: 0,
  following: 0
});
const permission = reactive({
  visibleFans: true
});
const getCustomProfileStatistics = async () => {
  const [err, res] = await apiGetProfileStatistics({
    customerId: customerId
  });
  if (!err) {
    statistics.workouts = res.workouts;
    statistics.followers = res.followers;
    statistics.following = res.following;
    permission.visibleFans = Boolean(res.visiableWorkout);
    user.value.name = res.name;
    user.value.image = res.image;
    user.value.customerId = res.customerId;
    user.value.isFocus = res.isFocus || isSelf;
    swipeable.value = canUseWorkTab.value;
    if (!canUseWorkTab.value) {
      data.tabActive = 'Posts';
    }
    await nextTick(() => {
      tabsRef.value.resize();
    });
    // await nextTick(() => {

    // });
  }
};
const data = reactive({
  tabActive: 'Workouts'
});
const swipeable = ref(true);
onMounted(async () => {
  await getCustomProfileStatistics();
});
onActivated(async () => {
  if (!notTabPage) {
    user.value.name = userStore.user.name;
    user.value.image = userStore.user.image;
  }
  await getCustomProfileStatistics();
  // const toast = showLoadingToast();
  // toast.close();
});

const workoutsTab = ref(null);
const collectsTab = ref(null);
const postsTab = ref(null);
const handleTabClick = (e) => {
  const { name, disabled } = e;
  if (name === 'Workouts' && disabled) {
    showDialog.value = true;
  } else {
    switch (name) {
      case 'Workouts':
        workoutsTab.value?.refresh();
        break;
      case 'Posts':
        postsTab.value?.refresh();
        break;
      case 'Collects':
        collectsTab.value?.refresh();
        break;
    }
  }
};
const handleFollowClick = async (value) => {
  const toast = showLoadingToast();
  const [err, res] = await apiFocus({
    focusCustomerId: customerId
  });
  toast.close();
  if (!err) {
    user.value.isFocus = !user.value.isFocus;
    showSuccessToast('Successfully');
    showDialog.value = false;

    await getCustomProfileStatistics();
  }
};

const resetTouch = () => {
  return {
    translateX: 0,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    beginTime: 0,
    endTime: 0,
    higher: false
  };
};

// 左滑事件对象
const touch = ref(resetTouch());
const onTouchStart = (e) => {
  touch.value = resetTouch();
  const { clientX, clientY } = e.touches[0];
  touch.value.startX = clientX;
  touch.value.startY = clientY;
  touch.value.higher = anchors[1] === height.value;
};
const onTouchMove = (e) => {
  const { clientX, clientY } = e.touches[0];
  touch.value.endX = clientX;
  touch.value.endY = clientY;
  const direction = new MyEvent(touch.value).getDirection();
  if (direction === MyEvent.Direction.DOWN) {
    if (touch.value.higher) {
      if (currentScrollRef.value.scrollTop > 0) {
        e.stopPropagation();
      }
    }
  }
};
const WorkoutsRef = ref();
const PostsRef = ref();
const CollectsRef = ref();
const currentScrollRef = computed(() => {
  return data.tabActive === 'Workouts'
    ? WorkoutsRef.value
    : data.tabActive === 'Posts'
      ? PostsRef.value
      : CollectsRef.value;
});
</script>

<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div
      :style="'background-image: url(' + header_bg + ')'"
      class="bg-no-repeat relative px-4 bg-cover h-[15.1875rem] before:absolute before:left-0 before:right-0 before:top-0 before:bottom-0 before:bg-black before:bg-opacity-40 z-0"
    >
      <NavBar
        @onFollowClick="handleFollowClick"
        :user="user"
        :height="1 - (anchors[1] - height) / (anchors[1] - anchors[0])"
      />
      <div class="flex mt-2 items-center relative z-10">
        <div>
          <img
            v-error
            class="w-16 h-16 object-cover rounded-full"
            :src="user.image"
            alt=""
          />
        </div>
        <div class="ml-7 flex space-x-4">
          <div
            class="text-center px-2"
            @click="handleWorkoutsBlockClick"
          >
            <div class="text-white font-medium text-xl">
              {{ statistics.workouts }}
            </div>
            <div class="text-white text-xs mt-1">Workouts</div>
          </div>

          <div
            class="text-center px-2"
            @click="handleFollowBlockClick(1)"
          >
            <div class="text-white font-medium text-xl">
              {{ statistics.followers }}
            </div>
            <div class="text-white text-xs mt-1">Followers</div>
          </div>
          <div
            class="text-center px-2"
            @click="handleFollowBlockClick(2)"
          >
            <div class="text-white font-medium text-xl">
              {{ statistics.following }}
            </div>
            <div class="text-white text-xs mt-1">Following</div>
          </div>
        </div>
      </div>
    </div>
    <van-floating-panel
      class="z-20 rounded-t-xl transition-all"
      content-draggable
      :safe-area-inset-bottom="false"
      v-model:height="height"
      :style="{
        '--van-floating-panel-bar-height': '0',
        '--van-floating-panel-bar-color': '#fff',
        '--van-floating-panel-header-height': '0',
        '--van-floating-panel-background': 'transparent'
      }"
      :anchors="anchors"
    >
      <div class="h-full flex-col flex overflow-hidden">
        <div class="rounded-t-xl overflow-hidden">
          <van-tabs
            ref="tabsRef"
            v-model:active="data.tabActive"
            line-height="2"
            line-width="49"
            lazy-render
            border
            @clickTab="handleTabClick"
            title-active-color="#333"
            title-inactive-color="#999999"
            style="--van-font-bold: 500; --van-padding-xs: 4px"
          >
            <van-tab
              :disabled="!canUseWorkTab"
              name="Workouts"
            >
              <template #title>
                <div class="px-3 flex items-center text-sm py-2.5">
                  <img
                    v-if="!canUseWorkTab"
                    class="mr-1"
                    src="assets/profile/lock.svg"
                    alt=""
                  />
                  <span> Workouts </span>
                </div>
              </template>
            </van-tab>
            <van-tab name="Posts">
              <template #title>
                <div class="px-3 flex items-center text-sm py-2.5">
                  <span> Posts </span>
                </div>
              </template>
            </van-tab>
            <van-tab
              name="Collects"
              v-if="isSelf"
            >
              <template #title>
                <div class="px-3 flex items-center text-sm py-2.5">
                  <span> Collects </span>
                </div>
              </template>
            </van-tab>
          </van-tabs>

          <div
            ref="WorkoutsRef"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            v-show="data.tabActive === 'Workouts'"
            :style="{ height: height - 44 - (notTabPage ? 0 : 82) + 'px' }"
            class="pt-2 bg-[#F5F6FA] px-4 overflow-y-auto"
          >
            <Workouts
              ref="workoutsTab"
              :customerId="customerId"
            />
          </div>

          <div
            ref="PostsRef"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            v-show="data.tabActive === 'Posts'"
            :style="{ height: height - 44 - (notTabPage ? 0 : 82) + 'px' }"
            class="pt-2 bg-[#F5F6FA] px-4 overflow-y-auto"
          >
            <Posts
              ref="postsTab"
              :customerId="customerId"
            />
          </div>

          <div
            ref="CollectsRef"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            v-show="data.tabActive === 'Collects'"
            :style="{ height: height - 44 - (notTabPage ? 0 : 82) + 'px' }"
            class="pt-2 bg-[#F5F6FA] px-4 overflow-y-auto"
          >
            <Collects
              ref="collectsTab"
              :customerId="customerId"
            />
          </div>
        </div>
      </div>
    </van-floating-panel>
    <Confirm
      title="Open only to fans, follow or not?"
      cancel-text="No"
      confirm-text="Yes"
      v-model="showDialog"
      @onConfirm="handleFollowClick"
    />
  </div>
</template>
<style scoped>
:deep(.van-floating-panel__content) {
  border-top-left-radius: 0.75rem /* 12px */;
  border-top-right-radius: 0.75rem /* 12px */;
}
:deep(.van-tabs__nav) {
  justify-content: center;
}
:deep(.van-action-sheet__item, .van-action-sheet__cancel) {
  padding: 12px 14px;
}
:deep(.van-action-sheet__content) {
  padding-top: 1rem;
}
:deep(.van-tabs) {
  background: #fff;
}
:deep(.van-tabs__wrap) {
  padding: 0 2rem;
}
</style>
