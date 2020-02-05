import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelCenterOrgs = (params) => {
    return new request({
        url: './personnel/personnelCenterOrgs/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelCenterOrgs/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelCenterOrg, token) {
    return new request({
        url: './personnel/personnelCenterOrgs',
        method: (personnelCenterOrg.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelCenterOrg
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelCenterOrgs/' + id,
        method: 'delete',
    });
}