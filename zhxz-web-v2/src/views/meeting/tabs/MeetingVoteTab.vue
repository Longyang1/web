<template>
    <div>
        <div class="tab-title">{{ meetingSessions[comIndex].name }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div :class="{'wrapper wrapper-content': true, 'hidden': (!manage && !isEnd && voting && !voteSubmit && curVoteSubjects && curVoteSubjects.length > 0)}">
                        <div v-if="manage" class="row row-background left-border vote-result">
                            <div class="col-sm-12 explain-sign">
                                <fieldset class="layui-elem-field" style="border: none;text-align: left;">
                                    <legend style="padding-top: 10px;"> <i class="fa fa-user text-warning"></i> 投票人员
                                        <div style="float:  right;padding-right: 40px;">
                                             <button @click="voteMemberSelectAll" type="button" class="btn btn-info agree-btn" style="background: #d5493a;border-color:#d5493a"><i class="fa fa-user"></i> {{ selectAll ? '取消全选' : '全部选中' }}</button>
                                        </div>
                                    </legend> 
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list">
                                                <li class="success-element">
                                                    <span style="display: block;padding-bottom: 10px;"><i class="fa fa-bar-chart text-success"></i> 
                                                        本次拥有投票权的用户总数为<em class="text-green-deep h4" style="font-weight: 500;">{{ members.filter(m => m.memberVoteFlag == 'y').length }}</em>人。
                                                    </span>
                                                    <div v-for="(member) in votingCandidates"
                                                        :class="{'layui-unselect layui-form-checkbox': true, 'layui-form-checked': checked(member)}"
                                                        :key="member.id"
                                                        @click="voteStep == 1 ? voteMemberSelect(member.principal ? member.principal : member.userId) : ''"
                                                        :style="{'margin-bottom': '10px'}">
                                                        <span v-if="!member.principal">{{ userMap[member.userId] }}</span>
                                                        <span v-if="member.principal">{{ userMap[member.principal] }}</span>
                                                        <i class="layui-icon layui-icon-ok" style="height:30px"></i>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    

                        <div v-if="manage && false" class="row row-background">
                            <div class="col-lg-12 col-md-12 left-border" style="text-align: left;padding-left:  10px;padding-top: 10px;padding-right: 10px">
                                <div class="top-btn-group" style="display: block;float:none">
                                    <button @click="voteMemberSelectAll" type="button" class="btn btn-info agree-btn" style="background: #d5493a;border-color:#d5493a"><i class="fa fa-user"></i> {{ selectAll ? '取消全选' : '全部选中' }}</button>
                                </div>
                                <div v-for="(member) in votingCandidates"
                                    :class="{'layui-unselect layui-form-checkbox': true, 'layui-form-checked': checked(member)}"
                                    :key="member.id"
                                    @click="voteStep == 1 ? voteMemberSelect(member.principal ? member.principal : member.userId) : ''"
                                    :style="{'margin-bottom': '10px'}">
                                    <span v-if="!member.principal">{{ userMap[member.userId] }}</span>
                                    <span v-if="member.principal">{{ userMap[member.principal] }}</span>
                                    <i class="layui-icon layui-icon-ok" style="height:30px"></i>
                                </div>
                            </div>
                        </div>
                        <div class="row row-background">
                            <div v-if="manage" class="col-lg-3 col-md-3 visible-lg-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="" src="/img/meeting/vote.png"/>
                                </div>
                            </div>
                            <div v-if="manage" class="col-lg-3 col-md-3 visible-md-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="visible-md-block" height="170" src="/img/meeting/vote.png"/>
                                </div>
                            </div>
    
                            <div v-if="manage" class="col-lg-2 col-md-3 middle" :style="{height: rolHeight + 'px'}">
                                <div class="o-btn-group">
                                    <button 
                                        :class="{'btn btn-info btn-vote vote-pros-check': true, 'member-review-btn-active': (!isEnd && voteStep == 1)}" 
                                        type="button"
                                        @click="memberReview"><i class="fa fa-users"></i> 人员复核</button>
                                    <button 
                                        :class="{'btn btn-info btn-vote vote-start': true,  'start-vote-btn-active': (voteStep == 2 || voteStep == 3)}"
                                        type="button"
                                        @click="startVoting({index: (inSelectSubjects.length + (comIndex - 1)), flag: true})"><i class="fa fa-play"></i> 开始投票</button>
                                    <button 
                                        :class="{'btn btn-info btn-vote vote-stop': true, 'end-vote-btn-active': (voteStep == 2 || voteStep == 3)}" 
                                        type="button"
                                        @click="endVoting({index: (inSelectSubjects.length + (comIndex - 1)), flag: false})"><i class="fa fa-stop"></i> 停止投票</button>
                                    <button v-if="manage" @click="next(inSelectSubjects.length + (comIndex - 1))" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div 
                                :class="{'col-lg-7 col-md-6': manage, 'col-lg-12 col-md-12': !manage}" 
                                :style="{height: manage ? (rolHeight + 'px') : 'auto'}">
                                <div class="top row" ref="meetingContent" :style="{'padding-top': !manage ? '0' : '20px'}">
                                    <ul class="sortable-list connectList agile-list ui-sortable vote-subject-list" style="text-align: left;padding-right: 20px;padding-left: 20px;" ref="subjectUl">
                                        <li v-if="manage" class="success-element" :style="{height: voteUserLiHeight + 'px', 'padding-left': '20px', 'padding-top':'10px', 'margin-top': '10px'}">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-icon-vote"></use>
                                            </svg>
                                            <span>投票内容:</span>
                                            <div class="agile-detail vote-pros">
                                                <div @click="selectCurVoteSubjects(null)" :class="{'layui-unselect layui-form-checkbox ': true, 'layui-form-checked': canVoteSubjects.length == voteSubjectIds.length}" lay-skin="primary" style="line-height: 50px;padding-right: 8px;padding-bottom: 2px;"><i class="layui-icon layui-icon-ok"></i></div>
                                                <span style="font-size: 14px;padding-right: 6px;"> 全部</span>
                                                <template v-for="(votingRound, index) in votingRounds">
                                                    <div 
                                                        :key="'vr_c_' + index"
                                                        @click="selectCurVoteSubjects(null, votingRound)" 
                                                        :class="votingRoundCheckboxClass(votingRound)" 
                                                        lay-skin="primary" 
                                                        style="line-height: 50px;padding-right: 8px;padding-bottom: 2px;"><i class="layui-icon layui-icon-ok"></i></div>
                                                    <span :key="'vr_t_' + index" style="font-size: 14px;padding-right: 6px;"> 第{{ votingRound }}轮</span>
                                                </template>
                                            </div>
                                        </li>
                                        <li v-if="!manage" class="success-element" :style="{height: voteUserLiHeight + 'px', 'padding-left': '20px', 'padding-top':'10px', 'margin-top': '10px'}">
                                            <i class="fa fa-user text-warning"></i> 投票人员
                                            <div class="agile-detail vote-pros" ref="voteUserBox">
                                                <span v-for="(member, index) in votingMembers" :key="member.id" :class="{voted: checkUserVoted(member)}">{{ userMap[member.userId] }}<template v-if="votingMembers.length > (index + 1)">，</template></span>
                                            </div>
                                        </li>
                                        <template v-for="(item, index) in manage ? canVoteSubjects : votedSubjects">
                                        <li class="success-element"
                                            :key="'vote_list_' + item.id"
                                            v-if="manage || (!manage && index == 0)">
                                            <div class="text-container">
                                                <div v-if="manage" @click="selectCurVoteSubjects(item.id)" :class="{'layui-unselect layui-form-checkbox ': true, 'layui-form-checked': subChecked(item.id)}" lay-skin="primary" style="line-height: 52px!important;padding-right: 8px;margin-left: 20px"><i class="layui-icon layui-icon-ok"></i></div>
                                                <span v-if="manage" class="subject-title" :style="{'width': subjectNameWidth + 'px'}" :title='item.subjectName'> {{ getSubjectIndex(item.id) }}、{{ item.subjectName }}</span>
                                                <sup v-if="manage && item.votingRound" :class="subjectVotingRoundClass(item.votingRound)">第{{ item.votingRound }}轮</sup>
                                                <span v-if="!manage && index == 0" style="height:52px;padding-left: 20px;line-height:52px;word-wrap: break-word;word-break: break-all;"><i class="fa fa-gavel text-warning"></i> 投票进度</span>
                                            </div>
                                            <div v-if="manage" lay-showpercent="true" lay-filter="sign-bar" class="layui-progress layui-progress-big" style="margin: 0 20px">
                                                <div lay-percent="0%" class="layui-progress-bar" :style="{'background-color': 'rgb(39, 194, 76)', width: voteRateInfo[item.id] + '%'}">
                                                    <span class="layui-progress-text">{{ voteRateInfo[item.id] }}%</span>
                                                </div>
                                            </div>
                                            <div v-if="!manage && index == 0" lay-showpercent="true" lay-filter="sign-bar" class="layui-progress layui-progress-big" style="margin: 0 20px">
                                                <div lay-percent="0%" class="layui-progress-bar" :style="{'background-color': 'rgb(39, 194, 76)', width: voteRateInfo[item.id] + '%'}">
                                                    <span class="layui-progress-text">{{ voteRateInfo[item.id] }}%</span>
                                                </div>
                                            </div>
                                        </li>
                                        </template>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br class="clear">
                    <div v-if="!manage && userCanVote" class="wrapper wrapper-content">
                        <div class="row row-background">
                            <div class="top-btn-group">
                                <button  v-if="!isEnd && !voteSubmit && curVoteSubjects && curVoteSubjects.length > 0" @click="emptyVote" type="button" class="btn btn-info agree-btn" style="background: #d5493a;border-color:#d5493a;margin-right: 10px;"><i class="fa fa-eraser"></i> 一键清空</button>
                                <button  v-if="!isEnd && !voteSubmit && curVoteSubjects && curVoteSubjects.length > 0" @click="allVoteAgree" type="button" class="btn btn-info agree-btn"><i class="fa fa-pencil"></i> 全选同意</button>
                            </div>
                            <div class="agile-detail" style="padding: 0 20px;">
                                <table v-if="refresh" class="subject-child-table">
                                    <tbody>
                                        <tr>
                                            <th style="min-width: 45px;">序号</th> 
                                            <th>议题名称</th> 
                                            <th v-if="hasRatingItem" colspan="2" style="min-width: 315px;"><!-- 项目立项可行性研究 -->评分项</th> 
                                            <th style="min-width: 160px;">表决意见</th> 
                                            <th v-if='hasConditionallyAgreed'>表决说明</th>
                                        </tr>
                                        <template v-for="(subject, index) in (voting ? curVoteSubjects : votedSubjects)">
                                            <tr 
                                                :key="subject.id"
                                                :class="{'odd': index % 2 != 0}">
                                                <td :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1">{{ index + 1 }}</td>
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
                                                        :useAnim="false"
                                                        @checkedAfter="voteOpinionChange">
                                                        <template  slot-scope="props">
                                                            <svg class="icon" aria-hidden="true">
                                                                <use :xlink:href="getOptionAfterIcon(props.val)"></use>
                                                            </svg>
                                                        </template>
                                                    </layui-radio-group>
                                                </td>
                                                <td v-if="subject.voteOptions.split(',').indexOf(2) != -1 || true" :rowspan="subject.ratingItem ? subject.ratingItem.split(',').length : 1" style="min-width: 160px;">
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
                                <button 
                                    v-if="!isEnd && voting && !voteSubmit && curVoteSubjects && curVoteSubjects.length > 0" 
                                    @click="voteResultSubmit()"
                                    class="layui-btn layui-btn-danger" 
                                    style="margin-bottom: 12px;background: #ea4c4c;padding: 0 35px;">
                                    提交
                                </button>
                            </div>
                        </div>
                    </div>
                    <br class="clear">
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import {getTabIndex, getMeeting, getMembers, getManage, getCurTabStatus, getSubjectSelectedIndex, getUserMap, getOfficeNameMap, getDicts} from '@/utils/meetingUtils'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
// import StarRate from 'vue-cute-rate'
import StarRate from '@/components/StarBtn'
import LayuiRadioGroup from '@/components/LayuiRadioGroup'
import meetingTabMixin from '@/mixin/meetingTabMixin'
import SignatureModal from './SignatureModal'
import { verifyVoteResultByTotalScore } from '@/utils/meetingUtils'


export default {
    mixins: [meetingTabMixin],
    components: {
        StarRate,
        LayuiRadioGroup
    },
    data () {
        return {
            rolHeight: 100340,
            selectAll: false,
            value: 3,
            memberVotes: [],
            // memberVotes: [{
            //     subjectId: '',
            //     scoreResultJson: '',
            //     voteOpinionDict: '',
            //     remark: ''
            // }],
            refresh: true,
            voteSubmit: false,
            cannotChangeSubjectIds: [],
            voting: false,
            voteUserLiHeight: 72,
            selectAll: false,
            subjectNameWidth: 0,
        }
    },
    computed: {
        ...mapGetters({
            curVoteSubjects: 'meeting/curVoteSubjects',
            votedSubjects: 'meeting/votedSubjects',
            votingCandidates: 'meeting/votingCandidates',
            // voting: 'meeting/voting'
        }),
        hasRatingItem: function(){
            var subjects = this.voting ? this.curVoteSubjects : this.votedSubjects;
            return subjects.filter(sub => {
                return sub.ratingItem && sub.ratingItem != "" && sub.ratingItem.trim().split(',').length > 0;
            }).length > 0;
        },
        hasConditionallyAgreed: function(){
            return true;
            // return this.curVoteSubjects.filter(sub => {
            //     return sub.voteOptions && sub.voteOptions.trim().split(',').indexOf('2') != -1;
            // }).length > 0;
        },
        voteRateInfo: function(){
            return this.$store.state.meeting.voteInfo.voteRateInfo || {};
        },
        memberSubjectVotes: function() {
            return this.$store.state.meeting.memberSubjectVotes || [];
        },
        subjectsVoteDetail: function() {
            return this.$store.state.meeting.voteInfo.subjectsVoteDetail || {};
        },
        votingRounds: function() {
            var votingRounds = [];
            this.canVoteSubjects.forEach(subject => {
                var votingRound = subject.votingRound;
                if (votingRound && votingRounds.indexOf(votingRound) == -1) {
                    votingRounds.push(votingRound);
                }
            });
            return votingRounds.sort((val1, val2) => {
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            });
        },
        votingMembers() {
            return this.votingCandidates.filter(item => item.memberVoteFlag == 'y');
        }
    },
    watch: {
        'curVoteSubjects': function(){
            this.updateMemberVotes();
            if(this.curVoteSubjects.length > 0){
                this.voteSubmit = false;
            }
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
        },
        memberSubjectVotes: {
            handler() {
                this.updateMemberVotes();
                this.refresh = false;
                this.$nextTick(function(){
                    this.refresh = true;
                });
            },
            deep: true
        },
        votedSubjects() {
            this.updateMemberVotes();
            this.refresh = false;
            this.$nextTick(function(){
                this.refresh = true;
            });
        },
        subjectVoteRefresh() {
            if (!this.manage) {
                console.log(this.myVoteDetailMap);
                var voting = false;
                this.voteSubjectIds.forEach(subId => {
                    if (!this.myVoteDetailMap[subId]) {
                        voting = true;
                        return;
                    }
                });
                this.voting = voting;
            }
        },
        voteSubjectIds() {
            if (!this.manage) {
                console.log(this.myVoteDetailMap);
                var voting = false;
                this.voteSubjectIds.forEach(subId => {
                    if (!this.myVoteDetailMap[subId]) {
                        voting = true;
                        return;
                    }
                });
                this.voting = voting;
            }
        },
        voteSubmit() {
            this.$nextTick(() => {
                if(this.$refs.voteUserBox){
                    this.voteUserLiHeight = this.$refs.voteUserBox.offsetHeight - 16 + 72;
                }
            });
        },
        votingCandidates: function (param) { 
            this.selectAll = this.votingCandidates.filter(member => member.memberVoteFlag == 'y').length == this.votingCandidates.length;
        }
    },
    mounted () {
        console.log("会议开始tab-" + this.meetingId);

        if(this.$refs.meetingContent && this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
            this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000)
        }

        if(this.$refs.voteUserBox){
            this.voteUserLiHeight = this.$refs.voteUserBox.offsetHeight - 16 + 72;
        }

        if (this.$refs.subjectUl) {
            this.subjectNameWidth = this.$refs.subjectUl.offsetWidth - 60 - 104;
        }

        if(!this.manage){
            this.updateMemberVotes();
        }

        if(this.voteStep == 4 && (this.curTabStatus != 3)){// || this.curTabStatus != 4
            this.$store.commit('meeting/UPDATE_TAB_STATUS', {
                index: this.inSelectSubjects.length + 3,
                status: 4
            });
        }

        var voting = false;
        this.voteSubjectIds.forEach(subId => {
            if (!this.myVoteDetailMap[subId]) {
                voting = true;
                return;
            }
        });
        this.voting = voting;

        this.selectAll = this.votingCandidates.filter(member => member.memberVoteFlag == 'y').length == this.votingCandidates.length;
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
            startVoting: 'meeting/VOTE',
            endVoting: 'meeting/VOTE',
            memberReview: 'meeting/MEMBER_REVIEW',
        }),
        ...mapMutations({
            voteMemberSelect: 'meeting/UPDATE_MEMBER_VOTE_FLAG',
        }),
        votingRoundChecked: function (votingRound) {
            var subjectIds = this.votedSubjects.filter(sub => {
                    return sub.votingRound == votingRound;
                }).map(sub => sub.id);
            var checked = false;
            subjectIds.forEach(subjectId => {
                if (this.votedSubjects.indexOf(subjectId, 'id') == -1) {
                    checked = false;
                    return;
                } else {
                    checked = true;
                }
            });
            return checked;
        },
        votingRoundCheckboxClass: function (votingRound) {
            var vclass = 'layui-unselect layui-form-checkbox ';
           
            return this.votingRoundChecked(votingRound) ? (vclass + 'layui-form-checked') : vclass;
        },
        selectCurVoteSubjects: function (subjectIds, votingRound) {
            if (votingRound) {
                var voteSubIds = this.canVoteSubjects.filter(sub => {
                    return sub.votingRound == votingRound;
                }).map(sub => sub.id);
                subjectIds = this.votedSubjects.map(sub => sub.id);
                if (this.votingRoundChecked(votingRound)) {
                    voteSubIds.forEach(subId => {
                        subjectIds.remove(subId);
                    });
                } else {
                    voteSubIds.forEach(subId => {
                        if (subjectIds.indexOf(subId) == -1) {
                            subjectIds.push(subId);
                        }
                    });
                } 
            }
            this.$store.commit('meeting/UPDATE_VOTE_SUBJECTIDS', subjectIds);
        },
        subjectVotingRoundClass: function (votingRound) {
            return 'voting-round voting-round-' + votingRound;
        },
        voteMemberSelectAll: function () {
            if (this.selectAll) {
                this.votingCandidates.forEach(member => {
                    this.voteMemberSelect(member.principal ? member.principal : member.userId);
                });
            } else {
                this.votingCandidates.forEach(member => {
                    if (member.memberVoteFlag != 'y') {
                        this.voteMemberSelect(member.principal ? member.principal : member.userId);
                    }
                });
            }
        },
        updateMemberVotes: function(){
            var memberVotes = [];
            var subjects = this.voting ? this.curVoteSubjects : this.votedSubjects;
            subjects.forEach(element => {
                var index = this.memberSubjectVotes.indexOf(element.id, 'subjectId');
                if(index != -1 && !(this.isEnd && this.myVoteDetailMap[element.id])) {
                    memberVotes.push(JSON.parse(JSON.stringify(this.memberSubjectVotes[index])));
                } else {
                    memberVotes.push({
                        subjectId: element.id,
                        scoreResultJson: (this.isEnd && this.myVoteDetailMap[element.id] && this.myVoteDetailMap[element.id].scoreResultJson) ? JSON.parse(this.myVoteDetailMap[element.id].scoreResultJson) : defaultScoreResult(element),
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
        voteResultSubmit: function(signature) {
            if (!signature) {
                var err = verifyVoteResultByTotalScore(this.memberVotes);
                if (err) {
                    var index = this.meetingSubjects.indexOf(err.subjectId, 'id');
                    msg('第' + (err.index + 1) + '个议题【' + this.meetingSubjects[index].subjectName + '】 ' + err.errMsg);
                    return;
                }
                this.$layer.iframe({
                    content: {
                        content: SignatureModal, //传递的组件对象
                        parent: this,//当前的vue对象
                        data:{
    
                        }//props
                    },
                    area: ['500px', '400px'],
                    title: "电子签名"
                });
                return;
            }
            loading();
            this.$store.dispatch('meeting/VOTE_RESULT_SUBMIT', {
                memberVotes: this.memberVotes,
                signature: signature
            }).then(() => {
                var count = 0;
                for (const key in this.myVoteDetailMap) {
                    if (this.myVoteDetailMap.hasOwnProperty(key)) {
                        //const element = this.myVoteDetailMap[key];
                        if(this.curVoteSubjects.indexOf(key, 'id') != -1) {
                            count++;
                        }
                    }
                }
                this.voteSubmit = (this.curVoteSubjects.length != 0 && count == this.curVoteSubjects.length) ? true : false;
                if(this.voteSubmit){
                    this.refresh = false;
                    this.$nextTick(function(){
                        this.refresh = true;
                    });
                }
                closeLoading();
                this.$layer.closeAll();
            }).catch(() => {
                if(!this.show){
                    alert("获取会议失败");
                }
                closeLoading();
                this.$layer.closeAll();
            })
        },
        checked: function(member) {
            if (!member.principal) {
                return member.memberVoteFlag == 'y';
            } else {
                var members = this.members;
                var index = members.indexOf(member.principal, 'userId');
                if (index != -1) {
                    var principal = members[index];
                    return principal.memberVoteFlag == 'y';
                }
            }
        },
	    checkUserVoted: function(member) {
            if (this.voteSubjectIds && this.voteSubjectIds.length > 0) {
                var detail = this.subjectsVoteDetail[this.voteSubjectIds[0]];
                if (!detail) {
                    return false;
                }
                for(var i = 1; i <= 8; i++) {
                    var votedMemberIds = detail['member_' + i] || [];
                    if (votedMemberIds.indexOf(member.userId) != -1) {
                        return true;
                    }
                }
            }
            return false;
        },
        getOptionAfterIcon: function (val) {
            if (val == 1) {
                return "#icon--smile";
            }

            if (val == 2) {
                return "#icon--smiling-";
            }

            if (val == 3) {
                return "#icon--sad-";
            }

            if (val == 4) {
                return "#icon--expressionless";
            }

            if (val == 5) {
                return "#icon-biaoqing";
            }
            return "";
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
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
        /* padding-right: 20px; */
        margin-right: 20px;
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
    .voted {
        color: #048dad;
        font-weight: bold;
    }
    .subject-title {
        height:52px;
        line-height:52px;
        word-wrap: break-word;
        word-break: break-all;
        width: 80%;
        vertical-align: top;
        display: inline-block;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    svg.icon {
        margin-left: 6px;
        /* margin-right: 6px; */
    }
    .voting-round {
        font-size: 10px; 
        padding: 2px 4px;
        background: red;
        color: #fff
    }
    .voting-round-2 {
        background: #048dad;
    }
    .voting-round-3 {
        background: #16c2c2
    }
</style>
