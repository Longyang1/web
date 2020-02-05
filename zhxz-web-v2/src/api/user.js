import request from '@/utils/request'
import qs from 'qs'

export const getUsers = (params) => {
    return new request({
        url: './sys/authUsers',
        method: 'get',
        params: params
    });
}
export const updatePwd = (params, token) => {
    return new request({
        url: './sys/authUsers/updatePwd',
        method: 'post',
        headers: {
            token
        },
        data: qs.stringify(Object.assign({
            rm: 1,
        }, params))
    });
}
export const updatePwdLogout = () => {
    return new request({
        url: './uua/logout',
        method: 'delete',
    });
}
export const getMenus = () => {
    return new request({
        url: './sys/menus',
        method: 'get',
        params: {
            applicationId: 2
        }
    });
}

export const getMyMenuTreeData = () => {
    return new request({
        url: './sys/menus/myTreeData',
        method: 'get',
    });
}

export const getChildrenMenuNum = (menuName) => {
    return new request({
        url: './sys/menus/getChildrenMenuNum',
        method: 'get',
        params: {
            menuName
        }
    });
}

export const getUserAuthorities = (userId) => {
    return new request({
        url: './uua/' + userId + '/authorities',
        method: 'get',
    });
}

export const  getEmailCode = (account, email) => {
    return new request({
        url: './sys/authUsers/emailCode',
        method: 'get',
        params: {
            account,
            email
        }
    });
}

export const  getSmsCode = (account, service) => {
    return new request({
        url: './sys/authUsers/smsCode',
        method: 'get',
        params: {
            account,
            service
        }
    });
}

export const getMobileSmsCode = (mobile, service) => {
    return new request({
        url: './sys/authUsers/mobile/smsCode',
        method: 'get',
        params: {
            mobile,
            service
        }
    });
}

export const getCaptcha = (uid) => {
    if (uid) {
        return new request({
            url: './sys/captcha',
            method: 'get',
            headers: {
                'Captcha-Uid': uid
            },
            responseType: 'blob'
        });
    } else {
        return new request({
            url: './sys/captcha',
            method: 'get',
            responseType: 'blob'
        });
    }
}

export const resetPwd = (account, newPwd, surePwd, code) => {
    return new request({
        url: './sys/authUsers/resetPwd',
        method: 'post',
        data: qs.stringify({
            account,
            newPwd,
            surePwd,
            code
        })
    });
}

export const addToUserGroup = (userUid, groupKey, token) => {
    return new request({
        url: './sys/authUsers/' + userUid + "/group",
        method: 'post',
        headers: {
            token
        },
        data: qs.stringify({
            groupKey
        })
    });
}

export const removeFromUserGroup = (userUid, groupKey) => {
    return new request({
        url: './sys/authUsers/' + userUid + "/group",
        method: 'delete',
        params: {
            groupKey
        }
    });
}