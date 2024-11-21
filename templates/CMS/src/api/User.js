import Fetch from 'plugin/Request.js';

export const apiLogin = (data) => {
  return Fetch.post('login', data);
};
