<template>
    <div>
        <dl class="timelineMinor">
            <dd class="timelineEvent" style="padding-left: 0">
                <div v-if="!manage" class="wrapper wrapper-content">
                    <div class="row row-background">
                        <!-- <div class="top-btn-group">
                            <button  v-if="!isEnd && !voteSubmit && curVoteSubjects && curVoteSubjects.length > 0" @click="emptyVote" type="button" class="btn btn-info agree-btn" style="background: #d5493a;border-color:#d5493a"><i class="fa fa-eraser"></i> 一键清空</button>
                            <button  v-if="!isEnd && !voteSubmit && curVoteSubjects && curVoteSubjects.length > 0" @click="allVoteAgree" type="button" class="btn btn-info agree-btn"><i class="fa fa-pencil"></i> 全选同意</button>
                        </div> -->
                        <div class="agile-detail" style="padding: 0 20px;">
                            <table v-if="refresh" class="subject-child-table">
                                <tbody>
                                    <tr>
                                        <th style="min-width: 45px;">序号</th> 
                                        <th>议题名称</th> 
                                        <th v-if="hasRatingItem" colspan="2" style="min-width: 340px;"><!-- 项目立项可行性研究 -->评分项</th> 
                                        <th style="min-width: 135px;">表决意见</th> 
                                        <th v-if='hasConditionallyAgreed'>表决说明</th>
                                    </tr>
                                    <template v-for="(subject, index) in canVoteSubjects">
                                        <tr
                                            :key="subject.id"
                                            :class="{'odd': index % 2 != 0}">
                                            <td :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1">{{ getSubjectIndex(subject.id) }}</td>
                                            <td :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" 
                                                :colspan="subject.ratingItem ? 1 : (hasRatingItem ? 3 : 1)">
                                                {{ subject.subjectName }}
                                            </td>
                                            <td v-if="subject.ratingItem">{{ ratingItemMap[subject.ratingItem.split(',')[0]] }}</td>
                                            <td v-if="subject.ratingItem && memberVotes[index]" style="text-align: left;">
                                                <star-rate 
                                                    v-if="refresh" 
                                                    v-model="memberVotes[index]['scoreResultJson'][subject.ratingItem.split(',')[0]]" 
                                                    :name="subject.id"
                                                    :on-change="ratingChange" 
                                                    :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                    type="star1" 
                                                    active-color="#fadb14" 
                                                    inactive-color="#ccc" 
                                                    hover-color="#fadb14"/>
                                                <span class="text rating-text">您的评分：{{ memberVotes[index]['scoreResultJson'][subject.ratingItem.split(',')[0]] }} 分</span>
                                            </td>
                                            <td v-if="memberVotes[index]" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" :colspan="subject.voteOptions.split(',').indexOf(2) != -1 ? 1 : 1" style="text-align: left;">
                                                <layui-radio-group
                                                    v-if="refresh"
                                                    :textMap="voteOptionMap" 
                                                    :vals="subject.voteOptions.split(',')"
                                                    :name="subject.id"
                                                    :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                    :val="memberVotes[index].voteOpinionDict"
                                                    formRadioClass="form-radio"
                                                    v-model="memberVotes[index].voteOpinionDict"
                                                    @checkedAfter="voteOpinionChange"/>
                                            </td>
                                            <td v-if="true || subject.voteOptions.split(',').indexOf(2) != -1" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" style="min-width: 160px;">
                                                <form class="form-horizontal m-t" id="commentForm">
                                                    <div class="form-group">
                                                        <div class="col-sm-12">
                                                            <textarea v-if="memberVotes[index]" :disabled='myVoteDetailMap[subject.id] ? true : false' v-model="memberVotes[index].remark" class="form-control" required="" aria-required="true" rows="4" placeholder="请写下您的宝贵意见..."></textarea>
                                                            <!-- <textarea v-if="!myVoteDetailMap[subject.id] && memberVotes[index] && memberVotes[index].voteOpinionDict == 2" :disabled='myVoteDetailMap[subject.id] ? true : false' v-model="memberVotes[index].remark" class="form-control" required="" aria-required="true" rows="4" placeholder="请写下您的宝贵意见..."></textarea> -->
                                                            <!-- <textarea v-if="myVoteDetailMap[subject.id] || (memberVotes[index] && memberVotes[index].voteOpinionDict != 2)" v-model="memberVotes[index].remark" disabled class="form-control" required="" aria-required="true" rows="4" placeholder="请写下您的宝贵意见..."></textarea> -->
                                                        </div>
                                                    </div>
                                                    <div v-if="false && !myVoteDetailMap[subject.id] && memberVotes[index] && memberVotes[index].voteOpinionDict == 2"  class="form-group">
                                                        <div class="col-sm-12">
                                                            <button class="btn btn-info agree-clear" type="button" @click="clear(index)">
                                                                <i class="fa fa-times"></i> 清空
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </td>
                                        </tr>
                                        <template v-for="(dict,dIndex) in (subject.ratingItem ? subject.ratingItem.split(',') : [])">
                                            <tr
                                                v-if="dIndex != 0" 
                                                :key="subject.id + '-' + dIndex"
                                                :class="{'odd': index % 2 != 0}">
                                                <td>{{ ratingItemMap[dict] }}</td>
                                                <td  v-if="memberVotes[index]" style="text-align: left;">
                                                    <star-rate 
                                                        v-if="refresh" 
                                                        v-model="memberVotes[index]['scoreResultJson'][dict]" 
                                                        :name="subject.id"
                                                        :on-change="ratingChange" 
                                                        :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                        :value="memberVotes[index]['scoreResultJson'][dict]"
                                                        class="test" 
                                                        type="star1" 
                                                        active-color="#fadb14" 
                                                        inactive-color="#ccc" 
                                                        hover-color="#fadb14"/>
                                                    <span class="text rating-text">您的评分：{{ memberVotes[index]['scoreResultJson'][dict] }} 分</span>
                                                </td>
                                            </tr>
                                        </template>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <br class="clear">
            </dd>
        </dl>
    </div>
