import request from '@/utils/request'
import qs from 'qs'

export const getSysCustomGroups = (params) => {
    return new request({
        url: './sys/sysCustomGroups',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysCustomGroups/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysCustomGroup) {
    return new request({
        url: './sys/sysCustomGroups',
        method: (sysCustomGroup.id ? 'put' : 'post'),
        data: {
        	sysCustomGroup
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysCustomGroups/' + id,
        method: 'delete',
    });
}