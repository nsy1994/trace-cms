import request from '@/utils/request';

export async function queryData() {
  return request(`/api/cms/confirm/query`);
}

export async function queryInfo() {
  return request(`/api/cms/queryInfo`);
}

export async function confirm(data) {
  return request('/api/cms/confirm/confirm', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}