</template>

<script>
import {getTabIndex, getMeeting, getMembers, getManage, getCurTabStatus, getSubjectSelectedIndex, getUserMap, getOfficeNameMap, getDicts} from '@/utils/meetingUtils'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
// import StarRate from 'vue-cute-rate'
import StarRate from '@/components/StarBtn'
import LayuiRadioGroup from '@/components/LayuiRadioGroup'
let _ = require('lodash')
export default {
    components: {
        StarRate,LayuiRadioGroup
    },
    data () {
        return {
            rolHeight: 100340,
            selectAll: false,
            value: 3,
            memberVotes: [],
            refresh: true,
            voteSubmit: false,
            cannotChangeSubjectIds: [],
        }
    },
    props: ['meetingId'],
    computed: {
        ...mapGetters({
            canVoteSubjects: 'meeting/canVoteSubjects',
            curVoteSubjects: 'meeting/curVoteSubjects',
        }),
        meetingSubjects() {
            return this.$store.state.meeting.meetingSubjects;
        },
        isEnd: function(){
            return this.$store.state.meeting.isEnd;
        },
        manage: function(){
            return getManage(this);
        },
        ratingItemMap: function(){
            return getDicts(this, 2).array2Obj('value', 'label');
        },
        voteOptionMap: function(){
            return getDicts(this, 3).array2Obj('value', 'label');
        },
        hasRatingItem: function(){
            return this.canVoteSubjects.filter(sub => {
                return sub.ratingItem && sub.ratingItem != "" && sub.ratingItem.trim().split(',').length > 0;
            }).length > 0;
        },
        hasConditionallyAgreed: function(){
            // return this.canVoteSubjects.filter(sub => {
            //     return sub.voteOptions && sub.voteOptions.trim().split(',').indexOf('2') != -1;
            // }).length > 0;
            return true;
        },
        myVoteDetailMap: function(){
            return this.$store.state.meeting.voteInfo.myVoteDetailMap || {};
        },
        memberSubjectVotes: function() {
            return this.$store.state.meeting.memberSubjectVotes || [];
        }
    },
    watch: {
        'curVoteSubjects': function(){
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
        },
        canVoteSubjects: function () {
            this.updateMemberVotes();
            this.refresh = false;
                this.$nextTick(function(){
                    this.refresh = true;
                });
        },
        memberVotes: {
            handler() {
                this.updateMemberSubjectVotes(this.memberVotes);
            },
            deep: true
        },
    },
    mounted () {
        console.log("会议开始tab-" + this.meetingId);

        if(this.$refs.meetingContent && this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
            this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000)
        }

        if(!this.manage){
            this.updateMemberVotes();
        }
    },
    methods: {
        ...mapMutations({
            //updateMemberSubjectVotes: 'meeting/UPDATE_MEMBER_SUBJECT_VOTES'
        }),
        getSubjectIndex(subjectId) {
            let index = this.meetingSubjects.indexOf(subjectId, 'id');
            return index == -1 ? '' : (index + 1);
        },
        updateMemberSubjectVotes: function(votes) {
            this.$store.commit('meeting/UPDATE_MEMBER_SUBJECT_VOTES', votes);
        },
        updateMemberVotes: function(){
            var memberVotes = [];
            this.canVoteSubjects.forEach(element => {
                var index = this.memberSubjectVotes.indexOf(element.id, 'subjectId');
                
                if(index != -1 && !(this.isEnd && this.myVoteDetailMap[element.id])) {
                    memberVotes.push(JSON.parse(JSON.stringify(this.memberSubjectVotes[index])));
                } else {
                    memberVotes.push({
                        subjectId: element.id,
                        scoreResultJson: (this.isEnd && this.myVoteDetailMap[element.id]) ? JSON.parse(this.myVoteDetailMap[element.id].scoreResultJson) : defaultScoreResult(element),
                        voteOpinionDict: (this.isEnd && this.myVoteDetailMap[element.id]) ? this.myVoteDetailMap[element.id].voteOpinionDict : null,
                        remark: (this.isEnd && this.myVoteDetailMap[element.id]) ? this.myVoteDetailMap[element.id].remark :  null
                    });
                }
            });
            function defaultScoreResult(subject){
                if(!subject.ratingItem){
                    return null;
                }
                var ratingItems = subject.ratingItem.trim().split(',');
                var res = {};
                ratingItems.forEach(ele => {
                    res[ele] = 0;
                });
                return res;
            }
            this.memberVotes = memberVotes;
        },
        subChecked: function(subId){
        	var index = this.voteSubjectIds.indexOf(subId);
        	return index != -1;
        },
        ratingChange: function(score, subjectId){
            
            if(this.cannotChangeSubjectIds.indexOf(subjectId, 'subjectId') == -1){
                this.cannotChangeSubjectIds.push(subjectId);
            }
        },
        clear: function(index){
            this.$set(this.memberVotes[index], 'remark', '');
        },
        voteOpinionChange: function(data) {
            
            var index = this.memberVotes.indexOf(data.name, 'subjectId');
            if(index == -1){
                return;
            }
            // 人为选择过分数的议题 分数不在随着表决项变化
            if(this.cannotChangeSubjectIds.indexOf(data.name) != -1){
                return;
            }
           
            var memberVote = this.memberVotes[index];
            var defaultScore = getDefaultScore(data.val);
            for(const key in memberVote.scoreResultJson) {
                memberVote.scoreResultJson[key] = defaultScore;
            }
            memberVote.voteOpinionDict = data.val;
            this.$set(this.memberVotes, index, memberVote);
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
            function getDefaultScore(voteOpinion){
                if(voteOpinion == 1){
                    return 4;
                }
                if(voteOpinion == 2){
                    return 3;
                }
                if(voteOpinion == 3){
                    return 1;
                }
                return 0;
            }
        },
        allVoteAgree: function() {
            this.memberVotes.forEach((item) => {
                this.voteOpinionChange({
                    name: item.subjectId,
                    val: 1
                });
            })
            
        },
        emptyVote: function() {
            confirm("确定清空投票数据吗？", () => {
                this.updateMemberVotes();
                if(this.curVoteSubjects.length > 0){
                    this.voteSubmit = false;
                }
                this.cannotChangeSubjectIds = [];
                this.refresh = false;
                this.$nextTick(function(){
                    this.refresh = true;
                });
            });
        },
    },
    created () {
         this.$store.commit('meeting/UPDATE_VOTING_DRAFT_DESTORY', 2);
    },
    beforeCreate () {
       
    },
    beforeDestroy () {
        console.log("des");
        //this.$store.commit('meeting/UPDATE_VOTING_DRAFT_DESTORY', 3);
    },
    destroyed () {
        this.$store.commit('meeting/UPDATE_VOTING_DRAFT_DESTORY', 3);
    }
}
</script>

