import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelWorkExperiences = (params) => {
    return new request({
        url: './personnel/personnelWorkExperiences/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelWorkExperiences/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelWorkExperience, token) {
    return new request({
        url: './personnel/personnelWorkExperiences',
        method: (personnelWorkExperience.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelWorkExperience
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelWorkExperiences/' + id,
        method: 'delete',
    });
}