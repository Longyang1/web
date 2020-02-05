<template>
	<div class="view-product" v-cloak>
		<div class="animated fadeInRight">
			<div class="ibox-content">
				<layui-form>
					<layui-fieldset label="工作任务基本信息">
						<template slot="main">
							<div class="layui-row">
								<div class="layui-col-md9" style="width: 464px !important;">
									<layui-item>
										<layui-inline-dict-linkage-select
											label="任务类别"
											type="WORK_TASK_TYPE_DICT"
											lay-verify="required1"
											v-model="wtWorkTaskInfo.workTaskTypeDict">
										</layui-inline-dict-linkage-select>
									</layui-item>
								</div>
								<div class="layui-col-md3">
									<layui-item v-if="wtWorkTaskInfo.workTaskTypeDict=='1C'">
										<layui-inline-input
											label="会议纪要文号"
											placeholder="请输入会议纪要文号"
											:cssStyle="{width:'300px'}"
											lay-verify="required"
											v-model="wtWorkTaskInfo.workTaskRemark"/>
									</layui-item>
								</div>
							</div>

							<layui-item>
								<layui-inline-radio
									label="重要程度"
									v-model="wtWorkTaskInfo.workTaskLevelDict"
									:items="workTaskLevelDicts"/>
							</layui-item>
							<layui-item>
								<layui-inline-input
									label="任务标题"
									:cssStyle="{width:'766px'}"
									placeholder="请输入任务标题"
									lay-verify="titleValidation"
									:max="50"
									v-model="wtWorkTaskInfo.workTaskTitle"/>
							</layui-item>

							<layui-item>
								<div class="layui-inline">
									<label class="layui-form-label">任务完成时限</label>
									<div class="layui-input-inline" style="width: 83px;">
										<layui-date
											name="workTaskStarttime"
											v-model="wtWorkTaskInfo.workTaskStarttime"
											:cssStyle="{width: '83px'}"/>
									</div>
									<div class="layui-form-mid" style="width: auto">-</div>
									<div class="layui-input-inline" style="width: 83px;">
										<layui-date
											name="meetingEndTime"
											v-model="wtWorkTaskInfo.workTaskEndtime"
											:cssStyle="{width: '83px'}"/>
									</div>
								</div>
								<layui-inline-radio
									label="需要定期反馈"
									v-model="wtWorkTaskInfo.regularFeedbackFlag"
									:items="regularFlags"/>
							</layui-item>
							<layui-item v-if="wtWorkTaskInfo.regularFeedbackFlag == 'y'">
								<layui-inline-select
									label="定期反馈"
									v-model="wtWorkTaskInfo.feedbackCycleDict"
									:items="feedbackCycleDicts"/>
								<layui-inline>
									<label class="layui-form-label">反馈人员包括</label>
									<div class="layui-input-block" style="margin-right: 50px;">
										<layui-simple-checkbox
											label="主办负责人"
											val="y"
											defaultValue="n"
											v-model="wtWorkTaskInfo.responsibleUserFlag">
										</layui-simple-checkbox>
										<layui-simple-checkbox
											label="协办负责人"
											val="y"
											defaultValue="n"
											v-model="wtWorkTaskInfo.assistUserFlag">
										</layui-simple-checkbox>
										<layui-simple-checkbox
											label="承办人"
											val="y"
											defaultValue="n"
											v-model="wtWorkTaskInfo.undertakeUserFlag">
										</layui-simple-checkbox>
									</div>
								</layui-inline>
							</layui-item>
							<layui-item>
								<layui-inline-input
									label="主办单位"
									placeholder="点击选择主办单位"
									lay-verify="required"
									func="officeClick"
									:value="officeNameMap[wtWorkTaskInfo.responsibleOfficeId]"
									@officeClick="officeClick(-1)">
								</layui-inline-input>
								<layui-inline-select
									label="主办负责人"
									lay-verify="required"
									v-model="wtWorkTaskInfo.responsibleUserId"
									:items="responsibleUsers">
								</layui-inline-select>
								<layui-inline>
									<layui-simple-checkbox
										@clickCheckboxAfter="clickCheckboxAfter"
										label="需要协办"
										defaultValue="n"
										val="y"
										v-model="wtWorkTaskInfo.assistFlag">
									</layui-simple-checkbox>
								</layui-inline>
							</layui-item>
							<template v-if="wtWorkTaskInfo.assistFlag =='y'">
								<layui-item>
									<layui-inline-input
										label="协办部门"
										placeholder="请输入协办部门"
										@officeClick="officeClick(0)"
										func="officeClick"
										:value="officeNameMap[firstAssistMember.participantOfficeId]">
									</layui-inline-input>
									<layui-inline-select
										label="协办负责人"
										v-model="firstAssistMember.participantUserId"
										:items="allAssistMembers[0]">
									</layui-inline-select>
									<i @click="addRow" class="fa fa-plus text-warning select-pros"
									   style="font-size: 16px; cursor: pointer;"></i>
								</layui-item>

								<layui-item v-for="(item, index) in moreAssitMembers" :key="'ss_' + index">
									<layui-inline-input
										label="协办部门"
										@officeClick="officeClick(index+1)"
										func="officeClick"
										:value="officeNameMap[moreAssitMembers[index].participantOfficeId]"
										placeholder="请输入协办部门">
									</layui-inline-input>
									<layui-inline-select
										label="协办负责人"
										v-model="moreAssitMembers[index].participantUserId"
										:items="allAssistMembers[index+1]">
									</layui-inline-select>
									<a @click="del(index+1)" class="delete_a">
										<i class="fa fa-minus text-warning select-pros"
										   style="font-size: 16px; cursor: pointer;"></i>
									</a>
								</layui-item>
							</template>
							<layui-item>
								<div class="layui-row">
									<div class="layui-col-md5">
										<layui-inline-user-tag
											style="width: 682px"
											placeholder="点击选择承办人"
											label="承办人"
											:userOfficeMap="underOfficeMap"
											v-model="undertaker">
										</layui-inline-user-tag>
									</div>
								</div>
							</layui-item>
							<layui-item>
								<layui-inline-ue
									label="任务描述"
									:cssStyle="{'width':'60.3%'}"
									:value="wtWorkTaskInfo.workTaskDesc"
									layVerify="required"
									ref="descUe">
								</layui-inline-ue>
							</layui-item>
						</template>
					</layui-fieldset>
					<!--文件上传-->
					<file-upload
						:attachmentBusinessId="wtWorkTaskInfo.id"
						attachmentBusinessType="wt_work_task_info"
						module="work"
						ref="fileUpload"/>
					<layui-fieldset label="高级设置" :close="true">
						<template slot="main">
							<div style="border: 1px solid #e7e9ee;width: 950px;padding-left:28px;padding-top: 20px ">
								<layui-item>
									<layui-inline-select
										label="公开范围"
										v-model="wtWorkTaskInfo.workTaskPublicScopeDict"
										:items="workTaskPublicScopeDicts">
									</layui-inline-select>
								</layui-item>
								<layui-item>
									<label class="layui-form-label">提醒方式</label>
									&nbsp;&nbsp;&nbsp; 发送
									<layui-inline-checkbox
										laySkin="primary"
										name="auditStatusDicts"
										:items="auditStatusDicts"
										v-model="remindModeList">
									</layui-inline-checkbox>
									<div class="layui-inline" style="margin-left: -55px">
										<span>提醒人员处理工作任务。</span>
									</div>

								</layui-item>
								<layui-item>
									<!--结束前提醒-->
									<template>
										<label class="layui-form-label">到期提醒</label>
										&nbsp;&nbsp;结束前&nbsp;&nbsp;
										<div class="layui-inline" style="width: 65px">
											<layui-inline-input
												placeholder="请输入"
												v-model="wtWorkTaskInfo.remindEndValue"
												:cssStyle="{width: '70px'}">
											</layui-inline-input>
										</div>
										<layui-inline-select
											label=""
											v-model="wtWorkTaskInfo.remindEndUnit"
											:items="remindUnit"
											:width="80">
										</layui-inline-select>
										提醒。
									</template>
								</layui-item>

								<layui-item>
									<label class="layui-form-label">超期锁定</label>
									<layui-simple-checkbox
										label="锁定"
										val='y'
										defaultValue="n"
										v-model="wtWorkTaskInfo.overtimeLockFlag">
									</layui-simple-checkbox>
								</layui-item>
								<template
									v-if="wtWorkTaskInfo.overtimeLockFlag=='y' && wtWorkTaskInfo.workTaskTypeDict.indexOf('0') !=-1 ">
									<layui-item>
										<layui-inline-input
											label="任务锁定/解锁人"
											placeholder="点击选择"
											func="selectMember"
											@selectMember="selectMember(-1)"
											:value="userMap[wtWorkTaskInfo.lockUnlockPerson]"
											:readonly="true">
										</layui-inline-input>
									</layui-item>
								</template>
								<template v-if="wtWorkTaskInfo.workTaskTypeDict.indexOf('0') ">
									<layui-item>
										<layui-inline-select
											label="任务锁定/解锁人"
											v-model="wtWorkTaskInfo.lockUnlockPerson"
											:items="lockUnlockPersons">
										</layui-inline-select>
									</layui-item>
								</template>
							</div>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
						<template>
							<template v-if="showSaveBtn">
								<button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit
								        lay-filter="saveWtWorkTaskInfo"><i class="fa fa-save"></i> 保存
								</button>
							</template>
							<template v-if="wtWorkTaskInfo.workTaskStatusDict=='1'">
								<button class="layui-btn layui-btn-lg layui-btn-orange" lay-submit
								        lay-filter="publicWtWorkTaskInfo">
									<i class="fa fa-paper-plane" aria-hidden="true"></i> 直接发布
								</button>
							</template>
						</template>
						<button @click="cancel" class="layui-btn layui-btn-lg layui-btn-red" lay-filter="cancel">
							<i class="fa fa-times"></i>&nbsp;关闭
						</button>
					</layui-inline>
				</layui-form>
			</div>
		</div>
	</div>
