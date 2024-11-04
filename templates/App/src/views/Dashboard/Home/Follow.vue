<script setup>
import FilterList from './components/FilterList.vue';
import { onMounted, reactive, ref } from 'vue';
import FollowCard from './components/FollowCard.vue';
import Comments from './components/Comments.vue';
import { apiGetDashboardFollows } from 'api/Dashboard.js';
import { useRecordScroll } from '@/hooks/useRecordScroll.js';
import share_dark_icon from 'assets/profile/share-dark.svg';
import warning_icon from 'assets/profile/warning.svg';
import { useRouter } from 'vue-router';
import { useEventObserver } from '@zhengxy/use';

const router = useRouter();

defineProps({
  height: {
    type: String,
    default: '100vh'
  }
});
const data = reactive({
  finished: false,
  refreshing: false,
  loading: false,
  query: {
    pageNo: 1,
    pageSize: 10,
    tags: []
  },
  currentContentId: '',
  postUserId: ''
});
const cardList = ref([]);
const handleSelect = ({ value }) => {
  data.query.pageNo = 1;
  data.loading = true;
  //如果选择的不是All
  data.query.tags = value >= 0 ? [value] : [];
  cardList.value = [];
  //会自动触发onLoad方法
  data.finished = false;
  onLoad();
};

const onLoad = async () => {
  const [err, res] = await apiGetDashboardFollows(data.query);
  data.loading = false;
  if (!err) {
    const { hasNextPage, follows } = res;
    data.finished = !hasNextPage;
    if (data.refreshing) {
      cardList.value = [];
      data.refreshing = false;
    }
    cardList.value = cardList.value.concat(follows);
    data.query.pageNo++;
  } else {
    data.finished = true;
  }
};
const scrollView = ref();
onMounted(() => {
  useRecordScroll(scrollView.value);
});
const showComment = ref(false);
const handleCommentClick = (contentId, postUserId) => {
  data.currentContentId = contentId;
  data.postUserId = postUserId;
  showComment.value = true;
};

const showActionSheet = ref(false);
const actions = [
  { name: 'Share', icon: share_dark_icon },
  { name: 'Report', icon: warning_icon }
];
const handleActionBarSelect = ({ name }) => {
  if (name === 'Report') {
    showActionSheet.value = false;
    router.push('/report/' + data.currentContentId);
  }
};

const handleEllipsisClick = (contentId) => {
  showActionSheet.value = true;
  data.currentContentId = contentId;
};
const emit = defineEmits(['onRefresh']);
useEventObserver('DeletePost', (contentId) => {
  const index = cardList.value.findIndex(
    (item) => item.contentId === contentId
  );

  index >= 0 && cardList.value.splice(index, 1);
  console.log(index);
  console.log(cardList.value);
});
const onRefresh = () => {
  data.query.pageNo = 1;
  data.loading = true;
  //如果选择的不是All
  data.finished = false;
  emit('onRefresh');
  onLoad();
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
          :onLoad="onLoad"
          :data="cardList"
        >
          <template #default="{ item }">
            <FollowCard
              :key="item.contentId"
              @onEllipsisClick="handleEllipsisClick"
              @onCommentClick="handleCommentClick"
              :data="item"
            >
            </FollowCard>
          </template>
        </LoadMore>
      </van-pull-refresh>
    </div>
    <Comments
      :postUserId="data.postUserId"
      :contentId="data.currentContentId"
      v-model="showComment"
    />
    <van-action-sheet
      teleport="body"
      cancel-text="Close"
      v-model:show="showActionSheet"
      :actions="actions"
      @select="handleActionBarSelect"
    />
  </div>
</template>
