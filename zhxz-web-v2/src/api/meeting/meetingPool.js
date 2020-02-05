import request from '@/utils/request'
import qs from 'qs'
import { getConfMembers } from '@/api/meeting/confMember'

export const getDicts = (type) => {
    return new request({
        url: './meeting/dict?type=' + type,
        method: 'get',
    });
} 

export const getMeetingSubjects = () => {
    return new request({
        url: './meetingSubjects',
        method: 'get',
        params: {
            "meetingSubjectStatusDict": 1
        }
    });
}

export const getMeetingInfos = (params) => {
    return new request({
        url: './meetingInfos',
        method: 'get',
        params: params
    });
}



export const subjectCounts = () => {
    return new request({
        url: './meetingSubjects/subjectCounts',
        method: 'get',
        params: {
            subjectStatus: 1, 
            subjectType: '1,2,3,4,5,6,7'
        }
    });
}

export const getInitData = () => {
    return request.all([getDicts('meeting_type_dict,meeting_status_dict,meeting_subject_type_dict'), getMeetingSubjects(), getMeetingInfos({pageNo: 1}), subjectCounts()]);
}

export const getCreateMeetingInitData = (meetingId) => {
    //var requestFunc = meetingId ? ;
    return request.all([
        getDicts('meeting_type_dict,meeting_subject_type_dict,meeting_Instructions_variable,meeting_member_type_dict'), 
        getMeetingSubjects(), 
        getMeetingInfos({pageNo: 1}), 
        subjectCounts()]);
}
