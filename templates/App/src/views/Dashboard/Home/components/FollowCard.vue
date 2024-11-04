<script setup>
import { useRouter } from 'vue-router';
import FollowPostCard from './FollowPostCard.vue';
import FollowWorkoutCard from './FollowWorkoutCard.vue';
import { formatLocalDateString } from 'plugin/Utils.js';

const router = useRouter();
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
});
const { workout, post, contentType } = props.data;
const cardData = contentType === 0 ? post : workout;

const emit = defineEmits(['onCommentClick', 'onEllipsisClick']);
const handleCommentClick = () => {
  emit('onCommentClick', props.data.contentId, props.data.ownerCustomerId);
};
const handleUserClick = () => {
  router.push({
    path: '/custom/profile',
    query: {
      customerId: props.data.ownerCustomerId
    }
  });
};

const handleCardClick = () => {
  if (contentType === 0) {
    router.push('/post/' + props.data.contentId);
  } else {
    router.push('/workout/' + props.data.contentId);
  }
};
const handleWorkoutClick = () => {
  router.push({
    path: '/post/detail/workout',
    state: {
      data: {
        exercise: toRaw(props.data.post.exercise),
        contentId: props.data.contentId
      }
    }
  });
};
const handleEllipsisClick = () => {
  emit('onEllipsisClick', props.data.contentId);
};
</script>

<template>
  <div
    @click="handleCardClick"
    class="rounded space-y-4 w-full overflow-hidden bg-white px-4 pt-6 pb-4 mb-2"
  >
    <div
      @click.stop="handleUserClick"
      class="flex items-center"
    >
      <img
        v-error
        class="object-cover w-8 h-8 rounded-full"
        :src="data.ownerImage"
        alt=""
      />
      <div class="flex-1 pl-2">
        <div class="text-sm font-medium text-black">
          {{ data.ownerCustomerName }}
        </div>
        <div class="text-xs text-tip">
          {{ formatLocalDateString(data.publishingDate) }}
        </div>
      </div>
      <div @click.stop="handleEllipsisClick">
        <img
          class="press"
          src="assets/follow/ellipsis.svg"
          alt=""
        />
      </div>
    </div>
    <FollowPostCard
      @onWorkoutClick="handleWorkoutClick"
      @onPostClick="handleCardClick"
      @onCommentClick="handleCommentClick"
      :data="cardData"
      :contentId="data.contentId"
      v-if="data.contentType === 0"
    />
    <FollowWorkoutCard
      :gender="data.gender"
      @onCommentClick="handleCommentClick"
      :contentId="data.contentId"
      :data="cardData"
      v-else
    />
  </div>
</template>
