import request from '@/utils/request'
import qs from 'qs'

export const getTableNames = () => {
    return new request({
        url: './sys/dms/',
        method: 'get',
    });
}

export const getColumns = (tableName) => {
    return new request({
        url: './sys/dms/' + tableName + "/columns",
        method: 'get',
    });
}

export const getObj = (tableName, idValue) => {
    return new request({
        url: './sys/dms/' + tableName + "/objs/" + idValue,
        method: 'get',
    });
}

export const updateProperty = (tableName, id, property, value) => {
    return new request({
        url: './sys/dms/' + tableName + "/objs/" + id,
        method: 'patch',
        params: {
            property,
            value
        }
    });
}

export const haha = (time) => {
    return new request({
        url: './sys/dms/haha',
        method: 'get',
        params: {
            time
        }
    });
}
