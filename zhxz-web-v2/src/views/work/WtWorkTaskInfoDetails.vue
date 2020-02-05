<template>
    <div class="view-product">
        <div class="info-center">
            <!-- manage-head -->
            <div class="manage-head-div">
                <div class="manage-head row">
                    <h6 class="padding-left manage-head-title col-sm-10">处理任务</h6>
                </div>
                <div class="layui-input-inline">
                    <span>
                      <button v-if="showFeedBackBtn" @click="taskFeedback()" type="button"
                              class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px;">
                          <i class="fa fa-spinner" aria-hidden="true"></i>&nbsp;&nbsp;进度反馈
                      </button>
                  </span>

                 <!--   <button v-if="createByOperate" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                        <i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;任务修改
                    </button>
                    <span>
                  <button v-if="showFeedBackBtn" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                      <i class="fa fa-exchange" aria-hidden="true"></i>&nbsp;&nbsp;任务转办
                  </button>
                  </span>
                    <span>
                  <button v-if="isSponsor" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                      <i class="fa fa-child" aria-hidden="true"></i>&nbsp;&nbsp;人员调整
                  </button>
                   </span>
                    <span>
                      <button v-if="createByOperate" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                          <i class="fa fa-lock" aria-hidden="true"></i>&nbsp;&nbsp;任务锁定
                      </button>
                    </span>
                    <span>
                      <button v-if="createByOperate" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                          <i class="fa fa-unlock" aria-hidden="true"></i>&nbsp;&nbsp;任务解锁
                      </button>
                    </span>-->
                    <span>
                      <button v-if="createByOperate && wtWorkTaskInfo.workPercent=='100' && wtWorkTaskInfo.workTaskStatusDict=='2'" @click="taskConfirmCompleted()"
                              type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                          <i class="fa fa-check" aria-hidden="true"></i>&nbsp;&nbsp;确认完成
                      </button>
                   </span>
                  <!--  <span>
                      <button v-if="createByOperate" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                          <i class="fa fa-unlink" aria-hidden="true"></i>&nbsp;&nbsp;任务终止
                      </button>
                     </span>
                    <span>
                      <button v-if="createByOperate" type="button" class="layui-btn layui-btn-sm layui-btn-blue" style="margin-left: 20px">
                          <i class="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;任务激活
                      </button>
                    </span>-->
                    <span style="color: red;font-size: 20px;margin-left: 200px">
