import request from '@/utils/request'
import qs from 'qs'

export const getBmCompanyInfos = (params) => {
    return new request({
        url: './bm/bmCompanyInfos/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './bm/bmCompanyInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(bmCompanyInfo, token) {
    return new request({
        url: './bm/bmCompanyInfos',
        method: (bmCompanyInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	bmCompanyInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './bm/bmCompanyInfos/' + id,
        method: 'delete',
    });
}