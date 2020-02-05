import request from '@/utils/request'
import qs from 'qs'

export const getMeetingSubjectItemConfigs = (params) => {
    return new request({
        url: './meeting/meetingSubjectItemConfigs/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './meeting/meetingSubjectItemConfigs/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(meetingSubjectItemConfig, token) {
    return new request({
        url: './meeting/meetingSubjectItemConfigs',
        method: (meetingSubjectItemConfig.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	meetingSubjectItemConfig
        }
    });
}

export function del(id) {
    return new request({
        url: './meeting/meetingSubjectItemConfigs/' + id,
        method: 'delete',
    });
}