import request from '@/utils/request'
import qs from 'qs'

export const getSysLogs = (params) => {
    return new request({
        url: './log/sysLogs/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './log/sysLogs/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysLog, token) {
    return new request({
        url: './log/sysLogs',
        method: (sysLog.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	sysLog
        }
    });
}

export function del(id) {
    return new request({
        url: './log/sysLogs/' + id,
        method: 'delete',
    });
}