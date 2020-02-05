import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/sysHolidaySettings/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysHolidaySetting, token) {
    return new request({
        url: './sys/sysHolidaySettings',
        method: (sysHolidaySetting.id ? 'put' : 'post'),
        headers:{
            token
        },
        data: {
        	sysHolidaySetting
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysHolidaySettings/' + id,
        method: 'delete',
    });
}