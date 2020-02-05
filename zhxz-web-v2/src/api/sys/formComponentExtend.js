import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/formComponentExtends/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(formComponentExtend) {
    return new request({
        url: './sys/formComponentExtends',
        method: (formComponentExtend.id ? 'put' : 'post'),
        data: {
        	formComponentExtend
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/formComponentExtends/' + id,
        method: 'delete',
    });
}
export function getByCompId(cid) {
    return new request({
        url: './sys/formComponentExtends/getByCompId?cid=' + cid,
        method: 'get',
    });
}