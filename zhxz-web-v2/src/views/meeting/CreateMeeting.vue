<template>
    <div class="view-product" v-cloak>
		<div class="info-center">
			<div class="wrapper wrapper-content animated fadeInRight">
				<div class="ibox-content">
					<layui-form>
						<layui-fieldset label="会议信息">
							<template slot="main">
								<layui-item>
									<layui-inline-input
										label="会议部门" 
										placeholder="点击选择会议部门"
										:value="officeNameMap[meetingInfo.officeId]"
										func="officeClick"
										:readonly="true"
										@officeClick="officeClick(1)"
										:cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                    <layui-inline-input
                                        v-if="enableVote && false"
										label="投票通过率" 
										placeholder="请输入投票通过率，如0.75"
										v-model="meetingInfo.votingPassRate"
										:cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                    <layui-inline-radio
                                        name="voteFlag"
                                        label="测试会标志"
                                        v-model="meetingInfo.testFlag"
                                        :items="yesNos"></layui-inline-radio>
								</layui-item>
								<layui-item>
									<layui-inline-input
										label="会议名称"
										:block="true"
										placeholder="请输入会议名称"
										v-model="meetingInfo.meetingName"></layui-inline-input>
								</layui-item>
								<div class="layui-row">
									<div class="layui-col-xs8">
										<layui-item>
											<layui-inline-input
												label="会议编号"
												placeholder="请输入会议编号"
												v-model="meetingInfo.meetingNumber"></layui-inline-input>
											<layui-inline-input
												label="会议类型"
												:readonly="true"
												:value="meetingTypeMap[meetingInfo.meetingTypeDict]"></layui-inline-input>	
										</layui-item>
										<layui-item>
											<layui-inline-date
												label="会议日期"
												placeholder="点击选择日期"
												name="meetingTime"
                                                :readonly="false"
												v-model="meetingInfo.meetingTime"/>
											<div class="layui-inline">
												<label class="layui-form-label">会议时间</label>
												<div class="layui-input-inline" style="width: 83px;">
													<layui-date
														type="time"
														name="meetingStartTime"
														v-model="meetingInfo.meetingStartTime"
														:cssStyle="{width: '83px'}"/>
												</div>
												<div class="layui-form-mid">-</div>
												<div class="layui-input-inline" style="width: 83px;">
													<layui-date
														type="time"
														name="meetingEndTime"
														v-model="meetingInfo.meetingEndTime"
														:cssStyle="{width: '83px'}"/>
												</div>
											</div>	
										</layui-item>
										<layui-item>
											<layui-inline-input
												label="会议年份"
												placeholder="请输入会议年份"
												v-model="meetingInfo.meetingYear"></layui-inline-input>
											<layui-inline-input
												label="会议期次"
												placeholder="请输入会议期次"
												v-model="meetingInfo.meetingSequence"></layui-inline-input>	
										</layui-item>
									</div>
									<div class="layui-col-xs4">
										<div class="layui-upload">
											<div class="layui-upload-list" style="display: inline-block;">
												<img v-if="meetingInfo.meetingPic" width="126" class="layui-upload-img" id="meetingImg" :src="'/api/file/pub/' + meetingInfo.meetingPic">
											</div>
											<p id="demoText" style="display: inline-block;margin-right: 10px;"></p>
											<button type="button" class="layui-btn layui-btn-lg layui-btn-blue" id="uploadBtn">更换图片</button><input class="layui-upload-file" type="file" accept="undefined" name="file">
										</div>
									</div>
								</div>
								<layui-item>
									<layui-inline-input
										label="会议地点"
										:block="true"
										placeholder="请输入会议地点"
                                        lay-verify="required"
										v-model="meetingInfo.meetingRoom"></layui-inline-input>
								</layui-item>
							</template>
						</layui-fieldset>
						<layui-fieldset label="会议议题" :showBoder="true">
							<i @click="showWatingSubjects" class="fa fa-plus text-warning select-pros" style="font-size: 16px;cursor: pointer;"></i>
							<template slot="main">
								<div class="layui-field-box">
									<div class="col-sm-12 subject-list">
										<ul class="sortable-list connectList agile-list agile-list-left">
											<template v-for="(item, index) in subjects">
												<li 
													:key="item.id" 
													:class="subjectItemClass(item.meetingTypeDict)"
													v-dragging="{ item: item, list: subjects, group: 'subject' }">
													{{ index + 1 }}、{{ meetingSubjectTypeMap[item.meetingSubjectTypeDict] }}——{{ item.subjectName }}
													<div class="agile-detail">
														<a href="javascript:void(0);" @click="remove(item)" class="pull-right btn btn-xs btn-white">
															<i class="fa fa-trash text-warning"></i> 移除
														</a>
														<a href="javascript:void(0);" @click="edit(item)" class="pull-right btn btn-xs btn-white">
															<i class="fa fa-circle-o"></i> 编辑
														</a>
														牵头部门：{{ officeNameMap[item.officeId] }}
													</div>
												</li>
											</template>
										</ul>
									</div>
								</div>
							</template>
						</layui-fieldset>
						<layui-item v-if="false">
							<!-- 主任委员 -->
							<layui-inline-select
								label="主任委员"
								:items="chairmanUsers"
								v-model="meetingInfo.chairmanUserId"
								v-if="meetingMemberTypeMap['5']">
								<layui-radio 
									v-model="meetingInfo.moderatorUserId" 
									label="会议主持人" 
									:val="meetingInfo.chairmanUserId ? meetingInfo.chairmanUserId : '-1'"></layui-radio>
							</layui-inline-select>
							<!-- 主任委员 -->
							<layui-inline-select
								label="副主任委员"
								:items="viceChairmanUsers"
								v-model="meetingInfo.viceChairmanUserId"
								v-if="meetingMemberTypeMap['6']">
								<layui-radio 
									v-model="meetingInfo.moderatorUserId" 
									label="会议主持人" 
									:val="meetingInfo.viceChairmanUserId ? meetingInfo.viceChairmanUserId : '-2'"></layui-radio>
							</layui-inline-select>
						</layui-item>
						<layui-item v-if="false && meetingMemberTypeMap['4'] && meetingInfo.meetingTypeDict != 1 && meetingInfo.meetingTypeDict != 2">
							<layui-inline-select
								label="主持人"
								:items="moderatorUsers"
								v-model="meetingInfo.moderatorUserId"></layui-inline-select>
						</layui-item>
						
                        <template v-for="mf in memberFieldset">
                            <layui-fieldset
                                v-if="meetingMemberTypeMap[mf.memberType]"
                                :key="mf.memberTypeName"
                                :label="mf.memberTypeName"
                                :showBoder="true">
                                    <i @click="selectMembers(mf.memberType)" class="fa fa-plus text-warning select-pros" style="font-size: 16px;cursor: pointer;"></i>
                                    <template slot="main">
                                        <layui-inline-checkbox
                                            valKey="userId"
                                            labelKey='userName'
                                            :labelMap="userMap"
                                            :items="meetingMembers.filter(mm => mm.meetingMemberTypeDict == mf.memberType)"
                                            v-model="checkedMembers"
                                            @clickCheckboxAfter="clickUserCheckboxAfter"
                                            :cssStyle="{'margin-bottom': '15px','margin-left': '20px'}"></layui-inline-checkbox>
                                    </template>
                            </layui-fieldset>
                        </template>
						<layui-item>
							<layui-inline-select
                                v-if="false && meetingMemberTypeMap['7']"
								label="监理负责人"
								:items="supervisorUsers"
								v-model="meetingInfo.supervisorUserId"></layui-inline-select>
							<layui-inline-select
                                v-if="meetingMemberTypeMap['11']"
								label="审议人"
								:items="oneVoteVetoUsers"
								v-model="meetingInfo.oneVoteVetoUserId"></layui-inline-select>
						</layui-item>
                        <layui-fieldset label="会议相关说明" iconClass='fa fa-volume-up text-warning'>
                            <template slot="main">
                                <div class="layui-tab layui-tab-card">
                                    <ul class="layui-tab-title">
                                        <li 
                                            v-for="(contentType, index) in contentTypes"
                                            :key="contentType.id"
                                            :class="{'layui-this': index == 0}">{{ contentType.label }}</li>
                                    </ul>
                                    <div class="layui-tab-content">
                                    <template v-for="(contentType,index) in contentTypes">
                                        <div 
                                            :class="{'layui-tab-item': true, 'layui-show': index == 0}"
                                            :key="contentType.id">
                                            <div class="layui-form-item">
                                                <div class="layui-inline group-box" style="border: 1px solid #e6e6e6;padding-right: 5px;padding-top: 5px;padding-left: 5px;">
                                                    <layui-inline-select
                                                        label="内容模板"
                                                        labelKey="name"
                                                        valKey="id"
                                                        v-model="selectTemplates[index]"
                                                        :items="meetingContentTemplates.filter(mt => mt.contentTypeDict == contentType.value)">
                                                        <button  @click="trueSelectTemplate(index)" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-check" aria-hidden="true"></i> 确认选择</button>
                                                        <button  @click="saveTemplate(index)" class="layui-btn layui-btn-lg layui-btn-orange"><i class="fa fa-save" aria-hidden="true"></i> 保存为模版</button>
                                                    </layui-inline-select>
                                                </div>
                                                <div class="layui-inline group-box" style="border: 1px solid #e6e6e6;padding-right: 5px;padding-top: 5px;padding-left: 5px;">
                                                    <layui-inline-select
                                                        label="会议变量"
                                                        valKey="label"
                                                        v-model="selectVars[index]"
                                                        :items="meetingVars">
                                                        <button  @click="insertVar(index)" class="layui-btn layui-btn-lg layui-btn-blue"><i class="iconfont icon-Inserttopic"></i> 插入变量</button>
                                                    </layui-inline-select>
                                                </div>
                                            </div>
                                            <ue v-model="meetingInfo[contentType.value]" :ref="'ue' + index"></ue>
                                        </div>
                                    </template>
                                    </div>
                                </div>
                            </template>
                        </layui-fieldset>
                        <layui-item v-if="enableSessionConfig && false">
                            <layui-inline-switch
                                label="开启会议环节配置"
                                v-model="meetingInfo.enableConfMeetingSession"></layui-inline-switch>
                        </layui-item>
                        <layui-fieldset v-if="enableSessionConfig && meetingInfo.enableConfMeetingSession == 'y'" label="会议环节配置" iconClass='fa fa-wrench text-warning' :close="sessionConfigClose">
                            <i @click="addMeetingSession" class="fa fa-plus text-warning select-pros" style="font-size: 16px;cursor: pointer;"></i>
                            <template slot="main">
                                <table class="footable table table-stripped">
                                    <thead>
                                        <tr>
                                            <th class="center">环节序号</th>
                                            <th class="center">环节名称</th>
                                            <th class="center">环节视图</th>
                                            <th class="center">环节标题</th>
                                            <th class="center">环节显示</th>
                                            <th class="center">会前公开</th>
                                            <th class="center">描述</th>
                                            <th class="center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody id="meetingTbody" class="footable_table">
                                        <template v-for="(item, index) in meetingSessions">
                                            <tr 
                                                :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                style="display: table-row;"
                                                :key="'ms_' + index"
                                                 v-dragging="{ item: item, list: meetingSessions, group: 'meetingSessions' }">
                                                <td style="text-align:center;">{{ index + 1 }}</td>
                                                <td style="text-align:center;">
                                                    <layui-inline-input
                                                        v-model="item.name"/>
                                                </td>
                                                <td style="text-align:center;overflow: visible;">
                                                    <layui-select
                                                        :items="meetingSessionDicts"
                                                        lay-verify="required"
                                                        v-model="item.viewTypeDict"></layui-select>
                                                </td>
                                                <td style="text-align:center;">
                                                    <layui-inline-input
                                                        v-model="item.title"/>
                                                </td>
                                                <td style="text-align:center;overflow: visible;">
                                                    <layui-select
                                                        :items="viewShowTypes"
                                                        v-model="item.viewShowTypeDict"></layui-select>
                                                </td>
                                                <td style="text-align:center;overflow: visible;">
                                                    <layui-select
                                                        :items="yesNos"
                                                        v-model="item.beforePublic"></layui-select>
                                                </td>
                                                <td style="text-align:center;">
                                                    <layui-inline-input
                                                        v-model="item.sessionDesc"/>
                                                </td>
                                                <td style="text-align:center;">
                                                    <a @click="delMeetingSession(index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>移除</a>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                    <tfoot>
                                    </tfoot>
                                </table>
                            </template>
                        </layui-fieldset>
                        <layui-fieldset v-if="false" label="会议相关说明" iconClass='fa fa-volume-up text-warning'>
                            <template slot="main">
                                <div class="layui-tab layui-tab-card">
                                    <ul class="layui-tab-title">
                                        <li 
                                            v-for="(contentType, index) in contentTypes"
                                            :key="contentType.id"
                                            :class="{'layui-this': index == 0}">{{ contentType.label }}</li>
                                    </ul>
                                    <div class="layui-tab-content">
                                    <template v-for="(contentType,index) in contentTypes">
                                        <div 
                                            :class="{'layui-tab-item': true, 'layui-show': index == 0}"
                                            :key="contentType.id">
                                            <div class="layui-form-item">
                                                <div class="layui-inline group-box" style="border: 1px solid #e6e6e6;padding-right: 5px;padding-top: 5px;padding-left: 5px;">
                                                    <layui-inline-select
                                                        label="内容模板"
                                                        labelKey="name"
                                                        valKey="id"
                                                        v-model="selectTemplates[index]"
                                                        :items="meetingContentTemplates.filter(mt => mt.contentTypeDict == contentType.value)">
                                                        <button  @click="trueSelectTemplate(index)" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-check" aria-hidden="true"></i> 确认选择</button>
                                                        <button  @click="saveTemplate(index)" class="layui-btn layui-btn-lg layui-btn-orange"><i class="fa fa-save" aria-hidden="true"></i> 保存为模版</button>
                                                    </layui-inline-select>
                                                </div>
                                                <div class="layui-inline group-box" style="border: 1px solid #e6e6e6;padding-right: 5px;padding-top: 5px;padding-left: 5px;">
                                                    <layui-inline-select
                                                        label="会议变量"
                                                        valKey="label"
                                                        v-model="selectVars[index]"
                                                        :items="meetingVars">
                                                        <button  @click="insertVar(index)" class="layui-btn layui-btn-lg layui-btn-blue"><i class="iconfont icon-Inserttopic"></i> 插入变量</button>
                                                    </layui-inline-select>
                                                </div>
                                            </div>
                                            <ue v-model="meetingInfo[contentType.value]" :ref="'ue' + index"></ue>
                                        </div>
                                    </template>
                                    </div>
                                </div>
                            </template>
                        </layui-fieldset>
                        <layui-inline class="btn-group-center hidden">
                            <button ref="saveBtn" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="save"><i class="fa fa-save"></i> 保存</button>
                            <button ref="publishBtn" class="layui-btn layui-btn-lg layui-btn-orange" lay-submit lay-filter="release"><i class="fa fa-paper-plane" aria-hidden="true"></i> 发布</button>
                            <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                        </layui-inline>
					</layui-form>
				</div>
			</div>
           
            <div class="layui-form-item layui-layout-admin">
                <div class="layui-input-block">
                    <div class="layui-footer" style="text-align:center;left: 0;">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" @click="toClick('saveBtn')"><i class="fa fa-save"></i> 保存</button>
                        <button class="layui-btn layui-btn-lg layui-btn-orange" @click="toClick('publishBtn')"><i class="fa fa-paper-plane" aria-hidden="true"></i> 发布</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </div>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
