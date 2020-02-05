import request from '@/utils/request'
import qs from 'qs'


export const getConfMembers = (params) => {
    return new request({
        url: './meeting/meetingConfMembers',
        method: 'get',
        params: params
    });
}

export const getConfMember = (id) => {
    return new request({
        url: './meeting/meetingConfMembers/' + id,
        method: 'get',
    });
}

export const delMeetingConfMember = (id) => {
    return new request({
        url: './meeting/meetingConfMembers/' + id,
        method: 'delete',
    });
}

export const saveOrUpdateConfMember = (meetingConfMember, meetingConfMemberDetails, token) => {
    return new request({
        url: './meeting/meetingConfMembers/',
        method: meetingConfMember.id ? 'put' : 'post',
        headers: {
            token
        },
        data: {
            meetingConfMember,
            meetingConfMemberDetails
        }
    });
}

