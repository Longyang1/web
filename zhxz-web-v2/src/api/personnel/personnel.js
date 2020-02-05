import request from '@/utils/request'
import qs from 'qs'

export const getPersonnels = (params) => {
    return new request({
        url: './personnel/personnels/',
        method: 'get',
        params: params
    });
}

export const get = (id) => {
    return new request({
        url: './personnel/personnels/' + id,
        method: 'get',
    });
}

export const getMe = (id) => {
    return new request({
        url: './personnel/personnels/me',
        method: 'get',
    });
}

export function saveOrUpdate(personnel, jobCodes, technicalExpertiseInfo, token) {
    return new request({
        url: './personnel/personnels',
        method: (personnel.id ? 'put' : 'post'),
        headers: {
            token
        },
        data: {
            personnel,
            jobCodes,
            technicalExpertiseInfo
        }
    });
}

export function del(id) {
    return new request({
        url: './personnel/personnels/' + id,
        method: 'delete',
    });
}

export const getPersonnelFamilys = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelFamilys',
        method: 'get',
    });
}

export const getPersonnelInterviews = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelInterviews',
        method: 'get',
    });
}

export const getPersonnelWrittenExaminations = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelWrittenExaminations',
        method: 'get',
    });
}

export const getPersonnelProjectExperiences = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelProjectExperiences',
        method: 'get',
    });
}

export const getPersonnelLearningExperiences = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelLearningExperiences',
        method: 'get',
    });
}

export const getPersonnelWorkExperiences = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelWorkExperiences',
        method: 'get',
    });
}

export const getPersonnelTrainings = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelTrainings',
        method: 'get',
    });
}

export const getPersonnelCertifications = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelCertifications',
        method: 'get',
    });
}

export const getPersonnelRewardPunishments = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelRewardPunishments',
        method: 'get',
    });
}

export const getPersonnelHiJobInfos = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelHiJobInfos',
        method: 'get',
    });
}

export function exportPersonInfoExcel() {
    return new request({
        url: './personnel/personnels/exportPersonInfoExcel',
        method: 'get',
        responseType:'blob',
    });
}

export const exportPersonInfo = (personnelId, userType, exportList) => {
    var exportType = exportList ? 'list' : '';
    return new request({
        url: './personnel/personnels/exportPersonnelInfo',
        method: 'get',
        params: {
            personnelId,
            userType,
            exportType
        },
        responseType: 'blob'
    });
}

export const link = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/linkMe',
        method: 'patch',
    });
}

export const saveHobby = (id, hobby) => {
    var property = 'hobby';
    var value = hobby;
    return new request({
        url: './personnel/personnels/' + id,
        method: 'patch',
        params: {
            property,
            value
        }
    });
}

export const getOfficesByCenterCode = (centerCode) => {
    return new request({
        url: './personnel/personnels/centerOffices',
        method: 'get',
        params: {
            centerCode
        }
    });
}

export const updatePhoto = (id, photo) => {
    var property = 'photo';
    var value = photo;
    return new request({
        url: './personnel/personnels/' + id,
        method: 'patch',
        params: {
            property,
            value
        }
    });
}

export const levelAdjustment = (personnelId, level, levelStartTime) => {
    return new request({
        url: './personnel/personnels/' + personnelId + '/level/' + level,
        method: 'patch',
        params: {
            levelStartTime
        }
    });
}

export const jobAdjustment = (personnelId, job, jobStartTime) => {
    return new request({
        url: './personnel/personnels/' + personnelId + '/job/' + job,
        method: 'patch',
        params: {
            jobStartTime
        }
    });
}

export const getPersonnelHiLevelInfos = (id) => {
    return new request({
        url: './personnel/personnels/' + id + '/personnelHiLevelInfos',
        method: 'get',
    });
}

export const getDepartments = () => {
    return new request({
        url: './personnel/personnels/departments',
        method: 'get',
    });
}

export const getOfficePersonnelCountData = (params) => {
    return new request({
        url: './personnel/personnels/officePersonnelCountData',
        method: 'get',
        params: params
    });
}

export const getPersonnelTotalCount = () => {
    return new request({
        url: './personnel/personnels/personnelTotalCount',
        method: 'get',
    });
}