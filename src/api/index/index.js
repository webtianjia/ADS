import fetch from '../fetch';
export default {
  orderStatistical(params){//订单统计
    return fetch.post('/clientIndex/getOrderStatistical',params)
  },
}
