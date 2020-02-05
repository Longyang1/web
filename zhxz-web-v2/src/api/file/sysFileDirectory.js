import request from '@/utils/request'
import qs from 'qs'

export const getSysFileDirectorys = (params) => {
    return new request({
        url: './file/sysFileDirectorys/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './file/sysFileDirectorys/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysFileDirectory, attamentIds, token) {
    return new request({
        url: './file/sysFileDirectorys',
        method: (sysFileDirectory.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            sysFileDirectory,
            attamentIds
        }
    });
}

export function del(id) {
    return new request({
        url: './file/sysFileDirectorys/' + id,
        method: 'delete',
    });
}

export const getDirNodes = (params) => {
    return new request({
        url: './file/sysFileDirectorys/treeData',
        method: 'get',
        params: params
    });
}