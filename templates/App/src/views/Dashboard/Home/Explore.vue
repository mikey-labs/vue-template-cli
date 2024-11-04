<script setup>
import FilterList from './components/FilterList.vue';
import { onMounted, reactive, ref } from 'vue';
import ExploreCard from './components/ExploreCard.vue';
import { apiGetDashboardPosts } from 'api/Dashboard.js';
import { useRecordScroll } from '@/hooks/useRecordScroll.js';
import MusclePopover from '@/views/Dashboard/Home/components/MusclePopover.vue';
import { useEventObserver } from '@zhengxy/use';

defineProps({
  height: {
    type: String,
    default: '100vh'
  }
});

const cardList = ref([]);
const data = reactive({
  finished: false,
  showPop: false,
  refreshing: false,
  loading: false,
  currentPost: {},
  query: {
    pageNo: 1,
    pageSize: 10,
    tags: []
  }
});

const handleSelect = ({ value }) => {
  data.query.pageNo = 1;
  data.loading = true;
  //如果选择的不是All
  data.query.tags = value >= 0 ? [value] : [];
  cardList.value = [];
  data.finished = false;
  onLoad();
};

const onLoad = async () => {
  const [err, res] = await apiGetDashboardPosts(data.query);
  data.loading = false;
  if (!err) {
    const { hasNextPage, posts } = res;
    data.finished = !hasNextPage;
    if (data.refreshing) {
      cardList.value = [];
      data.refreshing = false;
    }
    cardList.value = cardList.value.concat(posts);
    data.query.pageNo++;
  } else {
    data.finished = true;
  }
};

const handleMuscleClick = (item) => {
  data.currentPost = item;
  data.showPop = true;
};
const scrollView = ref();
onMounted(() => {
  useRecordScroll(scrollView.value);
});
const emit = defineEmits(['onRefresh']);
useEventObserver('DeletePost', (contentId) => {
  const index = cardList.value.findIndex(
    (item) => item.contentId === contentId
  );
  index >= 0 && cardList.value.splice(index, 1);
});
const onRefresh = () => {
  data.query.pageNo = 1;
  data.loading = true;
  //如果选择的不是All
  data.finished = false;
  onLoad();
  emit('onRefresh');
};
</script>

<template>
  <div
    :style="{ height: height }"
    class="px-4 overflow-hidden flex flex-col"
  >
    <FilterList
      class="mt-4 -mx-4 px-4"
      @onSelect="handleSelect"
    />
    <div
      ref="scrollView"
      class="flex-1 pb-6 overflow-y-auto relative mt-4"
    >
      <van-pull-refresh
        @refresh="onRefresh"
        loading-text="Refreshing..."
        pulling-text="Pull down to refresh"
        loosing-text="Release to refresh"
        head-height="60"
        v-model="data.refreshing"
      >
        <LoadMore
          v-model:finished="data.finished"
          v-model:loading="data.loading"
          :data="cardList"
          :onLoad="onLoad"
          masonry
        >
          <template #default="{ item }">
            <ExploreCard
              :key="item.contentId"
              @onMuscleClick="handleMuscleClick"
              :data="item"
            >
            </ExploreCard>
          </template>
        </LoadMore>
      </van-pull-refresh>
    </div>
    <MusclePopover
      v-model="data.showPop"
      :data="data.currentPost"
    />
  </div>
</template>
