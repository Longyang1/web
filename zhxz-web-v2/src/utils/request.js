import axios from 'axios'
import store from '../store'
import router from '../router'
import { getToken, removeToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: '/api/', // api的base_url
  timeout: 15000, // 请求超时时间
  headers: {
    "Pragma": "no-cache",
    "Cache-Control": "must-revalidate",
    "Cache-Control": "no-cache" ,
    "Cache-Control": "no-store",
  }
})
const notSetAuthHeaderUrls = [
    './sys/token',
    './uua/login',
    './uua/mobile/login',
    './sys/authUsers/emailCode',
    './sys/authUsers/smsCode',
    './sys/authUsers/mobile/smsCode',
    './sys/authUsers/resetPwd',
    './sys/captcha'
]
// request拦截器
service.interceptors.request.use(config => {

  if (needSetAuthHead(config.url)) {
    // config.headers['Auth'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // config.headers['Authorization'] = 'Bearer ' + getToken()
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        if (response['headers']['content-disposition']) {
            const data = response.data;
            var fileName = response['headers']['content-disposition'].split(";")[1].split("filename=")[1];
            var index = fileName.lastIndexOf("\"");
            if (index == fileName.length - 1) {
                var start = 0;
                if (fileName.indexOf("\"") == 0) {
                    start = 1;
                }
                fileName = fileName.substring(start, index);
            }
            return {
                data,
                fileName
            }
        }
        if (response['headers']['captcha-uid']) {
            return response;
        }
        const res = response.data;
        if (res['access_token'] || !res.status) {
            return response.data;
        }
        if (res.status != 200) {
            if (res.status == 401) {
                router.push({
                    path: '/login',
                })
            } else {
                msg(res.msg);
            }
            return Promise.reject(res)
        } else {
            return response.data
        }
    },
    error => {
        if (error && error.response) {
            if (error.response.status == 401) {
                removeToken();
                // location.reload()
            } else if (error.response.status == 403) {
                msg("无权访问");
            } else if (error.response.status == 500) {
                msg("系统繁忙,请稍后再试");
            }
        }
        console.log('err' + error) // for debug
        // store.dispatch('user/LOGOUT').then(() => {
        //   //location.reload()// 为了重新实例化vue-router对象 避免bug
        // })
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

const needSetAuthHead = (url) => {
    return notSetAuthHeaderUrls.indexOf(url) == -1;
}

/* eslint-disable no-proto */
service.__proto__ = axios
/* eslint-enable */

export default service
