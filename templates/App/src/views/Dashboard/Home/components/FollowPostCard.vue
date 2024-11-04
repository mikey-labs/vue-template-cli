<script setup>
import PictureSwiper from './PictureSwiper.vue';
import { apiCollect, apiLike } from 'api/UserOperation.js';
import { reactive } from 'vue';
import { useEventDispatch, useEventObserver } from '@zhengxy/use';
import favorite_icon from 'assets/follow/favorite.svg';
import favorited_icon from 'assets/follow/favorited.svg';
import collected_icon from 'assets/follow/collected.svg';
import collect_icon from 'assets/follow/collect.svg';

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  contentId: String
});
const { likeCount, collectCount, commnetCount, selfCollect, selfLike } =
  props.data;
const controller = reactive({
  likeCount,
  collectCount,
  isCollect: selfCollect,
  isLike: selfLike,
  commnetCount,
  isSelf: false
});
const emit = defineEmits(['onCommentClick', 'onPostClick', 'onWorkoutClick']);

const handlePostClick = () => {
  emit('onPostClick');
};
const handleStartWorkoutClick = () => {
  emit('onWorkoutClick');
};
const handleCommentClick = () => {
  emit('onCommentClick');
};

const handleCollectClick = async () => {
  const addValue = controller.isCollect ? -1 : 1;
  controller.collectCount += addValue;
  controller.isCollect = !controller.isCollect;
  const [err] = await apiCollect({ contentId: props.contentId });
  if (err) {
    controller.collectCount -= addValue;
    controller.isCollect = !controller.isCollect;
  } else {
    controller.isSelf = true;
    useEventDispatch('CollectCount', {
      value: addValue,
      contentId: props.contentId
    });
  }
};

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
useEventObserver('CollectCount', ({ value, contentId: itemContentId }) => {
  if (controller.isSelf) {
    controller.isSelf = false;
    return;
  }
  if (itemContentId === props.contentId) {
    controller.collectCount += value;
    controller.isCollect = !controller.isCollect;
  }
});
useEventObserver('LikeCount', ({ value, contentId: itemContentId }) => {
  if (controller.isSelf) {
    controller.isSelf = false;
    return;
  }
  if (itemContentId === props.contentId) {
    controller.collectCount += value;
    controller.isCollect = !controller.isCollect;
  }
});
useEventObserver('CommentCount', ({ value, contentId: itemContentId }) => {
  if (itemContentId === props.contentId) {
    controller.commnetCount += value;
  }
});
</script>

<template>
  <div
    class="space-y-4"
    @click="handlePostClick"
  >
    <div class="text-title">
      {{ data.contentName }}
    </div>
    <PictureSwiper :data="data.images || []" />
    <AnchorList :tag-ids="data.tagids" />

    <div class="pt-4 border-t flex items-center border-[#ddd]">
      <div class="flex-1 flex items-center press">
        <img
          src="assets/follow/sport.svg"
          alt=""
        />
        <span class="ml-1 text-info text-xs">
          {{ data.followPostCount }}
        </span>
      </div>

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
        @click.stop="handleCollectClick"
      >
        <img
          class="w-6"
          :src="controller.isCollect ? collected_icon : collect_icon"
          alt=""
        />
        <span class="ml-1 text-info text-xs">{{
          controller.collectCount
        }}</span>
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
    <div>
      <van-button
        @click.stop="handleStartWorkoutClick"
        color="linear-gradient(to right, #60AAFF, #0F5CF0)"
        block
        size="small"
      >
        <span class="text-sm text-white">Start Workout</span>
      </van-button>
    </div>
  </div>
</template>

<style scoped></style>
