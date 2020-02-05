<template>
    <div class="view-product" v-cloak>
		<div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
                    <layui-fieldset label="议题信息">
                        <template slot="main">
                            <layui-item>
                                <layui-inline-input
                                    label="议题名称" 
                                    placeholder="请输入标题"
                                    lay-verify="required"
                                    v-model="meetingSubject.subjectName"
                                    :readonly="globalReadonly"
                                    :block="true"></layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="上会部门" 
                                    placeholder="点击选择上会部门"
                                    :value="officeNameMap[meetingSubject.officeId]"
                                    func="officeClick"
                                    :disabledFunc="globalReadonly"
                                    :readonly="true"
                                    @officeClick="officeClick(1)"
                                    :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                <layui-inline-select
                                    label="上会类型"
                                    v-model="meetingSubject.meetingTypeDict"
                                    :readonly="globalReadonly"
                                    :items="meetingTypes"></layui-inline-select>
                            </layui-item>
                            <layui-item>
                                <layui-inline-radio
                                    v-if="enableVote"
                                    name="voteFlag"
                                    label="是否投票"
                                    v-model="meetingSubject.subjectVoteFlag"
                                    :readonly="globalReadonly"
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
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.votingRound"></add-reduce-input>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <layui-inline-checkbox
                                    name="voteOptions"
                                    label="投票选项"
                                    :items="voteOptions"
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.voteOptions"></layui-inline-checkbox>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <layui-inline-checkbox
                                    name="ratingItems"
                                    label="评分选项"
                                    :items="ratingItems"
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.ratingItem"></layui-inline-checkbox>
                            </layui-item>
                            <layui-inline-ue
                                v-if="!isHBH && refresh"
                                label="备注"
                                v-model="meetingSubject.remark"
                                :readonly="globalReadonly"
                                ref="remarkUe"></layui-inline-ue>
                            <layui-inline-textarea
                                v-if="isHBH"
                                label="备注"
                                v-model="meetingSubject.remark"
                                :readonly="globalReadonly"></layui-inline-textarea>
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="汇报内容">
                        <template slot="main">
                            <layui-item>
                                <layui-inline-input
                                    label="汇报部门" 
                                    placeholder="点击选择汇报部门"
                                    :value="officeNameMap[meetingSubject.reportOfficeId]"
                                    func="officeClick"
                                    :disabledFunc="globalReadonly"
                                    :readonly="true"
                                    @officeClick="officeClick(2)"
                                    :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                <layui-inline-input
                                    label="汇报人员" 
                                    placeholder="点击选择汇报人员"
                                    func="selectMember"
                                    @selectMember="selectMember(-1)"
                                    :value="userMap[meetingSubject.reportUserId] ? userMap[meetingSubject.reportUserId] : ''"
                                    :readonly="true"></layui-inline-input>
                                <layui-inline-input
                                    label="汇报时间" 
                                    placeholder="总汇报时间"
                                    type='number'
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.reportTime"></layui-inline-input>
                            </layui-item>
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="汇报材料人员">
                        <i id="uploadFiles" :class="{'fa fa-plus text-warning select-pros': true, 'hidden': globalReadonly}" style="font-size: 16px; cursor: pointer;margin-left: 5px;"></i>
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
                                        <th style="width: 60px">排序</th>
                                        <th style="width: 100px">状态</th>
                                        <th v-if="!globalReadonly" style="width: 100px">操作</th>
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
                                                :readonly="globalReadonly"
                                                v-model="reportMembers[index].reportTime"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input 
                                                placeholder="请输入目录"
                                                :readonly="globalReadonly"
                                                v-model="reportMembers[index].dirName"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input 
                                                placeholder="请输入备注"
                                                :readonly="globalReadonly"
                                                v-model="reportMembers[index].remark"></layui-inline-input>
                                        </td>
                                        <td>{{ index + 1 }}</td>
                                        <td v-if="!item.status && item.status != 0"></td>
                                        <td v-if="item.status == 0 || item.status == 5">{{ statusMap[item.status] }}</td>
                                        <td v-if="item.status == 1 || item.status == 3 || item.status == 6"><span style="color: #5FB878;">{{ statusMap[item.status] }}</span></td>
                                        <td v-if="item.status == 2 || item.status == 4"><span style="color: #FF5722;">{{ statusMap[item.status] }}</span></td>
                                        <td v-if="!globalReadonly">
                                            <a v-if="item.status == 4" @click="upload(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>重传</a>
                                            <a @click="deleteReportRow(index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </layui-fieldset>
                    <!-- class="btn-group-center" -->
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
import { getDicts } from '@/api/dict'
import { getTranMeetingSubjectInitData, delMeetingSubjectReportMember } from '@/api/meeting/meetingSubject'
import { saveOrUpdateTranSubject, getMeetingSubject, testExport } from '@/api/meeting/meetingSubject'
import { needToConvert } from '@/utils/fileUtils'
import { convertFile } from '@/api/file'
import UserSelectList from '@/components/UserSelectList'
import { getToken } from '@/utils/auth'
import { getAttaments, delAttament, downloadFile } from '@/api/file'
import Base from "@/views/base/Base"

