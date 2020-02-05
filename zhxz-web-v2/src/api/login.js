import request from '@/utils/request'
import qs from 'qs'

export function login(username, password, captcha, uid, token) {
    var grant_type = 'password';
    var client_id = 'client_2';
    var client_secret = '1xapp';
    return request({
        url: './uua/login',
        method: 'post',
        headers: {
            token,
            'Captcha-Uid': uid,
        },    
        data: qs.stringify({
            username,
            password,
            captcha,
            grant_type,
            client_id,
            client_secret,
        })
    })
}

export function mobileLogin(mobile, code) {
    var grant_type = 'password';
    var client_id = 'client_2';
    var client_secret = '1xapp';
    return request({
        url: './uua/mobile/login',
        method: 'post', 
        data: qs.stringify({
            mobile,
            code,
            grant_type,
            client_id,
            client_secret,
        })
    })
}

export function logout(){
    return request({
        url: './uua/logout',
        method: 'delete',
    })
}
