<template>
    <div>
        <!-- green -->
        <div :class="'login-box-2 login-bg-' + bgSuffix" ref="loginBox">
            <div id="login-logo">
                <img class="visible-lg-block" v-real-img="'/api/file/pub/assets/login-logo-' + bgSuffix + '.png?t=' + new Date().getTime()">
                <img class="visible-md-block" width="240" v-real-img="'/api/file/pub/assets/login-logo-' + bgSuffix + '.png?t=' + new Date().getTime()">
            </div>
            <div v-if="show" class="visible-lg-block">
                <div id="login-1" :class="'login-box-bg-' + bgSuffix">
                    <div class="autumn-left">
                        <img v-real-img="'/api/file/pub/assets/login-box-left-' + bgSuffix + '.png?t=' + new Date().getTime()" alt="">
                    </div>
                    <div class="autumn-right">
                        <img v-real-img="'/api/file/pub/assets/login-box-right-' + bgSuffix + '.png?t=' + new Date().getTime()" alt="" >
                    </div>
                    <div class="loginTittle">{{ loginTitle }}</div>
                    <div id="user">
                        <i :class="'iconfont icon-user ml ml-' + bgSuffix"></i>
                        <input type="text" name="" value="" @keyup.enter="passwordInputfocus(1)" v-model="account"/>
                    </div>
                    <div id="passWord">
                        <i :class="'iconfont icon-lock ml ml-' + bgSuffix"></i>
                        <input type="password" name="" value="" @keyup.enter="login" v-model="password" ref="passwordInput1"/>
                    </div>
                    <div v-if="showForget || true" id="remember">
                        <span @click="forget">忘记密码?</span>
                    </div>
                    <div id="loginBtn" @click="login">登录</div>
                    <div class="text">
                        <span>提示：推荐使用谷歌Chrome浏览器69.0及以上版本。</span>
                        <div>（Chrome 69.0版本下载：<a href="/api/file/pub/software/chrome32_69.0_win.zip" title="点击下载" target="_blank">32位</a>&nbsp;&nbsp;<a href="/api/file/pub/software/chrome64_69.0_win.zip" title="点击下载" target="_blank">64位</a>）</div>
                    </div>
                    <div id="qrcode-green" v-if="showErWeiMa">
                        <div class="guanbi-btn" @click="closeErWeiMa()"><i :class="'iconfont icon-iclose ml ml-' + bgSuffix"></i></div>
                        <div class="erweima-position" ref="erweima" id="erweima">
                            <canvas width="166" height="166" style="display: none;"></canvas><img alt="Scan me!" :src="'/api/file/pub/assets/maintenance-QR-code.png?t=' + new Date().getTime()" style="display: block;">
                        </div>
                        <div class="saoma-text">扫码进入iCan技术支持群</div>
                    </div>
                </div>
                

                <div v-if="showZixun" class="zixun">
                    <span class="zixun_mobile"><i :class="'iconfont icon-phone ml ml-' + bgSuffix"></i> 咨询支持电话：63699949/9613</span>
                    <span class="jishu" @click="getErWeiMa()"><i :class="'iconfont icon-two-dimensional-code ml ml-' + bgSuffix"></i> 技术支持群</span>
                </div>
            </div>
            <div v-if="show" class="visible-md-block" style="margin-top: 50px">
                <div id="login-1" :class="'login-box-bg-' + bgSuffix">
                    <div class="loginTittle">{{ loginTitle }}</div>
                    <div id="user">
                        <i :class="'iconfont icon-user ml ml-' + bgSuffix"></i>
                        <!-- <img src="/static/images/people-green.png" class="ml"/> -->
                        <!-- <img src="/static/images/line-green.png" class="line"/> -->
                        <input type="text" name="" value="" @keyup.enter="passwordInputfocus(2)" v-model="account"/>
                    </div>
                    <div id="passWord">
                        <i :class="'iconfont icon-lock ml ml-' + bgSuffix"></i>
                        <!-- <img src="/static/images/lock-green.png" class="ml"/> -->
                        <!-- <img src="/static/images/line-green.png" class="line"/> -->
                        <input type="password" name="" value="" @keyup.enter="login" v-model="password" ref="passwordInput2"/>
                    </div>
                    <div v-if="showForget" id="remember">
                        <span @click="forget">忘记密码?</span>
                    </div>
                    <div id="loginBtn" @click="login">登录</div>
                    <!-- <div id="qrcode-green" v-if="showErWeiMa">
                        <div class="guanbi-btn" @click="closeErWeiMa()"><img src="/static/images/guanbi-green.png" alt=""></div>
                        <div class="erweima-position" ref="erweima" id="erweima"></div>
                        <div class="saoma-text">扫码进入iCan技术支持群</div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
       
