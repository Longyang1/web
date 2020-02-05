import request from '@/utils/request'
import qs from 'qs'

export const getSysUserSettings = (params) => {
    return new request({
        url: './sys/sysUserSettings/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysUserSettings/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysUserSetting) {
    return new request({
        url: './sys/sysUserSettings',
        method: (sysUserSetting.id ? 'put' : 'post'),
        data: {
        	sysUserSetting
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysUserSettings/' + id,
        method: 'delete',
    });
}

export const getUserSettingByType = (userSettingTypeDict) => {
    return getSysUserSettings({
        userSettingTypeDict
    });
}

