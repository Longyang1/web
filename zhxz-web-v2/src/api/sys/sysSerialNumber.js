import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/sysSerialNumbers/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysSerialNumber, token) {
    return new request({
        url: './sys/sysSerialNumbers',
        method: (sysSerialNumber.id ? 'put' : 'post'),
        headers:{
            token
        },
        data: {
        	sysSerialNumber
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysSerialNumbers/' + id,
        method: 'delete',
    });
}