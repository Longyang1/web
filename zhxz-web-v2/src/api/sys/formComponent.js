import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/formComponents/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(formComponent,subjectSubitems,token) {
    return new request({
        url: './sys/formComponents',
        method: (formComponent.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            formComponent,
            subjectSubitems
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/formComponents/' + id,
        method: 'delete',
    });
}

export function getTreeData(params) {
    return new request({
        url: './sys/formComponents/getTreeData?'+params,
        method: 'get'
    });
}

export function checkNodeCode(nodeCode,id) {
    return new request({
        url: './sys/formComponents/checkNodeCode?nodeCode='+nodeCode+'&id='+id,
        method: 'get',
    });
}