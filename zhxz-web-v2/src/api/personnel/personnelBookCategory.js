import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelBookCategorys = (params) => {
    return new request({
        url: './personnel/personnelBookCategorys/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelBookCategorys/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelBookCategory, token) {
    return new request({
        url: './personnel/personnelBookCategorys',
        method: (personnelBookCategory.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelBookCategory
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelBookCategorys/' + id,
        method: 'delete',
    });
}