import request from '@/utils/request'
import qs from 'qs'

export const getBmContractInfos = (params) => {
    return new request({
        url: './bm/bmContractInfos/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './bm/bmContractInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(bmContractInfo, token) {
    return new request({
        url: './bm/bmContractInfos',
        method: (bmContractInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	bmContractInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './bm/bmContractInfos/' + id,
        method: 'delete',
    });
}

export function getCompanyDictList() {
    return new request({
        url: "./bm/bmContractInfos/selectBmCompanyList",
        method: 'post',
        data: {
        }
    })
}

export const getSupplierById = (id) => {
    return new request({
        url: './bm/bmCompanyInfos/' + id,
        method: 'get',
    });
}