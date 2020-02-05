<template>
    <div class="view-product" v-cloak>
		<div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
                    <layui-fieldset label="项目信息">
                        <template slot="main">

                            <layui-item>
                                <layui-inline-input
                                    label="项目名称"
                                    placeholder="请输入项目名称"
                                    v-model="projectInfo.projectName"
                                    :readonly="true"
                                    :cssStyle="{width: '542px', display: 'inline-block'}">
                                    <input @click="openProjectModal" type="text" readonly=true value="从已有项目中选择" class="layui-input" style="width: 130px;float: right;border: none;cursor:pointer;    background: rgb(45, 166, 179);padding-left: 0px;text-align: center;color: #fff;">
                                </layui-inline-input>
                            </layui-item>
                            <!-- <layui-item>
                                <layui-inline-input
                                    label="项目编号"
                                    placeholder="请输入项目编号"
                                    v-model="projectInfo.projectNumber"
                                    :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                <layui-inline-select
                                    label="项目类型"
                                    v-model="projectInfo.projectTypeDict"
                                    :items="projectTypes"></layui-inline-select>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="牵头部门"
                                    placeholder="点击选择牵头部门"
                                    :value="officeNameMap[projectInfo.officeId]"
                                    func="officeClick"
                                    :readonly="true"
                                    @officeClick="officeClick(3)"></layui-inline-input>
                                <layui-inline-input
                                    label="牵头部门联系人"
                                    placeholder="点击选择牵头部门联系人"
                                    func="selectMember"
                                    :required="false"
                                    @selectMember="selectMember(-1)"
                                    :value="userMap[projectInfo.officeContactUserId]"
                                    :readonly="true"></layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="项目概算"
                                    placeholder="请输入项目概算"
                                    v-model="projectInfo.budgetFundAdjust"
                                    :cssStyle="{display: 'inline-block', width: '150px'}">
                                    <span style="padding-left: 9px;padding-right: 10px">万元</span>
                                </layui-inline-input>
                                <layui-inline-input
                                    label="总预算"
                                    placeholder="请输入总预算"
                                    v-model="projectInfo.projectTotalFund"
                                    :cssStyle="{display: 'inline-block', width: '150px'}">
                                    <span style="padding-left: 9px;padding-right: 10px">万元</span>
                                </layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-select
                                    label="项目优先级"
                                    v-model="projectInfo.projectPriorityDict"
                                    :items="projectPrioritys"></layui-inline-select>
                                <layui-inline-select
                                    label="项目实施方式"
                                    v-model="projectInfo.projectActualizeDict"
                                    :items="projectActualizes"></layui-inline-select>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="项目总工作量"
                                    placeholder="请输入项目总工作量"
                                    v-model="projectInfo.workloadTotal"
                                    :cssStyle="{display: 'inline-block', width: '150px'}">
                                    <span style="padding-left: 9px;padding-right: 9px">人月</span>
                                </layui-inline-input>
                                <layui-inline-input
                                    label="项目外包工作量"
                                    placeholder="请输入项目外包工作量"
                                    v-model="projectInfo.workloadOutsourcing"
                                    :cssStyle="{display: 'inline-block', width: '150px'}">
                                    <span style="padding-left: 9px;padding-right: 10px">人月</span>
                                </layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="项目工期"
                                    placeholder="请输入项目工期"
                                    v-model="projectInfo.projectDuration">
                                </layui-inline-input>
                                <layui-inline-date
                                    label="投产实施时间"
                                    placeholder="点击选择投产实施时间"
                                    name="projectCommissioningDate"
                                    type="date"
                                    v-model="projectInfo.projectCommissioningDate"/>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="涉及CR"
                                    placeholder="请输入CR"
                                    v-model="projectInfo.crInfo"></layui-inline-input>
                                <layui-inline-radio
                                    name="voteFlag"
                                    label="是否后评价"
                                    v-model="projectInfo.evaluateFlag"
                                    :items="voteFlags"></layui-inline-radio>
                            </layui-item>
                            <layui-item>
                                <layui-inline-textarea
                                    label="项目备注"
                                    placeholder="请输入项目备注"
                                    v-model="projectInfo.projectRemark"
                                    :cssStyle="{width: '513px', display: 'inline-block'}"/>
                            </layui-item> -->
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="分项预算内容">
                        <i @click="addRow" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>
                        <template slot="main">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>预算内容</th>
                                        <th>预算类型</th>
                                        <th>预算金额（万元）</th>
                                        <th>采购方式</th>
                                        <th>入围公司</th>
                                        <th>合同类型</th>
                                        <th>知识产权归属</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(item, index) in subjectSubitems"
                                        :key="'ss_' + index"
                                        v-dragging="{ item: item, list: subjectSubitems, group: 'subjectSubitems' }">
                                        <td>
                                            <layui-inline-input
                                                v-model="subjectSubitems[index].subitemName"></layui-inline-input>
                                        </td>
                                        <td style="overflow: visible;">
                                            <layui-select
                                                v-model="subjectSubitems[index].budgetaryTypeDict"
                                                :items="budgetaryTypes"></layui-select>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                type="number"
                                                v-model="subjectSubitems[index].subitemBudgetFund"></layui-inline-input>
                                        </td>
                                        <td style="overflow: visible;">
                                            <layui-select
                                                v-model="subjectSubitems[index].procurementStyleDict"
                                                :items="procurementStyles"></layui-select>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                v-model="subjectSubitems[index].enteringCompany"></layui-inline-input>
                                        </td>
                                        <td style="overflow: visible;">
                                            <layui-select
                                                v-model="subjectSubitems[index].contractTypeDict"
                                                :items="contractTypes"></layui-select>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                v-model="subjectSubitems[index].intellectualPropertyOwnership"></layui-inline-input>
                                        </td>
                                        <td>
                                            <a @click="del(index, 'subitem')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="议题信息">
                        <template slot="main">
                            <layui-item>
                                <layui-inline-input
                                    label="议题名称"
                                    placeholder="请输入标题"
                                    v-model="meetingSubject.subjectName"
                                    :block="true"></layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="上会部门"
                                    placeholder="点击选择上会部门"
                                    :value="officeNameMap[meetingSubject.officeId]"
                                    func="officeClick"
                                    :readonly="true"
                                    @officeClick="officeClick(1)"
                                    :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                <layui-inline-select
                                    label="上会类型"
                                    v-model="meetingSubject.meetingTypeDict"
                                    :items="meetingTypes"></layui-inline-select>
                            </layui-item>
                            <layui-item>
                                <layui-inline-radio
                                    name="voteFlag"
                                    label="是否投票"
                                    :val="meetingSubject.subjectVoteFlag"
                                    v-model="meetingSubject.subjectVoteFlag"
                                    :items="voteFlags"></layui-inline-radio>
                                <layui-inline-select
                                    label="议题类型"
                                    v-model="meetingSubject.meetingSubjectTypeDict"
                                    :items="subjectTypes"></layui-inline-select>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <add-reduce-input
                                    name="votingRound"
                                    label="投票轮次"
                                    v-model="meetingSubject.votingRound"></add-reduce-input>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <layui-inline-checkbox
                                    name="voteOptions"
                                    label="投票选项"
                                    :items="voteOptions"
                                    v-model="meetingSubject.voteOptions"></layui-inline-checkbox>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <layui-inline-checkbox
                                    name="ratingItems"
                                    label="评分选项"
                                    :items="ratingItems"
                                    v-model="meetingSubject.ratingItem"></layui-inline-checkbox>
                            </layui-item>
                            <layui-inline-ue
                                label="备注"
                                :value="meetingSubject.remark"
                                ref="remarkUe"></layui-inline-ue>
                            <layui-fieldset label="汇报内容">
                                <template slot="main">
                                    <layui-item>
                                        <layui-inline-input
                                            label="汇报部门"
                                            placeholder="点击选择汇报部门"
                                            :value="officeNameMap[meetingSubject.reportOfficeId]"
                                            func="officeClick"
                                            :readonly="true"
                                            @officeClick="officeClick(2)"
                                            :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                        <layui-inline-input
                                            label="汇报时间"
                                            placeholder="总汇报时间"
                                            v-model="meetingSubject.reportTime"></layui-inline-input>
                                    </layui-item>
                                </template>
                            </layui-fieldset>
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="汇报材料人员">
                        <i id="uploadFiles" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>
                        <template slot="main">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>材料</th>
                                        <th>人员</th>
                                        <th>部门</th>
                                        <th>汇报时间</th>
                                        <th>目录</th>
                                        <th>备注</th>
                                        <th>排序</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody v-if="refresh">
                                    <tr
                                        v-for="(item, index) in reportMembers"
                                        :key="item.sort"
                                        v-dragging="{ item: item, list: reportMembers, group: 'reportMembers' }">
                                        <td @click="preview(item)" :title="item.fileName" style="cursor: pointer">{{ item.fileName }}</td>
                                        <td>
                                            <!-- <div class="layui-input-inline">
                                                <input @click="selectMember(index)" type="text" :value="userMap[item.memberId] ? userMap[item.memberId].name : ''" readonly="readonly" lay-verify="required" autocomplete="off" class="layui-input">
                                            </div> -->
                                            <layui-inline-input
                                                placeholder="点击选择汇报人员"
                                                func="selectMember"
                                                :required="false"
                                                @selectMember="selectMember(index)"
                                                :value="userMap[item.memberId] ? userMap[item.memberId] : ''"
                                                :readonly="true"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                placeholder="点击选择汇报部门"
                                                :required="false"
                                                func="officeClick"
                                                @officeClick="officeClick(index, 'report')"
                                                :value="officeNameMap[reportMembers[index].officeId]"
                                                :readonly="true"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                type="number"
                                                placeholder="请输入汇报时间"
                                                :required="false"
                                                v-model="reportMembers[index].reportTime"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                placeholder="请输入目录"
                                                :required="false"
                                                v-model="reportMembers[index].dirName"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                placeholder="请输入备注"
                                                :required="false"
                                                v-model="reportMembers[index].remark"></layui-inline-input>
                                        </td>
                                        <td>{{ index + 1 }}</td>
                                        <td v-if="item.status == 0 || item.status == 5">{{ statusMap[item.status] }}</td>
                                        <td v-if="item.status == 1 || item.status == 3 || item.status == 6"><span style="color: #5FB878;">{{ statusMap[item.status] }}</span></td>
                                        <td v-if="item.status == 2 || item.status == 4"><span style="color: #FF5722;">{{ statusMap[item.status] }}</span></td>
                                        <td>
                                            <a v-if="item.status == 4" @click="upload(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>重传</a>
                                            <a @click="deleteReportRow(index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </layui-fieldset>
                    <layui-inline class="btn-group-center">
                        <button v-if="meetingSubject.meetingSubjectStatusDict <= 2" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveTranSubject"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
		</div>
	</div>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
