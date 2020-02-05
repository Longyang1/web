import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelAnnualAssessments = (params) => {
    return new request({
        url: './personnel/personnelAnnualAssessments/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelAnnualAssessments/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelAnnualAssessment, token) {
    return new request({
        url: './personnel/personnelAnnualAssessments',
        method: (personnelAnnualAssessment.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelAnnualAssessment
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelAnnualAssessments/' + id,
        method: 'delete',
    });
}