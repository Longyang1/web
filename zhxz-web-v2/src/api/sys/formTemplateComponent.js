import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/formTemplateComponents/' + id,
        method: 'get',
    });
}


export function saveOrUpdate(formTemplateComponent) {
    return new request({
        url: './sys/formTemplateComponents',
        method: (formTemplateComponent.id ? 'put' : 'post'),
        data: {
        	formTemplateComponent
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/formTemplateComponents/' + id,
        method: 'delete',
    });
}

export function changeSubType(year,subType) {
    return new request({
        url: './sys/projectAllForm/changeSubType?year=' + year+'&subType='+subType,
        method: 'get',
    });
}