<!--                     工作任务将于{{wtWorkTaskInfo.workTaskStarttime | moment}}开始,请在开始后进行处理-->
                    </span>
                </div>
                <div class="layui-input-inline">
                    <button style="margin-left: 10px" type="button" class="layui-btn layui-btn-sm layui-btn-red"
                            @click="closeTable()" v-if="false"><i class="fa fa-close" aria-hidden="true"></i>&nbsp;&nbsp;关闭
                    </button>
                </div>
            </div>
            <div class="row wrapper wrapper-content animated fadeInRight">
                <div class="col-sm-3">
                    <!--	<div class="ibox float-e-margins process-board"
                             style="margin-top: -5px;border: 1px solid #eee;margin-left: -5px;border-top:none;">
                            <div class="ibox-title" style="height: 44px">
                                <h5><i class="icon iconfont icon-file"></i></h5>
                                <h5 class="ibox-title-text">任务跟踪</h5>
                            </div>
                            <div class="ibox-content">
                                <div id="vertical-timeline" class="vertical-container light-timeline">
                                    <div class="vertical-timeline-block">
                                        <div class="vertical-timeline-content timeline-content-start">
                                            <div>开始</div>
                                        </div>
                                    </div>

                                    <div class="vertical-timeline-block">
                                        <div class="vertical-timeline-content timeline-content-end">
                                            <div>结束</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>-->
                </div>
                <!-- right -->
                <div class="col-sm-9">
                    <div class="ibox float-e-margins basic-info">
                        <div class="ibox-content">
                            <div class="cont-head-title">
                                <i class="fa fa-bookmark-o text-warning" style="position:relative;top:3px"></i>
                                <span
                                    style="font-size: 100%; margin: 0 60px 0 5px ; height: 30px;position:relative;top:3px">
                                    {{wtWorkTaskInfo.workTaskTitle}}
                                </span>
                            </div>
                            <hr class="layui-bg-gray">
                            <div class="pro-info-div">
                                <div style="">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" v-for="item in dicts[0]"
                                            style="float: right;position: relative;top: 10px;margin-right: 38px;cursor: default"
                                            v-if="wtWorkTaskInfo.workTaskTypeDict &&
									         wtWorkTaskInfo.workTaskTypeDict.substr(0,1)===item.value">
                                            {{item.label}}
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary"
                                            style="float: right;position: relative;top: 10px;margin-right: 10px;cursor: default"
                                            v-if="wtWorkTaskInfo.workTaskType">
                                           {{wtWorkTaskInfo.workTaskType}}
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary"
                                            style="float: right;position: relative;top: 10px;margin-right: 10px;cursor: default"
                                            v-if="wtWorkTaskInfo.workTaskRemark">
                                            {{wtWorkTaskInfo.workTaskRemark}}
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-danger"
                                            style="float: right;position: relative;top: 10px;cursor: default"
                                            v-if="wtWorkTaskInfo.workTaskLevelDict==='1'">
                                        一般
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-danger"
                                            style="float: right;position: relative;top: 10px;cursor: default"
                                            v-if="wtWorkTaskInfo.workTaskLevelDict==='2'">
                                        重要
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-danger"
                                            style="float: right;position: relative;top: 10px;cursor: default"
                                            v-if="wtWorkTaskInfo.workTaskLevelDict==='3'">
                                        紧急
                                    </button>
                                    <span style="float: right ;position: relative; top: 14px; font-size: 15px">
                                        {{wtWorkTaskInfo.workTaskStarttime | moment('YYYY-MM-DD')}} - {{wtWorkTaskInfo.workTaskEndtime | moment('YYYY-MM-DD')}}
                                    </span>
                                    <span class="span-title"
                                          style="float: right;position:relative;top:15px;font-size: 12px;color: #959798">任务日期：</span>
                                </div>
                                <h3>任务总体进度</h3>
                                <div class="layui-row layui-col-space10 panel_box" style="margin-top: 5px">
                                    <div class="panel layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg2 "
                                         style="margin: 0 3% 0 0;">
                                        <a href="javascript:;" style="cursor: default">
                                            <div class="panel_icon layui-bg-green">
                                                <i class="layui-icon layui-icon-log"></i>
                                            </div>
                                            <!--手动锁定-->
                                            <div class="panel_word">
                                                <span>
	                                               <template v-if="isShowDay">
		                                               {{days}}<cite class="end-unit">天</cite>
		                                               <div style="margin-top: -5px">
		                                                    <cite>{{progressInfo}}</cite>
		                                               </div>
	                                               </template>
		                                            <template v-else>
													<div style="margin-top: 10px">
														<cite>{{progressInfo}}</cite>
													</div>
		                                            </template>
                                                </span>
                                            </div>
                                           <!-- <div class="panel_word">
                                                <span>{{1}}<cite class="end-unit">天</cite></span>
                                                <cite>距离结束</cite>
                                            </div>-->
                                            <div class="panel_word" v-if="wtWorkTaskInfo.workPercent=='100'">
                                                <div style="margin-top: 17px">
                                                    <cite>反馈已完成</cite>
                                                </div>
                                            </div>
                                            <div class="panel_word">
                                                <div style="margin-top: 17px">
                                                    <cite>任务已终止</cite>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="panel layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg2"
                                         style="position: relative;margin:0 3% 0 0">
                                        <a href="javascript:" style="cursor: default">
                                            <div class="panel_icon layui-bg-blue">
                                                <i class="layui-icon layui-icon-user"></i>
                                            </div>
                                            <div class="panel_word">
                                                <span>{{participants.length}}</span>
                                                <cite>参与人数</cite>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="panel layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg2"
                                         style="position: relative;margin:0 3% 0 0;cursor: default">
                                        <a href="javascript:;" style="cursor: default">
                                            <div class="panel_icon layui-bg-red">
                                                <i class="layui-icon layui-icon-ok-circle"></i>
                                            </div>
                                            <div class="panel_word">
                                                <span>{{wtWorkTaskInfo.workPercent ? wtWorkTaskInfo.workPercent :0}}%</span>
                                                <cite>任务完成进度</cite>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="panel layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg2"
                                         style="position: relative;margin:0 3% 0 0;cursor: default">
                                        <a href="javascript:;" style="cursor: default">
                                            <div class="panel_icon layui-bg-orange">
                                                <i class="layui-icon layui-icon-ok"></i>
                                            </div>
                                            <div class="panel_word userAll">
                                                <span>{{completedNumber}}</span>
                                                <cite>完成人数</cite>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="panel layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg2"
                                         style="position: relative;margin:0 3% 0 0">
                                        <a href="javascript:;" style="cursor: default">
                                            <div class="panel_icon layui-bg-cyan">
                                                <i class="layui-icon layui-icon-edit"></i>
                                            </div>
                                            <div class="panel_word outIcons">
                                                <span>{{runningNumber}}</span>
                                                <cite>进行中人数</cite>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <hr class="layui-bg-gray">

                            <div class="pro-info-div">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h3>参与部门 / 处室<span style="display: block;" class="show-more dept-btn zk"
                                                           @click="showMoreDept('.dept-btn')">更多<i
                                            class="fa fa-angle-double-down"></i></span></h3>
                                        <div class="dept-infos">
                                            <dl class="clearfix">
                                                <dd class="show-con partBtn">
                                              <span class="col-md-3 dept-info" v-for="item in officeIds">
                                                <button type="button" class="btn m-r-sm" style="cursor: default">
                                                  <i class="fa fa-users"></i>
                                                </button>{{officeNameMap[item] ? officeNameMap[item] : ''}}
                                              </span>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="layui-bg-gray">

                            <div class="pro-info-div">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h3>参与人员及状态
                                            <span class="show-more person-btn zk"
                                                  @click="showMorePerson('.person-btn')">更多<i
                                                class="fa fa-angle-double-down"></i></span></h3>
                                        <div class="person-status">
                                            <dl class="clearfix">
                                                <div class="show-con attendPerson">
	                                        <span class="col-md-3 person-info" v-for="(item,index) in participants"
	                                              :key="item.id">
	                                           <button type="button" class="btn m-r-sm" style="cursor: default"
	                                                  :class="[item.confirmCompleteFlag==='y' ? 'btn-success' : 'btn-danger' ]">
	                                            <i class="layui-icon"
	                                                :class="[item.confirmCompleteFlag==='n' ? 'layui-icon-edit' :  'layui-icon-ok']"></i>
	                                           </button>
	                                            <template v-if="item.participantUserId==wtWorkTaskInfo.responsibleUserId">
	                                             {{userMap[item.participantUserId] ? userMap[item.participantUserId]: '' }}(主办人)
	                                            </template>
	                                            <template v-if="item.participantTypeDict=='3'">
	                                                {{userMap[item.participantUserId] ? userMap[item.participantUserId]: '' }}(承办人)
	                                            </template>
	                                            <template v-if="item.participantTypeDict=='2'">
	                                                {{userMap[item.participantUserId] ? userMap[item.participantUserId]: '' }}(协办人)
	                                            </template>
	                                        </span>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="layui-bg-gray">

                            <div class="layui-tab layui-tab-brief">
                                <ul class="layui-tab-title">
                                    <li class="layui-this" style="cursor: default">任务信息</li>
                                </ul>
                                <div class="layui-tab-content">
                                    <div class="layui-tab-item layui-show">
                                        <div class="cont-task-div">
                                            <!--<h3>任务描述：</h3>-->
                                            <div style="position: relative;left: -45px;font-size:14px;"
                                                 class="cont-task-desc"
                                                 v-html="wtWorkTaskInfo.workTaskDesc"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="layui-bg-gray">
                            <div class="layui-tab layui-tab-brief">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">任务反馈历史</li>
                                </ul>
                                <div class="layui-tab-content">
                                    <div class="layui-tab-item layui-show">
                                        <div class="cont-task-div">
                                            <table class="layui-table">
                                                <thead>
                                                <tr>
                                                    <th data-sort-ignore="true"
                                                        style="text-align: center;vertical-align: middle" width="8%">
                                                        序号
                                                    </th>
                                                    <th data-sort-ignore="true"
                                                        style="text-align: center;vertical-align: middle" width="10%">
                                                        反馈人员
                                                    </th>
                                                    <th data-sort-ignore="true"
                                                        style="text-align: center;vertical-align: middle" width="15%">
                                                        反馈类型
                                                    </th>
                                                    <th data-sort-ignore="true"
                                                        style="text-align: center;vertical-align: middle" width="50%">
                                                        反馈内容
                                                    </th>
                                                    <th data-sort-ignore="true"
                                                        style="text-align: center;vertical-align: middle" width="20%">
                                                        反馈时间
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
	                                                <template v-for="(item, index) in wtFeedbackInfos">
		                                                <tr :key="item.id"
		                                                    style="position: relative;text-align: center">
			                                                <td style="vertical-align: middle">{{index+1}}</td>
			                                                <td style="vertical-align: middle">
				                                                {{feedBackUserMap[item.createBy]? feedBackUserMap[item.createBy] : ''}}
			                                                </td>
			                                                <td style="vertical-align: middle"
			                                                    v-if=" item.workTaskFeedbackTypeDict==='1'">进行中
			                                                </td>
			                                                <td style="vertical-align: middle"
			                                                    v-else-if="item.workTaskFeedbackTypeDict==='2'">已完成
			                                                </td>
			                                                <td v-else style="vertical-align: middle">
				                                                {{item.workTaskFeedbackType}}
			                                                </td>
			                                                <td style="vertical-align: middle;text-align: left"
			                                                    :title="item.feedbackContent">{{item.feedbackContent}}
			                                                </td>
			                                                <td style="vertical-align: middle">{{item.createDate| moment}}
			                                                </td>
		                                                </tr>
	                                                </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="layui-bg-gray">
                            <!--<h3>附件：</h3>-->
                            <file-upload
                                label="附件"
                                :attachmentBusinessId="wtWorkTaskInfo.id"
                                attachmentBusinessType="wt_work_task_info"
                                module="work"
                                :canUpload="false"
                                deleteServiceName="work/wtWorkTaskInfos"
                            />
                            <hr class="layui-bg-gray"
                                v-if="currentUserId===wtWorkTaskInfo.createBy &&wtWorkTaskInfo.workTaskStatusDict==='3'">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {getUsers} from '@/api/user';
    import {getDicts} from '@/api/dict';
    import {wtWorkTaskDetails,getTaskFeedBackHistory} from '@/api/work/wtWorkTaskInfo';
    import Base from '@/views/base/Base';
    import WtWorkTaskInfoFeedback from '@/views/work/WtWorkTaskInfoFeedback'
    import WtWorkConfirmCompleted from '@/views/work/WtWorkConfirmCompleted'


    export default {
        name: 'WtWorkTaskInfoDetails',
        extends: Base,
        // components: {StarRate},
        data() {
            return {
                dicts: [],
                otherParam: {},
                refresh: true,
                page: {},
                wtWorkTaskInfoId: this.$route.params.id || '',
                wtWorkTaskInfo: {},
                participants: [],
                userMap: {},
                officeNameMap: {},
                currentUserId: '',
                completedNumber: 0,
                runningNumber: 0,
				officeIds:[],
	            createByOperate:false,
	            //主办人
	            isSponsor:false,
	            isShowDay:true,
	            days:'',
                progressInfo:'',
                wtFeedbackInfos:[],
                feedBackUserMap:{},

            };
        },
        props: {},
	    computed:{
            showFeedBackBtn:function () {
             return  this.participants.filter(member => member.participantUserId === this.currentUserId &&
                        member.confirmCompleteFlag === 'n').length > 0 && this.wtWorkTaskInfo.workPercent!=='100';
            }
	    },
        mounted() {
            this.initData();
            this.$nextTick(() => {
                this.layuiInit();
            });
        },
        methods: {
            initData: function () {
                this.currentUserId = this.curUser.userId;
                getDicts('WORK_TASK_TYPE_DICT').then(result => {
                    console.log(result);
                    let workTaskTypeDict = result.data[0];
                    this.dicts.push(workTaskTypeDict);
                });
                if (this.wtWorkTaskInfoId) {
                    wtWorkTaskDetails(this.wtWorkTaskInfoId).then(res => {
                        this.wtWorkTaskInfo = res.data.wtWorkTaskInfo || {};
                        this.participants = res.data.participants || [];
                        this.completedNumber = res.data.completedNumber || 0;
                        this.runningNumber = res.data.runningNumber || 0;
                        this.userMap = res.data.userMap || {};
                        this.officeNameMap = res.data.officeNameMap || {};
                        this.days = res.data.date || 0;
						this.officeIds=Array.from(new Set(this.participants.map(value => value.participantOfficeId)||[]));
					    this.createByOperate = this.currentUserId==this.wtWorkTaskInfo.createBy;
					    this.isSponsor = this.currentUserId==this.wtWorkTaskInfo.responsibleUserId;
					    if (this.wtWorkTaskInfo.workPercent=='100'){
					        this.isShowDay=false;
					        this.progressInfo='反馈已完成';
					    } ;
					    if (this.wtWorkTaskInfo.workPercent!=='100' && this.wtWorkTaskInfo.workTaskStatusDict=='2'){
                            this.progressInfo= this.days>=0?'距离结束':'任务已超期'
					    } ;
                    });
                    getTaskFeedBackHistory(this.wtWorkTaskInfoId).then(res =>{
						this.wtFeedbackInfos = res.data.wtFeedbackInfos || [];
						this.feedBackUserMap = res.data.feedBackUserMap ||{};
                    })
                }
            },
            taskFeedback:function(){
                this.$layer.iframe({
                    content: {
                        content: WtWorkTaskInfoFeedback,//传递的组件对象
                        parent: this,//当前的vue对象
                        data: {
                            wtWorkTaskInfo: this.wtWorkTaskInfo,
                            participants:this.participants,
                        }
                    },
                    area: ['650px', '660px'],
                    title: "进度反馈",
                    shade: false,
                    shadeClose: false
                })
            },
            taskConfirmCompleted:function(){
                this.$layer.iframe({
                    content: {
                        content: WtWorkConfirmCompleted,//传递的组件对象
                        parent: this,//当前的vue对象
                        data: {
                            wtWorkTaskInfo: this.wtWorkTaskInfo,
                        }
                    },
                    area: ['650px', '450px'],
                    title: "确认完成",
                })
            },
            getTime: function () {
                var date = new Date();
                var separator = '-';
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = '0' + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate;
                }
                return year + separator + month + separator + strDate;
            },
            edit: function (wtWorkTaskInfo) {
                this.$parent.clickMenu({
                    'checked': false,
                    'icon': 'fa-legal',
                    'id': 'wtWorkTaskInfo',
                    'name': 'WtWorkTaskInfoForm',
                    'parentId': '4',
                    'text': '任务信息更新',
                    'children': []
                }, 3, {
                    id: wtWorkTaskInfo.id,
                    workDealFlag: 'yes',
                });
            },
            cancel: function () {
                this.backListView(this.wtWorkTaskInfo.id == null);
            },
            hrefMenu: function (name, text, icon) {
                this.$parent.clickMenu({
                    'checked': false,
                    'icon': icon,
                    'id': '',
                    'name': name,
                    'parentId': '4',
                    'text': text,
                    'children': []
                }, 3, {});
            },
            closeTable: function () {
                this.backListView(this.wtWorkTaskInfo.id == null);

            },
            layuiInit: function () {
                var _this = this;

                layui.use(['form'], function () {
                    var form = layui.form;
                    form.on('submit(saveWtEvaluationInfo)', function (data) {
                        _this.save();
                        return false;
                    });
                });
            },
            showMorePerson: function (obj) {
                var tspan = $(obj);
                if ($(obj).hasClass('zk')) {
                    if (this.participants) {
                        var lineLength = this.participants.length / 6;
                        var lineLengthMore = this.participants.length % 6;
                        if (lineLengthMore > 0) {
                            lineLength += 1;
                        }
                    }
                    var pxNum = lineLength * 50;
                    $('.attendPerson').css('height', pxNum + '%');
                    tspan.html('更多 <i class="fa fa-angle-double-down"></i>');
                    $(obj).removeClass('zk');
                } else {
                    $('.attendPerson').css('height', '50px');
                    tspan.html('收起 <i class="fa fa-angle-double-up"></i>');
                    $(obj).addClass('zk');
                }
            },
            showMoreDept: function (obj) {
                var tspan = $(obj);
                if ($(obj).hasClass('zk')) {
                    let dept = [];
                    if (this.assistOfficeIds !== undefined) {
                        dept = this.assistOfficeIds.concat(this.undertakeOfficeIds);
                    }
                    let lineLength = (dept.length + 1) / 3;
                    let lineLengthMore = (dept.length + 1) % 3;
                    if (lineLengthMore > 0) {
                        lineLength += 1;
                    }
                    let pxNum = lineLength * 50;
                    $('.partBtn').css('height', pxNum + '%');
                    tspan.html('更多 <i class="fa fa-angle-double-down"></i>');
                    $(obj).removeClass('zk');
                } else {
                    $('.partBtn').css('height', '50px');
                    tspan.html('收起 <i class="fa fa-angle-double-up"></i>');
                    $(obj).addClass('zk');
                }
            },

        },
        watch: {},
    };


