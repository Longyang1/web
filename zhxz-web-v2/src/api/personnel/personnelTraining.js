import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelTrainings = (params) => {
    return new request({
        url: './personnel/personnelTrainings/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelTrainings/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelTraining, attachmentId, token) {
    return new request({
        url: './personnel/personnelTrainings',
        method: (personnelTraining.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            personnelTraining,
            attachmentId
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelTrainings/' + id,
        method: 'delete',
    });
}