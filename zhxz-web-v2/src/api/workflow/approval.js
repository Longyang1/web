import request from '@/utils/request'
import qs from 'qs'

export const getApprovalHistory = (processKey, businessKey) => {
    return new request({
        url: './workflow/approval/history',
        method: 'post',
        params: {
            processKey,
            businessKey
        }
    });
}