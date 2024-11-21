export const formWithStar = (str, before = 4, end = 4) => {
  return str.substring(0, before) + '...' + str.substring(str.length - end);
};

/**
 *
 * @param {'selector' | 'input'} type
 * @param {string} label
 */
export const getPlaceHolderByType = (label, type = 'input') => {
  const Prefix = {
    selector: '请选择',
    input: '请输入'
  };
  return (Prefix[type] + label).replace('：', '');
};
const getRemarkText = (label) => {
  return `<span style="color:  #F85B59">[<span style="font-weight: 500">${label.replace('：', '')}</span>]</span>`;
};
/**
 *
 * @param {'selector' | 'input'|'upload'| 'table' | 'table-row'} type
 *@param {number=} rowNumber
 * @param {string} label
 * @param {string=} columnName
 */
export const getRequiredMessage = (
  label,
  type = 'input',
  rowNumber,
  columnName
) => {
  const html = getRemarkText(label);
  if (type === 'input') {
    return `${html} 为必填项`;
  } else if (type === 'selector') {
    return `请选择 ${html}`;
  } else if (type === 'table') {
    return `${html} 至少添加一项`;
  } else if (type === 'table-row') {
    return `${html} 表格中第<span style="color:  #F85B59"> ${rowNumber} </span>行，${getRemarkText(columnName)}为必填项目`;
  } else {
    return `请上传 ${html}`;
  }
};
export const cleanParam = (param = {}, filter0 = false, filterValue) => {
  const res = {};
  for (const key of Object.keys(param)) {
    (param[key] ||
      (param[key] === 0 && !filter0) ||
      typeof param[key] === 'boolean') &&
      param[key] !== filterValue &&
      (res[key] = param[key]);
  }
  return res;
};
export const criterionParam = (obj) => {
  const res = [];
  for (const key of Object.keys(obj)) {
    res.push({
      key: key,
      value: obj[key]
    });
  }
  return res;
};
export function getFileExtension(filename) {
  // 使用正则表达式匹配文件名中的后缀
  var match = filename.match(/\.([^.]+)$/);
  // 如果匹配到了，返回匹配到的后缀名，否则返回null
  return match ? match[1] : null;
}
export const getRandomNumber = (lenC = 16) => {
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
export function isImageFile(fileName) {
  // 定义正则表达式来匹配常见的图片文件扩展名
  const imageRegex = /\.(jpeg|jpg|png|gif|bmp|svg|webp|tiff|tif)$/i;
  return imageRegex.test(fileName);
}
