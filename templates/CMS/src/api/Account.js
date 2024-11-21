import Fetch from 'plugin/Request.js';

export const apiGetAccountList = (data) => {
  // return Fetch.post('Account/FindList', data);
  return Promise.resolve([
    null,
    {
      // Mock data
      count: 100,
      data: [
        {
          id: 1,
          name: 'Alice',
          role: 'Admin'
        },
        {
          id: 2,
          name: 'Bob',
          role: 'User'
        }
      ]
    }
  ]);
};
