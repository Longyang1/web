import request from '@/utils/request'
import qs from 'qs'

export const getMeetingContentTemplates = (params) => {
    return new request({
        url: './meeting/meetingContentTemplates',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './meeting/meetingContentTemplates/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(meetingContentTemplate, token) {
    return new request({
        url: './meeting/meetingContentTemplates',
        method: (meetingContentTemplate.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	meetingContentTemplate
        }
    });
}

export function del(id) {
    return new request({
        url: './meeting/meetingContentTemplates/' + id,
        method: 'delete',
    });
}