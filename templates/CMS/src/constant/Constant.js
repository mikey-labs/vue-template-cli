export const USER_PROFILE = 'USER_PROFILE';
export const USER_TOKEN = 'USER_TOKEN';
export const CLIENT_ID = '';
const format2Map = (list) => {
  return list.reduce((acc, status) => {
    acc[status.key] = status.value;
    acc[status.value] = status.key;
    return acc;
  }, {});
};
