import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelJobManages = (params) => {
    return new request({
        url: './personnel/personnelJobManages/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelJobManages/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelJobManage, token) {
    return new request({
        url: './personnel/personnelJobManages',
        method: (personnelJobManage.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelJobManage
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelJobManages/' + id,
        method: 'delete',
    });
}

export const getOfficesByCenterCode = (centerCode) => {
    return new request({
        url: './personnel/personnelJobManages/centerOffices',
        method: 'get',
        params: {
            centerCode
        }
    });
}