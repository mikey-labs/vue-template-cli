<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/store/useUserStore.js';

const props = defineProps({
  list: {
    type: Array,
    default: []
  },
  selected: {
    type: String
  }
});
const userStore = useUserStore();
const filterList = ref(userStore.userPreferenceList);
const emit = defineEmits(['onSelect']);
userStore.$subscribe((mutation, state) => {
  // console.log(state);
  // console.log(mutation);
  filterList.value = userStore.calcUserPreferenceList(state.user.preferenceIds);
});
const active = ref(props.selected);
watch(
  () => props.selected,
  (n) => (active.value = n)
);
const handleItemClick = (item, index) => {
  if (active.value === item.value) return;
  active.value = item.value;
  emit('onSelect', item);
};
const handleTouchstart = (e) => {
  e.stopPropagation();
};
</script>

<template>
  <div
    @touchstart.passive="handleTouchstart"
    class="flex flex-nowrap overflow-x-auto space-x-3"
  >
    <div
      class="rounded px-2 text-nowrap py-1 flex-shrink-0 text-sm"
      :class="
        active === item.value ? 'bg-body text-white' : 'bg-white text-body'
      "
      v-for="(item, i) in filterList"
      :key="i"
      @click="handleItemClick(item, i)"
    >
      {{ item.text }}
    </div>
  </div>
</template>
