import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelJobInfos = (params) => {
    return new request({
        url: './personnel/personnelJobInfos/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelJobInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelJobInfo, token) {
    return new request({
        url: './personnel/personnelJobInfos',
        method: (personnelJobInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelJobInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelJobInfos/' + id,
        method: 'delete',
    });
}