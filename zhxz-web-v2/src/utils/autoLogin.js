var jsSHA = require("jssha");
import { getToken } from '@/api/token'
import store from '../store' 
import router from '../router'

export const submitHandler = (func, checkToken) => {
    getToken().then((res) => {
        var token = res.data;
        func(token);
    }).catch((error) => {
        if (error && error.status == 404) {
            return;
        }
        console.log(error)
        msg('网络错误');
    });
};

export const autoLogin =  (pwd) => {
    try {
        submitHandler((token) => {
            var salt = token;
            var password = pwd || "123456Hx";
            var shaObj = new jsSHA("SHA-1", "TEXT");
            shaObj.update(password);
            password = shaObj.getHash("B64");
            password = "{SHA}" + password + salt;
            var shaObj2 = new jsSHA("SHA-1", "TEXT");
            shaObj2.update(password);
            password = "{SHA}" + shaObj2.getHash("B64");
            store.dispatch('user/LOGIN', {account: 'admin', password: password, token: salt}).then(() => {
                router.push({
                    name: 'Home',
                    params: {
                        //meetingId: '983b8fcd6a4311e886cc000c29b4d918'
                    }
                });
            }).catch(() => {
                // alert("登录失败");
                // this.resetToken();
            })
        }, false);
    } catch(err) {
        // console.log(err)
        // this.resetToken();
    }
};