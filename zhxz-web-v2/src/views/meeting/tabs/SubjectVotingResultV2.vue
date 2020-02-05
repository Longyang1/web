<template>
    <div class="row row-background left-border vote-result">
        <div class="col-sm-12 explain-sign">
            <fieldset class="layui-elem-field subject-title">
                <legend>
                    <i class="fa fa-bar-chart text-warning"></i> 结果统计
                    <div>
                        <button @click="showAllRemark('allTopShowRemark', 1)" class="btn btn-info vote-pdf" type="button" style="margin-right: 0px;"><i :class="{'fa': true, 'fa-folder-open-o': allTopShowRemark, 'fa-folder': !allTopShowRemark}" aria-hidden="true"></i> {{ allTopShowRemark ? '关闭全部意见' : '展开全部意见' }}</button>
                        <button v-if="false && manage" @click="generateVoteResultPDF" class="btn btn-info vote-pdf" type="button" style="margin-right: 10px;"><i class="fa fa-file-pdf-o"></i> 生成PDF文件</button>
                        <button v-if="false" @click="showVoteResultPDF" class="btn btn-info vote-pdf" type="button"><i class="fa fa-file-pdf-o"></i> 查看PDF文件</button>
                        <button v-if="false" class="btn btn-info vote-send-email" type="button" style="margin-left:10px;"><i class="fa fa-envelope-o"></i> 发送到邮箱</button>
                    </div>
                </legend>
                <div class="layui-field-box">
                    <div class="col-sm-12">
                        <ul class="sortable-list connectList agile-list">
                            <li class="success-element">
                                <span style="margin-left: 5px;font-size: 14px;">
                                    <i class="fa fa-bar-chart text-success"></i>
                                    本次投票
                                    <template v-for="(passType, index) in passTypes">
                                        {{ passType.label }}议题<em :class="'text-green-deep h4 pass-count-' + passType.value" style="font-weight: 500;" :key="passType.value">{{ passSubjectCount[passType.value] || 0 }}</em>个{{ index != (passTypes.length - 1) ? '，' : '。' }}
                                    </template>
                                </span>
                                <div class="agile-detail">
                                    <table class="subject-table subject-child-table subject-vote-result-table">
                                         <tr>
                                            <th>序号</th>
                                            <th>议题名称</th>
                                            <th>投票结果</th>
                                            <th v-if="enableReview">审议结果</th>
                                            <th>票数统计</th>
                                        </tr>
                                        <template v-for="(subject, index) in votedSubjects">
                                            <template v-if="subjectsVoteDetail[subject.id]">
                                                <tr 
                                                    :key="'vote_' + subject.id"
                                                    :class="{'odd': index % 2 != 0}">
                                                    <td :rowspan="canOneVote(subject) ? (2) : 1" style="min-width: 35px;text-align: center">{{ getSubjectIndex(subject.id) }}</td>
                                                    <td :rowspan="canOneVote(subject) ? (2) : 1" style="min-width: 205px">{{ subject.subjectName}}<i @click="showVoteRemark(subject.id, false, !subjectVoteRemarkInfo[subject.id + '_1'], 1)" :class="{'fa': true, 'fa-eye': subjectVoteRemarkInfo[subject.id + '_1'] != true, 'fa-eye-slash': subjectVoteRemarkInfo[subject.id + '_1'] == true}" :title="subjectVoteRemarkInfo[subject.id + '_1'] == true ? '隐藏意见' : '显示意见'" aria-hidden="true" style="margin-left: 4px; color: rgb(27, 88, 180); font-size: 14px;"></i><i v-if="subjectAttaMap[subject.id]" @click="showFile(subject)" :class="{'iconfont': true, 'icon-chengbengusuan': true}" title="投资估算表" aria-hidden="true" style="margin-left: 4px; color: #04be02; font-size: 14px;"></i></td>
                                                    <td :rowspan="canOneVote(subject)  ? (2) : 1" style="width:110px">
                                                        <img :src="reviewResultImgURL(subjectsVoteDetail[subject.id]['pass'])" alt="投票结果章">
                                                    </td>
                                                    <td v-if="enableReview" :rowspan="canOneVote(subject)  ? (2) : 1" style="width:110px">
                                                        <img :src="reviewResultImgURL((subject.resultReview || subjectsVoteDetail[subject.id]['review']))" alt="审议结果章">
                                                    </td>
                                                    <td style="min-width:310px" colspan=2>
                                                        <i class="fa fa-bar-chart text-success"></i> 
                                                        <template v-for="(item, svIndex) in subject.voteOptions.split(',')" name="vo">
                                                            {{ voteOptionMap[item] }}<em :key="'op-' + svIndex" :class="'vote-option vote-option-' + item">{{ subjectsVoteDetail[subject.id][item] || 0 }}</em>票{{ svIndex == (subject.voteOptions.split(',').length - 1) ? '。' : '，' }}
                                                        </template>
                                                    </td>
                                                </tr>
                                                <tr 
                                                    v-if="canOneVote(subject)"
                                                    :class="{'odd': index % 2 != 0}"
                                                    :key="'vote_2_' + subject.id">
                                                    <td v-if="!disableOneVote" colspan=2>
                                                        <button v-if="subjectsVoteDetail[subject.id]['pass'] == 1 && !(subject.resultPass == 3 || subject.resultPass == 4)" @click="updateSubjectVotePass({subjectId:subject.id, passType: 4, review: enableReview})" class="layui-btn layui-btn-xs" style="background:rgb(243, 19, 14)">否决</button>
                                                        <button v-if="subjectsVoteDetail[subject.id]['pass'] == 1 && !(subject.resultPass == 3 || subject.resultPass == 4)" @click="updateSubjectVotePass({subjectId:subject.id, passType: 3, review: enableReview})" class="layui-btn layui-btn-xs" style="background: #E0C94A">有条件通过</button>
                                                        <button v-if="subject.resultPass == 3 || subject.resultPass == 4" @click="updateSubjectVotePass({subjectId:subject.id, passType: 1, review: enableReview})" class="layui-btn layui-btn-xs" style="background: #4fa44a">通过</button>
                                                    </td>
                                                    <td v-if="enableReview" colspan=2>
                                                        <template v-for="passType in passTypes">
                                                            <button 
                                                                v-if="subject.resultReview != passType.value" 
                                                                @click="updateSubjectVotePass({subjectId:subject.id, passType: passType.value, review: enableReview, passName: passType.label})" 
                                                                :class="'layui-btn layui-btn-xs pass-type-' + passType.value" 
                                                                :key="'pt_' + passType.value">{{ passType.label }}</button>
                                                        </template>
                                                    </td>
                                                </tr>
                                                <template v-for="(optionDict) in subject.voteOptions.split(',')">
                                                    <template v-if="getUserIdsWithHasRemark(subject, optionDict).length > 0">
                                                        <tr 
                                                            :class="{'odd': index % 2 != 0}"
                                                            v-if="subjectsVoteDetail[subject.id]['member_' + optionDict] && subjectVoteRemarkInfo[subject.id + '_1'] == true"
                                                            :key="subject.id + subjectsVoteDetail[subject.id]['member_' + optionDict][0] + 'remark'">
                                                            <td class="remark" :rowspan="getRowspan(subject, optionDict)" style="min-width: 35px;text-align: center">{{ voteOptionMap[optionDict] }} <i class="fa fa-comment" aria-hidden="true" style="color: #f89432"></i> </td>    
                                                            <td class="remark" colspan="4" style="text-align: left">1、<span v-if="manage">[{{ userMap[getUserIdsWithHasRemark(subject, optionDict)[0]] }}]</span> {{ getUserRemark(subject.id, getUserIdsWithHasRemark(subject, optionDict)[0]) }}</td>
                                                        </tr>
                                                        <template v-for="(userId, uIndex) in getUserIdsWithHasRemark(subject, optionDict)">
                                                            <tr 
                                                                :class="{'odd': index % 2 != 0}"
                                                                v-if="uIndex != 0 && getUserRemark(subject.id, userId) && subjectVoteRemarkInfo[subject.id + '_1'] == true"
                                                                :key="subject.id + userId + 'remark'">
                                                                <td colspan="4" class="remark" style="text-align: left">{{ uIndex + 1 }}、<span v-if="manage">[{{ userMap[userId] }}] </span>{{ getUserRemark(subject.id, userId) }}</td>
                                                            </tr>
                                                        </template>
                                                    </template>
                                                </template>
                                            </template>
                                        </template>
                                    </table>
                                </div>				                                				                                
                            </li>
                            <li v-if="manage" class="success-element">
                                <div style="float: right;margin-bottom: 4px;">
                                    <button @click="showAllRemark(null, 2)" class="btn btn-info vote-pdf" type="button"><i :class="{'fa': true, 'fa-folder-open-o': allShowRemark, 'fa-folder': !allShowRemark}" aria-hidden="true"></i> {{ allShowRemark ? '关闭全部意见' : '展开全部意见' }}</button>
                                    <button v-if="false" class="btn btn-info vote-send-email" type="button" style="margin-left:10px;"><i class="fa fa-envelope-o"></i> 发送到邮箱</button>
                                </div>
                                <div class="agile-detail">
                                    <table class="subject-child-table">
                                        <tr>
                                            <th style="min-width: 100px;">序号</th>
                                            <th>议题名称</th>
                                            <th v-if="manage" colspan="2">投票结果人员名单</th>
                                        </tr>
                                        <template v-for="(subject, index) in votedSubjects">
                                            <tr :class="{'odd': index % 2 != 0}" :key="'vote_detail_' + subject.id">
                                                <td :rowspan="manage ? (subject.voteOptions.split(',').length + 1) : 1">{{ getSubjectIndex(subject.id) }}</td>
                                                <td :rowspan="manage ? (subject.voteOptions.split(',').length + 1) : 1">{{ subject.subjectName }} <i @click="showVoteRemark(subject.id, false, !subjectVoteRemarkInfo[subject.id + '_2'], 2)" :class="{'fa': true, 'fa-eye': subjectVoteRemarkInfo[subject.id + '_2'] != true, 'fa-eye-slash': subjectVoteRemarkInfo[subject.id + '_2'] == true}" :title="subjectVoteRemarkInfo[subject.id + '_2'] == true ? '隐藏意见' : '显示意见'" aria-hidden="true" style="margin-left: 2px; color: rgb(27, 88, 180); font-size: 14px;"></i> </td>
                                                <td v-if="manage" style="min-width:95px;">{{ voteOptionMap[subject.voteOptions.split(',')[0]] }}</td>
                                                <td v-if="manage && subjectsVoteDetail[subject.id]" class="align-left">
                                                    <template v-for="userId in subjectsVoteDetail[subject.id]['member_' + subject.voteOptions.split(',')[0]]">
                                                        {{ userMap[userId] }}
                                                    </template>
                                                </td>
                                                <td v-if="manage && !subjectsVoteDetail[subject.id]" class="align-left"></td>
                                            </tr>
                                            <tr
                                                :class="{'odd': index % 2 != 0}"
                                                v-for="(optionDict, vIndex) in subject.voteOptions.split(',')"
                                                :key="subject.id + optionDict">
                                                <template v-if="manage && vIndex != 0">
                                                    <td>{{ voteOptionMap[optionDict] }}</td>
                                                    <td v-if="subjectsVoteDetail[subject.id]" class="align-left">
                                                        <template v-for="userId in subjectsVoteDetail[subject.id]['member_' + optionDict]">
                                                            {{ userMap[userId] }}
                                                        </template>
                                                    </td>
                                                    <td v-if="!subjectsVoteDetail[subject.id]" class="align-left"></td>
                                                </template>
                                            </tr>
                                            <template v-for="(optionDict) in subject.voteOptions.split(',')">
                                                <template v-if="getUserIdsWithHasRemark(subject, optionDict).length > 0">
                                                    <tr 
                                                        :class="{'odd': index % 2 != 0}"
                                                        v-if="subjectsVoteDetail[subject.id]['member_' + optionDict] && subjectVoteRemarkInfo[subject.id + '_2'] == true"
                                                        :key="subject.id + subjectsVoteDetail[subject.id]['member_' + optionDict][0] + 'remark'">
                                                        <td class="remark" :rowspan="getRowspan(subject, optionDict)">{{ voteOptionMap[optionDict] }} <i class="fa fa-comment" aria-hidden="true" style="color: #f89432"></i> </td>    
                                                        <td class="remark" colspan="3" style="text-align: left">1、<span v-if="manage">[{{ userMap[getUserIdsWithHasRemark(subject, optionDict)[0]] }}]</span> {{ getUserRemark(subject.id, getUserIdsWithHasRemark(subject, optionDict)[0]) }}</td>
                                                    </tr>
                                                    <template v-for="(userId, uIndex) in getUserIdsWithHasRemark(subject, optionDict)">
                                                    <tr 
                                                        :class="{'odd': index % 2 != 0}"
                                                        v-if="uIndex != 0 && getUserRemark(subject.id, userId) && subjectVoteRemarkInfo[subject.id + '_2'] == true"
                                                        :key="subject.id + userId + 'remark'">
                                                        <td colspan="3" class="remark" style="text-align: left">{{ uIndex + 1 }}、<span v-if="manage">[{{ userMap[userId] }}] </span>{{ getUserRemark(subject.id, userId) }}</td>
                                                    </tr>
                                                    </template>
                                                </template>
                                            </template>
                                        </template>
                                    </table>
                                </div>				                                				                                
                            </li>
                        </ul>
                    </div>
                </div>								  
            </fieldset>
        </div>
    </div>
   
