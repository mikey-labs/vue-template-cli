import { nativeGetNavBarHeight } from 'api/Native.js';

export default function useNavbarHeight() {
  const barHeightStyle = ref({
    paddingBottom: '16px'
  });
  const bottomSafeHeight = nativeGetNavBarHeight();
  if (bottomSafeHeight) {
    barHeightStyle.value.paddingBottom = bottomSafeHeight + 'px';
  }
  return barHeightStyle;
}
