import { TransactionType } from '@/constant/Constant.js';
import { getRedirection } from '@/hooks/useNavigation.js';

export const useSetPageAnimation = (to) => {
  if (to.meta.transition === TransactionType.None) return;
  const redirection = getRedirection();
  to.meta.transition =
    redirection.type === 'push' ||
    redirection.type === 'replace' ||
    (redirection.type === 'go' && redirection.step > 0)
      ? TransactionType.SlideIn
      : TransactionType.SlideOut;
};
