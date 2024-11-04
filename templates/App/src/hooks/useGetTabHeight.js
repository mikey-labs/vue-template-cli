import { nextTick, onMounted, ref } from 'vue';

export const useGetTabHeight = (tabContainer) => {
  const tabContainerHeight = ref('100vh');
  onMounted(() => {
    nextTick().then(() => {
      tabContainerHeight.value = tabContainer.value?.$el.offsetHeight + 'px';
    });
  });
  return tabContainerHeight;
};
