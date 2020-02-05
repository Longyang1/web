import Vue from 'vue'
import { login, mobileLogin, logout } from '@/api/login.js'
import { setToken, removeToken } from '@/utils/auth';
import { LOGIN, MOBILE_LOGIN, LOGOUT, SET_USER, SET_USER_FROM_STORAGE } from '@/store/mutation-types'

const state = {
    user: {
        userId: null,
        username: '',
        realName: '',
        office: {

        },
        department: {

        },
        authorities: []
    }
}

// getters
const getters = {
    isLogin: state => { 
        if (!state.user.userId) { 
            var userJson = sessionStorage.getItem('user');
            if(userJson && userJson != ''){
                //state.user = JSON.parse(userJson);
                //Vue.set(state.user, 'office', user.office);
            }
        } 
        return state.user.userId; 
    }
}

// actions
const actions = {
    [LOGIN]({ commit }, user) {
        return new Promise((resolve, reject) => {
            login(user.account, user.password, user.captcha, user.codeUid, user.token).then(response => {
                const data = response.data;
                user.password = '';
                data['user'] = user;
                commit(SET_USER, data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [MOBILE_LOGIN]({ commit }, param) {
        return new Promise((resolve, reject) => {
            mobileLogin(param.mobile, param.code).then(response => {
                const data = response.data;
                user.password = '';
                data['user'] = user;
                commit(SET_USER, data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [LOGOUT]({ commit }, meetingId) {
        return new Promise((resolve, reject) => {
            logout().then(response => {
                // commit(SET_USER, {
                //     user: {
                //         userId: '',
                //         account: '',
                //         realName: '',
                //     }
                // })
                removeToken();
                localStorage.removeItem('user');
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
        // return null;
    },
}

// mutations
const mutations = {
    [SET_USER](state, data) {
        
        // state.user.account = data.user.account;
        var userInfo = JSON.parse(data.userInfo);
        Vue.set(state.user, 'office', userInfo.office);
        Vue.set(state.user, 'realName', userInfo.realName);
        Vue.set(state.user, 'username', userInfo.username);
        Vue.set(state.user, "userId", userInfo.id);
        Vue.set(state.user, "office", userInfo.office);
        Vue.set(state.user, "department", userInfo.department);
        Vue.set(state.user, "authorities", userInfo.authorities);

        setToken(data['access_token']);

        localStorage.setItem('user', JSON.stringify(state.user));

    },
    [SET_USER_FROM_STORAGE](state, data) {
        state.user = data;
        
        // Vue.set(state.user, 'office', data.office);
        // Vue.set(state.user, 'realName', data.realName);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}