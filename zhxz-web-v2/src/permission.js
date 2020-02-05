import router from './router'
import store from './store'
import Vue from 'vue'
import { getToken } from '@/utils/auth';
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { autoLogin } from '@/utils/autoLogin'

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

const whiteList = ['/login', '/toHome'] // 不重定向白名单
router.beforeEach((to, from, next) => {

    if (to.name != "LoginCheckOut" && location.hostname.indexOf(process.env.OLD_DOMAIN) != -1) {
        next({
            path: '/toHome',
            query: { 
                
            }
        });
    }
    
    NProgress.start()
    if (from.name == 'Meeting') {

        if (to.name == 'Home') {
            next();
        } else {
            next({
                path: '/home',
                query: { 
                    toPath: 'MeetingList' 
                }
            });
        }
    }
    //alert(to.name + "-" + from.name);
    Vue.prototype.$layer.closeAll();
    if (getToken()) {
        next()
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            if (process.env.VUE_APP_AUTO_LOGIN == "1") {
                autoLogin(process.env.VUE_APP_PWD);
            } else {
                next('/login')
            }
        }
    }
})

router.afterEach(() => {
    NProgress.done();
})