export default {
    name: 'TransactionSubjectAdd',
	extends: Base,
    data () {
        return {
            meetingTypes: [],
            memberTypes: [],
            meetingSubject: {
                id: this.$route.params.id,
                meetingTypeDict: this.$route.params.meetingTypeDict || '',
                subjectName: '',
                meetingSubjectTypeDict: '',
                meetingSubjectStatusDict: '',
                subjectVoteFlag: 'n',
                votingRound: 1,
                remark: '',
                reportUserId: '',
                reportOfficeId: '',
                reportTime: '',
                voteOptions: [],
                ratingItem: [],
                officeId: ''
            },
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
            officeClickIndex: -1,
            reportMembers: [],
            meetingConfMemberDetails: [],
            office: {name: this.$route.params.officeName || localStorage.getItem('officeName')},
            roles: [],
            professionalFields: [],
            curSelectUserIndex: -1,
            userMap: {},
            officeNameMap: {},
            refresh: true,
            statusMap: {
                0: '转换中',
                1: '转换成功',
                2: '转换失败',
                3: '正常',
                4: '上传失败',
                5: '上传中...',
                6: '上传成功'
            },
            enableVote: process.env.VUE_APP_MEETING_SUBJECT_ENABLE_VOTE != '1',
            isHBH: process.env.VUE_APP_IS_HBH == '1',
        }
    },
    computed: {
       
	},
	watch: {
		'office.name': function() {
            this.refreshed();
        },
        globalReadonly: function () {
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
            if (this.curSelectUserIndex == -1) {
                this.$set(this.meetingSubject, 'reportUserId', user.userId);
            } else {
                var reportMember = this.reportMembers[this.curSelectUserIndex];
                reportMember.memberId = user.userId;
                if (!reportMember.officeId) {
                    reportMember.officeId = office.orgId;
                }
                if(!this.officeNameMap[office.orgId]){
                    this.officeNameMap[office.orgId] = office.orgName;
                }
                this.$set(this.reportMembers, this.curSelectUserIndex, reportMember);
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
                //this.office.name = node.name;
            } else if(this.officeClickIndex == 2) {
                this.meetingSubject.reportOfficeId = node.id;
                //this.reportOfficeName = node.name;
            }
            if(!this.officeNameMap[node.id]) {
                this.officeNameMap[node.id] = node.name;
                //this.$set(this.officeNameMap, node.id, node.name);
            }
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
                if (!this.isHBH && this.$refs.remarkUe) {
                    subject.remark = this.$refs.remarkUe.getContent();
                }
                saveOrUpdateTranSubject(subject, reportMembers, attachmentInfos, token).then(result => {
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
                getTranMeetingSubjectInitData(this.meetingSubject.id).then(results => {
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

                        this.globalReadonly = this.meetingSubject.meetingSubjectStatusDict > 2;
                    }

                });
            } else {
                this.globalReadonly = false;
            }
        	getDicts('MEETING_TYPE_DICT,MEETING_SUBJECT_TYPE_DICT,VOTE_OPINION_DICT,PROJECT_FEASIBILITY').then(result => {
                if(result.data){
                    this.meetingTypes = result.data[0] || [];
                    this.subjectTypes = result.data[1] || [];
                    this.voteOptions = result.data[2] || [];
                    this.ratingItems = result.data[3] || [];
                }
            });
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
        upload: function(reportMember) {
            //console.log(reportMember.obj);
            reportMember.obj.upload(reportMember.sort, reportMember.file);
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
                        // var tr = demoListView.find('tr#upload-' + index),
                        // tds = tr.children();
                        // tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                        // tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
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