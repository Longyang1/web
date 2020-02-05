import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelWrittenExaminations = (params) => {
    return new request({
        url: './personnel/personnelWrittenExaminations/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelWrittenExaminations/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelWrittenExamination, token) {
    return new request({
        url: './personnel/personnelWrittenExaminations',
        method: (personnelWrittenExamination.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelWrittenExamination
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelWrittenExaminations/' + id,
        method: 'delete',
    });
}