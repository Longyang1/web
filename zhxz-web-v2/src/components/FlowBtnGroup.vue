<template>
    <div v-if="finish" class="layui-form-item layui-layout-admin">
        <div class="layui-input-block">
            <div class="layui-footer" style="text-align:center;left: 0;">
                <slot v-if="!enableFlow || (enableFlow && (!status || status == 1) || ((!status || status == 1) && createBy == curUser.userId))"></slot>
                <template v-if="enableFlow">
                    <button v-if="btns.indexOf(4) != -1" @click="approve(4)" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #28d88b"><i class="fa fa-check"></i> 通过</button>
                    <button v-if="btns.indexOf(5) != -1" @click="approve(5)" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #ed4014"><i class="iconfont icon-bohui"></i> 驳回</button>
                    <button v-if="btns.indexOf(7) != -1" @click="approve(7)" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #1e88f5"><i class="iconfont icon-zhongxintijiao"></i> 重新提交</button>
                    <button v-if="btns.indexOf(6) != -1" @click="approve(6)" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #ffa024"><i class="iconfont icon-3"></i> 取消申请</button>
                    <button v-if="btns.indexOf(3) != -1" @click="approve(3)" class="layui-btn layui-btn-lg layui-btn-red" style="background-color: #fb8f76"><i class="iconfont icon-butongguo"></i> 不通过</button>
                </template>
                <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
            </div>
        </div>
    </div>
</template>

<script>
import Base from "@/views/base/Base"
import request from '@/utils/request'
import ApprovalModal from './ApprovalModal'

export default {
	extends: Base,
    data() {
        return {
            task: {},
            finish: false,
        }
    },
    computed: {
        btns() {
            let configInfo = this.task.description;
            if (configInfo) {
                let config = JSON.parse(configInfo);
                return (config.btns || '').split(',');
            }
            return [];
        }
    },
    props: {
        processKey: {
            type: String,
            default: ""
        },
        businessKey: {
            type: String,
            default: ""
        },
        status: {
            type: [String, Number],
            default: '1'
        },
        createBy: {
            type: String,
            default: ""
        }
    },
    watch: {
        status() {
            this.init();
        },
        createBy() {
            this.setFormReadonlyFlag();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        approve: function(approveStatus) {
            // 重新提交
            // if (approveStatus == 7) {
            //     confirm('确定重新提交吗？', () => {
            //         this.$parent.submitStatus = 2;
            //         this.$parent.save();
            //     });
            //     return;
            // }
            this.$layer.iframe({
				content: {
					content: ApprovalModal, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                        approveStatus: approveStatus,
                        task: this.task,
                        processKey: this.processKey,
                        businessKey: this.businessKey
					}
				},
				area: ['500px', '384px'],
				title: "审批"
            });
        },
        init: function() {
            if (this.enableFlow && this.status == '2') {
                return new request({
                    url: '/workflow/tasks/running',
                    method: 'get',
                    params: {
                        processKey: this.processKey,
                        businessKey: this.businessKey
                    },
                }).then(res => {
                    this.task = res.data || {};
                    this.setFormReadonlyFlag();
                    this.finish = true;
                }).catch(error => {
                    this.finish = true;
                });
            } else {
                this.finish = true;
                this.setFormReadonlyFlag();
            }
        },
        setFormReadonlyFlag() {
            if (this.status == 1) {
                this.$parent.globalReadonly = (this.createBy != this.curUser.userId);
                return;
            }
            let readonly = false;
            let configInfo = this.task.description || "{}";
            let config = JSON.parse(configInfo);
            if (this.businessKey && !config.edit) {
                readonly = true;
            } else if (this.businessKey && this.task.id && this.task.assignee != this.curUser.userId) {
                readonly = true;
            }
            this.$parent.globalReadonly = readonly;
        },
    }
}
</script>