<script setup>
import { reactive, ref } from 'vue';
import { apiLike } from 'api/UserOperation.js';
import { useEventDispatch, useEventObserver } from '@zhengxy/use';
import favorite_icon from 'assets/follow/favorite.svg';
import favorited_icon from 'assets/follow/favorited.svg';
import { formatCalories, formatDuration } from 'plugin/Utils.js';

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  gender: Number,
  contentId: String
});
const workoutInfo = ref([
  {
    text: 'Excercises',
    value: ''
  },
  {
    text: 'Duration',
    value: ''
  },
  {
    text: 'Calories',
    value: ''
  },
  {
    text: 'Total Volume',
    value: ''
  }
]);

const emit = defineEmits(['onCommentClick']);
const handleCommentClick = () => {
  emit('onCommentClick');
};
const { excerciseCount, duration, calories, totalvolume } = props.data;
workoutInfo.value[0].value = excerciseCount || 0;
workoutInfo.value[1].value = formatDuration(duration || 0).join(' ');
workoutInfo.value[2].value = formatCalories(calories || 0);
workoutInfo.value[3].value = (totalvolume || 0) + ' lbs';

const { likeCount, commnetCount, selfLike } = props.data;
const controller = reactive({
  likeCount,
  isLike: selfLike,
  commnetCount,
  isSelf: false
});

const handleFavoriteClick = async () => {
  const addValue = controller.isLike ? -1 : 1;
  controller.likeCount += addValue;
  controller.isLike = !controller.isLike;
  const [err, res] = await apiLike({ contentId: props.contentId });
  if (err) {
    controller.likeCount -= addValue;
    controller.isLike = !controller.isLike;
  } else {
    controller.isSelf = true;
    useEventDispatch('LikeCount', {
      value: addValue,
      contentId: props.contentId
    });
  }
};
useEventObserver('LikeCount', ({ value, contentId: itemContentId }) => {
  if (controller.isSelf) {
    controller.isSelf = false;
    return;
  }
  if (itemContentId === props.contentId) {
    controller.likeCount += value;
    controller.isLike = !controller.isLike;
  }
});
useEventObserver('CommentCount', ({ value, contentId: itemContentId }) => {
  if (itemContentId === props.contentId) {
    controller.commnetCount += value;
  }
});
</script>

<template>
  <div class="space-y-4">
    <div class="text-title">{{ data.contentName }}</div>
    <div class="rounded flex items-center bg-[#F5F6FA] py-4">
      <MuscleFrontMap
        :gender="gender"
        :data="data.muscleTags"
      />
      <div class="text-[#565656] space-y-2 flex-1 text-center">
        <slot>
          <div
            v-for="(item, index) in workoutInfo"
            :key="index"
          >
            <div class="font-bold">{{ item.value }}</div>
            <div class="text-[13px] mt-0.5">{{ item.text }}</div>
          </div>
        </slot>
      </div>
      <MuscleBackMap
        :gender="gender"
        :data="data.muscleTags || []"
      />
    </div>
    <AnchorList :tag-ids="data.tagids || []" />

    <div class="pt-4 border-t flex items-center justify-end border-[#ddd]">
      <div
        class="flex items-center"
        @click.stop="handleFavoriteClick"
      >
        <img
          :src="controller.isLike ? favorited_icon : favorite_icon"
          alt=""
        />
        <span class="ml-1 text-info text-xs">{{ controller.likeCount }}</span>
      </div>

      <div
        class="ml-4 flex items-center"
        @click.stop="handleCommentClick"
      >
        <img
          src="assets/follow/comment.svg"
          alt=""
        />
        <span class="ml-1 text-info text-xs">{{
          controller.commnetCount
        }}</span>
      </div>
    </div>
  </div>
</template>
