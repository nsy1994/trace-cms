import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryData(data) {
  let number = '';
  let name = '';
  if (data) {
    number = data.searchNumber ? data.searchNumber : '';
    name = data.searchName ? data.searchName : '';
  }
  return request(`/api/cms/report/query?number=${number}&name=${name}`);
}

export async function queryCategory(data) {
  return request(`/api/queryCategoriesAndKinds?${stringify(data)}`);
}

export async function addData(data) {
  return request('/api/cms/report/add', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/api/cms/report/delete', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function updateData(data) {
  return request('/api/cms/report/update', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}
