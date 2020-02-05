import request from '@/utils/request'
import qs from 'qs'

export function saveOrUpdate(wtWorkTaskInfo) {
    return new request({
        url: './work/wtWorkTaskInfos',
        method: (wtWorkTaskInfo.id ? 'put' : 'post'),
        data: wtWorkTaskInfo
    });
}

export function del(id) {
    return new request({
        url: './work/wtWorkTaskInfos/' + id,
        method: 'delete',
    });
}
export function addAttend(id) {
  return new request({
    url: './work/wtDeptWorkTaskInfos/addAttend?businessId='+id,
    method: 'get',
  });
}
export function delAttend(id) {
  return new request({
    url: './work/wtDeptWorkTaskInfos/delAttend?businessId='+id,
    method: 'get',
  });
}
export function get() {
  return new request({
    url: './work/wtDeptWorkTaskInfos?pageSize=10&pageNo=1',
    method: 'get',
  });
}
export const batchDownload = (params) => {
  return new request({
    url: './work/wtWorkTaskInfoImportDownload/batchDeptDownload',
    method: 'get',
    params: params,
    responseType: 'blob',
  });
}
