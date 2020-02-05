import request from '@/utils/request'
import qs from 'qs'

export const getOfficeNodes = (params) => {
    return new request({
        url: './sys/authOrgs/orgTreeData',
        method: 'get',
        params: params
    });
}
export const get = (params) => {
    return new request({
        url: './sys/authOrgs',
        method: 'get',
        params: params
    });
}

export const judgeNodeHaveChild = (orgParentId) => {
    return new request({
        url: './sys/authOrgs/judgeNodeHaveChild/?orgParentId='+orgParentId,
        method: 'get',
    });
}

export const gets = (params) => {
    return new request({
        url: './sys/authOrgs',
        method: 'get',
        params: params
    });
}
