import fetch from '../fetch';
export default {
  list(params){//公告列表
    return fetch.post('/clientNotice/list',params)
  }
}
