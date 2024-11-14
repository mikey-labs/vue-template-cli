import Fetch from 'plugin/Request.js';

/**
 * 用refresh_token 换取 access_token，自行替换成api接口
 * @param data {{refresh_token}}
 * @return {Promise<Awaited<{access_token: string}>>}
 */
export const apiRefreshToken = (data) => {
  // return Fetch.get('dashboard/post', data);
  return Promise.resolve({ access_token: 'your access_token' });
};
