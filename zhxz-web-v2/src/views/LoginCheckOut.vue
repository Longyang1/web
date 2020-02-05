<template>
    <div class="login-box" ref="loginBox">
        <div id="login-logo" :class="{'low-height': marginTop}">
            <img class="visible-lg-block" src="/public/img/login-logo-2.png">
            <img class="visible-md-block" width="240" src="/public/img/login-logo-2.png">
        </div>
        <div id="login">
            <div style="font-size:16px;color:#fff;text-align:left;">
                <h4>系统提示：</h4>
                <p>&nbsp;</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;信息科技流程管理作业平台(iCan)已经启用新域名www.ican.hxb，访问地址为：http://www.ican.hxb:8080，请使用新的域名访问平台，给您带来的不便 ，敬请谅解！</p>
            </div>
            <div style="font-size:16px;color:#fff;margin-top:30px;text-align:center;">系统将于&nbsp;{{ time }}&nbsp;秒后自动跳转...</div>
            <p style="font-size:16px;color:#fff;margin-top:30px;text-align:center;"> 如果页面未自动跳转,请点击：<a ref="link" href="http://www.ican.hxb:8080" target="_self">iCan平台</a></p>
        </div>
    </div>
</template>

<script>
import Base from "@/views/base/Base";
import UpdatePwd from "@/views/UpdatePwd";
var jsSHA = require("jssha");
import Forget from "@/views/Forget";

export default {
    name: "LoginCheckOut",
    extends: Base,
    data() {
        return {
            time: 5,
            interval: null,
            marginTop: null,
        };
    },
    mounted() {
        this.$nextTick(() => {
            var h = this.$refs.loginBox.offsetHeight;
            if ((632 + 90) > h) {
                this.marginTop = '51px';
            };
        });
        this.interval = setInterval(() => {
            if (this.time == 1) {
                clearInterval(this.interval);
                this.$refs.link.click();
            }
            this.time -= 1;
        }, 1000);
    },
    methods: {
    }
};
</script>

<sty
<style scoped>
/* @import url("/public/css/login2.css"); */
.login-box {
    height: 100%;
    width: 100%;
    position: absolute;
    background: url(/public/img/logobj-new.jpg) no-repeat;
    background-size: 100% 100%;
}
#login-logo.low-height {
    margin-top: 51px;
}
#login {
    padding: 39px 43px 31px 50px !important;
}
#login a {
    color: #fff;
}
#login a:hover {
    color: #fff;
}
</style>