<style src="../../assets/css/meeting/screen.css" scoped></style>
<style src="../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .btn-vote {
        height: 46px;
        width: 130px;
        display: block;
        margin-bottom: 5px;
        background: #d2cfbc;
        border: none;
    }
    /* div.layui-unselect {
        margin-bottom: 10px;
    } */
    .vote-subject-list li {
        height: 85px;
        padding: 0;
    }
    .vote-subject-list li:first-child {
        height: 52px;
    }
    .text-container {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    td /deep/ .star-full {
        margin-right: 0px;
    }
    td /deep/ .star-main {
        margin: 0;
    }
    td /deep/ .icon-star1 {
        font-size: 26px;
    }
    td .rating-text {
        position: relative;
        top: -4px;
    }
    td /deep/ .layui-unselect.layui-form-radio {
        display: block;
        padding-bottom: 10px;
    }
    .member-review-btn-active {
        background: #5580ba;
    }
    .start-vote-btn-active {
        background: #6ca80d;
    }
    .end-vote-btn-active {
        background: #ea4c4c;
    }
    td {
        vertical-align: middle;
    }
    .o-btn-group .btn-info:active:focus, .o-btn-group .btn-info:active:hover{
        background-color: #d2cfbc;
        border: none;
    }
    .o-btn-group .btn:active:focus, .o-btn-group .btn:focus {
        outline-offset: 0;
    }
    .o-btn-group .btn.active, .o-btn-group .btn:active {
        -webkit-box-shadow: none;
        box-shadow: 0px;
    }
    .top-btn-group {
        float: right;
        margin-right: 20px;
        margin-bottom: 4px;
        margin-top: 4px;
    }
</style>
