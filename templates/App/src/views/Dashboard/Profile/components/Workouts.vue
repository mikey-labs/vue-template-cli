<script setup>
import { reactive, ref } from 'vue';
import WorkoutsItem from './WorkoutsItem.vue';
import { apiGetProfileWorkout } from 'api/Profile.js';

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
  const [err, res] = await apiGetProfileWorkout(data.query);
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
  <LoadMore
    v-model:finished="data.finished"
    v-model:loading="data.loading"
    :data="cardList"
    :onLoad="onLoad"
  >
    <template #default="{ item }">
      <WorkoutsItem
        :key="item.contentId"
        :data="item"
      >
      </WorkoutsItem>
    </template>
  </LoadMore>
</template>
