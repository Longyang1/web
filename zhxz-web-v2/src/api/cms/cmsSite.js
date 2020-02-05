import request from '@/utils/request'
import qs from 'qs'

export const getCmsSites = (params) => {
    return new request({
        url: './cms/cmsSites/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './cms/cmsSites/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(cmsSite, token) {
    return new request({
        url: './cms/cmsSites',
        method: (cmsSite.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	cmsSite
        }
    });
}

export function del(id) {
    return new request({
        url: './cms/cmsSites/' + id,
        method: 'delete',
    });
}