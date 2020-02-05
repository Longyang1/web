import Vue from 'vue'
import VueRouter from 'vue-router'
import RouterConfig from './modules' // 引入业务逻辑模块
import CommonRouters from './common' // 引入通用模块
/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
Vue.use(VueRouter)
export default new VueRouter({
    // mode: 'history',// 需要服务端支持
    scrollBehavior: () => ({ y: 0 }),
    routes: RouterConfig.concat(CommonRouters)
})
