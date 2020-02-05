import request from '@/utils/request'
import qs from 'qs'

export function getDictsWithCondition(params) {
    return request({
        url: './sys/sysDicts',
        method: 'get',
        params: params
    });
}

export function getDicts(type) {
    if (!type) {
        return Promise.reject("参数为空");
    }
    return request({
        url: './sys/sysDicts',
        method: 'get',
        params: {
            type
        }
    });
}

export function getDictByTypeValue(typeCode,value) {
    return request({
        url: './sys/sysDicts/getDictByTypeValue',
        method: 'get',
        params: {
            typeCode,
            value
        }
    });
}

export function getDictTypes(type) {
    return request({
        url: './sys/sysDictTypes',
        method: 'get',
        params: {
            type
        }
    });
}