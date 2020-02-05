import request from '@/utils/request'
import qs from 'qs'

export const getSysAttachmentDownloads = (params) => {
    return new request({
        url: './sys/sysAttachmentDownloads/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './sys/sysAttachmentDownloads/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(sysAttachmentDownload, token) {
    return new request({
        url: './sys/sysAttachmentDownloads',
        method: (sysAttachmentDownload.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	sysAttachmentDownload
        }
    });
}

export function del(id) {
    return new request({
        url: './sys/sysAttachmentDownloads/' + id,
        method: 'delete',
    });
}