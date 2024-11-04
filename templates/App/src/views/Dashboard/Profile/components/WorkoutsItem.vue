<script setup>
import { useRouter } from 'vue-router';
import { formatCalories, formatDuration } from 'plugin/Utils.js';
import { useUserStore } from '@/store/useUserStore.js';
import favorited_icon from 'assets/follow/favorited.svg';
import favorite_icon from 'assets/follow/favorite.svg';
import { reactive } from 'vue';
import { useEventObserver } from '@zhengxy/use';

const userStore = useUserStore();
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
});
const router = useRouter();
const {
  likesCount,
  excerciseCount,
  duration,
  calories,
  totalVolume,
  commentsCount,
  tagids,
  selfLike,
  contentId
} = props.data;

const workoutInfo = [
  {
    text: 'Excercises',
    value: excerciseCount
  },
  {
    text: 'Duration',
    value: formatDuration(duration).join(' ')
  },
  {
    text: 'Calories',
    value: formatCalories(calories)
  },
  {
    text: 'Total Volume',
    value: totalVolume + ' lbs'
  }
];
const tags = userStore.calcUserPreferenceList(tagids || [], false).slice(0, 2);
const controller = reactive({
  likeCount: likesCount || 0,
  isLike: selfLike,
  commentsCount: commentsCount || 0
});
useEventObserver('LikeCount', ({ value, contentId: itemContentId }) => {
  if (itemContentId === contentId) {
    controller.likeCount += value;
    controller.isLike = !controller.isLike;
  }
});
useEventObserver('CommentCount', ({ value, contentId: itemContentId }) => {
  if (itemContentId === contentId) {
    controller.commentsCount += value;
  }
});
const handleClick = () => {
  console.log(props.data);
  router.push('/workout/' + props.data.contentId);
};
</script>

<template>
  <div
    class="bg-white p-4 mb-2 flex"
    @click="handleClick"
  >
    <div
      class="rounded flex-shrink-0 flex items-center bg-[#F5F6FA] px-1 h-[5.625rem]"
    >
      <MuscleFrontMap
        class="!text-[0.25rem]"
        :gender="data.gender"
        :data="data.muscleTags"
      />
      <div class="w-[3rem] max-h-[4.875rem] overflow-hidden">
        <div class="text-[#565656]">
          <div
            class="flex h-5 scale-[0.5] origin-top flex-col items-center"
            v-for="(item, index) in workoutInfo"
            :key="index"
          >
            <div class="font-medium leading-[1] text-nowrap text-sm">
              {{ item.value }}
            </div>
            <div class="text-xs leading-[1] text-nowrap">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
      <MuscleBackMap
        class="!text-[0.25rem]"
        :gender="data.gender"
        :data="data.muscleTags"
      />
    </div>
    <div class="ml-2 flex-1 overflow-hidden flex flex-col space-y-2">
      <div class="text-title line-clamp-2 text-sm">{{ data.workoutName }}</div>
      <div class="flex overflow-hidden space-x-4 flex-1">
        <Anchor
          class="whitespace-nowrap"
          :text="item.text"
          v-for="item in tags"
        />
      </div>
      <div class="flex space-x-4">
        <div class="flex items-center">
          <img
            src="assets/follow/comment.svg"
            alt=""
          />
          <span class="text-black text-xs ml-1.5">
            {{ controller.commentsCount }}
          </span>
        </div>
        <div class="flex items-center">
          <img
            class="w-6"
            :src="controller.isLike ? favorited_icon : favorite_icon"
            alt=""
          />
          <span class="text-black text-xs ml-1.5">
            {{ controller.likeCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
