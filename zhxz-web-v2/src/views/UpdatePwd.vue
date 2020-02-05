<template>
  <div class="view-product" style="overflow-y: hidden;">
        <div>
            <div class="ibox-content" style="padding-top: 20px">
                <layui-form style="text-align: center;">
                    <layui-item>
                        <layui-inline-input
                                label="旧密码"
                                type="password"
                                placeholder="旧密码"
                                lay-verify="required"
                                v-model='originalPwd'
                        ></layui-inline-input>
                    </layui-item>
                    <layui-item>
                        <layui-inline-input
                                label="新密码"
                                placeholder="新密码"
                                type="password"
                                lay-verify="required"
                                v-model='newPwd'
                        ></layui-inline-input>
                    </layui-item>
                    <layui-item>
                        <layui-inline-input
                                label="确认新密码"
                                type="password"
                                placeholder="确认新密码"
                                lay-verify="required"
                                v-model='surePwd'
                        ></layui-inline-input>
                    </layui-item>
                    <hr class="layui-bg-blue" style="margin-bottom: 8px">
                    <div>
                        <ul class="pwd-rule">
                            <li style="font-weight: bold;">密码规则：</li>
                            <li>1. 密码长度：8-20位；</li>
                            <li>2. 密码格式：必须包含大写字母、小写字母和数字，并且符合安全规定。</li>
                            <li></li>
                        </ul>
                    </div>
                    <layui-inline :style="{width:'100%'}">
                        <div style="text-align:center;padding: 4px 0px;">
                            <button class="layui-btn layui-btn-lg layui-btn-blue" @click="saveUpatePwd()" ><i class="fa fa-save"></i> 保存</button>
                            <button class="layui-btn layui-btn-lg layui-btn-red" @click="closeUpdateFrame()"><i class="fa fa-times"></i> 关闭</button>
                        </div>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { updatePwd, updatePwdLogout } from '@/api/user'
import {formatDate} from "@/utils/formatUtils";
//import jssha from 'jssha';
var jsSHA = require("jssha");

import BaseModal from '@/views/base/BaseModal';

    export default {
        extends: BaseModal,
        data() {
            return {
               originalPwd:null,
               newPwd:null,
               surePwd:null,
            }
        },
        computed: {
            
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData: function () {
               var vParent = this.$parent;
            },
            closeUpdateFrame:function(){
              this.$layer.close(this.layerid);
            },
            saveUpatePwd: function(){
                if(this.originalPwd=="" || this.originalPwd==null){
                    alert("旧密码不能为空");
                    return;
                }
                if(this.newPwd=="" || this.newPwd==null){
                    alert("新密码不能为空");
                    return;
                }
                if(this.surePwd=="" || this.surePwd==null){
                    alert("确认密码不能为空");
                    return;
                }
                if(this.originalPwd==this.newPwd){
                    alert("新密码和旧密码不能一样");
                    return;
                }
                if(this.surePwd!=this.newPwd){
                    alert("新密码和确认密码不一致");
                    return;
                }
                this.submitHandler((token) => {
                    var originalPwd=this.originalPwd;
                    var newPwd = this.newPwd;
                    var surePwd = this.surePwd;

                    var salt= token; 
                    var shaObj = new jsSHA("SHA-1", "TEXT");
                    shaObj.update(originalPwd);
                    originalPwd = shaObj.getHash("B64");
                    originalPwd = "{SHA}"+originalPwd+salt;
                    var shaObj2 = new jsSHA("SHA-1", "TEXT");
                    shaObj2.update(originalPwd);
                    originalPwd="{SHA}" + shaObj2.getHash("B64");
                    var params = {originalPwd:originalPwd,newPwd:newPwd,surePwd:surePwd};
                    updatePwd(params, token).then(result => {
                        var router = this.$router;
                        alert("密码修改成功，请使用新密码重新登录系统！");
                        var interval= setInterval(() => {
                            updatePwdLogout().then(() => {
                               location.reload();
                            }).catch(() => { })
                            clearInterval(interval);
                        }, 2000);
                    }).catch((error) => {
                        this.resetToken(error);
                    });
                });
            }
        }, 
        filters: {
            formatDate(dateTime) {
                let date = new Date(dateTime);
                return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
            },
            formatDate1(dateTime) {
                let date = new Date(dateTime);
                return formatDate(date, 'YYYY')
            },
        },
        watch: {},
    }
</script>

<style scoped>
    .pwd-rule {
        text-align: left;
    }
    .pwd-rule li {
        padding-bottom: 4px;
    }
</style>
