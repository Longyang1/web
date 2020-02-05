import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelCenterConfigs = (params) => {
    return new request({
        url: './personnel/personnelCenterConfigs/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelCenterConfigs/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelCenterConfig, centerOffices, token) {
    return new request({
        url: './personnel/personnelCenterConfigs',
        method: (personnelCenterConfig.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            personnelCenterConfig,
            centerOffices
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelCenterConfigs/' + id,
        method: 'delete',
    });
}

export const getPersonnelCenterOrgs = (id) => {
    return new request({
        url: './personnel/personnelCenterConfigs/' + id + "/personnelCenterOrgs",
        method: 'get',
    });
}