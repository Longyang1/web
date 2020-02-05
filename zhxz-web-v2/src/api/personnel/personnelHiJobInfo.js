import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelHiJobInfos = (params) => {
    return new request({
        url: './personnel/personnelHiJobInfos/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelHiJobInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelHiJobInfo, token) {
    return new request({
        url: './personnel/personnelHiJobInfos',
        method: (personnelHiJobInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelHiJobInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelHiJobInfos/' + id,
        method: 'delete',
    });
}