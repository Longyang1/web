<template>
    <div id="subjectTop">
        <h2 ></h2>
        <div id="target-top" class="tab-title">{{ subject.subjectName }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div class="row row-background">
                            <div class="col-lg-3 col-md-3 visible-lg-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="" src="/img/meeting/metting4.png"/>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 visible-md-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="visible-md-block" height="170" src="/img/meeting/metting4.png"/>
                                </div>
                            </div>
    
                            <div v-if="manage" class="col-lg-2 col-md-3 middle" :style="{height: rolHeight + 'px'}">
                                <div class="o-btn-group">
                                    <button @click="tabSwitch({index: subjectSelectedIndex + subTabIndex})" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}"><i class="fa fa-circle-o" aria-hidden="true"></i>启动议题</button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span>点击启动议题按钮后参会人员进入该议题页面</span>
                                    <button v-if="manage" @click="next(subjectSelectedIndex + subTabIndex)" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': manage, 'col-lg-9 col-md-9': !manage}" :style="{height: rolHeight + 'px'}">
                                <div v-if="false && manage" class="top row" ref="meetingContent">
                                    <!-- 事务类议题特殊部分 start -->
                                    <span v-if="!subject.projectId">{{ subject.subjectName}}</span>
                                    <img 
                                        v-if="manage && !disabled && !subject.projectId && subject.subjectVoteFlag == 'y'" 
                                        @click="subjectVote(subject.id, subjectSelectedIndex + subTabIndex)" 
                                        src="/img/meeting/subject-vote.png"
                                        style="float:right;padding-right: 10px;"/>
                                    <div v-if="!subject.projectId" class="meeting-content" v-html="subject.remark"></div>
                                    <!-- 事务类议题特殊部分 end -->
                                </div>
                                <!-- <ul class="sortable-list connectList agile-list middle" style="padding-right: 20px;">
                                    <li class="success-element" style="width: 100%;"> -->
                                <div ref="meetingContent" :class="{'file-manage': manage}" style="padding-left: 30px">
                                    <div v-if="manage && !disabled && !subject.projectId && subject.subjectVoteFlag == 'y'" style="text-align: right;padding-right: 20px;padding-top: 10px">
                                        <img 
                                            @click="subjectVote(subject.id, subjectSelectedIndex + subTabIndex)" 
                                            src="/img/meeting/subject-vote.png"/>
                                    </div>
                                    <meeting-subject-file type="2"></meeting-subject-file>
                                </div>
                            </div>
                        </div>

                        <div v-if="subject.remark" class="row row-background left-border" style="margin-top: 20px">
                            <div class="col-sm-12 explain-sign">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend style="padding-top: 10px;">
                                        <i class="iconfont icon-icon-teststage" style="color: rgb(84, 116, 182);"></i> 说明
                                    </legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            {{ subject.remark }}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        <meeting-subject-item></meeting-subject-item>

                        <!-- <meeting-subject-file></meeting-subject-file> -->

                        <!-- 投票草稿 start -->
                        <div v-if="false && meeting.meetingTypeDict != 6 && !isEnd && !manage && canVote && subject.subjectVoteFlag == 'y'" class="row row-background left-border" style="margin-top: 20px">
                            <div class="col-sm-12 explain-sign">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend style="padding-top: 10px;">
                                        <i class="iconfont icon-caogao" style="color: rgb(237, 103, 46);"></i> 投票草稿
                                    </legend>
                                    <div class="layui-field-box">
                                         <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list ui-sortable">
                                                <li class="success-element">
                                                    <div class="agile-detail">
                                                        <table class="subject-child-table">
                                                            <tbody>
                                                                <tr>
                                                                    <th v-if="hasRatingItem" colspan="2" style="min-width: 315px;"><!-- 项目立项可行性研究 -->评分项</th> 
                                                                    <th style="min-width: 135px;">表决意见</th> 
                                                                    <th>意见说明</th>
                                                                </tr>
                                                                <tr>
                                                                    <td v-if="subject.ratingItem">{{ ratingItemMap[subject.ratingItem.split(',')[0]] }}</td>
                                                                    <td v-if="subject.ratingItem" style="text-align: left;">
                                                                        <star-rate 
                                                                            v-if="refresh" 
                                                                            v-model="memberVote['scoreResultJson'][subject.ratingItem.split(',')[0]]" 
                                                                            :name="subject.id"
                                                                            :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                                            :on-change="ratingChange" 
                                                                            type="star1" 
                                                                            active-color="#fadb14" 
                                                                            inactive-color="#ccc" 
                                                                            hover-color="#fadb14"/>
                                                                        <span class="text rating-text">您的评分：{{ memberVote['scoreResultJson'][subject.ratingItem.split(',')[0]] }} 分</span>
                                                                    </td>
                                                                    <td v-if="memberVote" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" :colspan="subject.voteOptions.split(',').indexOf(2) != -1 ? 1 : 1" style="text-align: left;">
                                                                        <layui-radio-group
                                                                            v-if="refresh"
                                                                            :textMap="voteOptionMap" 
                                                                            :vals="subject.voteOptions.split(',')"
                                                                            :name="subject.id"
                                                                            :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                                            :val="memberVote.voteOpinionDict"
                                                                            formRadioClass="form-radio"
                                                                            v-model="memberVote.voteOpinionDict"
                                                                            @checkedAfter="voteOpinionChange"/>
                                                                    </td>
                                                                    <td v-if="subject.voteOptions.split(',').indexOf(2) != -1 || true" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" style="min-width: 160px;">
                                                                        <form class="form-horizontal m-t" id="commentForm">
                                                                            <div class="form-group">
                                                                                <div class="col-sm-12">
                                                                                    <textarea v-model="memberVote.remark" class="form-control" required="" :disabled="myVoteDetailMap[subject.id] ? true : false" aria-required="true" rows="4" placeholder="请写下您的宝贵意见..."></textarea>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </td>
                                                                </tr>
                                                                <template v-for="(dict,dIndex) in (subject.ratingItem ? subject.ratingItem.split(',') : [])">
                                                                    <tr 
                                                                        v-if="dIndex != 0" 
                                                                        :key="subject.id + '-' + dIndex">
                                                                        <td>{{ ratingItemMap[dict] }}</td>
                                                                        <td  v-if="memberVote" style="text-align: left;">
                                                                            <star-rate 
                                                                                v-if="refresh" 
                                                                                v-model="memberVote['scoreResultJson'][dict]" 
                                                                                :name="subject.id"
                                                                                :on-change="ratingChange" 
                                                                                :disabled="myVoteDetailMap[subject.id] ? true : false"
                                                                                :value="memberVote['scoreResultJson'][dict]"
                                                                                class="test" 
                                                                                type="star1" 
                                                                                active-color="#fadb14" 
                                                                                inactive-color="#ccc" 
                                                                                hover-color="#fadb14"/>
                                                                            <span class="text rating-text">您的评分：{{ memberVote['scoreResultJson'][dict] }} 分</span>
                                                                        </td>
                                                                    </tr>
                                                                </template>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>								  
                                </fieldset>
                            </div>
                        </div>
                        <!-- 投票草稿 end -->
                    </div>
                    <br class="clear">
                </dd>
            </dl>
        </div>
        <div v-if="disabled" class="watermark-image"></div>
        <a id="fileA" ref="attaTag" :href="attaUrl" target="_blank"></a>
    </div>