</template>

<script>
import {getDicts} from '@/api/dict';
import {get, saveOrUpdate} from '@/api/work/wtWorkTaskInfo';
import OfficeTree from '@/components/OfficeTree';
import Base from '@/views/base/Base';
import {getUsers} from '@/api/user';
import UserSelectList from '@/components/UserSelectList';
import {formatDate} from '@/utils/formatUtils';
export default {
    name: 'WtWorkTaskInfoForm',
    extends: Base,
    data() {
        return {
            workTaskTypeDicts: [],
            workTaskLevelDicts: [],
            workTaskStatusDicts: [],
            feedbackCycleDicts: [],
            workTaskPublicScopeDicts: [],
            auditStatusDicts: [],
            remindUnit: [],
            remindModeList: ['1'],
            officeNameMap: {},
            userMap: [],
            feedbackTimeList: [
                {
                    label: '任意日期',
                    value: 11
                },
                {
                    label: '星期一',
                    value: 1
                },
                {
                    label: '星期二',
                    value: 2
                },
                {
                    label: '星期三',
                    value: 3
                },
                {
                    label: '星期四',
                    value: 4
                },
                {
                    label: '星期五',
                    value: 5
                },
                {
                    label: '星期六',
                    value: 6
                },
                {
                    label: '星期天',
                    value: 7
                }
            ],
            monthList: [{
                label: '任意日期',
                value: 11
            },
                {
                    label: '第一天',
                    value: 1
                },
                {
                    label: '月中',
                    value: 2
                },
                {
                    label: '最后一天',
                    value: 3
                }
            ],
            responsibleUsers: [],
            quarterList: [{
                label: '任意日期',
                value: 11
            },
                {
                    label: '第一天',
                    value: 1
                },
                {
                    label: '第二天',
                    value: 2
                },
                {
                    label: '第三天',
                    value: 3
                }
            ],
            wtWorkTaskInfo: {
                id: this.$route.params.id,
                workTaskType: '',
                workTaskTypeDict: '',
                workTaskLevelDict: '1',
                workTaskNo: '',
                workTaskTitle: '',
                workTaskStarttime: '',
                workTaskEndtime: '',
                workTaskStatus: '',
                workTaskStatusDict: '1',
                regularFeedbackFlag: 'n',
                overtimeLockFlag: 'y',
                feedbackCycle: '',
                feedbackCycleDict: '1',
                feedbackTime: '',
                assistFlag: 'n',
                responsibleUserFlag: 'n',
                assistUserFlag: 'n',
                undertakeUserFlag: 'n',
                responsibleOfficeId: '',
                responsibleUserId: '',
                workTaskDesc: '',
                workTaskRemark: '',
                workTaskPublicScope: '',
                workTaskPublicScopeDict: '2',
                remindMode: '',
                remindStartValue: '',
                remindStartUnit: '1',
                remindEndValue: '3',
                remindEndUnit: '1',
                workTaskCloseTime: '',
                workTaskCloseUserId: '',
                normalCloseFlag: '',
                auditProcessFlag: '',
                auditStatus: '',
                auditStatusDict: '',
                currentAuditNode: '',
                currentAuditUserId: '',
                auditSendTime: '',
                auditEndTime: '',
                workPercent: '0',
                lockUnlockPerson: '',
                finishToApprove: 'n'
            },
            responsibleUser: [],
            assistUser: [],
            undertakeUser: [],
            assist: [],
            moreAssitMembers: [],
            underOfficeMap: {},
            rowIndex: 1,
            participantIndex: 0,
            officeClickIndex: -1,
            authUsers: [],
            userOfficeMap: {},
            currentUserId: '',
            curSelectUserIndex: '',
            reportMembers: [],
            regularFlags: [{
                label: '是',
                value: 'y'
            },
                {
                    label: '否',
                    value: 'n'
                }
            ],
            delayWays: [{
                label: '周末、节假日提前',
                value: 'y'
            },
                {
                    label: '周末、节假日顺延',
                    value: 'n'
                }
            ],
            otherParam: {
                startTime: '',
                endTime: ''
            },
            participantTypeDicts: [],
            undertaker: [],
            undertakerIds: [],
            lockUnlockPersons: [],
			assistUsers:[],
			firstAssistMember:{
				participantUserId:'',
				participantOfficeId:'',
			},
			allAssistMembers:{},
			selectedAllAssistMembers:[],
	        showSaveBtn:true,
        };
    },
    computed: {},
    watch: {
		'wtWorkTaskInfo.assistFlag':function () {
			if (this.wtWorkTaskInfo.assistFlag!=='y'){
				this.allAssistMembers = {};
				this.firstAssistMember = {};
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
        selectMember: function (index) {
            this.curSelectUserIndex = index;
            this.$layer.iframe({
                content: {
                    content: UserSelectList, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        isMultiUser: false
                    }//props
                },
                area: ['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + 'px')],
                title: '人员选择'
            });
        },
        clickCheckboxAfter: function (data) {
            if (data.checked) {
            } else {
                this.moreAssitMembers = [];
            }
        },
        cancel: function () {
            this.backListView(this.wtWorkTaskInfo.id == null);
        },
        officeClick: function (index) {
            this.officeClickIndex = index;
            console.log(index);
            console.log(this.officeClickIndex);
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this, //当前的vue对象
                    data: []
                },
                area: [
                    'auto',
                    (window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight) *
                    0.8 +
                    'px'
                ],
                title: '部门选择'
            });
        },
	    getResponsibleUsers2Item:function(){
            this.responsibleUsers = [];
            getUsers({'orgId':this.wtWorkTaskInfo.responsibleOfficeId}).then(res =>{
                let data = res.data;
                let authUsers = data.authUsers||[];
                authUsers.forEach(user =>{
                    this.responsibleUsers.push({
                        label:user.userName,
                        value:user.userId
                    })
                });
                if (!this.wtWorkTaskInfo.id){
					this.wtWorkTaskInfo.responsibleUserId = this.responsibleUsers.length>0 ?this.responsibleUsers[0].value:'';
				}
            })
	    },

		getUser2Item:function(officeId,index,isEchoData){
            if (officeId){
                getUsers({"orgId":officeId}).then(result => {
                    let data = result.data;
                    let authUsers = data.authUsers|| [] ;
                    let users = [];
                    authUsers.forEach(user =>{
                        users.push({
                            label:user.userName,
                            value:user.userId
                        })
                    });
                    this.allAssistMembers[index]=[];
                    this.allAssistMembers[index] = users;
                    if (!isEchoData){
                        if (index==0){
                            this.firstAssistMember.participantUserId = this.allAssistMembers[0].length>0?
                                this.allAssistMembers[0][0].value:'';
                        }else {
                            this.moreAssitMembers[index-1].participantUserId = this.allAssistMembers[index].length>0?
                                this.allAssistMembers[index][0].value:'';
                        }
                    }

                });
            } ;
		},

        clickNodeAfter: function (node) {
            this.officeNameMap[node.id]=node.name;
            if (this.officeClickIndex==-1){
                this.wtWorkTaskInfo.responsibleOfficeId=node.id;
                this.getResponsibleUsers2Item();
	        }
	        if (this.officeClickIndex==0){
				this.firstAssistMember.participantOfficeId = node.id;
				this.getUser2Item(this.firstAssistMember.participantOfficeId,0,false);
	        }
	        if (this.officeClickIndex>0){
	            let index = this.officeClickIndex -1;
	            console.log(index + "612line");
	            this.moreAssitMembers[index].participantOfficeId = node.id;
				let officeId=this.moreAssitMembers[index].participantOfficeId;
				if (officeId){
					this.allAssistMembers[index+1]=[];
					this.getUser2Item(officeId,index+1,false);
				}
            }
            this.$layer.closeAll();
        },
        getTime: function () {
            let date = new Date();
            let seperator1 = '-';
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            return year + seperator1 + month + seperator1 + strDate;
        },
        save: function (isPublish) {
			this.selectedAllAssistMembers=[];
            this.wtWorkTaskInfo.workTaskDesc = this.$refs.descUe.getContent();
            this.workTaskTypeDicts.some(dict => {
                if (dict.value==this.wtWorkTaskInfo.workTaskTypeDict){
                    this.wtWorkTaskInfo.workTaskType = dict.label;
                }
            });
            if (this.wtWorkTaskInfo.workTaskTypeDict != '1C') {
                this.wtWorkTaskInfo.workTaskRemark = '';
            }
            if (isPublish){
            	this.wtWorkTaskInfo.workTaskStatusDict='2';
			}
            this.selectedAllAssistMembers = this.moreAssitMembers.concat(this.firstAssistMember);
			let saveVerifyPass = this.saveVerify();
			if (!saveVerifyPass){
				return;
			}
			this.submitHandler((token) => {
                console.log(token + 'this is token ');
                saveOrUpdate(
                    JSON.stringify(this.wtWorkTaskInfo),
                    JSON.stringify(this.selectedAllAssistMembers),
                    JSON.stringify(this.undertaker),
                    JSON.stringify(this.$refs.fileUpload.getAttamentIds()),
                    token
                ).then(result => {
                    alert(result.msg);
                    if (this.wtWorkTaskInfo.workTaskStatusDict='2'){
                        this.showSaveBtn = false;
                        this.$parent.updateMenuNum('WtWorkTaskInfoList', 'add', 1);
                    } ;
                    this.backListView(this.wtWorkTaskInfo.id == null);
                }).catch((error) => {
                    this.resetToken(error);
                });
            });
        },
		saveVerify:function(){
        	if(!this.wtWorkTaskInfo.workTaskStarttime){
        		msg('请选择任务开始时间');
        		return false;
			}
        	if (!this.wtWorkTaskInfo.workTaskEndtime){
        		msg("请选择任务结束时间");
        		return false;
			}
        	if (!this.wtWorkTaskInfo.workTaskDesc.trim()){
        		msg("请填写任务描述");
        		return false;
			}
			let	selectedAllAssistMembersIds=this.selectedAllAssistMembers.map(value => value.participantUserId) || [];
        	let userNames= this.undertaker.filter(underUser => selectedAllAssistMembersIds.indexOf(underUser.userId)!==-1 ||
				underUser.userId==this.wtWorkTaskInfo.responsibleUserId).map(underUser => underUser.userName) ||[];
			let	participantUserIds=this.selectedAllAssistMembers.filter(assistUser =>
				assistUser.participantUserId==this.wtWorkTaskInfo.responsibleUserId).map(value => value.participantUserId) || [];
			let participantUserNames = [];
			if (participantUserIds.length>0) {
				for (let i = 0; i < Object.keys(this.allAssistMembers).length; i++) {
					let assistMembers = this.allAssistMembers[i] || [];
					let assistMembersUserNames = assistMembers.filter(value =>
						participantUserIds.indexOf(value.value) !== -1).map(value => value.label) || [];
						participantUserNames=participantUserNames.concat(assistMembersUserNames);
				}
			}
			userNames=userNames.concat(participantUserNames);
			userNames = Array.from(new Set(userNames));
        	if (userNames.length>0){
        		msg('参与人员'+userNames.join(',')+'不能重复选择');
        		return false;
			}
        	let startTime = new Date(this.wtWorkTaskInfo.workTaskStarttime).getTime();
        	let endTime = new Date(this.wtWorkTaskInfo.workTaskEndtime).getTime();
        	if (startTime>endTime){
        		msg('任务开始时间不能大于结束时间');
        		return false;
			}
        	return true;
		},
        initData: function () {
            this.currentUserId = this.curUser.userId;
            if (!this.wtWorkTaskInfo.id) {
                this.wtWorkTaskInfo.responsibleOfficeId = this.curUser.office.id || -1;
                this.officeNameMap[this.wtWorkTaskInfo.responsibleOfficeId] = this.curUser.office.name || '';
				this.wtWorkTaskInfo.workTaskStarttime = this.getTime();
				this.getResponsibleUsers2Item();
            }
            if (this.wtWorkTaskInfo.id) {
                get(this.wtWorkTaskInfo.id).then(res => {
					this.wtWorkTaskInfo = res.data.wtWorkTaskInfo|| {};
					this.officeNameMap = res.data.officeNameMap|| {};
					this.underOfficeMap = res.data.underOfficeMap|| {};
					this.undertaker = res.data.underTakeUser|| [];
					let assistMembers = res.data.assitMembers|| [];
					this.assistUsers = res.data.assistUsers|| [];
					if (this.wtWorkTaskInfo.workTaskStarttime){
						this.wtWorkTaskInfo.workTaskStarttime =formatDate(this.wtWorkTaskInfo.workTaskStarttime,'YYYY-MM-DD')
					}
					if (this.wtWorkTaskInfo.workTaskEndtime){
						this.wtWorkTaskInfo.workTaskEndtime =formatDate(this.wtWorkTaskInfo.workTaskEndtime,'YYYY-MM-DD')
					}
					this.getResponsibleUsers2Item();
					if (assistMembers.length>0){
						this.firstAssistMember.participantOfficeId = assistMembers[0].participantOfficeId;
						getUsers({"orgId": this.firstAssistMember.participantOfficeId}).then(result => {
							let data = result.data;
							let authUsers = data.authUsers || [];
							this.allAssistMembers[0]=[];
							let users = [];
							authUsers.forEach(user =>{
								users.push({
									label:user.userName,
									value:user.userId
								})
							});
							this.allAssistMembers[0] = users;
							this.firstAssistMember.participantUserId = assistMembers[0].participantUserId;
						});
						let assistMemberOthers = assistMembers.filter(member =>
							member.participantUserId!==assistMembers[0].participantUserId);
						for (let i = 0; i < assistMemberOthers.length; i++) {
                            getUsers({"orgId": assistMemberOthers[i].participantOfficeId}).then(result => {
                                let data = result.data;
                                let authUsers = data.authUsers || [];
                                this.allAssistMembers[i+1]=[];
                                let users = [];
                                authUsers.forEach(user =>{
                                    users.push({
                                        label:user.userName,
                                        value:user.userId
                                    })
                                });
                                this.allAssistMembers[i+1] = users;
                                this.moreAssitMembers.push({
                                    participantOfficeId: assistMemberOthers[i].participantOfficeId,
                                    participantUserId: assistMemberOthers[i].participantUserId
                                });
                            });
						}
					}

				});
            }
            getDicts('WORK_TASK_TYPE_DICT,WORK_TASK_LEVEL_DICT,WORK_TASK_STATUS_DICT,FEEDBACK_CYCLE_DICT,' +
                'WORK_TASK_PUBLIC_SCOPE_DICT,REMIND_WAY,REMIND_UNIT,PARTICIPANT_TYPE_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.workTaskTypeDicts = result.data[0] || [];
                    this.workTaskLevelDicts = result.data[1] || [];
                    this.workTaskStatusDicts = result.data[2] || [];
                    this.feedbackCycleDicts = result.data[3] || [];
                    this.workTaskPublicScopeDicts = result.data[4] || [];
                    this.auditStatusDicts = result.data[5] || [];
                    this.remindUnit = result.data[6] || [];
                    this.participantTypeDicts = result.data[7] || [];
                    /*this.workTaskTypeDicts = workTaskTypeDicts.filter(dict => {
						return dict.value.startsWith('1') && dict.value !== '1';
					})*/
                }
            });
        },
        addRow: function () {
            this.moreAssitMembers.push({
                participantOfficeId: null,
                participantUserId: null
            });
        },
        del: function (index) {
            console.log(index +"        this is del index");
            confirm(
                '确定删除该行吗？', () => {
                   delete this.allAssistMembers[index];
                	if (this.allAssistMembers[index+1] && this.allAssistMembers[index+1].length>0){
						this.allAssistMembers[index] = this.allAssistMembers[index+1];
						delete this.allAssistMembers[index+1];
					}
                   this.moreAssitMembers.splice(index-1,1);
                },
            );
        },
        layuiInit: function () {
            var _this = this;
            layui.use(['element', 'form'], function () {
                var element = element,
                    form = layui.form;
                //自定义验证规则
                form.verify({
                    content: function (value) {
                        layedit.sync(editIndex);
                    },
                    titleValidation: function (value) {

                        if (value.trim().length === 0) {
                            return '必填项不能为空';
                        }
                        if (value.length > 50) {
                            return '任务标题最多为50个字';
                        }
                    }
                });
                form.on('submit(saveWtWorkTaskInfo)', function (data) {
                    _this.save();
                    return false;
                });
                form.on('submit(publicWtWorkTaskInfo)', function (data) {
                	let isPublish = true;
                    _this.save(isPublish);
                    return false;
                });
            });
        }
    }
};
</script>
<style scoped>
	.view-product /deep/ .time-select .layui-input-inline {
		width: 60px
	}

	.layui-col-md9 {
		width: 32% !important;
	}
</style>
