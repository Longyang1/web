import request from '@/utils/request'
import qs from 'qs'

export const getProjectInfos = (params) => {
    return new request({
        url: './project/projectInfos/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './project/projectInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(projectInfo, token) {
    return new request({
        url: './project/projectInfos',
        method: (projectInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	projectInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './project/projectInfos/' + id,
        method: 'delete',
    });
}