import request from '@/utils/request'
import qs from 'qs'

export const getConfTemplates = (params) => {
    return new request({
        url: './meeting/meetingConfTemplates',
        method: 'get',
        params: params
    });
}