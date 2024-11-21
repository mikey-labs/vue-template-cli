export default {
  mounted(el, binding) {
    if (el.nodeName === 'IMG') {
      el.onerror = () => {
        el.src = user_icon;
        el.onerror = null;
      };
    }
  },
  updated(el, binding) {
    if (!el.getAttribute('src')) {
      // el.src = user_icon;
    }
    if (el.nodeName === 'IMG') {
      el.onerror = () => {
        el.src = user_icon;
        el.onerror = null;
      };
    }
  }
};
