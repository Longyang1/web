<template>
    <div class="view-product" style="overflow-y: hidden;">
        <div>
            <div class="ibox-content" style="padding-top: 20px">
                <layui-form style="text-align: center;">
                    <layui-item>
                        <layui-inline-input
                            label="OA账号"
                            placeholder="OA账号"
                            lay-verify="required"
                            v-model="account"
                        ></layui-inline-input>
                    </layui-item>
                    <div class="layui-form layui-form-pane">
                        <div class="layui-form-item" style="padding-left: 112px;">
                            <div class="layui-inline">
                                <label title="验证码" class="layui-form-label layui-required">{{ enableSms ? '短信验证码' : '邮件验证码' }}</label>
                                <div class="layui-input-block">
                                    <input
                                        v-model="code"
                                        lay-verify="required"
                                        autocomplete="off"
                                        placeholder="验证码"
                                        class="layui-input"
                                        style="width: 192px;margin-right: 8px;"
                                    >
                                </div>
                            </div>
                            <button
                                @click="getCode"
                                class="layui-btn layui-btn-primary btn_yz"
                                style="float: right;margin-right: 12px;display: block;width: 100px;"
                            >{{ getMobileCodeText() }}</button>
                        </div>
                    </div>
                    <layui-item class="autofill_color">
                        <layui-inline-input
                            label="新密码"
                            placeholder="新密码"
                            type="password"
                            lay-verify="required"
                            v-model="newPwd"
                        ></layui-inline-input>
                    </layui-item>
                    <layui-item>
                        <layui-inline-input
                            label="确认新密码"
                            type="password"
                            placeholder="确认新密码"
                            lay-verify="required"
                            v-model="surePwd"
                        ></layui-inline-input>
                    </layui-item>
                    <hr class="layui-bg-blue" style="margin-bottom: 8px">
                    <div>
                        <ul class="pwd-rule">
                            <li style="font-weight: bold;">提示：</li>
                            <li>1. 输入正确的账号，获取{{ enableSms ? '短信验证码' : '邮件验证码' }}操作才能正常进行（{{ enableSms ? '短信验证码' : '邮件验证码' }}有效期为{{ enableSms ? '5' : '10' }}分钟）；</li>
                            <li>2. 密码长度：8-20位；</li>
                            <li>3. 密码格式：必须包含大写字母、小写字母和数字，并且符合行内安全规定。</li>
                            <li></li>
                        </ul>
                      <ul class="pwd-rule">
                        <li style="font-weight: bold;color:red">注意：</li>
                        <li>重置密码还可直接联系管理员：刘帅（63699949，13810474041）、王敏（63699613，18500063356）。</li>
                      </ul>
                    </div>
                    <layui-inline :style="{width:'100%'}">
                        <div style="text-align:center;padding: 4px 0px;">
                            <button
                                class="layui-btn layui-btn-lg layui-btn-blue"
                                @click="resetPwd()"
                            >
                                <i class="fa fa-repeat"></i> 重置密码
                            </button>
                            <button
                                class="layui-btn layui-btn-lg layui-btn-red"
                                @click="closeUpdateFrame()"
                            >
                                <i class="fa fa-times"></i> 关闭
                            </button>
                        </div>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
    </div>
</template>

<script>
import { getEmailCode, getSmsCode, resetPwd } from "@/api/user";

import BaseModal from "@/views/base/BaseModal";
const enableSms = window.enableSms || false;

export default {
    extends: BaseModal,
    data() {
        return {
            account: this.username,
            newPwd: null,
            surePwd: null,
            code: null,
            wait_timer: false,
            enableSms: enableSms,
        };
    },
    props: {
        username: {
            type: String,
            default: ""
        }
    },
    mounted() {
        
    },
    methods: {
        closeUpdateFrame: function() {
            this.$layer.close(this.layerid);
        },
        resetPwd: function() {
            confirm("确定重置密码吗？", () => {
                //加载层-风格4
                var layId = layer.msg("重置密码中", {
                    icon: 16,
                    shade: 0.01
                });
                resetPwd(this.account, this.newPwd, this.surePwd, this.code).then(res => {
                    layer.close(layId);
                    alert(res.msg);
                    this.closeUpdateFrame();
                }).catch(error => {
                    layer.close(layId);
                });
            });
        },
        getCode: function() {
            // 加载层-风格4
            var layId = layer.msg("验证码获取中", {
                icon: 16,
                shade: 0.01,
                time: 0
            });

            if (!this.enableSms) {
                getEmailCode(this.account, '').then(res => {
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
            } else {
                getSmsCode(this.account, 'Tx').then(res => {
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
            }
        },
        // 验证码倒计时显示内容
        getMobileCodeText: function() {
            if (this.wait_timer > 0) {
                $('.btn_yz').addClass('layui-btn-disabled').attr('disabled',"true");
                return this.wait_timer + "s后获取";
            }

            if (this.wait_timer === 0) {
                $('.btn_yz').removeClass('layui-btn-disabled').removeAttr('disabled',"false");
                return "重新获取";
            }

            if (this.wait_timer === false) {
                return "获取验证码";
            }
        }
    }
};
</script>

<style scoped>
.pwd-rule {
    text-align: left;
}
.pwd-rule li {
    padding-bottom: 4px;
}
input:-webkit-autofill {
    -webkit-text-fill-color: #354e6a !important;
  transition: background-color 5000s ease-in-out 0s;
}
.autofill_color /deep/ .layui-input {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
}

</style>