</script>

<style scoped>
    .layui-table {
        width: 100%;
        background-color: #fff;
        color: #666;
        height: auto;
        /* position: relative;
         text-align: center;*/
    }

    /* head */

    .manage-head-div {
	    border: 1px solid #f0f0f0;
	    margin: 10px;
    }

    .manage-head {
	    padding: 8px 0;
	    margin: 0;
	    background-color: #f0f0f0;
	    border-left: 4px solid #0078ad;
	    border-bottom: 0;
    }

    .manage-head-title {
	    position: relative;
	    height: 18px;
	    line-height: 18px;
	    color: #363636;
	    font-size: 16px;
    }

    .manage-head-div .layui-inline {
	    padding: 0 10px 10px 10px;
    }

    .manage-head-div .layui-input-inline {
	    padding-right: 10px;
	    line-height: 50px;
    }


    /* cont */

    .wrapper-content {
	    margin-top: -5px;
	    margin-left: -5px;
    }


    /* cont-left */

    .wrapper-content .process-board {
	    margin-top: -11px;
    }

    .wrapper-content .ibox-title {
	    padding-top: 7px;
	    padding-left: 10px;
	    color: #1e9fff;
    }

    .wrapper-content .ibox-title .iconfont {
	    font-size: 24px;
	    margin-top: 0;
    }

    .wrapper-content .ibox-title .ibox-title-text {
	    padding-top: 4px;
	    padding-left: 8px;
	    font-weight: 500;
    }

    .col-sm-3 .approval-opinion {
	    width: 100%;
	    height: 100%;
	    padding: 0;
    }

    .col-sm-3 .approval-opinion textarea {
	    border: 0;
    }

    .wrapper-content .process-board .ibox-content {
	    padding: 0;
    }


    /* timeline */

    #vertical-timeline.light-timeline:before {
	    background-color: #888;
    }

    #vertical-timeline::before {
	    left: 50%;
	    width: 5px;
	    height: 95%;
    }

    .vertical-timeline-content::before {
	    content: '';
	    position: relative;
	    top: -10px;
	    right: -0.2em;
	    height: 0;
	    width: 0;
	    border: 12px solid transparent;
	    border-top: 12px solid #888;
    }

    .vertical-timeline-block {
	    margin: 2em 0;
    }

    .vertical-timeline-content {
	    padding: 10px;
	    margin: 0 25px;
	    border-radius: 1em;
	    text-align: center;
	    border: 2px solid #797979;
	    background-color: #d7d7d7;
	    color: #333;
	    font-size: 12px;
    }

    .timeline-content-start::before {
	    border: 0;
    }

    .vertical-container .timeline-content-start {
	    width: 40%;
	    margin: 0 auto;
	    margin-top: -5px;
	    padding-top: 10px;
	    border: 2px solid #b7eb8f;
	    background-color: #f6ffed;
	    color: #52c41a;
	    font-size: 14px;
    }

    .vertical-container .timeline-content-end {
	    width: 40%;
	    margin: 0 auto;
	    margin-bottom: -25px;
	    padding-top: 10px;
	    border: 2px solid #d7d7d7;
	    background-color: #ececec;
	    color: #66667c;
	    font-size: 14px;
    }

    .timeline-content-end div {
	    margin-top: -14px;
    }

    .vertical-container .timeline-content-green {
	    border: 2px solid #008B45;
	    background-color: #28c24d;
	    color: #fff;
    }

    .vertical-container .timeline-content-red {
	    border: 2px solid #cd0000;
	    background-color: #f05151;
	    color: #fff;
    }

    .vertical-timeline-content .timeline-title,
    .vertical-timeline-content .separation-line {
	    margin-bottom: 5px;
    }

    .vertical-timeline-content .timeline-title {
	    margin-top: -15px;
	    font-size: 14px;
    }

    .vertical-timeline-content .separation-line {
	    border: 1px solid #fff;
    }

    .vertical-timeline-content .timeline-progress-div {
	    padding-top: 5px;
    }

    .timeline-progress-div .layui-progress {
	    margin-top: 5px;
    }

    .timeline-progress-div .task-per {
	    padding-left: 10px;
    }

    .vertical-timeline-content .timeline-lock {
	    text-align: left;
    }

    .timeline-lock i {
	    font-size: 20px;
	    color: #888;
    }


    /* cont-right */

    .wrapper-content .basic-info {
	    border-top: 0;
	    border-color: #ffffff;
	    margin-left: -30px;
	    color: #333333;
    }

    .wrapper-content .basic-info .ibox-content {
	    border-color: #ffffff;
	    padding: 0;
    }

    .basic-info .cont-head-title {
	    padding: 0 10px;
	    font-size: 20px;
	    font-weight: 300;
    }

    .cont-head-title button {
	    margin: 0 0 0 5px;
    }

    .cont-head-title .my-btn-danger {
	    border: 1px solid #C9C9C9;
	    background-color: #fff;
	    color: #ff5722;
    }

    .cont-head-title span {
	    font-size: 14px;
    }

    .cont-head-title .span-title {
	    font-weight: 700;
	    margin-left: 10px;
    }

    .basic-info hr {
	    border-top: 1.5px solid #eee;
	    margin-top: 10px;
	    margin-bottom: 10px;
    }

    .basic-info .cont-task-div {
	    padding: 0 15px;
	    color: #4f4f4f;
    }

    div.cont-task-desc {
	    padding: 5px 10px 10px 35px;
	    line-height: 25px;
    }

    .wrapper-content .basic-info .layui-field-title {
	    margin: -12px 0 0 0;
    }

    .layui-form-pane .layui-form-label {
	    width: 150px;
    }

    .layui-form-pane .layui-input-block {
	    margin-left: 150px;
    }

    .layui-tab .layui-tab-title {
	    border-bottom-width: 0;
    }

    .layui-tab .layui-tab-content {
	    margin-left: -10px;
    }

    .basic-info .sub-select-div {
	    width: 100%;
    }

    .basic-info .sub-select-div .sub-select-cont {
	    width: 75%;
    }

    .layui-tab .layui-tab-content .layui-form-item {
	    margin-bottom: 0;
    }

    .basic-info .info-remarks {
	    width: 99%;
    }

    .basic-info .info-remarks label {
	    height: 100px;
	    line-height: 80px;
	    vertical-align: middle;
    }

    .basic-info .info-remarks textarea {
	    resize: none;
    }

    .basic-info .end-btn-div {
	    text-align: center;
    }


    /* layui */

    .layui-btn-primary:hover,
    .layui-tab-brief>.layui-tab-more li.layui-this:after,
    .layui-tab-brief>.layui-tab-title .layui-this:after {
	    border-color: #ff7d4e;
    }

    .layui-btn-blue {
	    background-color: #177ce3;
	    background-repeat: repeat-y;
	    background-image: -moz-linear-gradient(left, #29adeb, #177ce3);
	    background-image: -webkit-linear-gradient(left, #29adeb, #177ce3);
	    background-image: -o-linear-gradient(left, #29adeb, #177ce3);
	    background-image: linear-gradient(left, #29adeb, #177ce3);
    }

    .layui-form-checkbox i {
	    height: 30px;
    }

    .layui-tab {
	    margin: -10px 10px 10px 10px;
    }

    .layui-tab-brief>.layui-tab-title .layui-this {
	    color: #177ce3;
    }

    .cont-task-div .attachment-list {
	    padding: 10px 5px;
    }

    .attachment-list .file-box {
	    width: 170px;
    }

    .attachment-list .file-name {
	    font-size: 12px;
    }

    .file .icon {
	    width: 100%;
	    margin-top: 0;
	    margin-bottom: 0;
    }


    /* COLORS */

    .file .icon i.text-success {
	    color: #009688;
    }

    .file .icon i.text-info {
	    color: #01aaed;
    }

    .file .icon i.text-warning {
	    color: #f8ac59;
    }

    .file .icon i.text-danger {
	    color: #ed5565;
    }

    .file .icon i.text-blue {
	    color: #1e9fff;
    }

    .file .icon i.text-yellow {
	    color: #ffb800;
    }


    /*星星样式*/

    .star_list {
	    width: 210px;
    }

    .star_score {
	    background: url(../../../public/img/work/star/stark2.png) no-repeat;
	    width: 160px;
	    height: 38px;
	    position: relative;
	    margin-top: 8px;
	    margin-left: 20px;
    }

    .star_score a {
	    height: 38px;
	    display: block;
	    text-indent: -999em;
	    position: absolute;
	    left: 0;
    }

    .star_score a:hover {
	    background: url(../../../public/img/work/star/stars2.png) repeat-x;
	    left: 0;
    }

    .star_score a.clibg {
	    background: url(../../../public/img/work/star/stars2.png) repeat-x;
	    left: 0;
    }

    .star_score {
	    background: url(../../../public/img/work/star/starky.png) repeat-x;
    }

    .star_score a:hover {
	    background: url(../../../public/img/work/star/starsy.png) repeat-x;
	    left: 0;
    }

    .star_score a.clibg {
	    background: url(../../../public/img/work/star/starsy.png) repeat-x;
	    left: 0;
    }


    /* table */

    .table {
	    width: 100%;
	    border: 1px solid #e7e7e7;
	    border-collapse: collapse;
	    border-spacing: 0;
	    table-layout: fixed;
	    color: #888;
	    margin-top: 10px;
	    margin-left: 10px;
	    margin-right: -10px;
    }

    .table tr th,
    .table tr td {
	    padding: 12px 8px;
	    border: 1px solid #e1e6eb;
	    font-family: "Microsoft YaHei";
    }

    .table tr th {
	    font-weight: 600;
	    text-align: center;
	    color: #333;
	    background: #f4f5f9;
	    border: 1px solid #e1e6eb;
	    font-size: 12px;
	    white-space: normal;
    }

    .table tr td {
	    vertical-align: middle;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    font-size: 12px;
	    text-align: center;
    }

    .table-padding tr th,
    .table-padding tr td {
	    padding: 0 10px;
    }

    .check-table tr {
	    padding-left: 35px;
    }

    .check-table .check-item {
	    margin-left: -35px;
	    width: 35px;
	    text-align: right;
    }

    .check-table .check-item input {
	    margin-left: 6px;
	    vertical-align: middle;
    }

    .table-hover tr:hover td {
	    background-color: #f9f9fa;
    }

    .table-center tr th,
    .table-center tr td {
	    text-align: center;
    }

    .tr-border .th,
    .tr-border .td {
	    text-align: center;
    }

    .table tr td.feedback-per {
	    color: #1890ff;
    }


    /* schedule */

    .pro-info-div {
	    margin: -8px 10px 0 20px;
    }

    .pro-info-div h3 {
	    line-height: 35px;
    }

    .pro-info-div .col-md-12 {
	    padding-right: 0;
	    padding-left: 0;
    }

    .panel_box {
	    margin-bottom: 5px;
    }

    .panel {
	    text-align: center;
	    height: 80px;
	    margin-bottom: 0;
    }

    .panel_box a {
	    display: block;
	    border-radius: 5px;
	    overflow: hidden;
	    height: 70px;
	    background-color: #f2f2f2 !important;
    }

    .panel_icon {
	    width: 40%;
	    line-height: 70px;
	    float: left;
	    position: relative;
	    height: 100%;
    }

    .panel_icon i {
	    font-size: 40px !important;
	    color: #fff;
	    display: inline-block;
    }

    .panel_word {
	    width: 60%;
	    float: right;
	    margin: 13px 0 14px;
    }

    .panel_word span {
	    font-size: 20px;
	    display: block;
	    height: 30px;
	    font-weight: 600;
	    color: #5a5a5a;
    }

    .panel_word cite {
	    font-size: 12px;
	    color: #888;
    }

    .panel_word .end-unit {
	    color: #5a5a5a;
    }

    .dept-infos,
    .person-status {
	    width: 100%;
	    border-top: 1px solid #e7eaec;
    }

    .dept-infos dl,
    .person-status dl {
	    line-height: 48px;
	    overflow: hidden;
    }

    .dept-infos dl dd,
    .person-status dl dd {
	    font-size: 16px;
	    height: 48px;
	    overflow: hidden;
    }

    .dept-infos dl dd .dept-info,
    .person-status dl dd .person-info {
	    font-size: 14px;
	    line-height: 48px;
	    display: inline-block;
	    text-overflow: ellipsis;
	    -moz-text-overflow: ellipsis;
	    overflow: hidden;
	    white-space: nowrap;
    }

    .dept-infos .btn,
    .person-info .btn {
	    border-radius: 68px;
	    padding: 2px 6px;
    }

    .pro-info-div .show-more {
	    cursor: pointer;
	    float: right;
	    margin-right: 8px;
	    font-size: 12px;
	    color: #1e9fff;
	    display: none;
    }

</style>