</template>

<script>
import meetingTabMixin from '@/mixin/meetingTabMixin'
import { getVoteResultPDFUrl, generateVoteResultPDF } from '@/api/meeting/meeting'
import { getAttaments, checkFileExist } from '@/api/file'
import { mapGetters, mapState, mapMutations, mapActions} from 'vuex'
import * as fileApi from '@/api/file'

export default {
    mixins: [meetingTabMixin],
    data () {
        return {
            subjectVoteRemarkInfos: [],
            allShowRemark: false,
            allTopShowRemark: false,
            tzgsAttachmentInfos: [],
        }
    },
    props: {
        disableOneVote: {
            type: Boolean,
            default: true
        },
        enableReview: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        subjectsVoteDetail: function(){
            return this.$store.state.meeting.voteInfo.subjectsVoteDetail;
        },
        passSubjectCount: function(){
            return this.$store.state.meeting.voteInfo.passSubjectCount;
        },
        userVoteResultsMap: function(){
            return this.$store.state.meeting.voteInfo.userVoteResultsMap || {};
        },
        votedSubjects: function(){
            return this.canVoteSubjects.filter(sub => {
                return this.subjectsVoteDetail[sub.id] && (this.curVoteSubjectIds.indexOf(sub.id) != -1 || this.isEnd);
            });
        },
        subjectVoteRemarkInfo: function() {
            return this.subjectVoteRemarkInfos.array2Obj('subjectId', 'flag');
        },
        curVoteSubjectIds: function(){
            return  this.$store.state.meeting.voteInfo.curVoteSubjectIds || [];
        },
        passTypes: function(){
            return this.$store.state.meeting.meetingDicts[11];
        },
        subjectAttaMap() {
            return this.tzgsAttachmentInfos.array2Obj('attachmentBusinessId');
        }
    },
    watch: {
        curVoteSubjectIds: {
            handler() {
                let businessIds = this.curVoteSubjectIds.join(',');
                fileApi.getAttaments({
                    businessIds: businessIds,
                    attachmentBusinessType: 'meeting_subject',
                    attachmentName: '估算表'
                }).then(res => {
                    let data = res.data || {};
                    this.tzgsAttachmentInfos = (data.attachmentInfos || []);
                });
            },
            deep: true,
        }
    },
    mounted() {
        let businessIds = this.curVoteSubjectIds.join(',');
        fileApi.getAttaments({
            businessIds: businessIds,
            attachmentBusinessType: 'meeting_subject',
            attachmentName: '投资估算表'
        }).then(res => {
            let data = res.data || {};
            
            this.tzgsAttachmentInfos = (data.attachmentInfos || []).filter(atta => {
                return atta.attachmentName.startsWith('投资估算表.');
            });
        });
    },
    methods: {
        ...mapActions({
            updateSubjectVotePass: 'meeting/UPDATE_SUBJECT_VOTE_PASS',
        }),
        hasVoteOption: function(subject, optionDict){
            return subject.voteOptions && subject.voteOptions.split(',').indexOf(optionDict) != -1;
        },
        canConversionResult: function(subject){
            var _this = this;
            function check(subject, isOneVote){
                var subjectId= subject.id;
                if(isOneVote){
                    if(subject.resultPass == 4){
                        return true;//false;
                    }
                    if(subject.resultPass == 3){
                        return true;//false;
                    }
                    if(_this.subjectsVoteDetail[subjectId]['pass'] == 1){
                        return true;
                    }
                } else {
                    if(subject.resultPass == 3){
                        return false;
                    }
                }
                return false;
            }
            //return (check(subject, true) || check(subject, false));
            return check(subject, true);
        },
        voteResultImgURL: function(subjectId){
    		var index = this.canVoteSubjects.indexOf(subjectId, 'id');
    		if(index == -1){
    			return "";
    		}
    		if(this.canVoteSubjects[index].resultPass == 3){
    			return "/img/meeting/condition-pass.png";
    		}
    		if(this.canVoteSubjects[index].resultPass == 4){
    			return "/img/meeting/one-vote-veto.png";
            }
            if(this.subjectsVoteDetail[subjectId]['pass'] && this.subjectsVoteDetail[subjectId]['pass'] == 3){
                return "/img/meeting/condition-pass.png";
            }
            if(this.subjectsVoteDetail[subjectId]['pass'] && this.subjectsVoteDetail[subjectId]['pass'] == 5){
                return "/img/meeting/xuyi.png";
            }
            return this.subjectsVoteDetail[subjectId]['pass'] ? (this.subjectsVoteDetail[subjectId]['pass'] == 1 ? "/img/meeting/pass.png" : "/img/meeting/not-pass.png") : "/img/meeting/one-vote-veto.png";
        },
        reviewResultImgURL(result) {
            if (result == 1) {
    			return "/img/meeting/pass.png";
            }
            if (result == 2) {
    			return "/img/meeting/not-pass.png";
    		}
            if (result == 3) {
    			return "/img/meeting/condition-pass.png";
    		}
    		if (result == 4) {
    			return "/img/meeting/one-vote-veto.png";
            }
            if (result == 3) {
                return "/img/meeting/condition-pass.png";
            }
            if (result == 5) {
                return "/img/meeting/xuyi.png";
            }
        },
        getUserRemark: function(subjectId, userId){
        	var userVoteResults = this.userVoteResultsMap[userId];
            var index = -1;
            var remark = "";
            if(userVoteResults && (index = userVoteResults.indexOf(subjectId, 'subjectId')) != -1){
                remark = userVoteResults[index].remark;
            } else {
                return "";
            }
        	return remark;
        },
        canOneVote: function(subject) {
            return (!this.disableOneVote || this.enableReview) && !this.isEnd && 
                    this.user.userId == this.meeting.oneVoteVetoUserId && 
                    (this.enableReview || this.canConversionResult(subject));
        },
        generateVoteResultPDF: function (params) {
            generateVoteResultPDF(this.meeting.id).then(res => {
                setTimeout(() => {
                    alert('生成成功');
                }, 1000);
            });
        },
        getRowspan: function(subject, option) {
            
            var options = subject.voteOptions.split(',');
            var rowCount = 0;
            // if (options) {
                
            //     options.forEach(option => {
            //         if (this.subjectsVoteDetail[subject.id]['member_' + option]) {
            //             rowCount += this.subjectsVoteDetail[subject.id]['member_' + option].length;
            //         }
            //     });
            // }
            if (this.subjectsVoteDetail[subject.id]['member_' + option]) {
                this.subjectsVoteDetail[subject.id]['member_' + option].forEach(element => {
                    if (this.getUserRemark(subject.id, element)) {
                        rowCount++;
                    }
                });
            }
            return rowCount;
        },
        showVoteResultPDF: function(){
            getAttaments({
                attachmentBusinessId: this.meeting.id,
                attachmentBusinessType: 'meeting_vote_result'
            }).then(result => {
                var attachmentInfos = result.data.attachmentInfos;
                if (attachmentInfos && attachmentInfos.length > 0) {
                    var atta =  attachmentInfos[0];
                    var status = atta.status;
                    if (status == 1) {
                        checkFileExist({
                            path: atta.attachmentSavePath
                        }).then(res => {
                            if (res.data == true) {      
                                var show = 2;
                                var url = true;
                                var fileUrl = "/api/file/pub/" + atta.attachmentSavePath;
                                this.$store.commit("meeting/UPDATE_SHOW", {
                                    show,
                                    url,
                                    fileUrl
                                });
                            } else {
                                alert("文件还在生成中，请稍后再试"); 
                            }
                        });
                    } else {
                       alert("文件还在生成中，请稍后再试"); 
                    }
                } else {
                    alert("文件不存在");
                }
            });
        },
        getUserRemark: function(subjectId, userId){
            
        	var userVoteResults = this.userVoteResultsMap[userId];
            var index = -1;
            var remark = "";
            if(userVoteResults && (index = userVoteResults.indexOf(subjectId, 'subjectId')) != -1){
                remark = userVoteResults[index].remark;
            } else {
                return "";
            }
            console.log(remark);
        	return remark;
        },
        showNotifyVoteRemark: function(subject, remarkUser){
            
            var remark = this.getUserRemark(subject.id, remarkUser.id);
           
            this.$notify({
                title: subject.subjectName + "---" + remarkUser.name + "意见",
                text: remark,
            });
        },
        showVoteRemark: function(subjectId, needFefresh, _flag, tableNo) {

            var index = this.subjectVoteRemarkInfos.indexOf(subjectId, 'subjectId');
            var flag = true;
            if (_flag != null) {
                flag = _flag;
            }
            if (index != -1) {
                var info = this.subjectVoteRemarkInfos[index];
                if (_flag == null) {
                    flag = !info.flag;
                }
                subjectId += "_" + tableNo;
                this.$set(this.subjectVoteRemarkInfos, index, {
                    subjectId,
                    flag,
                });
                return;
            }
            subjectId += "_" + tableNo;
            this.subjectVoteRemarkInfos.push({
                subjectId,
                flag
            });
            if(needFefresh != false) {
                this.refresh = false;
                this.$nextTick(() => {
                    this.refresh = true;
                });
            }
        },
        showAllRemark: function(flagName, tableNo) {
            let name = flagName || 'allShowRemark';
            this[name] = !this[name];
            this.votedSubjects.forEach(element => {
                this.showVoteRemark(element.id, false, this[name], tableNo);
            });

        },
        getUserIdsWithHasRemark: function (subject, optionDict) {
            var userIds = [];
            if (this.subjectsVoteDetail[subject.id]['member_' + optionDict]) {
                this.subjectsVoteDetail[subject.id]['member_' + optionDict].forEach(userId => {
                    if (this.getUserRemark(subject.id, userId)) {
                        userIds.push(userId);
                    }
                });
            }
            userIds.sort((x, y) => {
                let xIndex = this.members.indexOf(x, 'userId');
                let yIndex = this.members.indexOf(y, 'userId');
                return xIndex - yIndex;
    		})
            return userIds;
        },
        getRowspan: function(subject, option) {
            
            var options = subject.voteOptions.split(',');
            var rowCount = 0;
            // if (options) {
                
            //     options.forEach(option => {
            //         if (this.subjectsVoteDetail[subject.id]['member_' + option]) {
            //             rowCount += this.subjectsVoteDetail[subject.id]['member_' + option].length;
            //         }
            //     });
            // }
            if (this.subjectsVoteDetail[subject.id]['member_' + option]) {
                this.subjectsVoteDetail[subject.id]['member_' + option].forEach(element => {
                    if (this.getUserRemark(subject.id, element)) {
                        rowCount++;
                    }
                });
            }
            return rowCount;
        },
        showFile(subject) {
            let atta = this.subjectAttaMap[subject.id];
            if (!atta) {
                return;
            }
            var attaUrl = "";
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isMobile = u.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var suff = atta.attachmentSavePath.substring(atta.attachmentSavePath.lastIndexOf(".") + 1 , atta.attachmentSavePath.length);
            if((suff == 'doc' || suff == "docx" || suff == 'xls' || suff == "xlsx" || suff == "ppt" || suff == "pptx" || suff == "pdf") && (!isMobile || isAndroid)) {//!isMobile && 
                var show = 2;
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show,
                    subject,
                    reportMember: {},
                    atta
                });
            } else {
        		if(isiOS && (suff == 'doc' || suff == "docx")){
        			//location.href =  process.env.API_HOST + "/pub/upload/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".pdf";
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".pdf";                 
        		} else if (suff == 'xls' || suff == "xlsx") {
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".html";                 
                } else {
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath;
                }
                // location.href = process.env.API_HOST + "/pub/upload/" + atta.attachmentSavePath;
                // alert(this.attaUrl);
                //this.attaUrl = attaUrl;
                //alert(this.attaUrl);
                // var obj = document.getElementById('fileA');
                // obj.href = attaUrl;
                // obj.click();
                window.open(attaUrl)
                // this.$nextTick(() => {
                //     alert(this.$refs.attaTag.href);
                //     this.$refs.attaTag.click();
                //     // window.open(this.attaUrl)
                //     //$("#fileA").trigger('click');
                //     $("#fileA").trigger('click');
                // });
                //return th
                return attaUrl;
            }
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .vote-result {
        margin-top: 20px;
        padding-bottom: 0;
    }
    .agile-list {
        text-align: left;
    }
    legend {
        width: 100%;
    }
    legend > div {
        display: block;
        padding-right: 40px;
        float: right;
    }
    .subject-vote-result-table tr td {
        width: auto;
    }
    .vote-result /deep/ .notification-content {
        word-wrap:break-word;
        white-space:normal;
        word-break:break-all; 
    }
    .subject-child-table td, .subject-vote-result-table tr td {
        border: 1px solid wheat!important;
    }
    .vote-option-1 {
        color: #44b333;
    }
    .vote-option-2 {
        color: #44b333;
    }
    .vote-option-3 {
        color: #e52527;
    }
    .vote-option-4 {
        color: #ffa200;
    }
    .vote-option-5 {
        color: #40a6f4;
    }
    .subject-vote-result-table tr td {
        border: 1px solid white;
    }
    td button {
        cursor: pointer;
    }
    td {
        word-wrap:break-word;
        word-break:break-all;
    }
    .pass-type-1 {
        background: #4fa44a;
    }
    .pass-type-2 {
        background: #f05c5c;
    }
    .pass-type-3 {
        background: #E0C94A;
    }
    .pass-type-4 {
        background:rgb(243, 19, 14)
    }
    .pass-type-5 {
        background: #56aff4
    }
    .pass-count-1 {
        color: #4fa44a;
    }
    .pass-count-2 {
        color: #f05c5c;
    }
    .pass-count-3 {
        color: #E0C94A;
    }
    .pass-count-4 {
        color:rgb(243, 19, 14)
    }
    .pass-count-5 {
        color: #56aff4
    }
</style>

