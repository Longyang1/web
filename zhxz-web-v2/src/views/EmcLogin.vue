<template>
    <div>
        <div class="login_box">
            <div class="visible-lg-block">
                <div class="sys-logo">
                    <img src="/img/emc/sys-logo.png" alt="">
                </div>
                <div id="login">
                    <div class="star">
                        <img src="/img/emc/star.png" alt="">
                    </div>
                    <div class="tab">
                        <a @click="switchLoginType()" href="javascript:;" :class="{'account': true, 'active': loginType == 1}">账号登录</a>
                        <a @click="switchLoginType()" href="javascript:;" :class="{'msg': true, 'active': loginType == 2}">短信登录</a>
                    </div>
                    <!-- <div v-if="loginType == 1" class="login-text">信联科技账号可以直接登录</div> -->
                    <!-- 账号登录状态 -->
                    <div v-show="loginType == 1" class="login-position">
                        <div id="user">
                            <img src="/img/emc/grey-person.png" class="ml"/>
                            <img src="/img/emc/grey-line.png" class="line"/>
                            <input type="text" name="" id="userInput" @keyup.enter="passwordInputfocus(1)" v-model="account" placeholder="请输入账号"/>
                        </div>
                        <div id="passWord">
                            <img src="/img/emc/grey-lock.png" class="ml"/>
                            <img src="/img/emc/grey-line.png" class="line"/>
                            <input type="password" name="" id="passWordInput" @keyup.enter="passwordInputfocus(2)" v-model="password" ref="passwordInput1" placeholder="请输入密码"/>
                        </div>
                        <div class="securityCode-out" style="overflow:hidden">
                            <div id="securityCode">
                                <input type="" v-model="icode" @keyup.enter="login" ref="passwordInput2" placeholder="请输入验证码" />
                            </div>
                            <div id="randomCode" style="float: right;padding-right: 4px;">
                                <img style="border-radius: 5px;" @click="refreshCaptcha" :src="url"/>
                            </div>
                        </div>
                        <div id="loginBtn" @click="login">登 录</div>
                    </div>
                    <!-- 短信登录状态 -->
                    <div v-show="loginType == 2" class="login-position">
                        <div id="user">
                            <img src="/img/emc/grey-person.png" class="ml"/>
                            <img src="/img/emc/grey-line.png" class="line"/>
                            <input type="text" v-model="mobile" id="userInput" value="" placeholder="请输入手机号" />
                        </div>
                        <div id="securityCode-Float">
                            <input type="" v-model="code" placeholder="请输入短信验证码" />
                        </div>
                        <div id="getSecurity">
                            <a @click="getSmsCode" href="javascript:;" class="btn_yz">{{ getMobileCodeText() }}</a>
                        </div>
                        <div id="loginBtn" @click="login">登 录</div>
                    </div>
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
    import { getMobileSmsCode, getCaptcha } from "@/api/user"

    var bgSuffix = window.bgSuffix;
    export default {
        name: "Login",
        extends: Base,
        data() {
            return {
                account: '',
                password: '',
                mobile: '',
                code: '',
                loginType: 1,
                codeUid: '',
                icode: '',
                wait_timer: false,
                url: '',
            };
        },

		mounted () {
            this.refreshCaptcha();
		},
        methods: {
            refreshCaptcha() {
                getCaptcha(this.codeUid).then(response => {
                    this.codeUid = response['headers']['captcha-uid'];
                    let data = response.data;
                    if (data.size == 0) {
                        return;
                    }
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.url = e.target.result || "";
                    };
                    reader.readAsDataURL(data);
                });
            },
            // 验证码倒计时显示内容
            getMobileCodeText: function() {
                if (this.wait_timer > 0) {
                    $('.btn_yz').addClass('layui-btn-disabled').attr('disabled', "true");
                    return this.wait_timer + "s后获取";
                }

                if (this.wait_timer === 0) {
                    $('.btn_yz').removeClass('layui-btn-disabled').removeAttr('disabled', "false");
                    return "重新获取";
                }

                if (this.wait_timer === false) {
                    return "获取验证码";
                }
            },
            getSmsCode() {
                if ($('.btn_yz').hasClass('layui-btn-disabled')) {
                    return;
                }
                if (!this.mobile) {
                    msg("手机号不能为空");
                    return;
                }

                // 加载层-风格4
                var layId = layer.msg("验证码获取中", {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });

        
                getMobileSmsCode(this.mobile, 'Tx').then(res => {
                    layer.close(layId);
                    alert(res.msg);
                    // 验证码倒计时
                    var that = this;
                    this.wait_timer = 120;
                    var timer_interval = setInterval(function() {
                        if (that.wait_timer > 0) {
                            that.wait_timer--;
                        } else {
                            clearInterval(timer_interval);
                        }
                    }, 1000);
                }).catch(error => {
                    // alert("获取验证码超时，获取失败。");
                    layer.close(layId);
                });
                
            },
            switchLoginType() {
               this.loginType = this.loginType == 1 ? 2 : 1; 
            },
            login: function() {
                if (this.loginType == 1) {
                    this.accountPasswordLogin();
                } else {
                    this.mobileLogin();
                }
            },
            accountPasswordLogin() {
                if (!this.account) {
                    msg("帐号不能为空");
                    return;
                }

                if (!this.password) {
                    msg("帐号不能为空");
                    return;
                }

                if (!this.icode) {
                    msg("验证码不能为空");
                    return;
                }
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
                        this.$store.dispatch('user/LOGIN', {account: this.account, password: password, captcha: this.icode, codeUid: this.codeUid, token: salt}).then(() => {
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
                        }).catch((error) => {
                            this.refreshCaptcha();
                            this.resetToken();
                        })
                    }, false);
                } catch(err) {
                    console.log(err)
                    this.resetToken();
                }
            },
            mobileLogin() {
                if (!this.mobile) {
                    msg("手机号不能为空");
                    return;
                }
                if (!this.code) {
                    msg("验证码不能为空");
                    return;
                }
                this.$store.dispatch('user/MOBILE_LOGIN', {mobile: this.mobile, code: this.code}).then(() => {
                    this.$router.push({
                        name: 'Home',
                        params: {}
                    });
                });
            },
            randomColor: function() {
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                return "rgb(" + r + "," + g + "," + b + ")";
            },
            draw: function(show_num) {
                var canvas_width=$('#canvas').width();
                var canvas_height=$('#canvas').height();
                var canvas = document.getElementById("canvas");//获取到canvas的对象，演员
                var context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
                canvas.width = canvas_width;
                canvas.height = canvas_height;
                var sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
                var aCode = sCode.split(",");
                var aLength = aCode.length;//获取到数组的长度
                
                for (var i = 0; i <= 3; i++) {
                    var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
                    var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
                    var txt = aCode[j];//得到随机的一个内容
                    show_num[i] = txt.toLowerCase();
                    var x = 10 + i * 20;//文字在canvas上的x坐标
                    var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
                    context.font = "bold 23px 微软雅黑";
        
                    context.translate(x, y);
                    context.rotate(deg);
        
                    context.fillStyle = this.randomColor();
                    context.fillText(txt, 0, 0);
        
                    context.rotate(-deg);
                    context.translate(-x, -y);
                }
                for (var i = 0; i <= 5; i++) { //验证码上显示线条
                    context.strokeStyle = this.randomColor();
                    context.beginPath();
                    context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
                    context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
                    context.stroke();
                }
                for (var i = 0; i <= 30; i++) { //验证码上显示小点
                    context.strokeStyle = this.randomColor();
                    context.beginPath();
                    var x = Math.random() * canvas_width;
                    var y = Math.random() * canvas_height;
                    context.moveTo(x, y);
                    context.lineTo(x + 1, y + 1);
                    context.stroke();
                }
            },
            passwordInputfocus: function(index) {
                this.$refs['passwordInput' + index].focus();
            },

        }
    }
