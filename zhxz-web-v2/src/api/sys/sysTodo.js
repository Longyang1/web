import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './todo/sysTodos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysTodo) {
    return new request({
        url: './todo/sysTodos',
        method: (sysTodo.id ? 'put' : 'post'),
        data: {
        	sysTodos
        }
    });
}

export function del(id) {
    return new request({
        url: './todo/sysTodos/' + id,
        method: 'delete',
    });
}
export function updateStatus(params) {
    return new request({
        url: './todo/sysTodos/updateStatus' ,
        method: 'post',
        params:params
    });
}
export const getSysTodos = (params) => {
    return new request({
        url: './todo/sysTodos/',
        method: 'get',
        params: params
    });
}


export function batchUpdateStatus(id) {
    return new request({
        url: './todo/sysTodos/batchUpdateStatus/'+id,
        method: 'get',

    });
}