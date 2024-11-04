<script setup>
import { defineModel, reactive, ref, watch } from 'vue';
import Popover from '@/components/Popover.vue';
import CommentItem from './CommentItem.vue';
import { apiComment, apiGetCommentsList } from 'api/UserOperation.js';
import { showLoadingToast, showToast } from 'vant';
import { formatDate, useEventDispatch } from '@zhengxy/use';
import { useUserStore } from '@/store/useUserStore.js';
import { LoadMoreText } from '@/constant/Constant.js';
import useNavbarHeight from '@/hooks/useNavbarHeight.js';

const userStore = useUserStore();

const props = defineProps({
  contentId: String,
  postUserId: String | Number
});
const show = defineModel({ required: true, type: Boolean });

const comments = ref([]);
const data = reactive({
  finished: false,
  loading: false,
  total: 0,
  query: {
    pageNo: 1,
    pageSize: 10,
    contentId: props.contentId
  }
});
const onLoad = async () => {
  const [err, res] = await apiGetCommentsList(data.query);
  console.log(res);
  if (!err) {
    const { hasNextPage, pageList, total } = res;
    data.total = total;
    data.finished = !hasNextPage;
    comments.value = comments.value.concat(pageList);
    data.query.pageNo++;
    data.loading = false;
  } else {
    data.finished = true;
  }
};

watch(
  () => props.contentId,
  async (contentId) => {
    if (contentId) {
      data.finished = false;
      data.loading = true;
      comments.value = [];
      data.query.pageNo = 1;
      data.query.contentId = contentId;
      await onLoad();
    }
  }
);

const comment = ref();
const handleSendClick = async () => {
  if (!comment.value) {
    showToast('Please input a comment');
    return;
  }
  const toast = showLoadingToast();
  const [err, res] = await apiComment({
    contentId: data.query.contentId,
    otherCustomerId: props.postUserId,
    content: comment.value
  });
  toast.close();
  if (!err) {
    //刷新
    comments.value.unshift({
      image: userStore.user.image,
      name: userStore.user.name,
      date: formatDate(Date.now()),
      content: comment.value
    });
    useEventDispatch('CommentCount', {
      value: 1,
      content: comment.value,
      image: userStore.user.image,
      name: userStore.user.name,
      contentId: data.query.contentId
    });
    data.total += 1;
    comment.value = '';
  }
};
const handlePopoverClose = () => {
  // data.total = 0;
};
defineExpose({
  refresh: () => {
    data.finished = false;
    data.loading = true;
    comments.value = [];
    data.query.pageNo = 1;
    data.query.contentId = props.contentId;
    onLoad();
  }
});
const safeBottomStyle = useNavbarHeight();
</script>

<template>
  <Popover
    teleport="body"
    :title="'Comments  (' + data.total + ')'"
    @close="handlePopoverClose"
    v-model="show"
  >
    <template #bar>
      <div class="border-t"></div>
    </template>
    <van-list
      v-model:loading="data.loading"
      :finished="data.finished"
      :finished-text="LoadMoreText.Finish"
      :loading-text="LoadMoreText.loading"
      @load="onLoad"
    >
      <CommentItem
        :key="i"
        :data="item"
        v-for="(item, i) in comments"
      >
      </CommentItem>
    </van-list>
    <template #footer>
      <div :style="safeBottomStyle">
        <div class="border-t border-[#ddd] px-4 pt-2">
          <van-field
            autocomplete="off"
            style="
              --van-cell-background: #f2f2f2;
              --van-cell-vertical-padding: 2px;
              --van-cell-horizontal-padding: 2px;
            "
            placeholder="Comments"
            v-model="comment"
            class="rounded-full border border-primary pl-5"
          >
            <template #button>
              <van-button
                @click="handleSendClick"
                round
                style="
                  --van-button-normal-padding: 0 16px;
                  --van-button-default-height: 38px;
                "
                type="primary"
              >
                <span class="text-sm">Send</span>
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
    </template>
  </Popover>
</template>
