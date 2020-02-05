import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelInterviews = (params) => {
    return new request({
        url: './personnel/personnelInterviews/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelInterviews/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelInterview, token) {
    return new request({
        url: './personnel/personnelInterviews',
        method: (personnelInterview.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelInterview
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelInterviews/' + id,
        method: 'delete',
    });
}