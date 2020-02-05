import Vue from 'vue'
import { ADD_ACTIVE_MENU_ID, REMOVE_ACTIVE_MENU_ID, SET_CUR_REFRESH_TABLE_TAB_ID, SET_AUTHORITIES } from '@/store/mutation-types'

const state = {
    activeMenuIds: [],
    refreshTabId: null,
    curRemoveMenuName: null,
    authorities: [],
}

// getters
const getters = {
    
}

// actions
const actions = {

} 

// mutations
const mutations = {
    [ADD_ACTIVE_MENU_ID](state, menuId) {
        var index = state.activeMenuIds.indexOf(menuId, 'menuId');
        if(index == -1){
            state.activeMenuIds.push({
                menuId: menuId,
                destroy: false
            });
        } else {
            // Vue.set(state.activeMenuIds, index, {
            //     menuId: menuId,
            //     destroy: true    
            // });
        }
    },
    [REMOVE_ACTIVE_MENU_ID](state, menuId) {
        var index = state.activeMenuIds.indexOf(menuId, 'menuId');
        if(index != -1){
            state.activeMenuIds.splice(index, 1);
        }
        state.curRemoveMenuName = menuId + "_" + new Date().getTime();
    },
    [SET_CUR_REFRESH_TABLE_TAB_ID](state, menuId) {
        state.refreshTabId = menuId;
    },
    [SET_AUTHORITIES](state, authorities) {
        state.authorities = authorities;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}