import { defineStore } from 'pinia';

export const useRouterStore = defineStore('RouterStore', {
  state: () => {
    return {
      keepAlive: []
    };
  },
  actions: {
    addOrDelete(oldName, redirection) {
      const { type, step: deleteCount, keepAlive: isKeepAlive } = redirection;
      console.log(redirection, oldName);
      // console.log(oldName, isKeepAlive);
      if (!oldName) return;
      const index = this.keepAlive.findIndex((name) => oldName === name);
      if (isKeepAlive) {
        index === -1 && this.keepAlive.push(oldName);
      } else {
        if (Math.abs(deleteCount) > 1) {
          //如果多层回退
          for (let i = 0; i < Math.abs(deleteCount) - 1; i++) {
            this.keepAlive.pop();
          }
        } else {
          //普通回退
          if (index >= 0) {
            this.keepAlive.splice(index, 1);
          }
        }
      }
      setTimeout(() => {
        console.log(this.keepAlive.join(','));
      }, 10);
    },
    clearCache() {
      this.keepAlive = [];
    }
  }
});
