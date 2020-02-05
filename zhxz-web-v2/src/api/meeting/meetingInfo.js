import request from '@/utils/request'
import qs from 'qs'

export const get = (meetingId) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId,
        method: 'get',
    });
}

export const getMeetingSubjects = (meetingId) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId + "/meetingSubjects",
        method: 'get',
    });
}

export const getMeetingMembers = (meetingId) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId + "/meetingMembers",
        method: 'get',
    });
}

export const updateMember = (meetingId, memberId, property, value, token) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId + "/meetingMembers/" + memberId,
        method: 'patch',
        headers: {
            token
        },
        params: {
            property,
            value
        }
    });
}

export const getMeetingSessions = (meetingId) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId + "/meetingSessions",
        method: 'get',
    });
}

export const getMeetingVoteChecks = (meetingId) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId + "/voteChecks",
        method: 'get',
    });
}

export const recovery = (meetingId, token) => {
    return request({
        url: "./meeting/meetingInfos/" + meetingId + "/recovery",
        headers: {
            token
        },
        method: 'put',
    });
}