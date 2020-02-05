import request from '@/utils/request'
import qs from 'qs'

export const getSysResourcePrivileges = (params) => {
    return new request({
        url: './sys/sysResourcePrivileges/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysResourcePrivileges/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysResourcePrivileges,token) {
    return new request({
        url: './sys/sysResourcePrivileges',
        method: 'post',
        headers:{
            token
        },
        data: {
        	sysResourcePrivileges
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysResourcePrivileges/' + id,
        method: 'delete',
    });
}

export function currentUserManageerResources() {
    return new request({
        url: './sys/sysResourcePrivileges/currentUserManageerResources',
        method: 'get',
    });
}