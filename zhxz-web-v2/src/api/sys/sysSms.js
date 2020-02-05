import request from '@/utils/request'
import qs from 'qs'

export const getSysSmss = (params) => {
    return new request({
        url: './sys/sysSmss/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysSmss/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysSms, token) {
    return new request({
        url: './sys/sysSmss',
        method: (sysSms.smsId ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	sysSms
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysSmss/' + id,
        method: 'delete',
    });
}