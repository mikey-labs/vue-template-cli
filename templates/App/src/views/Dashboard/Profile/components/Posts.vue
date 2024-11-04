<script setup>
import { reactive, ref } from 'vue';
import { apiGetProfilePosts } from 'api/Profile.js';
import PostCard from './PostCard.vue';
import MusclePopover from '@/views/Dashboard/Home/components/MusclePopover.vue';

const props = defineProps({
  customerId: Number | String
});
const cardList = ref([]);
const data = reactive({
  finished: false,
  loading: false,
  query: {
    pageNo: 1,
    pageSize: 10,
    customerId: props.customerId
  }
});

const onLoad = async () => {
  const [err, res] = await apiGetProfilePosts(data.query);
  data.loading = false;
  if (!err) {
    const { hasNextPage, details } = res;
    data.finished = !hasNextPage;
    cardList.value = cardList.value.concat(details || []);
    data.query.pageNo++;
  } else {
    data.finished = true;
  }
};
const showPop = ref(false);
const currentPost = ref({});
const handleMuscleClick = (data) => {
  currentPost.value = toRaw(data);
  showPop.value = true;
};
const refresh = () => {
  data.query.pageNo = 1;
  data.loading = true;
  cardList.value = [];
  data.finished = false;
  onLoad();
};
defineExpose({
  refresh: refresh
});
</script>

<template>
  <div class="pt-2">
    <LoadMore
      v-model:finished="data.finished"
      v-model:loading="data.loading"
      :data="cardList"
      :onLoad="onLoad"
      masonry
    >
      <template #default="{ item }">
        <PostCard
          show-status
          @onMuscleClick="handleMuscleClick"
          :key="item.contentId"
          :data="item"
        >
        </PostCard>
      </template>
    </LoadMore>
    <MusclePopover
      v-model="showPop"
      :data="currentPost"
    />
  </div>
</template>
