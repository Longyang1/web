<template>
    <div class="view-product" v-cloak>
        <div class="">
            <layui-form>
                <dd>
                    <div style="padding-left:20px;padding-top: 20px ">
                        <layui-item>
                            <div id="d1">
                                <span id="s1"> 任务进度</span></div>
                            <div id="d2">
                                <div lay-showpercent="true" lay-filter="sign-bar" class="layui-progress"
                                     style="margin: 20px 20px;width:88%">
                                    <div lay-percent="0%" class="layui-progress-bar"
                                         :style="{'background-color': 'rgb(24, 144, 255)', width:wtWorkTaskInfo.workPercent+'%'}">
                                    </div>
                                    <span style="left: 100%;position: relative;top: -5px">{{wtWorkTaskInfo.workPercent}}%</span>
                                </div>
                            </div>
                        </layui-item>

                        <layui-item>
                            <layui-inline-textarea
                                label="完成说明"
                                style="width: 97%"
                                v-model="wtFeedbackInfo.feedbackContent"
                                layVerify="required"
                            ></layui-inline-textarea>
                        </layui-item>
                    </div>
                </dd>
                <div style="margin-top: 30px">
                    <layui-inline class="btn-group-center">
                        <button style="color: white" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit
                                lay-filter="saveWtFeedbackInfo"><i
                            class="fa fa-save"></i>&nbsp; 提交
                        </button>
                        <button style="color: white" class="layui-btn layui-btn-lg layui-btn-red"
                                @click="closeIframe()"><i
                            class="fa fa-close"></i>&nbsp;关闭
                        </button>
                    </layui-inline>
                </div>
            </layui-form>
        </div>
    </div>
</template>

<script>
    import {confirmCompleted} from '@/api/work/wtWorkTaskInfo'
    import BaseModal from '@/views/base/BaseModal'

    export default {
        name: 'WtWorkConfirmCompleted',
        extends: BaseModal,
        data() {
            return {
                wtFeedbackInfo: {
                    id: this.$route.params.id,
                    workTaskInfoId: '',
                    feedbackPercent: '',
                    confirmCompleteFlag: '',
                    feedbackContent: '',
                },
	            wtWorkTaskId:'',
            }
        },
        props: {
            wtWorkTaskInfo: {
                type: Object,
                default: null
            },
            fromWtTaskListFlag: {
                type: Boolean,
                default: false
            },
            fromBoardPageFlag: {
                type: Boolean,
                default: false
            },
        },
        computed: {},
        watch: {},
        mounted() {
            this.wtWorkTaskId =  this.wtWorkTaskInfo.id;
            this.wtFeedbackInfo.workTaskInfoId = this.wtWorkTaskInfo.id;
            this.wtFeedbackInfo.feedbackPercent = this.wtWorkTaskInfo.workPercent;
            this.$nextTick(() => {
                this.layuiInit();
            });
        },
        methods: {
            save: function () {
                var _this = this;
                console.log(this.wtWorkTaskInfo);
                this.submitHandler((token) => {
                    confirmCompleted(JSON.stringify(this.wtFeedbackInfo),this.wtWorkTaskId, token).then(result => {
                        alert(result.msg);
                        this.$layer.closeAll();
                        this.$parent.initData();
                        _this.$parent.$parent.updateMenuNum('WtWorkTaskInfoList', 'sub', 1);
                        _this.$parent.$parent.closeTabByName("WtDealWorkTaskInfo");
                        if (_this.fromWtTaskListFlag) {
                            _this.$parent.$parent.closeTabByName("WtWorkTaskInfoList");
                            _this.hrefMenu("WtWorkTaskInfoList", "个人工作任务", "fa-user");
                        } else if (_this.fromBoardPageFlag) {
                            _this.$parent.$parent.closeTabByName("WtWorkTaskInfoBoard");
                            _this.hrefMenu("WtWorkTaskInfoBoard", "工作任务看板", "fa-user");
                        }
                    }).catch((error) => {
                        this.resetToken(error);
                    });
                })
            },

            closeIframe: function () {
                this.$layer.closeAll();
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
                });
            }
        }
        ,
    }

</script>
<style scoped>
	#d1 {
		text-align: center;
		float: left;
		border: 1px solid #e6e6e6;
		width: 110px;
		height: 38px;
		background-color: #fbfbfb;
	}

	#d2 {
		border: 1px solid #e6e6e6;
		width: 498px;
		height: 38px;
		margin-left: 109px;
	}

	#s1 {
		position: relative;
		top: 8px;

	}
</style>
