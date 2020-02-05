import request from '@/utils/request'
import qs from 'qs'

export const getCmsArticles = (params) => {
    return new request({
        url: './cms/cmsArticles/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './cms/cmsArticles/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(cmsArticle, cmsArticleData, attamentIds, approver, comment, token) {
    return new request({
        url: './cms/cmsArticles',
        method: (cmsArticle.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            cmsArticle,
            cmsArticleData,
            attamentIds,
            approver,
            comment
        }
    });
}

export function del(id) {
    return new request({
        url: './cms/cmsArticles/' + id,
        method: 'delete',
    });
}

export const publish = (id) => {
    return new request({
        url: './cms/cmsArticles/' + id + "/publish",
        method: 'patch',
    });
}

export const cancelPublish = () => {
    return new request({
        url: './cms/cmsArticles/' + id + "/cancelPublish",
        method: 'patch',
    });
}

export const addReadingRecord = (articleId) => {
    return new request({
        url: './cms/cmsArticles/' + articleId + "/readingRecord",
        method: 'post',
    });
}

export const know = (articleId) => {
    return new request({
        url: './cms/cmsArticles/' + articleId + "/know",
        method: 'patch',
    });
}

export const addHits = (articleId) => {
    return new request({
        url: './cms/cmsArticles/' + articleId + "/hits",
        method: 'patch',
    });
}