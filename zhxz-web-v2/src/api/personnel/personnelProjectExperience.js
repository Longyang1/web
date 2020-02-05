import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelProjectExperiences = (params) => {
    return new request({
        url: './personnel/personnelProjectExperiences/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelProjectExperiences/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelProjectExperience, token) {
    return new request({
        url: './personnel/personnelProjectExperiences',
        method: (personnelProjectExperience.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelProjectExperience
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelProjectExperiences/' + id,
        method: 'delete',
    });
}