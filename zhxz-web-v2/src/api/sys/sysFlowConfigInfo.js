import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/sysFlowConfigInfos/' + id,
        method: 'get',
    });
}
export const getSysFlowConfigInfos = (params) => {
    return new request({
        url: './sys/sysFlowConfigInfos/',
        method: 'get',
        params: params
    });
}

export const saveOrUpdate = (sysFlowConfigInfo,sysFlowConfigInfos,token) => {
    return new request({
        url: './sys/sysFlowConfigInfos',
        method: (sysFlowConfigInfo.id ? 'put' : 'post'),
        headers:{
            token
        },
        data: {
            sysFlowConfigInfo,
            sysFlowConfigInfos
            
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysFlowConfigInfos/' + id,
        method: 'delete',
    });
}
