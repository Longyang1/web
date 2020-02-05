<template>
    <div id="app" class="easyui-layout" fit="true" scroll="no" ref="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
export default {
    name: "App",
    data() {
        return {
        
        };
    },
    methods: {
    
    },
    created () {
        //在页面加载时读取sessionStorage里的状态信息
        if (localStorage.getItem("user") ) {
            //this.$store.replaceState(Object.assign({}, this.$store.state.user,JSON.parse(sessionStorage.getItem("user"))))
            this.$store.commit('user/SET_USER_FROM_STORAGE', JSON.parse(localStorage.getItem("user")));
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
