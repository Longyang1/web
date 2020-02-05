import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelCertifications = (params) => {
    return new request({
        url: './personnel/personnelCertifications/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelCertifications/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelCertification, attachmentId, token) {
    return new request({
        url: './personnel/personnelCertifications',
        method: (personnelCertification.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            personnelCertification,
            attachmentId
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelCertifications/' + id,
        method: 'delete',
    });
}