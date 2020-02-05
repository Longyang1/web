import request from '@/utils/request'
import qs from 'qs'

export const getSysAreas = (params) => {
    return new request({
        url: './sys/sysAreas/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysAreas/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysArea, token) {
    return new request({
        url: './sys/sysAreas',
        method: (sysArea.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	sysArea
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysAreas/' + id,
        method: 'delete',
    });
}