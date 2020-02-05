import request from '@/utils/request'
import qs from 'qs'

export const get = (id) => {
    return new request({
        url: './sys/formTemplateInfos/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(formTemplateComponentId,formTemplateInfoId,formComponentFormId,compType,checkedBoxDatas) {
    return new request({
        url: './sys/formTemplateInfos',
        method: (formTemplateComponentId ? 'put' : 'post'),
       /* headers: {
            token
        },*/
        data: {
        	formTemplateComponentId,formTemplateInfoId,formComponentFormId,compType,checkedBoxDatas
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/formTemplateInfos/' + id,
        method: 'delete',
    });
}

export function getYear() {
    return new request({
        url: './sys/formTemplateInfos/getYear',
        method: 'get',
    });
}
export function getByYearType(year,type) {
    return new request({
        url: './sys/formTemplateInfos/getByYearType?year='+year+'&type='+type,
        method: 'get',
        data: {
            year,type
        }
    });
}
export function getCheckAndAllDatas(compId,tempInfoId) {
    return new request({
        url: './sys/formTemplateInfos/getCheckAndAllDatas?formCompId='+compId+'&formTempInfoId='+tempInfoId,
        method: 'get'
    });
}
export function checkChangeStatus(tempInfoId,compId,status) {
    return new request({
        url: './sys/formTemplateInfos/checkChangeStatus?formTemplateInfoId='+tempInfoId+'&formComponentId='+compId+'&status='+status,
        method: 'get'
    });
}

export function publishOrNo(id,status,token) {
    return new request({
        url: './sys/formTemplateInfos/publishOrNo',
        method: 'put',
        headers: {
            token
        },
        data: {
            id,status
        }
    });
}

export function getExistTemp(year) {
    return new request({
        url: './sys/formTemplateInfos/getExistTemp?year='+year,
        method: 'get'
    });
}
export function letscopy(sourceId,selectYear,selectTemp,token) {
    return new request({
        url: './sys/formTemplateInfos/letscopy',
        method: 'post',
        headers: {
            token
        },
        data:{
            sourceId,selectYear,selectTemp
        }
    });
}



