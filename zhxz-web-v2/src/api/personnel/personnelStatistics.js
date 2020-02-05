import request from '@/utils/request'
import qs from 'qs'

export const getGenderData = () => {
    return new request({
        url: './personnel/personnelStatistics/genderData',
        method: 'get',
    });
}

export const getPoliticalData = () => {
    return new request({
        url: './personnel/personnelStatistics/politicalData',
        method: 'get',
    });
}

export const getEducationData = () => {
    return new request({
        url: './personnel/personnelStatistics/educationData',
        method: 'get',
    });
}