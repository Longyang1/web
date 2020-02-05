import request from '@/utils/request'
import qs from 'qs'

export const startProcess = (processKey, assignee, token) => {
    return new request({
        url: './workflow/process/start',
        method: 'post',
        data: qs.stringify({
            processKey,
            assignee
        })
    });
}