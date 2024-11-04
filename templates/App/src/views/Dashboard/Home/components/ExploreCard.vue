<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import collect_icon from 'assets/follow/collect.svg';
import collected_icon from 'assets/follow/collected.svg';
import { apiCollect } from 'api/UserOperation.js';
import { useEventDispatch, useEventObserver } from '@zhengxy/use';

const router = useRouter();
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
});
const { collectCount, selfCollect, contentId } = props.data;
const controller = reactive({
  collectCount,
  isCollect: selfCollect,
  isSelf: false //用于判断是否是当前组件广播，如果是则不处理监听数字变化逻辑
});
const imgLoaded = ref(false);
const handleClick = () => {
  router.push('/post/' + contentId);
};
const emit = defineEmits(['onMuscleClick']);
const handleMuscleClick = () => {
  emit('onMuscleClick', props.data);
};

const handleCollectClick = async () => {
  const addValue = controller.isCollect ? -1 : 1;
  controller.collectCount += addValue;
  controller.isCollect = !controller.isCollect;
  const [err] = await apiCollect({ contentId: contentId });
  if (err) {
    controller.collectCount -= addValue;
    controller.isCollect = !controller.isCollect;
  } else {
    controller.isSelf = true;
    useEventDispatch('CollectCount', {
      value: addValue,
      contentId: contentId
    });
  }
};
useEventObserver('CollectCount', ({ value, contentId: itemContentId }) => {
  if (controller.isSelf) {
    controller.isSelf = false;
    return;
  }
  if (contentId === itemContentId) {
    controller.collectCount += value;
    controller.isCollect = !controller.isCollect;
  }
});
</script>

<template>
  <div
    class="rounded float-left overflow-hidden item mb-2"
    @click="handleClick"
  >
    <div class="relative flex flex-col">
      <van-image
        :src="data.image"
        width="100%"
        :height="imgLoaded ? 'auto' : '6rem'"
        @load="imgLoaded = true"
        alt=""
      />
      <div
        class="absolute bg-white h-8 p-1 rounded-sm overflow-hidden w-10 right-2 bottom-2"
        @click.stop="handleMuscleClick"
      >
        <div class="scale-[0.11] items-center flex origin-top-left">
          <MuscleFrontMap
            :gender="data.gender"
            :data="data.muscleTags"
          />
          <div class="text-center leading-relaxed">
            <div class="italic">Total</div>
            <div class="italic">Exercises</div>
            <div class="font-bold mt-1 text-5xl">
              {{ data.totalExcercisesCount }}
            </div>
          </div>
          <MuscleBackMap
            :gender="data.gender"
            :data="data.muscleTags"
          />
        </div>
      </div>
    </div>
    <div class="p-2 bg-white">
      <div class="text-sm line-clamp-2 text-left break-words font-bold">
        {{ data.contentName }}
      </div>
      <div class="flex items-center justify-start mt-2">
        <img
          v-error
          class="rounded-full w-[1.125rem] object-cover h-[1.125rem]"
          :src="data.ownerImage"
          alt=""
        />
        <span class="ml-1 flex-1 text-[#555555] text-xs line-clamp-1">{{
          data.ownerCustomerName
        }}</span>
        <img
          @click.stop="handleCollectClick"
          :src="controller.isCollect ? collected_icon : collect_icon"
          alt=""
        />
        <span class="text-xs text-title">{{ controller.collectCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  width: calc(50% - 0.25rem);
}
.item:nth-child(2n) {
}
</style>
