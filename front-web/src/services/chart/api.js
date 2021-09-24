import {request} from "umi";

export async function getData() {
  return request('/question/searchAll', {
    method: 'GET',
  });
}

export async function getContent(id) {
  return request('/question/detail', {
    method: 'GET',
    params: {
      id:id
    }
  });
}

export async function queryNode(q) {
  return request('/question/search', {
    method: 'GET',
    params: {
      q: q
    }
  });
}
