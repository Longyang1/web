import request from '@/utils/request'
import qs from 'qs'
import { getDictByTypeValue } from '@/api/dict'

export const getAttaments = (params) => {
    return new request({
        url: './file/sysAttachmentInfos',
        method: 'get',
        params: params
    });
}

export const convertFile = (attachmentId) => {
    return new request({
        url: './file/convert/' + attachmentId,
        method: 'post',
    });
}

export const delAttament = (attachmentId) => {
    return new request({
        url: './file/sysAttachmentInfos/' + attachmentId,
        method: 'delete',
    });
}

export const checkFileExist = (params) => {
    return new request({
        url: './file/download/checkFileExist',
        method: 'get',
        params: params,
    });
}

export const downloadFile = (params) => {
    return new request({
        url: './file/download',
        method: 'get',
        params: params,
        responseType: 'blob'
    });
}

export const downloadAttachment = (id) => {
    return new request({
        url: './file/download/attachment/' + id,
        method: 'get',
        responseType: 'blob'
    });
}

export const getFileUploadInitData = (attachmentBusinessId, attachmentBusinessType, fileFuncTypePrefix) => {
    return request.all([getDictByTypeValue('FILE_FUNCTION_TYPE_DICT', fileFuncTypePrefix), getAttaments({
        attachmentBusinessId,
        attachmentBusinessType
    })]);
}