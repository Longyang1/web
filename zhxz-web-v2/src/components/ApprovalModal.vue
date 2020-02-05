<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content" style="padding-right: 20px;padding-top: 20px">
                <layui-form>
                    <layui-item v-if="nextTaskName && approveStatus != 6">
                        <layui-inline-input
                            label="审批环节"
                            :value="nextTaskName"
                            :readonly="true"
                            :block='true'></layui-inline-input>
                    </layui-item>
                    <layui-item v-if="selectApproverType != 'none' && (submitFlow || approveStatus == 4 || approveStatus == 7)">
                        <select-user-input
                            v-if="selectApproverType == 'one'"
                            label="审批人"
                            :block='true'
                            lay-verify='required'
                            v-model="approver"></select-user-input>
                    </layui-item>
                    <layui-item v-if="!submitFlow">
                        <layui-inline-textarea
                            label="意见" 
                            v-model="comment"
                            :disabled="false"
                            :lay-verify='(approveStatus == 3 || approveStatus == 5) ? "required" : ""'
                            placeholder="请输入意见"></layui-inline-textarea>
                    </layui-item>
					<layui-inline v-show="false" class="btn-group-center">
                        <button ref="approveBtn" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="approveBtn"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
            <div class="layui-footer">
                <button v-if="submitFlow" @click="toClick('approveBtn')" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #28d88b"><i class="fa fa-check"></i> 提交</button>
                <button v-if="approveStatus == 4" @click="toClick('approveBtn')" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #28d88b"><i class="fa fa-check"></i> 通过</button>
                <button v-if="approveStatus == 5" @click="toClick('approveBtn')" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #ed4014"><i class="iconfont icon-bohui"></i> 驳回</button>
                <button v-if="approveStatus == 7" @click="toClick('approveBtn')" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #1e88f5"><i class="iconfont icon-zhongxintijiao"></i> 重新提交</button>
                <button v-if="approveStatus == 6" @click="toClick('approveBtn')" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #ffa024"><i class="iconfont icon-3"></i> 取消申请</button>
                <button v-if="approveStatus == 3" @click="toClick('approveBtn')" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #fb8f76"><i class="iconfont icon-butongguo"></i> 不通过</button>
                <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
            </div> 
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import BaseModal from "@/views/base/BaseModal"
import request from '@/utils/request'
import bus from '@/assets/js/event.js'
import qs from 'qs'

export default {
	extends: BaseModal,
    data () {
        return {
            initAfter: false,
            approver: '',
            comment: this.approveStatus == 4 ? '同意。' : '',
            nextTaskName: this.submitFlow ? this.taskName : '',
            selectApproverType: 'one'
        }
	},
	props: {
	    layerid: {
			type: String,
			default: null
        },
        approveStatus: {
			type: [Number, String],
			default: null
        },
        task: {
            type: Object,
            default: () => {
                return {};
            }
        },
        processKey: {
            type: String,
            default: ""
        },
        businessKey: {
            type: String,
            default: ""
        },
        submitFlow: {
            type: Boolean,
            default: false
        },
        taskName: {
            type: String,
            default: ""
        },
	},
    computed: {
       	
	},
	watch: {
        
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        approve: function() {
            if (this.submitFlow) {
                if (this.$parent.trueSelectApproverAfter) {
                    this.$parent.trueSelectApproverAfter(this.approver, this.layerid);
                }
                return;
            }
            // 重新提交
            if (this.approveStatus == 7) {
                confirm('确定重新提交吗？', () => {
                    let parent = this.$parent;
                    while(parent) {
                        if (parent.save) {
                            parent.submitStatus = 2;
                            parent.approver = this.approver;
                            parent.taskComment = this.comment;
                            parent.save();
                            return;
                        }
                        parent = parent.$parent;
                    }
                });
                return;
            }
            confirm("确定提交吗？", () => {
                this.submitHandler((token) => {  
                    loading();
                    return new request({
                        url: '/workflow/tasks/' + this.task.id + "/complete",
                        method: 'post',
                        data: qs.stringify({
                            comment: this.comment,
                            assignee: this.approver,
                            approved: this.approveStatus,
                        }),
                        headers: {
                            token
                        },
                    }).then(res => {
                        alert(res.msg);
                        this.refreshFormView();
                        closeLoading();
                        this.$layer.close(this.layerid);
                    }).catch(error => {
                        closeLoading();
                        this.resetToken();
                    });
                });
            });
        },
        refreshFormView: function() {

            this.$parent.init();

            let parent = this.$parent;
            while(parent && !parent.initData) {
                parent = parent.$parent;
            }
            if (parent) {
                parent.initData();
            }

            bus.$emit('flowRefresh', {
                processKey: this.processKey,
                businessKey: this.businessKey
            });
        },
        initData: function() {
            let configInfo = this.task.description || "{}";
            let config = JSON.parse(configInfo);
            let approveConfig = config[this.approveStatus];
            if (approveConfig) {
                this.selectApproverType = approveConfig['approver'] || 'one';
                this.nextTaskName = approveConfig['nextTaskName'];
            }
            
            if (false) {
               
            } else {
                this.initAfter = true;
            }
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form'], function(){
        		var element = element
        		,form = layui.form;

				//自定义验证规则
				form.verify({
					title: function(value){
					    if(value.length < 10){
					    	return '标题至少得10个字符哟';
					    }
					}
					,content: function(value){
					    layedit.sync(editIndex);
					}
				});

				form.on('submit(approveBtn)', function(data){
					_this.approve();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
.layui-footer {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    background-color: #eee;
}
.view-product /deep/ .layui-form-item.layui-form-text, .view-product /deep/ .layui-form-item.layui-form-text {
    padding-right: 0px!important;
}
</style>