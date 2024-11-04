<script setup>
defineProps({
  data: {
    type: Object,
    default: {}
  }
});
const showPop = defineModel({ type: Boolean, default: false });
</script>

<template>
  <van-popup
    round
    style="--van-popup-round-radius: 8px"
    teleport="body"
    v-model:show="showPop"
  >
    <div class="flex items-center overflow-x-hidden py-10 px-4">
      <MuscleFrontMap
        class="flex-1 text-[0.9375rem]"
        :gender="data.gender"
        :data="data.muscleTags"
      />
      <div class="text-center leading-relaxed px-2">
        <div class="italic">Total</div>
        <div class="italic">Exercises</div>
        <div class="font-bold mt-1 text-5xl">
          {{ data.totalExcercisesCount }}
        </div>
      </div>
      <MuscleBackMap
        class="flex-1 text-[0.9375rem]"
        :gender="data.gender"
        :data="data.muscleTags"
      />
    </div>
  </van-popup>
</template>

<style scoped></style>