</script>

<style scoped>
    .login_box {
		height:100%;
		width:100%;
		position:absolute;
		background:url(/img/emc/emcBg.png) no-repeat;
		background-size: 100% 100%;
    }
    .sys-logo {
        width: 500px;
        margin: 0 auto;
        margin-top: 170px;
    }
    #login {
        position: relative;
        left: 50%;
        width: 596px;
        height: 410px;
        transform: translate(-50%);
        margin-top: 26px;
        background: #fff;
        text-align: center;
        /* padding: 39px 122px 31px 122px; */
    }
    #user {
        margin-top: 20px;
    }

    #user,
    #passWord {
        width: 348px;
        height: 45px;
        background:  #fff;
        border-radius: 5px;
        margin-bottom: 20px;
        overflow: hidden;
        border:1px solid rgba(126,133,137,1);
    }
    #securityCode-Float, #securityCode {
        width: 210px;
        height: 45px;
        background:  #fff;
        border-radius: 5px;
        margin-bottom: 20px;
        overflow: hidden;
        border:1px solid rgba(126,133,137,1);
        margin-right: 10px;
        line-height: 45px;
    }
    #securityCode-Float {
        float: left;
    }
    #securityCode-Float input {
        line-height: 45px;
    }
    #securityCode {
        float: left;
    }
    #getSecurity {
        margin-bottom: 20px;
    }
    #getSecurity a {
        display: inline-block;
        padding: 15px 20px;
        color: #696D6F;
        background: #EFEFEF;
        border-radius: 5px;
    }

    #passWord input,
    #user input {
        outline: none;
        box-sizing: border-box;
        width: 280px;
        line-height: 45px;
        color: #989C91;
        float: left;
        border: none;
    }

    input:-webkit-autofill {
        -webkit-text-fill-color: #989C91 !important;
        transition: background-color 5000s ease-in-out 0s;
    }
    #user .ml {
        font-size: 22px;
    }
    #passWord .ml {
        font-size: 15px;
        padding-left: 15px !important;
        padding-right: 17px !important;
        padding-top: 14px !important;
    }
    #user .ml,
    #passWord .ml {
        float: left;
        padding: 0 15px;
        padding-top: 12px;
    }
    .line {
        height: 33px;
        margin-right: 10px;
    }
    #user .line,
    #passWord .line {
        float: left;
        padding-top: 12px;
    }
    #loginBtn {
        width: 348px;
        height: 45px;
        background:rgba(239,239,239,1);
        box-shadow: 0px 0px 5px 0px rbga(25, 84, 174, 0.85);
        border-radius: 5px;
        /* margin-top: 38px; */
        margin-bottom: 15px;
        font-size: 16px;
        font-family: 'Microsoft YaHei';
        line-height: 45px;
        color: #444749;
        cursor: pointer;
    }
    .account, .msg {
        display: inline-block;
        /* width: 298px; */
        height: 60px;
        font-size: 16px;
        padding: 16px 116px;
    }
    .active {
        background:#FF7B80;
        color: #fff!important;
    }
    .msg {
        color: #000;
    }
    .login-text {
        color: #989C91;
        margin-top: 25px;
    }
    .login-position {
        padding: 0px 122px 31px 122px;
    }
    .grey-line {
        display: inline-block;
        width: 1px;
        height: 3px;
        color: #7E8589;
    }
    .star {
        position: absolute;
        right: -88px;
        bottom: 66px;
    }
    #randomCode {
        margin-bottom: 20px;
    }
    #canvas {
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
    }
</style>