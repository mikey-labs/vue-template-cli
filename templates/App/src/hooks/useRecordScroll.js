import { onActivated, onBeforeUnmount, toValue } from 'vue';

export const useRecordScroll = (el) => {
  const dom = toValue(el);
  dom.position = 0;
  const handleScroll = (e) => (dom.position = e.target.scrollTop);
  dom.addEventListener('scroll', handleScroll);
  onActivated(() => {
    dom.scrollTop = el.position;
  });
  onBeforeUnmount(() => dom.removeEventListener('scroll', handleScroll));
};
