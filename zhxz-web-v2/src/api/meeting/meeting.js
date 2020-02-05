import request from '@/utils/request'
import qs from 'qs'
import { getSubjectSelectedIndex } from '../../utils/meetingUtils';
import { getConfMembers } from '@/api/meeting/confMember'
import { getConfTemplates } from '@/api/meeting/confTemplate'
import { getMeetingSubjects, subjectCounts } from '@/api/meeting/meetingSubject'
import { getDicts } from '@/api/dict'
import * as meetingInfoApi from '@/api/meeting/meetingInfo'

export const getCacheData = (meetingId) => {
    return request({
        url: './meeting/' + meetingId + "/cacheData",
        method: 'get'
    });
}

export const getVoteData = (meetingId) => {
    return request({
        url: './meeting/' + meetingId + "/voteData",
        method: 'get'
    });
}

export const getMeetingData = (meetingId) => {
    var requests = [];
    requests.push(getDicts("meeting_type_dict,meeting_subject_type_dict,project_feasibility,vote_opinion_dict,meeting_member_type_dict,project_type_dict,budgetary_type_dict,procurement_style_dict,contract_type_dict,project_priority_dict,project_actualize_dict,PASS_TYPE"));
    requests.push(meetingInfoApi.get(meetingId));
    requests.push(meetingInfoApi.getMeetingSubjects(meetingId));
    requests.push(meetingInfoApi.getMeetingMembers(meetingId));
    requests.push(getCacheData(meetingId));
    requests.push(getVoteData(meetingId));
    requests.push(meetingInfoApi.getMeetingSessions(meetingId));
    return request.all(requests);
}

export function saveMeetingInfo(params, token) {
    return request({
        url: './meeting/meetingInfos',
        method: JSON.parse(params.meetingInfo).id ? 'put' : 'post',
        headers: {
            token
        },    
        data: params
    });
}
export function getMeeting(meetingId){
    return request({
        url: './meeting/meetingInfos/' + meetingId,
        method: 'get',
    })
}

export const getMeetingInfos = (params) => {
    return new request({
        url: './meeting/meetingInfos',
        method: 'get',
        params: params
    });
}

export const getMeetingPoolInitData = () => {
    return request.all([getDicts('meeting_type_dict,meeting_status_dict,meeting_subject_type_dict'), getMeetingSubjects({"meetingSubjectStatusDict": 1}), subjectCounts()]);
}

export const getCreateMeetingInitData = (meetingInfo, subjectIds, memberTypeDicts) => {
    var requests = [];
    requests.push(getDicts('MEETING_TYPE_DICT,MEETING_SUBJECT_TYPE_DICT,MEETING_INSTRUCTIONS_VARIABLE,MEETING_MEMBER_TYPE_DICT,CONTENT_TYPE_DICT,MEETING_SESSION_DICT,VIEW_SHOW_TYPE_DICT'));
    var requestFunc = meetingInfo.id ? getMeeting(meetingInfo.id) : getMeetingSubjects({"keys": subjectIds});
    requests.push(requestFunc);
    requests.push(getConfMembers({"officeId": meetingInfo.officeId, 'meetingTypeDict': meetingInfo.meetingTypeDict, 'memberTypeDict': memberTypeDicts.join(',')}));
    requests.push(getConfTemplates({meetingType: meetingInfo.meetingTypeDict}));
    if(meetingInfo.id) {
        requests.push(getSubjects(meetingInfo.id)); // 
        requests.push(getMeetingMembers(meetingInfo.id));
        requests.push(meetingInfoApi.getMeetingSessions(meetingInfo.id));
    }
    return request.all(requests);
}

export function getMeetingInitData(meetingId) {
    return request({
        url: './meeting/getConferenceViewInitData',
        method: 'get',
        params: {
            meetingId
        }
    })
}

export function del(meetingId) {
    return request({
        url: './meeting/meetingInfos/' + meetingId,
        method: 'delete',
    })
}

export function delSubject(meetingId, subjectId) {
    return request({
        url: './meeting/meetingInfos/' + meetingId + "/meetingSubjects/" + subjectId,
        method: 'delete',
    })
}


export function sendTabSwitchMsg(meetingId, tabIndex, templateField) {
    return request({
        url: './meeting/tabSwitch/' + meetingId + "/" + tabIndex,
        method: 'put',
        params: {
            templateField
        }
    });
}

export function sendSignMsg(meetingId, userId){
    return request({
        url: './meeting/sign/' + meetingId,
        method: 'put',
        params: {
            userId
        }
    });
}

export function sendNextMsg(meetingId, index){
    return request({
        url: 'meeting/' + meetingId + "/tabStatus",
        method: 'post',
        data: qs.stringify({
            index,
        })
    });
}

export function sendVoteMsg(meetingId, index, voteSubjectIds, flag){
    return request({
        url: './meeting/' + meetingId + "/userVoteFlag",
        method: 'post',
        data: qs.stringify({
            index: index,
            flag: flag,
            voteSubjectIds: (flag ? voteSubjectIds.join(",") : null)
        })
    });
}

export function sendMemberReviewMsg(meetingId, members){
    return request({
        url: './meeting/' + meetingId + "/voteMemberReview",
        method: 'post',
        data: members
    });
}

export function voteResultSubmit(meetingId, voteResult, signature){
    return request({
        url: './meeting/' + meetingId + "/vote",
        method: 'post',
        data: {
            voteResult: JSON.stringify(voteResult),
            signature
        }
    });
}

