import request from '@/utils/request'
import qs from 'qs'

export const getStatPersonnelInfos = (params) => {
    return new request({
        url: './personnel/statPersonnelInfos/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/statPersonnelInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(statPersonnelInfo, token) {
    return new request({
        url: './personnel/statPersonnelInfos',
        method: (statPersonnelInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	statPersonnelInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/statPersonnelInfos/' + id,
        method: 'delete',
    });
}