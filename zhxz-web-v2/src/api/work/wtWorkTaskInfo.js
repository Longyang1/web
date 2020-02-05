import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './work/wtWorkTaskInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(wtWorkTaskInfo, assistMembers, undertaker, attamentIds, token) {
    return new request({
        url: './work/wtWorkTaskInfos',
        method: (wtWorkTaskInfo.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            "wtWorkTaskInfo": wtWorkTaskInfo,
            "assistMembers": assistMembers,
            "undertaker": undertaker,
            'attamentIds': attamentIds,
        }
    });
}

export function del(id) {
    return new request({
        url: './work/wtWorkTaskInfos/' + id,
        method: 'delete',
    });
}

export function wtWorkTaskDetails(wtWorkTaskId) {
    return new request({
        url: './work/wtWorkTaskInfos/'+wtWorkTaskId+'/details',
        method:'get'
    })
}
export function taskProgressFeedback(wtFeedbackInfo,processStateValue,attamentIds,token) {
    return new request({
        url: './work/wtWorkTaskInfos/taskProgressFeedback',
        method:'post',
        headers: {
            token
        },
        data:{
            wtFeedbackInfo,
            processStateValue,
            attamentIds,
        }
    })
}
export function getTaskFeedBackHistory(wtWorkTaskId) {
    return new request({
        url: './work/wtWorkTaskInfos/'+wtWorkTaskId+'/getTaskFeedBackHistory',
        method:'get',
        data:{}
    })
}
export function confirmCompleted(wtFeedbackInfo,wtWorkTaskId,token) {
    return new request({
        url: './work/wtWorkTaskInfos/'+wtWorkTaskId+'/confirmCompleted',
        method:'post',
        headers: {
            token
        },
        data:{
            wtFeedbackInfo,
        }
    })
}

