import request from '@/utils/request'
import qs from 'qs'

export const getSysMails = (params) => {
    return new request({
        url: './sys/sysMails/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysMails/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysMail, token) {
    return new request({
        url: './sys/sysMails',
        method: (sysMail.mailId ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	sysMail
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysMails/' + id,
        method: 'delete',
    });
}