</template>

<script>
import { getTabIndex, getMeeting, getManage, getCurTabStatus, getSubjectSelectedIndex, getUserMap, getOfficeNameMap, getDicts } from '@/utils/meetingUtils'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import StarRate from '@/components/StarBtn'
import LayuiRadioGroup from '@/components/LayuiRadioGroup'
import meetingTabMixin from '@/mixin/meetingTabMixin'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
import 'echarts/theme/macarons.js'
import MeetingSubjectItem from '@/views/meeting/tabs/MeetingSubjectItem'
import MeetingSubjectFile from '@/views/meeting/tabs/MeetingSubjectFile'

export default {
    mixins: [meetingTabMixin],
    components: {
        StarRate,
        LayuiRadioGroup,
        MeetingSubjectItem,
        MeetingSubjectFile
    },
    data () {
        return {
            rolHeight: 100270,
            memberVote: {
                subjectId: '',
                scoreResultJson: '',
                voteOpinionDict: '',
                remark: ''
            },
            refresh: true,
            canChangeScore: true,
            attaUrl: '',

        }
    },
    computed: {
        ...mapGetters({
            votingCandidates: 'meeting/votingCandidates',
        }),
        curTabStatus: function() {
            return getCurTabStatus(this, this.subjectSelectedIndex + this.comIndex);
        },
        canVote() {
            return this.votingCandidates.indexOf(this.user.userId, 'userId') != -1;
        },
        subjectSelectedIndex: function() {
            return getSubjectSelectedIndex(this);
        },
        subject: function() {
            return this.inSelectSubjects[this.subjectSelectedIndex];
        },
        hasRatingItem: function() {
            var sub = this.subject;
            return sub.ratingItem && sub.ratingItem != "" && sub.ratingItem.trim().split(',').length > 0;
        },
        memberSubjectVotes: function() {
            return this.$store.state.meeting.memberSubjectVotes || [];
        },
        disabled () {
            return false;//this.disabledSubjectIds.indexOf(this.subject.id) != -1;
        },
        votingDraftRefresh() {
            return this.$store.state.meeting.votingDraftRefresh;
        },
        votingDraftDestory() {
            return this.$store.state.meeting.votingDraftDestory;
        },
    },
    watch: {
        subjectSelectedIndex() {
           
        },
        subject: function() {

            var index = this.memberSubjectVotes.indexOf(this.subject.id, 'subjectId');
            if (index != -1) {
                this.memberVote = this.memberSubjectVotes[index];
            } else {
                this.initMeetingVote(this.subject);
            }

            this.canChangeScore = true;
           
            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
                // if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
                    //     this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000);
                // }
                document.querySelector("#meeting").scrollIntoView(true)
            });
        },
        memberVote: {
            handler() {
                this.$nextTick(() => {

                    if (this.votingDraftDestory != 2) {
                        this.updateMemberSubjectVotes(this.memberVote);
                    }
                });
            },
            deep: true
        },
        votingDraftRefresh: function() {
            var index = this.memberSubjectVotes.indexOf(this.subject.id, 'subjectId');
            if (index != -1) {
                this.memberVote = this.memberSubjectVotes[index];
                this.refresh = false;
                this.$nextTick(function(){
                    this.refresh = true;
                });
            } 
        },
        subjectVoteRefresh: function () {
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
        },
    },
    mounted () {
        console.log("会议开始tab-" + this.meetingId);

        // if (this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)) {
        //     this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000);
        // }

        this.initMeetingVote(this.subject);

        var index = this.memberSubjectVotes.indexOf(this.subject.id, 'subjectId');
        if (index != -1) {
            this.memberVote = this.memberSubjectVotes[index];
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
        }
    },
    methods: {
        ...mapActions({
            doTabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
        }),
        ...mapMutations({
            setVoteSubjectIds: 'meeting/UPDATE_VOTE_SUBJECTIDS',
            setTabIndex: 'meeting/SET_TAB_INDEX',
            saveCurVoteSubjectTabIndex: 'meeting/SET_CUR_VOTE_SUBJECT_TAB_INDEX',
            //updateMemberSubjectVotes: 'meeting/UPDATE_MEMBER_SUBJECT_VOTES'
        }),
        notifyTableHeight(h) {
            if (100270 < (h + 100000)) {
                this.rolHeight = (h + 100000 + 20) + (this.manage ? 10 : 0);
            } else {
                this.rolHeight = 100270;
            }
        },
        updateMemberSubjectVotes: function(votes) {
            this.$store.commit('meeting/UPDATE_MEMBER_SUBJECT_VOTES', votes);
        },
        tabSwitch: function(param) {
            this.doTabSwitch(param).then(() => {
                // 非部务会不需弹出倒计时页面
                if(this.meeting.meetingTypeDict != 3){
                    return;
                }
                var minite = 0;
                // if (this.subitemMap) {
                //     for(const key in this.subitemMap){
                //         if(key == 'mems_' + this.subject.id){
                //             this.subitemMap[key].forEach(item => {
                //                 minite += item.reportTime;
                //             });
                //             break;
                //         }
                //     }
                // }
                this.$store.commit("meeting/UPDATE_MINUTE", minite);
                
                this.$store.commit("meeting/UPDATE_COUNTDOWN_SHOW", false);

                this.$store.commit("meeting/UPDATE_SHOW", {
                    show: 5
                });
                this.$nextTick(() => {
                    this.$store.commit("meeting/UPDATE_COUNTDOWN_SHOW", true);
                });

            });
        },
        subjectVote: function(subjectId, index){
            this.setVoteSubjectIds([subjectId]);
            this.setTabIndex(this.inSelectSubjects.length + this.subTabIndex);
            this.saveCurVoteSubjectTabIndex(index);
        },
        initMeetingVote: function(element) {
            this.memberVote = {
                subjectId: element.id,
                scoreResultJson: defaultScoreResult(element),
                voteOpinionDict: null,
                remark: null
            }
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
        },
        ratingChange: function(score, subjectId){
            this.canChangeScore = false;
        },
        voteOpinionChange: function(data) {
            
            if(!this.canChangeScore) {
                return;
            }
            var memberVote = this.memberVote;
            
            var defaultScore = getDefaultScore(data.val);
            for(const key in memberVote.scoreResultJson) {
                memberVote.scoreResultJson[key] = defaultScore;
            }
            memberVote.voteOpinionDict = data.val;
            this.$set(this.memberVote, 'voteOpinionDict', data.val);
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
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style scoped>
    fieldset.subject-title {
       border: none;
       text-align: left;
    }
    .subject-table {
       font-size: 14px;
    }
    .subject-table tr td {
       height: 32px;
       line-height: 32px;
    }
   /* .subject-table .visible-md-block tr td {
       width: 50%;
   } */
    .top {
       padding-top: 20px;
    }
    .col-lg-9 .subject-table .visible-lg-block tr td {
       width: 33%;
    }
    fieldset.subject-title {
        margin-top: 0px;
    }
    legend {
        width: 100%;
    }
    legend > div {
        display: block;
        padding-right: 40px;
        float: right;
    }
    .child-padding {
        padding-left: 24px;
    }
    td {
        vertical-align: middle;
    }
    td /deep/ .layui-unselect.layui-form-radio {
        display: block;
        padding-bottom: 10px;
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
    .watermark-image {
        position: relative;

        width: 100%;
        height: 100%;

        /* background: url("/img/meeting/timg.jpg") no-repeat; */
        background-size: 300px;
    }

    .watermark-image:before {
        content: "该议题已失效.";
        font-size: 33pt;

        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -170px;

        background-color: rgba(255, 255, 0, 0.7);
        -webkit-transform:rotate(-45deg);
    }
    .ys-total {
        background: #0b92e4;
        color: #fff;
        font-weight: bold;
    }
    .row /deep/ div[type='2'] ul {
        min-height: 248px;
    }
    .row .file-manage /deep/ div[type='2'] {
        margin-top: 0;
    }
</style>
