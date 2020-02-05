import request from '@/utils/request'
import qs from 'qs'

export const getPersonnelAddressBooks = (params) => {
    return new request({
        url: './personnel/personnelAddressBooks/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnelAddressBooks/' + id,
        method: 'get',
    });
}

export function saveOrUpdate(personnelAddressBook, token) {
    return new request({
        url: './personnel/personnelAddressBooks',
        method: (personnelAddressBook.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
        	personnelAddressBook
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnelAddressBooks/' + id,
        method: 'delete',
    });
}

export const batchSaveOrUpdate = (books, token) => {
    return new request({
        url: './personnel/personnelAddressBooks/batch',
        method: 'post',
        headers: {
            token
        },
        data: {
        	books
        }
    });
}