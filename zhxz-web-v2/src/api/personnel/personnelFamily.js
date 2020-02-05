import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelFamilys = (params) => {
    return new request({
        url: './personnel/personnelFamilys/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelFamilys/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelFamily, token) {
    return new request({
        url: './personnel/personnelFamilys',
        method: (personnelFamily.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelFamily
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelFamilys/' + id,
        method: 'delete',
    });
}