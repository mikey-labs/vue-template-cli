export const isValidName = (str) => /^[a-zA-Z0-9_ ]+$/.test(str);
export const formMobile = (mobile, before = 4, end = 4) => {
  return (
    mobile.substring(0, before) + '...' + mobile.substring(mobile.length - end)
  );
};
export function formatSeconds(seconds) {
  if (!seconds) return '00:00';
  const totalSeconds = Math.floor(seconds);
  // 计算分钟
  const minutes = Math.floor(totalSeconds / 60);
  // 计算剩余的秒数
  const remainingSeconds = totalSeconds % 60;

  // 格式化输出，确保秒数是两位数
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const getNonceStr = (lenC) => {
  let len = lenC;
  len = len || 8;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
  const maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
};
export const base64ToFile = (base64String) => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); // 将 base64 解码
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  // 将解码后的 base64 字符串转换为字节数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  // 自动生成文件名
  const extension = mime.split('/')[1]; // 提取文件扩展名
  const fileName = `${Date.now() + getNonceStr()}.${extension}`;
  // 创建并返回 File 对象
  return new File([u8arr], fileName, { type: mime });
};

const getCssVarValue = (prop) => {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(prop);
};
export const getSafeBottomHeight = () => {
  const newValue = getCssVarValue('--safe-area-bottom');
  if (!newValue) {
    const oldValue = getCssVarValue('--safe-area-bottom-old');
    return Number.parseInt(oldValue) || 0;
  }
  return Number.parseInt(newValue) || 0;
};
