<template>
    <div class="view-product" v-cloak>
        <div class="">
            <layui-form>
                <dd>
                    <div style="padding-left:20px;padding-top: 20px ">
                        <layui-item>
                            <!--<h5> <i class="fa fa-file-text-o text-warning"></i><b style="margin-left:5px">反馈内容</b></h5>
                            <hr/>-->
                            <layui-inline-input
                                label="任务反馈人"
                                v-model="feedbackUser.realName"
                                :readonly=true
                                :cssStyle="{width:'466px'}"
                            ></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <div style="margin-right: 20px">
                                <layui-inline-radio
                                    label="处理状态"
                                    :items="processState"
                                    v-model="processStateValue"
                                ></layui-inline-radio>
                            </div>
                        </layui-item>

                       <!-- <layui-item>
                            <layui-inline-mutil-select
                                label="通知人员"
                                :items="allParticipantsTask"
                                v-model="informStaffIds"
                                :width="466"
                            >
                            </layui-inline-mutil-select>
                        </layui-item>-->

                        <layui-item>
                            <layui-inline-textarea
                                label="反馈说明"
                                v-model="wtFeedbackInfo.feedbackContent"
                                style="width: 606px"
                                layVerify="feedbackContent"
                            ></layui-inline-textarea>
                        </layui-item>

                        <!--<h3>附件：</h3>-->
                        <file-upload
                            style="padding-right: 15px"
                            :attachmentBusinessId='wtFeedbackInfo.workTaskInfoId'
                            attachmentBusinessType="wt_work_task_info"
                            module="work"
                            ref="fileUpload"
                            :notInModal="false"/>
                    </div>

                </dd>
                <div style="margin-top: 20px;">
                    <layui-inline class="btn-group-center">
                        <button style="color: white" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit
                                lay-filter="saveWtFeedbackInfo"><i
                            class="fa fa-save"></i>&nbsp; 提交
                        </button>
                        <button style="color: white" class="layui-btn layui-btn-lg layui-btn-red"
                                @click="closeIframe()"><i
                            class="fa fa-close"></i>&nbsp;
                            关闭
                        </button>
                    </layui-inline>
                </div>
            </layui-form>
        </div>
    </div>
</template>
<script>
    import {taskProgressFeedback} from '@/api/work/wtWorkTaskInfo'
    import BaseModal from '@/views/base/BaseModal'

    export default {
        name: 'WtWorkTaskInfoFeedback',
        extends: BaseModal,
        data() {
            return {
                wtFeedbackInfo: {
                    id: null,
                    workTaskInfoId: '',
                    workTaskMemberId:'',
                    memberUserId: '',
                    workTaskFeedbackType: '',
                    workTaskFeedbackTypeDict: '',
                    feedbackTime: '',
                    feedbackContent: '',
                    feedbackPercent: 0,
                    confirmCompleteFlag: '',
                    attachmentFlag: '',
                },
                processStateValue:'',
                processState: [{
                    value: 'n',
                    label: '任务仍在进行中'
                },
                    {
                        value: 'y',
                        label: '我的任务已完成'
                    }],
                informStaffIds: [],
                feedbackUser:{},
            }
        },
        props: {
            wtWorkTaskInfo: {
                type: Object,
                default: null
            },
            isAttachment: {
                type: String,
                default: null
            },
            participants: {
                type: Array,
                default: null
            },
        },
        computed: {},
        watch: {
            "processStateValue": function () {
                if (this.processStateValue == 'n') {
                    alert("提示：处理状态为”任务仍在进行中“将不会改变任务整体进度。");
                }
                if (this.processStateValue == 'y') {
                    alert("提示：处理状态为”我的任务已完成“会改变任务整体进度。");
                }
            }
        },
        mounted() {
            this.initData();
            this.$nextTick(() => {
                this.layuiInit();
            });
        },
        methods: {
            initData:function(){
                this.feedbackUser = this.curUser;
                this.wtFeedbackInfo.workTaskInfoId = this.wtWorkTaskInfo.id;
                this.wtFeedbackInfo.memberUserId = this.feedbackUser.userId;
                this.wtFeedbackInfo.workTaskMemberId = this.feedbackUser.userId;
            },
            //关闭iframe层
            closeIframe: function () {
                this.$layer.closeAll();
            },
            save: function () {
                console.log(this.wtFeedbackInfo);
                if (!this.processStateValue) {
                    msg("请选择处理状态");
                    return;
                }
                console.log("反馈任务附件" + this.$refs.fileUpload.getAttamentIds());
                if (this.$refs.fileUpload.getAttamentIds()) {
                    this.wtFeedbackInfo.attachmentFlag = 'y';
                }
                this.submitHandler((token) => {
                    taskProgressFeedback(JSON.stringify(this.wtFeedbackInfo),
                        this.processStateValue,
                        JSON.stringify(this.$refs.fileUpload.getAttamentIds()), token).then(result => {
                        alert(result.msg);
                        this.$layer.closeAll();
                        this.$parent.initData();
                        // this.$parent.$parent.closeTabByName("WtDealWorkTaskInfo");
                        /*if (this.fromWtTaskListFlag) {
                            this.$parent.$parent.closeTabByName("WtWorkTaskInfoList");
                            this.hrefMenu("WtWorkTaskInfoList", "个人工作任务", "fa-user");
                        } else if (this.fromBoardPageFlag) {
                            this.$parent.$parent.closeTabByName("WtWorkTaskInfoBoard");
                            this.hrefMenu("WtWorkTaskInfoBoard", "工作任务看板", "fa-user");
                        }*/
                    }).catch((error) => {
                        this.resetToken(error);
                    });
                })
            },
            hrefMenu: function (name, text, icon) {
                // console.log(menUrl+"............")
                this.$parent.$parent.clickMenu({
                    "checked": false,
                    "icon": icon,
                    "id": "",
                    "name": name,
                    "parentId": "4",
                    "text": text,
                    "children": []
                }, 3, {});
            },
            layuiInit: function () {
                var _this = this;
                layui.use(["form"], function () {
                    var form = layui.form;
                    form.on("submit(saveWtFeedbackInfo)", function (data) {
                        _this.save();
                        return false;
                    });
                    form.verify({
                        feedbackContent: function (value) {
                            if (value.trim().length === 0) {
                                return '请详细说明进展情况';
                            }
                        },
                        content: function (value) {
                            layedit.sync(editIndex);
                        }
                    });

                });
            }
        }
    }
</script>