</template>

<script>
    import Base from '@/views/base/Base'
    import UpdatePwd from "@/views/UpdatePwd"
    var jsSHA = require("jssha");
    import Forget from "@/views/Forget"
    var bgSuffix = window.bgSuffix;
    export default {
        name: "Login",
        extends: Base,
        data() {
            window.appv = window.appv || {};
            var loginTitle = window.appv.loginTitle;
            var showZixun = window.appv.showZixun;
            var showForget = window.appv.showForget;
            return {
                account: '',
                password: '',
                marginTop: null,
                showErWeiMa: false,
                bgSuffix: bgSuffix,
                loginTitle: loginTitle,
                showZixun: showZixun,
                showForget: showForget,
                defaultImg: 'this.style.display=none',
                show: false,
            };
        },
        
		mounted () {
			this.account = this.$route.params.id;
            this.$nextTick(() => {
                var h = this.$refs.loginBox.offsetHeight;
                if ((632 + 90) > h) {
                    this.marginTop = '51px';
                };
            });
            setTimeout(() => {     
                this.$nextTick(() => {
                    this.show = true;
                })
            }, 50);
		},
        methods: {
            passwordInputfocus: function(index) {
                this.$refs['passwordInput' + index].focus();
            },
            login: function() {
                try {
                    this.submitHandler((token) => {
                        var salt = token;
                        var password = this.password;
                        var shaObj = new jsSHA("SHA-1", "TEXT");
                        shaObj.update(password);
                        password = shaObj.getHash("B64");
                        password = "{SHA}" + password + salt;
                        var shaObj2 = new jsSHA("SHA-1", "TEXT");
                        shaObj2.update(password);
                        password = "{SHA}" + shaObj2.getHash("B64");
                        this.$store.dispatch('user/LOGIN', {account: this.account, password: password, token: salt}).then(() => {
                            var msg = (this.password == "123" || this.password == "123456") ? "初始密码必须修改" : "";
                            if (msg == "") {
                                msg = /((?=.*\d)(?=.*\D)(?=.*[a-z])(?=.*[A-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$/.test(this.password) ? "" : "您的密码强度过低，请先修改密码";
                            }
                            if (msg != "") {
                                alert(msg);
                                this.$layer.iframe({
                                    content: {
                                        content: UpdatePwd,
                                        parent: this,//当前的vue对象
                                        data: [
                                            
                                        ]
                                    },
                                    area:[((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)*0.3 + "px"), "380px"],
                                    title:"修改密码",
                                });
                                this.resetToken();
                            } else {
                                this.$router.push({
                                    name: 'Home',
                                    params: {
                                        //meetingId: '983b8fcd6a4311e886cc000c29b4d918'
                                    }
                                });
                            }
                        }).catch(() => {
                            // alert("登录失败");
                            this.resetToken();
                        })
                    }, false);
                } catch(err) {
                    console.log(err)
                    this.resetToken();
                }
            },
               
            forget: function() {
                this.$layer.iframe({
                    content: {
                        content: Forget,
                        parent: this,//当前的vue对象
                        data: {
                            username: this.account
                        }
                    },
                    area:["630px", "530px"],
                    title: "忘记密码",
                });
            },
            getErWeiMa: function() {
                this.showErWeiMa = true;
            },
            closeErWeiMa: function() {
                this.showErWeiMa = false;
            }
        }
    }
</script>

<style src="@/assets/css/login.css" scoped></style>
<style scoped>
    /* 蓝色背景 */
	.login-box {
		height:100%;
		width:100%;
		position:absolute;
		background:url(/img/logobj-new.jpg) no-repeat;
		background-size: 100% 100%;
    }
    /* 绿色背景 */
    .login-box-2 {
        height:100%;
		width:100%;
		position:absolute;
		background:url(/img/bg-green.jpg) no-repeat;
		background-size: 100% 100%;
    }
    #login-logo.low-height {
        margin-top: 51px;
    }

</style>





