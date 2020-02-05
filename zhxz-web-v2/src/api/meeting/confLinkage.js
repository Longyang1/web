import request from '@/utils/request'
import qs from 'qs'
import { getDicts } from '@/api/dict'


export const getMeetingConfLinkages = (params) => {
    return new request({
        url: './meeting/meetingConfLinkages',
        method: 'get',
        params: params
    });
}

export const getMeetingConfLinkage = (id) => {
    return new request({
        url: './meeting/meetingConfLinkages/' + id,
        method: 'get',
    });
}

export const getMeetingConfLinkageInitData = (id) => {
    return request.all([getMeetingConfLinkage(id), getDicts('LINKAGE_TYPE')]);
}

export function saveOrUpdateConfLinkage(meetingConfLinkage, token) {
    return new request({
        url: './meeting/meetingConfLinkages',
        method: (meetingConfLinkage.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: meetingConfLinkage
    });
}

export function delMeetingConfLinkage(id) {
    return new request({
        url: './meeting/meetingConfLinkages/' + id,
        method: 'delete',
    });
}