import request from '@/utils/request'
import qs from 'qs'

export const getCmsCategorys = (params) => {
    return new request({
        url: './cms/cmsCategorys/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './cms/cmsCategorys/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(cmsCategory, token) {
    return new request({
        url: './cms/cmsCategorys',
        method: (cmsCategory.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	cmsCategory
        }
    });
}

export function del(id) {
    return new request({
        url: './cms/cmsCategorys/' + id,
        method: 'delete',
    });
}

export const getCateforyNodes = (params) => {
    return new request({
        url: './cms/cmsCategorys/treeData',
        method: 'get',
        params: params
    });
}