import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/sysNoticeInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysNoticeInfo, attachmentIds, token) {
    return new request({
        url: './sys/sysNoticeInfos',
        method: (sysNoticeInfo.id ? 'put' : 'post'),
        headers:{
            token
        },
        data: {
            sysNoticeInfo,attachmentIds
            
        }
    });
}

export const getNoticeInfos = (params) => {
    return new request({
        url: './sys/sysNoticeInfos/spaceSysNoticeInfos',
        method: 'get',
        params: params
    });
}
export const getSysNoticeInfoAddCount = (id) => {
    return new request({
        url: './sys/sysNoticeInfos/getSysNoticeInfoAddCount/'+id,
        method: 'get',
        
    });
}

export function addViewCount(id) {
    return new request({
        url: './sys/sysNoticeInfos/' + id + "/count",
        method: 'post'
    });
}

export function del(id) {
    return new request({
        url: './sys/sysNoticeInfos/' + id,
        method: 'delete',
    });
}

export const addReadingRecord = (noticeId) => {
    return new request({
        url: './sys/sysNoticeInfos/' + noticeId + "/readingRecord",
        method: 'post',
    });
}