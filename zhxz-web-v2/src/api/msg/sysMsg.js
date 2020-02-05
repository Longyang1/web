import request from '@/utils/request'
import qs from 'qs'

export const getSysMsgs = (params) => {
    return new request({
        url: './msg/sysMsgs/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './msg/sysMsgs/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysMsg, receiver, token) {
    return new request({
        url: './msg/sysMsgs',
        method: (sysMsg.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            sysMsg,
            receiver
        }
    });
}

export function del(id) {
    return new request({
        url: './msg/sysMsgs/' + id,
        method: 'delete',
    });
}

export const readMsg = (id) => {
    return new request({
        url: './msg/sysMsgs/reading/' + id,
        method: 'put',
    });
}

export const readAllMsg = (msgType) => {
    return new request({
        url: './msg/sysMsgs/reading',
        method: 'put',
        params: {
            msgType
        }
    });
}
