import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelRewardPunishments = (params) => {
    return new request({
        url: './personnel/personnelRewardPunishments/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelRewardPunishments/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelRewardPunishment, attachmentId, token) {
    return new request({
        url: './personnel/personnelRewardPunishments',
        method: (personnelRewardPunishment.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            personnelRewardPunishment,
            attachmentId
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelRewardPunishments/' + id,
        method: 'delete',
    });
}