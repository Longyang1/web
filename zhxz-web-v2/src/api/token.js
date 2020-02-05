import request from '@/utils/request'
import qs from 'qs'

export const getToken = () => {
    return new request({
        url: './sys/token',
        method: 'get',
    });
}