import request from '@/utils/request'
import qs from 'qs'

export const getMeetingSubjects = (params) => {
    return new request({
        url: './meeting/meetingSubjects',
        method: 'get',
        params: params
    });
}

export const getMeetingSubject = (id) => {
    return new request({
        url: './meeting/meetingSubjects/' + id,
        method: 'get',
    });
}

export const getMeetingSubjectSubitems = (id) => {
    return new request({
        url: './meeting/meetingSubjects/' + id + "/meetingSubjectSubitems",
        method: 'get',
    });
}

export const getMeetingSubjectReportMembers = (id) => {
    return new request({
        url: './meeting/meetingSubjects/' + id + "/meetingSubjectReportMembers",
        method: 'get',
    });
}

export const getMeetingSubjectInitData = (id) => {
    return request.all([getMeetingSubject(id), getMeetingSubjectItems(id), getMeetingSubjectReportMembers(id)]);
}

export const getTranMeetingSubjectInitData = (id) => {
    return request.all([getMeetingSubject(id), getMeetingSubjectReportMembers(id)]);
}

export const subjectCounts = () => {
    return new request({
        url: './meeting/meetingSubjects/subjectCounts',
        method: 'get',
        params: {
            subjectStatus: 1, 
            subjectType: '1,2,3,4,5,6,7'
        }
    });
}

export const saveOrUpdate = (subject, subjectItems, reportMembers, attamentIds, token) => {
    return new request({
        url: './meeting/meetingSubjects/',
        method: subject.id ? 'put' : 'post',
        headers: {
            token
        },
        data: {
            subject,
            subjectItems,
            reportMembers,
            attamentIds
        }
    });
}

export const saveOrUpdateTranSubject = (subject, reportMembers, attachmentInfos, token) => {
    return new request({
        url: './meeting/meetingSubjects/',
        method: subject.id ? 'put' : 'post',
        headers: {
            token
        },
        data: {
            subject: JSON.stringify(subject),
            reportMembers: JSON.stringify(reportMembers),
            attachmentInfos: JSON.stringify(attachmentInfos),
        }
    });
}

export const saveOrUpdateProjectSubject = (subject, reportMembers, attachmentInfos, projectInfo, subjectSubitems, token) => {
    return new request({
        url: './meeting/meetingSubjects/',
        method: subject.id ? 'put' : 'post',
        headers: {
            token
        },
        data: {
            subject: JSON.stringify(subject),
            reportMembers: JSON.stringify(reportMembers),
            attachmentInfos: JSON.stringify(attachmentInfos),
            projectInfo: JSON.stringify(projectInfo),
            subjectSubitems: JSON.stringify(subjectSubitems)
        }
    });
}

export const delMeetingSubject = (id) => {
    return new request({
        url: './meeting/meetingSubjects/' + id,
        method: 'delete',
    });
}


export const updateSubject = (id, property, value, token) => {
    return new request({
        url: './meeting/meetingSubjects/' + id,
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

export const delMeetingSubjectReportMember = (subjectId, reportMemberId) => {
    return new request({
        url: './meeting/meetingSubjects/' + subjectId + "/meetingSubjectReportMembers/" + reportMemberId,
        method: 'delete',
    });
}

export const getMeetingSubjectItems = (subjectId) => {
    return new request({
        url: './meeting/meetingSubjects/' + subjectId + "/meetingSubjectItems",
        method: 'get',
    });
}