export function publishVoteResult(meetingId, index, subjectsVoteDetail, subjectPassCount){
    var _subjectsVoteDetail = JSON.parse(JSON.stringify(subjectsVoteDetail));
    // for (const key in _subjectsVoteDetail) {
    //     if (_subjectsVoteDetail.hasOwnProperty(key)) {
    //         const element = _subjectsVoteDetail[key];
    //         for(var i = 1; i <= 4; i++) {
    //             if(i != 2 && element.hasOwnProperty('member_' + i)){
    //                 element['member_' + i] = null;
    //             }
    //         }
            
    //     }
    // }
    return request({
        url: './meeting/' + meetingId + "/vote/publishResult",
        method: 'post',
        data: {
            index: index, 
            subjectVoteDetail: _subjectsVoteDetail,
            passSubjectCount: subjectPassCount
        }
    });
}

export function endMeeting(meetingId, index){
    return request({
        url: './meeting/' + meetingId + "/end",
        method: 'post',
        data: qs.stringify({
            index: index, 
        })
    });
}

export function updateSubjectResultPass(meetingId, subjectId, passType, review) {
    return request({
        url: "./meeting/" + meetingId + "/subject/" + subjectId + "/resultPass/" + passType,
        method: 'put',
        params: {
            review 
        }
    });
}

export function saveSummary(meetingId, summary) {
    return request({
        url: "./meeting/meetingInfos/" + meetingId,
        method: 'patch',
        data: qs.stringify({
            property: 'meetingSummary',
            value: summary, 
        })
    });
}

export function getMeetingNote(meetingId){
    return request({
        url: "./meeting/meetingInfos/" + meetingId + "/meetingNotes",
        method: 'get',
    });
}
export function saveNote(meetingId, note) {
    return request({
        url: "./meeting/meetingInfos/" + meetingId + "/meetingMembers",
        method: 'put',
        data: qs.stringify({
            property: 'meetingNote',
            value: note, 
        })
    });
}
// 今后更正
export function getVoteResultPDFUrl(meetingId){
    return request({
        url:"./meeting/generatePDFByMeetingId",
        method: 'get',
        data: qs.stringify({
            meetingId
        })
    });
}
// 今后更正
export function getSignResultPDFUrl(meetingId){
    return request({
        url:"./meeting/" + meetingId + "/exportSignResultPdf",
        method: 'post',
    });
}

export function getMeetingMembers(meetingId) {
    return request({
        url:"./meeting/meetingInfos/" + meetingId + "/meetingMembers",
        method: 'get',
    });
}

export function getSubjects(meetingId) {
    return request({
        url:"./meeting/meetingInfos/" + meetingId + "/meetingSubjects",
        method: 'get',
    });
}

export function saveMeetingAssignments(meetingId, params) {
    return request({
        url: "./meeting/meetingInfos/" + meetingId + "/meetingAssignments",
        method: 'post',
        data: params
    });
}

export function getMeetingAssignments(meetingId) {
    return request({
        url: "./meeting/meetingInfos/" + meetingId + "/meetingAssignments",
        method: 'get',
    });
}

export const getNewMeetingStatus = (meetingIds) => {
    return request({
        url: './meeting/getNewMeetingStatus',
        method: 'get',
        params: {
            meetingIds: meetingIds.join(",")
        }
    })
}

export const getSignInMeeting = () => {
    return request({
        url: './meeting/getSignInMeeting',
        method: 'get',
    })
}

export const publishMeeting = (meetingId, publishFlag) => {
    return request({
        url: './meeting/meetingInfos/' + meetingId,
        method: 'patch',
        params: {
            property: 'meetingStatusDict',
            value: (publishFlag ? 1 : 4)
        }
    })
}

export const submitMemberSubjectVotes = (meetingId, memberVotes) => {
    return request({
        url: "meeting/" + meetingId + "/saveMemberSubjectVote",
        method: 'post',
        data: memberVotes
    });
}

export const submitFilteringVoteResult = (meetingId, filteringVotes) => {
    return request({
        url: "meeting/" + meetingId + "/saveFilteringVoteResult",
        method: 'post',
        data: filteringVotes
    });
}

export const publishFilteringVoteResult =  (meetingId, filteringVoteResult, index, disabledSubjectIds, subjectIds) => {
    return request({
        url: "meeting/" + meetingId + "/publishFilteringVoteResult",
        method: 'post',
        data: {
            filteringVoteResult: JSON.stringify(filteringVoteResult),
            index: index,
            disabledSubjectIds: JSON.stringify(disabledSubjectIds),
            subjectIds: JSON.stringify(subjectIds)
        }
    });
}

export const exportSupervisory = (meetingId, index) => {
    
    var data = !isNaN(index) ? qs.stringify({
        index
    }) : '';
    return request({
        url: "meeting/" + meetingId + "/exportSupervisory",
        method: 'post',
        data: data
    });
}

export const generateVoteResultPDF = (meetingId) => {
    return request({
        url: "meeting/" + meetingId + "/voteResultPdf",
        method: 'post',
    });
}

export const exportAttendanceContent = (meetingId) => {
    return request({
        url: "meeting/" + meetingId + "/exportAttendanceContent",
        method: 'post',
    });
}

export const oneKey = (meetingId) => {
    return request({
        url: "meeting/" + meetingId + "/oneKey",
        method: 'put',
    });
}

export const exportFile = (meetingId) => {
    return new request({
        url: './meeting/' + meetingId + '/exportFile',
        method: 'post',
        params: {
 
        },
        responseType: 'blob'
    });
}