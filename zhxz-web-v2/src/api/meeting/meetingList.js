import request from '@/utils/request'
import qs from 'qs'


export function search(formData){
    return new request({
        url: './meeting/search',
        method: 'get',
        params: formData
    });
}

export function getDicts(){
    return new request({
        url: './meeting/dict?type=meeting_type_dict,meeting_status_dict',
        method: 'get',
    });
}

export function getInitData(formData) {
    return request.all([getDicts()]);
    
}