import { getConfMembers } from '@/api/meeting/confMember'
import { getMeetingSubjects } from '@/api/meeting/meetingSubject'
import { getCreateMeetingInitData, saveMeetingInfo, delSubject } from '@/api/meeting/meeting'
import { getMeetingContentTemplates, saveOrUpdate as saveOrUpdateContentTemplate } from '@/api/meeting/meetingContentTemplate'
import { getMeetingConfLinkages } from '@/api/meeting/confLinkage'
import UserSelectList from '@/components/UserSelectList'
import SortedUserList from '@/views/meeting/SortedUserList'
import WatingSubjectList from '@/views/meeting/WatingSubjectList'
import { formatDate } from '@/utils/formatUtils'
import { getToken } from '@/utils/auth'
import Base from "@/views/base/Base"

const curDate = new Date();

export default {
    name: 'CreateMeeting',
	extends: Base,
    data () {
        return {
            meetingStatus: [{"label":"全部", value:"", selected: 1}],
            meetingTypes: [{"label":"全部", value:"", selected: 1}],
            memberTypeDicts: [],
			memberTypes: [],
            contentTypes: [],
            meetingSessionDicts: [],
            meetingSessions: [],
            viewShowTypes: [],
            filterMemberFieldsetValues: [11], //[4, 5, 6, 11],
            meetingMemberTypeMap: {},
            memberFieldset: [],
            projectOfficeMap: {},
            meetingSubjectTypeMap: {},
            officeNameMap: {},
            subjectIds: this.$route.params.subjectIds,
            subjects: null,
            meetingInfo: {
                id: this.$route.params.meetingId,
                officeId: this.$route.params.officeId,
                meetingName: null,
                meetingNumber: null,
                meetingYear:curDate.getFullYear() + '',
                meetingSequence: null,
                meetingSequenceName: null,
                meetingTime: formatDate(curDate, 'YYYY-MM-DD'),
                meetingStartTime: null,
                meetingEndTime: null,
                meetingRoom: null,
                meetingPic: null,
                meetingTypeDict: this.$route.params.meetingTypeDict,
                supervisorUserId: null,
                moderatorUserId: null,
                chairmanUserId: null,
                viceChairmanUserId: null,
                oneVoteVetoUserId: null,
                attendanceContent: null,
                meetingStartContent: null,
                voteCheckDesc: null,
                meetingEndContent: null,
                meetingSummary: null,
                enableConfMeetingSession: 'y',
                testFlag: 'n'
            },
            userMap: {},
            confMemberAroleMap: {},
            meetingMembers: [],
            radioCheckedIndex: 0,
            meetingTemplateMap: {},
            selectTemplates: {},
            meetingVars: [],
            selectVars: {},
            memberType: '',
            office: {
                name: '',
            },
            members: [],
			release: false,
			initEnd: false,
			checkedMembers: [],
            meetingContentTemplates: [],
            defaultVotingPassRateMap: {
                6: 0.5
            },
            enableVote: process.env.VUE_APP_MEETING_SUBJECT_ENABLE_VOTE != '1',
            enableSessionConfig: process.env.VUE_APP_MEETING_ENABLE_SESSION_CONFIG != '1',
            yesNos: [{
                label: '是',
                value: 'y'
            },{
                label: '否',
                value: 'n'
            }],
            sessionConfigClose: true,
        }
    },
    computed: {
    	meetingTypeMap: function(){
    		return this.meetingTypes.array2Obj('value', 'label');
    	},
    	memberTypeMap: function(){
    		return this.memberTypes.array2Obj('value', 'label');
    	},
        userOffice: function(){
            return this.$store.state.user.user.office;
		},
		chairmanUsers: function() {
			return this.handleAfterUsers('5');
		},
		viceChairmanUsers: function() {
			return this.handleAfterUsers('6');
		},
		moderatorUsers: function() {
			return this.handleAfterUsers('4');
		},
		supervisorUsers: function() {
			return this.handleAfterUsers('7');
		},
		oneVoteVetoUsers: function() {
			var users = [];
			var members = this.meetingMembers;
			members.forEach((member) => {
				if (member.checked) {
					users.push({
						label: this.userMap[member.userId],
						value: member.userId
					});
				}
			});
			return users;
		}
    },
    watch: {
    	'meetingInfo.supervisorUserId': function() {
    		this.updateFlag(this.meetingInfo.supervisorUserId, 7);
    	},
    	'meetingInfo.chairmanUserId': function() {
            
            let meetingInfo = this.meetingInfo;
            if (meetingInfo.meetingTypeDict == 1 || meetingInfo.meetingTypeDict == 2) {
                if (!meetingInfo.chairmanUserId && !meetingInfo.viceChairmanUserId) {
                    this.$set(this.meetingInfo, 'moderatorUserId', '');
                    this.updateFlag(this.meetingInfo.chairmanUserId, 5);
                    this.updateFlag(this.meetingInfo.moderatorUserId, 4);
                } else if (this.meetingInfo.moderatorUserId == -1 && meetingInfo.chairmanUserId) {
                    this.$set(this.meetingInfo, 'moderatorUserId', meetingInfo.chairmanUserId);
                } else if (meetingInfo.chairmanUserId != this.meetingInfo.moderatorUserId && this.meetingInfo.moderatorUserId != meetingInfo.viceChairmanUserId) {
                    this.$set(this.meetingInfo, 'moderatorUserId', '');
                    this.updateFlag(this.meetingInfo.chairmanUserId, 5);
                    this.updateFlag(this.meetingInfo.moderatorUserId, 4);
                } else {
                    this.updateFlag(this.meetingInfo.chairmanUserId, 6);
                }
            } else {
                this.updateFlag(this.meetingInfo.chairmanUserId, 5);
            }
    	},
    	'meetingInfo.viceChairmanUserId': function() {
            let meetingInfo = this.meetingInfo;
            if ((meetingInfo.meetingTypeDict == 1 || meetingInfo.meetingTypeDict == 2)) {
                if (!meetingInfo.chairmanUserId && !meetingInfo.viceChairmanUserId) {
                    this.$set(this.meetingInfo, 'moderatorUserId', '');
                    this.updateFlag(this.meetingInfo.viceChairmanUserId, 6);
                    this.updateFlag(this.meetingInfo.moderatorUserId, 4);
                }  else if (this.meetingInfo.moderatorUserId == -2 && meetingInfo.viceChairmanUserId) {
                    this.$set(this.meetingInfo, 'moderatorUserId', meetingInfo.viceChairmanUserId);
                } else if (meetingInfo.chairmanUserId != this.meetingInfo.moderatorUserId && this.meetingInfo.moderatorUserId != meetingInfo.viceChairmanUserId) {
                    this.$set(this.meetingInfo, 'moderatorUserId', '');
                    this.updateFlag(this.meetingInfo.viceChairmanUserId, 6);
                    this.updateFlag(this.meetingInfo.moderatorUserId, 4);
                } else {
                    this.updateFlag(this.meetingInfo.viceChairmanUserId, 6);
                }
            } else {
                this.updateFlag(this.meetingInfo.viceChairmanUserId, 6);
            }
        },
        'meetingInfo.moderatorUserId': function() {
            this.updateFlag(this.meetingInfo.chairmanUserId, 5);
            this.updateFlag(this.meetingInfo.viceChairmanUserId, 6);
            this.updateFlag(this.meetingInfo.moderatorUserId, 4);
        },
	},
	mounted: function () {

        // this.office.name = this.userOffice.name;
        if (!this.meetingInfo.id) {
            this.meetingInfo.officeId = this.curUser.office.id || -1;
            this.officeNameMap[this.meetingInfo.officeId] = this.curUser.office.name || "";
        }
		
		this.initData();
		
        this.layuiInit();
    },
    methods: {
        addMeetingSession: function() {
            this.sessionConfigClose = false;
            this.meetingSessions.push({
                name: '',
                title: '',
                sessionDesc: '',
                viewTypeDict: '',
                viewShowTypeDict: 'all'
            });
        },
        delMeetingSession: function(index) {
            confirm("确定移除该环节吗？", () => {
                this.meetingSessions.splice(index, 1);
            });
        },
		handleAfterUsers: function(memberType) {
			var users = [];
			var members = this.confMemberAroleMap[memberType] || [];
			members.forEach((member) => {
				users.push({
					label: this.userMap[member.memberId],
					value: member.memberId
				});
			});
			return users;
		},
        updateFlag: function(val, type) {
            return;
            for (var i = 0; i < this.meetingMembers.length; i++) {
                if (this.meetingMembers[i].meetingMemberTypeDict == type) {
                    let mm = this.meetingMembers[i];
                    mm.checked = false;
                    this.$set(this.meetingMembers, i, mm);
                }
            }

            if (!val) {
                return;
            }

            var index = this.meetingMembers.indexOf(val, "userId");
            if (index != -1) {
                var mm = this.meetingMembers[index];
                mm.meetingMemberTypeDict = type;
                mm.checked = true;
                this.$set(this.meetingMembers, index, mm);
            }
        },
    	existSub: function(subId){
    		for(var i = 0; i < this.subjects.length; i++){
    			if(this.subjects[i].id == subId){
    				return true;
    			}
    		}
    		return false;
    	},
    	showWatingSubjects: function(){
			if(this.meetingInfo.meetingTypeDict){
				getMeetingSubjects({"meetingSubjectStatusDict": 1, 'meetingTypeDict': this.meetingInfo.meetingTypeDict}).then(result => {
			
					var data = result.data;
					var selectedSubjects = data.subjects || [];
					var _subjects = [];
					selectedSubjects.forEach(sub => {
						if(!this.existSub(sub.id)){
							_subjects.push(sub);
						}
					});
					if(_subjects.length <= 0){
						alert("没有可被添加的议题，您可以先去议题管理中创建新的议题");
					} else {
						Object.assign(this.projectOfficeMap, data.projectOfficeMap || {});
						Object.assign(this.officeNameMap, data.officeNameMap || {});

						this.$layer.iframe({
							content: {
								content: WatingSubjectList, //传递的组件对象
								parent: this,//当前的vue对象
								data:{
									subjects: _subjects,
									meetingSubjectTypeMap: this.meetingSubjectTypeMap,
									officeNameMap: this.officeNameMap,
									projectOfficeMap: this.projectOfficeMap
								}//props
							},
							area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
							title:"添加议题"
						});
					}
				});
			}
		},
		trueSelectedSubjects: function(selectedSubjects){
			selectedSubjects.forEach(item => {
				this.subjects.push(item);
			});
			this.$layer.closeAll();
		},
    	confirmMemberOrder: function(){
    		var meetingMembers = this.meetingMembers;
    		var mtds = this.memberTypeDicts.join(',');
    		meetingMembers = meetingMembers.filter(function(item){
    			return item.checked && mtds.indexOf(item.meetingMemberTypeDict) != -1;
    		});

    		var mtdArr = ['4','5','6','2','7','1','3','8'];
    		meetingMembers.sort((x, y) => {
    			if(x.memberOrder && !y.memberOrder){
    				return 1;
    			}
    			if(!x.memberOrder && y.memberOrder){
    				return -1;
    			}
    			if(x.memberOrder && y.memberOrder){
    				return x.memberOrder - y.memberOrder;
    			}
    			if(!x.memberOrder && !y.memberOrder){
    				return mtdArr.indexOf(x.meetingMemberTypeDict) - mtdArr.indexOf(y.meetingMemberTypeDict);
    			}
    		})
    		this.members = meetingMembers;
    		if (this.meetingInfo.meetingTypeDict == 1 || this.meetingInfo.meetingTypeDict == 2) {
    			// var moderatorUserId = this.radioCheckedIndex == 0 ? this.meetingInfo.chairmanUserId : this.meetingInfo.viceChairmanUserId;
    			// var index = this.members.indexOf(moderatorUserId, 'userId');
    			// if(index != -1 && this.members[index].meetingMemberTypeDict != 4){
    			// 	this.members[index].meetingMemberTypeDict = 4;
    			// 	this.$set(this.members, index, this.members[index]);
    			// }
			}
			
			this.$layer.iframe({
				content: {
					content: SortedUserList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						members: this.members,
						userMap: this.userMap,
						memberTypeMap: this.memberTypeMap
					}//props
				},
				area: ['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "参会人员确认排序"
			});
		},
		orderAfter: function(orderedMembers){
			this.$layer.closeAll();
			orderedMembers.forEach((item, index) => {
				item.memberOrder = index + 1;
			});
			//alert('oa->' + this.userMap[orderedMembers[orderedMembers.length - 1].userId].name);
			this.members = orderedMembers;
			this.save(this.release ? "release" : "save");
		},
    	officeChange: function(){
    		this.meetingMembers = [];
            //$(".user-checkbox").empty();
            getConfMembers({"officeId": this.meetingInfo.officeId, 'meetingTypeDict': this.meetingInfo.meetingTypeDict, 'memberTypeDict': this.memberTypeDicts.join(',')}).then(result => {
                var data = result.data;
    			var confMembers = data.confMembers || []; 
    			this.userMap = data.userMap || {};
    			var confMemberDetails = data.confMemberDetails || [];
    			var confMemberAroleMap = {};
    			var type = null;
        		for(var i = 0; i < confMembers.length; i++){
        			var arr = confMemberAroleMap[confMembers[i].memberTypeDict] || [];
        			for(var j = 0; j < confMemberDetails.length; j++){
        				if(confMemberDetails[j].abRoleDict === '1' && confMembers[i].id === confMemberDetails[j].confMemberId){
        					arr.push(confMemberDetails[j]);
        					if(!this.existMember(confMemberDetails[j].memberId)){
        						this.meetingMembers.push({
        							'userId': confMemberDetails[j].memberId,
        							'meetingMemberTypeDict': confMembers[i].memberTypeDict,
        							'checked': true//"4,5,6".indexOf(confMembers[i].memberTypeDict) != -1 ? false : true
        						});
        					}
        				}
        			}
        			confMemberAroleMap[confMembers[i].memberTypeDict] = arr;
        			type = confMembers[i].memberTypeDict;
        		}
        		this.confMemberAroleMap = confMemberAroleMap;
        		//this.$set(this.meetingMembers, 0, this.meetingMembers.length);
        		if(type){
        			this.$set(this.confMemberAroleMap, type, this.confMemberAroleMap[type]);
        		}
            });
        },
        clickNodeAfter: function(node){
            confirm("切换部门系统将会调整参会人员，如果确认切换则提取新的部门的配置参会人员取代当前的,确定切换吗?", () => {
    			this.meetingInfo.officeId = node.id;
                this.office.name = node.name;
                this.officeNameMap[node.id] = node.name;
                this.$layer.closeAll();
    			this.officeChange();
    		});
        },
    	officeClick: function(){
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: [
                       
                    ]
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title:"会议部门选择"
			});
    	},
    	remove: function(subject){
    		confirm("确定移除该议题吗？", () => {
    			if(this.meetingInfo.id){
					delSubject(this.meetingInfo.id, subject.id).then(result => {
						this.subjects.remove(subject.id, "id");
            			alert("移除成功!");
					});
    			} else {
					this.subjects.remove(subject.id, "id");
					alert("移除成功!");
    			}
    		});
    	},
    	trueSwitchOffice: function(officeId, officeName){
    		confirm("切换部门系统将会调整参会人员，如果确认切换则提取新的部门的配置参会人员取代当前的,确定切换吗?", function(){
    			this.meetingInfo.officeId = officeId;
    			this.office.name = officeName;
    			this.layer.close(this.index);
    			this.officeChange();
    		});
		},
		getSelectUsers: function(users, officeMap, layerid){
			console.log(users);
			var names = [];
			var userList = users;
			for(var i = 0; i < userList.length; i++){
				var index = this.meetingMembers.indexOf(userList[i].userId, "userId");
				if(index != -1){
					var mm = this.meetingMembers[index];
					if(!existRoleMember(mm, this)){
						mm.meetingMemberTypeDict = this.memberType;
						mm.checked = true;
						if(this.checkedMembers.indexOf(mm.userId) == -1) {
							this.checkedMembers.push(mm.userId);
						}
						this.$set(this.meetingMembers, index, mm);
					} else {
						names.push(this.userMap[mm.userId]);
						this.checkedMembers.push(mm.userId);
					}
				} else {
					this.meetingMembers.push({
						'userId': userList[i].userId,
						'meetingMemberTypeDict': this.memberType,
						'checked': true
					});
					this.userMap[userList[i].userId] = userList[i].userName;
					this.checkedMembers.push(userList[i].userId);
				}
			}
			//Vue.set(vm.meetingMembers, 0, vm.meetingMembers[0]);
			if(names.length > 0){
				alert(names.join(',') + " 已存在于下拉框勾选的人员中，已忽略");
			}
			var _this = this;
			function existRoleMember(mm, obj){
				var mi = obj.meetingInfo;
				return mm.userId == mi.supervisorUserId || mm.userId == mi.moderatorUserId || mm.userId == mi.chairmanUserId || mm.userId == mi.viceChairmanUserId;
			}
			this.$layer.close(layerid);
		},
    	selectMembers: function(memberType){
			//alert("开发中--" + memberType);
			this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
			});
    		this.memberType = memberType;
    	},
    	trueSelectTemplate: function(tabIndex){
			confirm('确定使用选中的模版(确定后将覆盖您现在的内容)吗?', () => {
                var templateId = this.selectTemplates[tabIndex];
                var index = this.meetingContentTemplates.indexOf(templateId, "id");
                if (index != -1) {
                    this.$refs['ue' + tabIndex][0].setContent(this.meetingContentTemplates[index].content);
                }
			});
    	},
    	saveTemplate: function(tabIndex){
            layer.prompt((val, index) => {
                this.submitHandler((token) => {     
                    var contenTemplate = {
                        content: this.$refs['ue' + tabIndex][0].getUEContent(),
                        name: val,
                        meetingTypeDict: this.meetingInfo.meetingTypeDict,
                        contentTypeDict: this.contentTypes[tabIndex].value
                    }
                    saveOrUpdateContentTemplate(JSON.stringify(contenTemplate), token).then((result) => {
                        alert(result.msg);
                    }).catch(error => {
                        this.resetToken(error);
                    });
                });
                layer.close(index);
            });
    	},
    	insertVar: function(tabIndex){
    		var value = this.selectVars[tabIndex];
    		var ue = this.$refs['ue' + tabIndex][0].editor;
    		//ue.focus();  
			ue.execCommand('inserthtml', value); 
    	},
    	updateSubjectVoteFlag: function(item) {
    		var value = (item.subjectVoteFlag == 'y' ? 'n' : 'y');
    		axios.patch('./meetingSubjects/' + item.id, 'property=subjectVoteFlag&value=' + value).then(function(res){
    			var result = res.data;
    			if(result.status == 200){
    				for(var i = 0; i < this.subjects.length; i++){
    					if(this.subjects[i].id == item.id){
    						var subject = this.subjects[i];
    						subject.subjectVoteFlag = value;
    						this.$set(this.subjects, i, subject);
    					}
    				}
    			} else {
    				alert(result.msg);
    			}
    		});
    	},
    	subjectItemClass: function(meetingTypeDict){
    		var _class = "";
    		switch(meetingTypeDict){
				case "1":_class = "warning-element"; break;
				case "2":_class = "success-element"; break;
				case "3":_class = "info-element"; break;
				case "4":_class = "danger-element"; break;
				case "5":_class = "green-element"; break;
				case "6":_class = "darkgreen-element"; break;
				case "7":_class = "darkblue-element"; break;
				default:_class = "darkblue-element";
			}
    		return _class;
    	},
    	edit: function(subject){

			this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-file-text-o",
                "id": "meeting-subject-add",
                "name": "MeetingSubjectForm",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "议题信息编辑",
                "children": [

                ]
            }, 3, {
                id: subject.id,
                projectId: subject.projectId,
            });
		},
		clickUserCheckboxAfter: function(data){
			var index = this.meetingMembers.indexOf(data.val, 'userId');
			if(index != -1){
				var member = this.meetingMembers[index];
				member.checked = data.checked;
				this.$set(this.meetingMembers, index, member);
			}
		},
    	save: function(flag) {
            this.submitHandler((token) => {
                console.log("正在提交");
                var meetingMembers = this.members;

                for(var i = 0; i < meetingMembers.length; i++){
                    delete meetingMembers[i]['checked'];
                }
                //this.members = meetingMembers;
                // this.meetingInfo.meetingStartContent = this.$refs['ue0'][0].getUEContent();
                // this.meetingInfo.attendanceContent = this.$refs['ue1'][0].getUEContent();
                // this.meetingInfo.voteCheckDesc = this.$refs['ue2'][0].getUEContent();
                // this.meetingInfo.meetingEndContent = this.$refs['ue3'][0].getUEContent();
                // this.meetingInfo = this.$refs['ue4'][0].getUEContent();
                var mi = copy(this.meetingInfo);
                function copy(obj){
                    var newobj = {};
                    for (var attr in obj) {
                        newobj[attr] = obj[attr];
                    }
                    return newobj;
                }
                if(mi.meetingTypeDict == 1 || mi.meetingTypeDict == 2){
                    // mi.moderatorUserId = this.radioCheckedIndex == 0 ? this.meetingInfo.chairmanUserId : this.meetingInfo.viceChairmanUserId;
                }
                mi.meetingStartTime = this.meetingInfo.meetingTime +  (this.meetingInfo.meetingStartTime ? (" " + this.meetingInfo.meetingStartTime) : '');
                mi.meetingEndTime = this.meetingInfo.meetingTime + (this.meetingInfo.meetingEndTime ? (" " + this.meetingInfo.meetingEndTime) : '');
                
                var subjectIds = this.subjects.map((subject) => {
                    return subject.id;
                });
                
                saveMeetingInfo({
                    'meetingInfo': JSON.stringify(mi), 
                    'subjectIds': JSON.stringify(subjectIds), 
                    'meetingMembers': JSON.stringify(meetingMembers),
                    'meetingSessions': (this.meetingInfo.enableConfMeetingSession == 'y' ? JSON.stringify(this.meetingSessions) : ''),
                    'flag': flag,
                }, token).then((result) => {
                    alert(result.msg);
                    //this.meetingInfo.id = result.data;
                    this.backListView(this.meetingInfo.id == null, 'MeetingPool');
                }).catch((error) => {
                    this.resetToken(error);
                });
            });
    	},
        initData: function(){
            var meetingId = this.meetingInfo.id;
            loading();
            getMeetingConfLinkages({
                typeDict: 'MEETING_MEMBER_TYPE_DICT',
                officeId: this.meetingInfo.meetingTypeDict
            }).then(res => {
                var dicts = res.data.dicts || [];
                var memberTypeDicts = [];
                dicts.forEach(dict => {
                    memberTypeDicts.push(dict.value);
                    this.meetingMemberTypeMap[dict.value] = dict.value;
                });
                this.memberTypeDicts = memberTypeDicts;
                getCreateMeetingInitData(this.meetingInfo, this.subjectIds, memberTypeDicts).then(results => {

                    // 初始化字典值
                    var data = results[0].data;
                    var mts = data[0];
                    mts.unshift(this.meetingTypes[0]);
                    this.meetingTypes = mts;
                    this.meetingSubjectTypeMap = data[1].array2Obj('value', 'label');
                    this.meetingVars = data[2] || [];
                    this.memberTypes = data[3] || [];
                    this.memberTypes.forEach(item => {
                        if (this.filterMemberFieldsetValues.indexOf(item.value) == -1) {
                            this.memberFieldset.push({
                                'memberType': item.value, 
                                'memberTypeName': item.label
                            });
                        }
                    });
                    
                    this.contentTypes = data[4] || [];
                    this.meetingSessionDicts = data[5] || [];
                    if (!meetingId) {
                        this.meetingSessionDicts.forEach((item, index) => {
                            if (item.desc) {
                                var conf = JSON.parse(item.desc);
                                if (conf.default) {
                                    this.meetingSessions.push({
                                        name: item.label,
                                        viewTypeDict: item.value,
                                        title: '',
                                        sessionDesc: '',
                                        viewShowTypeDict: 'all',
                                        beforePublic: (conf.public || 'n')
                                    });
                                }
                            }
                        });
                    }

                    this.viewShowTypes = data[6] || [];
                    
                    // 新增时议题数据初始化 修改时会议信息初始化
                    var data = results[1].data;
                    if (!data) {
                        this.subjects = [];
                        return;
                    }
                    this.subjects = data.subjects || [];
                    this.projectOfficeMap = data.projectOfficeMap || {};
                    Object.assign(this.officeNameMap, data.officeNameMap || {});
                    if (meetingId) {
                        this.office.name = data.officeName || "";
                        this.officeNameMap = data.officeNameMap || {};
                        var subjectData = results[4].data;
                        if (subjectData) {
                            this.subjects = subjectData.meetingSubjects || [];
                            this.projectOfficeMap = subjectData.projectOfficeMap || {};
                            Object.assign(this.officeNameMap, (subjectData.officeNameMap || {}));
                            var _subjectIds = "";
                            for (var i = 0; i < this.subjects.length; i++) {
                                _subjectIds +=  this.subjects[i].id + ",";
                            }
                            var subjectIds = _subjectIds.substr(0, _subjectIds.length - 1);
                        }
                        var mi = data.meetingInfo || {};
                        mi.meetingTime = mi.meetingTime ? formatDate(mi.meetingTime, "YYYY-MM-DD") : "";
                        mi.meetingStartTime = mi.meetingStartTime ? formatDate(mi.meetingStartTime, "HH:mm:ss") : "";
                        mi.meetingEndTime = mi.meetingEndTime ? formatDate(mi.meetingEndTime, "HH:mm:ss") : "";
                        for (var key in mi) {
                            this.meetingInfo[key] = mi[key];
                        }
                        var memberData = results[5].data;
                        if (memberData) {
                            var meetingMembers = memberData.meetingMembers || [];
                            for (var i = 0; i < meetingMembers.length; i++) {
                                meetingMembers[i].checked = true;
                                this.checkedMembers.push(meetingMembers[i].userId);
                            }
                            this.meetingMembers = meetingMembers;
                            Object.assign(this.userMap, (memberData.userMap || {}))
                        }

                        var meetingSessionData = results[6].data;
                        if (meetingSessionData && meetingSessionData.length > 0) {
                            this.enableConfMeetingSession = true;
                            this.meetingSessions = meetingSessionData || [];
                        }
                    } else {
                        this.meetingInfo.votingPassRate = this.defaultVotingPassRateMap[this.meetingInfo.meetingTypeDict] || '0.75';
                         this.meetingInfo.meetingPic = '/meeting/mp-' + this.$route.params.meetingTypeDict + ".png";
                    }
                    // 默认部门以及会议类型下 配置人员数据 初始化
                    var data = results[2].data;
                    var confMembers = data.confMembers || []; 
                    this.userMap = this.mergeJsonObject(this.userMap, (data.userMap || {}));
                    var confMemberDetails = data.confMemberDetails || [];
                    var confMemberAroleMap = {};
                    for(var i = 0; i < confMembers.length; i++){
                        var arr = confMemberAroleMap[confMembers[i].memberTypeDict] || [];
                        for(var j = 0; j < confMemberDetails.length; j++){
                            if(confMemberDetails[j].abRoleDict === '1' && confMembers[i].id === confMemberDetails[j].confMemberId){
                                arr.push(confMemberDetails[j]);
                                if(!this.existMember(confMemberDetails[j].memberId)){
                                    var checked = (meetingId) ? false : true; // || "4,5,6".indexOf(confMembers[i].memberTypeDict) != -1
                                    this.meetingMembers.push({
                                        'userId': confMemberDetails[j].memberId,
                                        'meetingMemberTypeDict': confMembers[i].memberTypeDict,
                                        'checked': checked
                                    });
                                    if (checked) {
                                        this.checkedMembers.push(confMemberDetails[j].memberId);
                                    }
                                }
                            }
                        }
                        confMemberAroleMap[confMembers[i].memberTypeDict] = arr;
                    }
                    this.confMemberAroleMap = confMemberAroleMap;
                
                    // 会议说明模板 初始化
                    var data = results[3].data || [];
                    var meetingTemplateMap = {};
                    for (var i = 0; i < data.length; i++) {
                        var items = meetingTemplateMap[data[i].catalogueTitle] || [];
                        items.push(data[i]);
                        meetingTemplateMap[data[i].catalogueTitle] = items;
                    }
                    
                    this.meetingTemplateMap = meetingTemplateMap;
                    
                    this.$nextTick(() => {
                        this.initEnd = true;
                    });
                    // this.globalReadonly = true;
                    // this.globalReadonly = false;
                    closeLoading();
                });
            }).catch(error => {
                closeLoading();
            });
			
			getMeetingContentTemplates({
				meetingTypeDict: this.meetingInfo.meetingTypeDict
			}).then((res) => {
				this.meetingContentTemplates = res.data.meetingContentTemplates || [];
			});
        },
        existMember: function(memberId){
        	for(var i = 0; i < this.meetingMembers.length; i++){
        		if(this.meetingMembers[i].userId == memberId){
        			return true;
        		}
			}
        	return false;
        },
        mergeJsonObject: function(jsonbject1, jsonbject2){
			var resultJsonObject = {};
			for(var attr in jsonbject1) {
			   resultJsonObject[attr] = jsonbject1[attr];
			}
			for(var attr in jsonbject2) {
			   resultJsonObject[attr] = jsonbject2[attr];
			}
			return resultJsonObject;
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form', 'layedit', 'upload'], function(){
        		var element = element
        		,form = layui.form
				,layer = layui.layer
				,layedit = layui.layedit
                ,upload = layui.upload;

				//普通图片上传
				var uploadInst = upload.render({
					elem: '#uploadBtn',
					url: './api/file/upload/img?module=meeting',
					headers: {
                        Authorization: ('Bearer ' + getToken())
                    },
					before: function(obj){
						obj.preview(function(index, file, result){
					       $('#meetingImg').attr('src', result); //图片链接（base64）
					    });
					},
					done: function(res){
						//如果上传失败
						if(res.status != 200){
					        return layer.msg(res.msg);
					    }
					    //上传成功
						layer.msg('上传成功')
                        _this.$set(_this.meetingInfo, 'meetingPic', res.data);
                        var demoText = $('#demoText');
                        demoText.empty();
						//$('#meetingImg').attr('src', res.data); //图片链接（base64）
					},
					error: function(){
						//演示失败状态，并实现重传
					    var demoText = $('#demoText');
					    demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
					    demoText.find('.demo-reload').on('click', function(){
					        uploadInst.upload();
					    });
				    }
				});

				//创建一个编辑器
				var editIndex = layedit.build('LAY_demo_editor');

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
		
				form.on('submit(save)', function(data){
					this.release = false;
					_this.confirmMemberOrder();
					return false;
				});

				form.on('submit(release)', function(data){
					layer.confirm("是否直接发布?", function(index){
    	    			layer.close(index);
    	    			_this.release = true;
    	    			_this.confirmMemberOrder();
    	    		});
					return false;
				});
				
				$(".my-btn").click(function(){
					eval($(this).attr('trigger-func'));
				});
				
        	});

        }
    }
}
</script>

<style scoped>
    .row {
        margin-right: 0;
        margin-left: 0;
    }
	.view-product /deep/ .group-box .layui-form-label {
		width: 84px;
	}
    .table > thead > tr > th, td {
        text-align: center;
    }
    table .layui-input, table /deep/ .layui-input, .layui-select, .layui-textarea {
        height: 30px;
    }
    .view-product {
        padding-bottom: 0px;
    }
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
</style>


