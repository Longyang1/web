import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelMsgs = (params) => {
    return new request({
        url: './personnel/personnelMsgs/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelMsgs/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelMsg, token) {
    return new request({
        url: './personnel/personnelMsgs',
        method: (personnelMsg.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelMsg
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelMsgs/' + id,
        method: 'delete',
    });
}

export function readPersonnelMsgAfter(id) {
    return new request({
        url: './personnel/personnelMsgs/' + id + "/read",
        method: 'patch',
    });
}