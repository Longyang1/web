import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelLearningExperiences = (params) => {
    return new request({
        url: './personnel/personnelLearningExperiences/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelLearningExperiences/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelLearningExperience, attachmentId, token) {
    return new request({
        url: './personnel/personnelLearningExperiences',
        method: (personnelLearningExperience.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            personnelLearningExperience,
            attachmentId
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelLearningExperiences/' + id,
        method: 'delete',
    });
}