import ProjectList from '@/views/meeting/ProjectList'
import { getDicts } from '@/api/dict'
import { saveOrUpdateProjectSubject, getProjectMeetingSubjectInitData, delMeetingSubjectReportMember } from '@/api/meeting/meetingSubject'
import { needToConvert } from '@/utils/fileUtils'
import { convertFile } from '@/api/file'
import UserSelectList from '@/components/UserSelectList'
import { getToken } from '@/utils/auth'
import { getAttaments, delAttament, downloadFile } from '@/api/file'
import { formatDate } from '@/utils/formatUtils'
import Base from "@/views/base/Base"

export default {
    name: 'ProjectSubjectAdd',
	extends: Base,
    data () {
        return {
            meetingTypes: [],
            memberTypes: [],
            budgetaryTypes: [],
            procurementStyles: [],
            projectTypes: [],
            contractTypes: [],
            projectPrioritys: [],
            projectActualizes: [],
            meetingSubject: {
                id: this.$route.params.id,
                meetingTypeDict: this.$route.params.meetingTypeDict || '',
                subjectName: '',
                meetingSubjectTypeDict: '',
                meetingSubjectStatusDict: '',
                subjectVoteFlag: 'n',
                votingRound: 1,
                remark: '',
                reportOfficeId: '',
                reportTime: '',
                voteOptions: [],
                ratingItem: [],
                officeId: ''
            },
            projectInfo: {
                id: this.$route.params.projectId || '',
                projectName: '',
                projectNumber: '',
                projectTypeDict: '',
                projectNatureDict: '',
                projectMajorDict: '',
                officeId: '',
                officeContactUserId: '',
                projectBudgetFund: '',
                projectTotalFund: '',
                workloadTotal: '',
                workloadOutsourcing: '',
                evaluateFlag: 'n',
                crInfo: '',
                projectRemark: '',
                projectDuration: '',
                budgetFundAdjust: '',
                projectCommissioningDate: ''
            },
            subjectSubitems: [],
            voteFlags: [
                {
                    label: '是',
                    value: 'y'
                },
                {
                    label: '否',
                    value: 'n'
                }
            ],
            subjectTypes: [],
            voteOptions: [],
            ratingItems: [],
            reportOfficeName: '',
            officeContactName: '',
            officeClickIndex: -1,
            reportMembers: [],
            meetingConfMemberDetails: [],
            office: {name: this.$route.params.officeName || localStorage.getItem('officeName')},
            roles: [],
            professionalFields: [],
            curSelectUserIndex: -1,
            userMap: {},
            officeNameMap: {},
            statusMap: {
                0: '转换中',
                1: '转换成功',
                2: '转换失败',
                3: '正常',
                4: '上传失败',
                5: '上传中...',
                6: '上传成功'
            }
        }
    },
    computed: {

	},
	watch: {
		'office.name': function() {
            this.refreshed();
        }
	},
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        preview: function(atta) {
            var path = atta.attachmentSavePath;
            if (path == "") {
                return;
            }
            var fileName = atta.fileName;
            downloadFile({
                path,
                fileName
            }).then(res => {
                this.download(res);
            }).catch(err => {
                if (err.msg) {
                    alert(err.msg);
                }
                console.log(err);
            });
        },
        openProjectModal: function() {
            this.$layer.iframe({
				content: {
					content: ProjectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{

					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.6 + "px")],
				title:"项目列表"
			});
        },
        selectProjectAfter: function(project, officeContactUserName, officeName) {
            this.projectInfo = project;
            this.userMap[project.officeContactUserId] = officeContactUserName;
            this.officeNameMap[project.officeId] = officeName;
            this.$set(this.meetingSubject, 'subjectName', project.projectName);
            this.$set(this.meetingSubject, 'projectId', project.id);
            this.$set(this.meetingSubject, 'officeId', project.officeId);
            this.$set(this.meetingSubject, 'reportOfficeId', project.officeId);
            this.$layer.closeAll();
        },
        addRow: function() {
            this.subjectSubitems.push({
                subitemName: null,
                budgetaryTypeDict: null,
                subitemBudgetFund: null,
                procurementStyleDict: null,
                enteringCompany: null,
                intellectualPropertyOwnership: null,
                contractTypeDict: null
            });
        },
        del: function(index, type) {
            var showTip = false;
            var arr = [];
            if(type == 'subitem') {
                arr = this.subjectSubitems;
                var subitem = arr[index];
                for(var key in subitem) {
                    if(subitem[key]) {
                        showTip = true
                        break;
                    }
                }
            } else {
                arr = this.meetingConfMemberDetails;
                var confMemberDetail = this.meetingConfMemberDetails[index];
                showTip = (confMemberDetail.memberId || confMemberDetail.professionalFieldDict)
            }

            confirm('确定删除该行吗？', () => {
                arr.splice(index, 1);
            }, showTip);
        },
        selectMember: function(index){
            //alert("开发中--" + memberType);
            this.curSelectUserIndex = index;
			this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						isMultiUser: false
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
            });
        },
        getSelectUser: function(user, office) {

            this.userMap[user.userId] = user.userName;
            if(this.curSelectUserIndex != -1) {
                var reportMember = this.reportMembers[this.curSelectUserIndex];
                reportMember.memberId = user.userId;
                if (!reportMember.officeId) {
                    reportMember.officeId = office.orgId;
                }
                if(!this.officeNameMap[office.orgId]){
                    this.officeNameMap[office.orgId] = office.orgName;
                }
                this.$set(this.reportMembers, this.curSelectUserIndex, reportMember);
            } else {
                this.$set(this.projectInfo, 'officeContactUserId', user.userId);
            }

            this.$layer.closeAll();
        },
    	clickNodeAfter: function(node){
            var arr = !isNaN(this.officeClickIndex) ? [] : this.officeClickIndex.split('_');
            if (arr.length > 1) {
                var index = arr[1];
                var reportMember = this.reportMembers[index];
                reportMember.officeId = node.id;
                this.$set(this.reportMembers, index, reportMember);
            } else if(this.officeClickIndex == 1) {
                this.meetingSubject.officeId = node.id;
                this.meetingSubject.reportOfficeId = this.meetingSubject.reportOfficeId || node.id;
                this.office.name = node.name;
            } else if(this.officeClickIndex == 2) {
                this.meetingSubject.reportOfficeId = node.id;
                this.reportOfficeName = node.name;
            } else if(this.officeClickIndex == 3) {
                this.officeContactName = node.name;
                this.projectInfo.officeId = node.id;
            }
            this.officeNameMap[node.id] = node.name;
			this.$layer.closeAll();
        },
    	officeClick: function(index, type){
            //console.log(index);
            this.officeClickIndex = type ? (type + "_" + index) : index;
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
    	save: function(){
            if (!this.projectInfo.id) {
                alert("您还未选取项目，请先选取后在进行保存操作！");
                return;
            }
            this.submitHandler((token) => {
                var reportMembers = JSON.parse(JSON.stringify(this.reportMembers.filter(reportMember => reportMember.attachmentId)));
                var attachmentInfos = [];
                reportMembers.forEach((reportMember, index) => {
                    delete reportMember.obj;
                    delete reportMember.file;
                    delete reportMember.fileName;
                    reportMember.sort = index + 1;
                    attachmentInfos.push({
                        attachmentId: reportMember.attachmentId,
                        dirName: reportMember.dirName
                    });
                    //attachmentIds.push(reportMember.attachmentId);
                    delete reportMember.attachmentId;
                    delete reportMember.dirName;
                });

                var subject = JSON.parse(JSON.stringify(this.meetingSubject));
                subject.voteOptions = subject.voteOptions.length <= 0 ? '' : subject.voteOptions.join(',');
                subject.ratingItem = subject.ratingItem.length <= 0 ? '' : subject.ratingItem.join(",");
                subject.remark = this.$refs.remarkUe.getContent();

                saveOrUpdateProjectSubject(subject, reportMembers, attachmentInfos, this.projectInfo, this.subjectSubitems, token).then(result => {
                    alert(result.msg);
                    this.backListView(this.meetingSubject.id == null, 'MeetingSubjectList');
                }).catch((reason) => {
                    console.log('catch:', reason);
                    this.resetToken(reason);
                });
            });
    	},
        initData: function(){
            if(this.meetingSubject.id){
                getProjectMeetingSubjectInitData(this.meetingSubject.id, this.projectInfo.id).then(results => {
                    var subjectData = results[0].data;
                    if(subjectData) {
                        var meetingSubject = subjectData.subject || {};
                        meetingSubject.ratingItem = meetingSubject.ratingItem ? meetingSubject.ratingItem.split(",") : [];
                        meetingSubject.voteOptions = meetingSubject.voteOptions ? meetingSubject.voteOptions.split(",") : [];
                        meetingSubject.votingRound = meetingSubject.votingRound || null;
                        this.meetingSubject = meetingSubject;

                        this.officeNameMap = subjectData.officeNameMap || {};
                    }

                    var reportMembersData = results[1].data;
                    if(reportMembersData) {
                        var reportMembers = reportMembersData.reportMembers || [];
                        var attachmentMap = reportMembersData.attachmentMap || {};
                        reportMembers.forEach(ele => {
                            var attachment = attachmentMap[ele.id] ? attachmentMap[ele.id][0] : null;
                            if(attachment) {
                                ele.attachmentId = attachment.id;
                                ele.attachmentSavePath = attachment.attachmentSavePath;
                                ele.fileName = attachment.attachmentName;
                                ele.status = attachment.status;
                                ele.dirName = attachment.dirName;
                            }
                        });
                        this.reportMembers = reportMembers;
                        this.userMap = reportMembersData.userMap || {};
                        Object.assign(this.officeNameMap, (reportMembersData.officeNameMap || {}));
                    }

                    var subjectSubitems = results[2].data;
                    this.subjectSubitems = subjectSubitems || [];

                    var projectData = results[3].data;
                    if (projectData) {
                        Object.assign(this.officeNameMap, (projectData.officeNameMap || {}));
                        Object.assign(this.userMap, (projectData.userMap || {}));
                        var projectInfo = projectData.projectInfo;
                        projectInfo.projectCommissioningDate = projectInfo.projectCommissioningDate ? formatDate(projectInfo.projectCommissioningDate, 'YYYY-MM-DD') : '';
                        this.projectInfo = projectInfo || this.projectInfo;
                    }
                });
            }
        	getDicts('MEETING_TYPE_DICT,MEETING_SUBJECT_TYPE_DICT,VOTE_OPINION_DICT,PROJECT_FEASIBILITY,BUDGETARY_TYPE_DICT,PROCUREMENT_STYLE_DICT,PROJECT_TYPE_DICT,CONTRACT_TYPE_DICT,project_priority_dict,project_actualize_dict').then(result => {
                if(result.data){
                    this.meetingTypes = result.data[0] || [];
                    this.subjectTypes = result.data[1] || [];
                    this.voteOptions = result.data[2] || [];
                    this.ratingItems = result.data[3] || [];
                    this.budgetaryTypes = result.data[4] || [];
                    this.procurementStyles = result.data[5] || [];
                    this.projectTypes = result.data[6] || [];
                    this.contractTypes = result.data[7] || [];
                    this.projectPrioritys = result.data[8] || [];
                    this.projectActualizes = result.data[9] || [];
                }
            });
        },
        upload: function(reportMember) {
            //console.log(reportMember.obj);
            reportMember.obj.upload(reportMember.sort, reportMember.file);
        },
        deleteReportRow: function(index) {
            confirm("确定要删除该行吗？", () => {
                var reportMemberId = this.reportMembers[index].id;
                if (reportMemberId) {
                    delMeetingSubjectReportMember(this.meetingSubject.id, reportMemberId).then(result => {
                        this.reportMembers.splice(index, 1);
                        alert(result.msg);
                    });
                } else {
                    this.reportMembers.splice(index, 1);
                    alert("删除成功");
                }
            });
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form', 'upload'], function(){
        		var element = element
                ,form = layui.form
                ,upload = layui.upload;

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

				form.on('submit(saveTranSubject)', function(data){
					_this.save();
					return false;
                });

                var uploadListIns = upload.render({
                    elem: '#uploadFiles',
                    url: '/api/file/upload/attachment?type=meeting_subject_report_member&module=meeting',
                    accept: 'file',
                    multiple: true,
                    auto: false,
                    headers: {
                        Authorization: ('Bearer ' + getToken())
                    },
                    // bindAction: '#testListAction',
                    before: function(obj){
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            console.log(index);
                            if(_this.reportMembers.indexOf(index, 'sort') == -1){
                                _this.reportMembers.push({
                                    fileName: file.name,
                                    memberId: null,
                                    officeId: null,
                                    attachmentSavePath: null,
                                    reportTime: '',
                                    sort: index,// 暂时用于记录文件的ID index
                                    dirName: '',
                                    remark: null,
                                    status: 5,
                                    obj: obj,
                                    file: file
                                });
                            }
                        });
                        return false;
                    },
                    choose: function (obj) {
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            console.log(index);
                            if(_this.reportMembers.indexOf(index, 'sort') == -1){
                                _this.reportMembers.push({
                                    fileName: file.name,
                                    memberId: null,
                                    officeId: _this.meetingSubject.officeId,
                                    attachmentSavePath: null,
                                    reportTime: '',
                                    sort: index,// 暂时用于记录文件的ID index
                                    dirName: '',
                                    remark: null,
                                    status: 5,
                                    obj: obj,
                                    file: file
                                });
                                obj.upload(index, file);
                            }
                        });
                        return false;
                    },
                    done: function (res, index, upload) {

                        if (res.status == 200) { //上传成功
                            var arrIndex = _this.reportMembers.indexOf(index, 'sort');
                            if(arrIndex != -1){
                                var reportMember =  _this.reportMembers[arrIndex];
                                reportMember.attachmentId = res.data.attachmentId;
                                reportMember.attachmentSavePath = res.data.path;
                                reportMember.status = 6;
                                _this.$set(_this.reportMembers, arrIndex, reportMember);
                                // 转换
                                if(res.data && needToConvert(res.data.path)) {
                                    convertFile(res.data.attachmentId).then(result => {
                                        // 转换中 ---
                                        reportMember.status = 0;
                                        _this.$set(_this.reportMembers, arrIndex, reportMember);
                                    });
                                }

                            }
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {
                        var arrIndex = _this.reportMembers.indexOf(index, 'sort');
                        if(arrIndex != -1){
                            var reportMember =  _this.reportMembers[arrIndex];
                            reportMember.status = 4;
                            _this.$set(_this.reportMembers, arrIndex, reportMember);
                        }
                    }
                });
        	});

        }
    }
}
</script>

<style scoped>
    .table > thead > tr > th, td {
        text-align: center;
    }
    table .layui-input, table /deep/ .layui-input, .layui-select, .layui-textarea {
        height: 30px;
        width: 170px!important;
    }
</style>
