import request from '@/utils/request'
import qs from 'qs'
import { getMyMenuTreeData } from '@/api/user'

export const getSysShortcutPrivileges = (params) => {
    return new request({
        url: './sys/sysShortcutPrivileges/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysShortcutPrivileges/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysShortcutPrivilege, token) {
    return new request({
        url: './sys/sysShortcutPrivileges',
        method: (sysShortcutPrivilege.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	sysShortcutPrivilege
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysShortcutPrivileges/' + id,
        method: 'delete',
    });
}

export const saveMyShortcutPrivilege = (privilegeIds) => {
    return new request({
        url: './sys/sysShortcutPrivileges/myShortcutPrivilege',
        method: ('post'),
        data: {
        	privilegeIds
        }
    });
}

export const getMyMenuTreeInitData = () => {
    var requests = [];
    requests.push(getMyMenuTreeData());
    requests.push(getSysShortcutPrivileges({
        simpleData: 'y'
    }));
    return request.all(requests);
}