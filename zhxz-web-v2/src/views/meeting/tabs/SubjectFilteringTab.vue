<template>
    <div>
        <div class="tab-title"></div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div v-if="manage || (!manage && publishFilteringVoteFlag)" class="wrapper wrapper-content">
                        <div v-if="manage" class="row row-background" style="margin-bottom: 20px">
                            <div class="col-lg-3 col-md-3 visible-lg-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="" src="/img/meeting/m_box_1.png"/>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 visible-md-block left-border" :style="{height: rolHeight + 'px'}">
                                <div class="middle">
                                    <img class="visible-md-block" height="180" src="/img/meeting/m_box_1.png"/>
                                </div>
                            </div>
    
                            <div v-if="manage" class="col-lg-2 col-md-3 middle" :style="{height: rolHeight + 'px'}">
                                <div class="o-btn-group">
                                    <button @click="startVote" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}"><i class="fa fa-circle-o" aria-hidden="true"></i>启动预投票</button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span>在此点击启动预投票</span>
                                    <!-- <button v-if="manage" @click="next(inSelectSubjects.length + (comIndex - 1))" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button> -->
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': manage, 'col-lg-9 col-md-9': !manage, 'middle': true}" :style="{height: rolHeight + 'px'}">
                                <div class="top row" style="width: 90%;height: 161px;margin:auto;">
                                    <span style="font-weight: bold;">投票进度</span>
                                    <div>
                                        <div lay-showpercent="true" lay-filter="sign-bar" class="layui-progress layui-progress-big">
                                            <div lay-percent="0%" class="layui-progress-bar" :style="{'background-color': 'rgb(39, 194, 76)', width: filteringRate + '%'}">
                                                <span class="layui-progress-text" :style="{'padding': (filteringRate < 12 ? '0' : '0 10px')}">{{ filteringRate }}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="isSupervisorUser" class="row row-background left-border">
                            <div class="col-sm-12 explain-sign">
                                <span class="explain-sign-text-center explain-sign-text-title">监票说明</span>
                                <div v-html="meeting.preVoteCheckDesc" style="padding: 0 20px;text-align:left;"></div>
                            </div>
                        </div>

                        <div class="row row-background left-border vote-result" style="margin-top: 20px">
                            <div v-if="refresh" class="col-sm-12 explain-sign">
                                <fieldset class="layui-elem-field subject-title">
                                    <legend>
                                        <i class="fa fa-bar-chart text-warning"></i> 结果统计
                                        <div v-if="manage">
                                            <button @click="publishFilteringVoteResult(inSelectSubjects.length + (comIndex - 1))" class="btn btn-info vote-pdf" type="button"><i class="fa fa-file-pdf-o"></i> 公布结果</button>
                                        </div>
                                    </legend>
                                    <div class="layui-field-box">
                                        <div class="col-sm-12">
                                            <ul class="sortable-list connectList agile-list">
                                                <li class="success-element">
                                                    <span style="margin-left: 5px;">
                                                        <i class="fa fa-bar-chart text-success"></i> 
                                                        本次投票通过议题<em class="text-green-deep h4" style="font-weight: 500;">{{ passInfos[0] }}</em>个，
                                                        未通过议题<em class="text-roseo h4" style="font-weight: 500;">{{ passInfos[1] }}</em>个。
                                                    </span>
                                                    <div class="agile-detail">
                                                        <table class="subject-table subject-vote-result-table">
                                                            <template v-if="needFilteringSubjects">
                                                                <template v-for="subject in needFilteringSubjects">
                                                                    <tr 
                                                                        :key="'fvote_' + subject.id">
                                                                        <td style="min-width: 300px">{{ subject.subjectName}}</td>
                                                                        <td style="width:110px">
                                                                            {{ subjectFilteringVoteDetail[subject.id] ? ((subjectFilteringVoteDetail[subject.id].pass == 1) ? '通过' : '不通过') : "" }}
                                                                        </td>
                                                                        <td style="min-width:386px" colspan=2>
                                                                            <i class="fa fa-bar-chart text-success"></i> 
                                                                            <template>同意<em class="text-green-deep">{{ subjectFilteringVoteDetail[subject.id] ? subjectFilteringVoteDetail[subject.id][1] : '' }}</em>票，</template>
                                                                            <template>不同意<em class="text-roseo">{{ subjectFilteringVoteDetail[subject.id] ? subjectFilteringVoteDetail[subject.id][3] : '' }}</em>票，</template>
                                                                            <template>弃权<em class="text-yellow-deep">{{ subjectFilteringVoteDetail[subject.id] ? subjectFilteringVoteDetail[subject.id][4] : '' }}</em>票。</template>
                                                                        </td>
                                                                    </tr>
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
                    </div>
                    <div v-if="!manage && userCanVote" class="wrapper wrapper-content">
                        <div class="row row-background">
                            <div class="agile-detail" style="padding: 0 20px;">
                                <table v-if="refresh" class="subject-child-table">
                                    <tbody>
                                        <tr>
                                            <th style="min-width: 45px;">序号</th> 
                                            <th>议题名称</th> 
                                            <th style="min-width: 135px;">表决意见</th> 
                                        </tr>
                                        <template v-for="(subject, index) in needFilteringSubjects">
                                            <tr 
                                                v-if="filteringVotes && filteringVotes.length > 0"
                                                :key="subject.id"
                                                :class="{'odd': index % 2 != 0}">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ subject.subjectName }}</td>
                                                <td style="text-align: left;">
                                                    <layui-radio-group
                                                        v-if="refresh"
                                                        :textMap="voteOptionMap" 
                                                        :vals="[1, 3, 4]"
                                                        :name="subject.id"
                                                        :disabled="submit"
                                                        :val="filteringVotes[index].voteOpinion"
                                                        formRadioClass="form-radio"
                                                        v-model="filteringVotes[index].voteOpinion"
                                                        @checkedAfter="voteOpinionChange"/>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                                <button 
                                    v-if="!submit"
                                    @click="submitFilteringVoteResult"
                                    class="layui-btn layui-btn-danger" 
                                    style="margin-bottom: 12px;background: #ea4c4c;padding: 0 35px;">
                                    提交
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="publishFilteringVoteFlag && !isSupervisorUser" class="wrapper wrapper-content">
                        <div class="row row-background left-border">
                            <div class="col-sm-12 explain-sign">
                                <span class="explain-sign-text-center explain-sign-text-title">监票说明</span>
                                <div v-html="meeting.preVoteCheckDesc" style="padding: 0 20px;text-align:left;"></div>
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
import { getTabIndex, getMeeting, getManage, getCurTabStatus } from '@/utils/meetingUtils'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import { submitFilteringVoteResult, publishFilteringVoteResult } from '@/api/meeting/meeting'
import LayuiRadioGroup from '@/components/LayuiRadioGroup'
export default {
    components: {
        LayuiRadioGroup
    },
    data () {
        return {
            rolHeight: 100340,
            refresh: true,
            voteOptionMap: {
                1: '同意',
                3: '不同意',
                4: '弃权'
            },
            filteringVotes: [],
            subjectFilteringVoteDetail: {},
            passInfos: [0, 0],
            submit: false,
        }
    },
    props: ['meetingId', 'comIndex'],
    computed: {
        ...mapGetters({
            noStartStatus: 'meeting/noStartStatus',
            needFilteringSubjects: 'meeting/needFilteringSubjects',
            inSelectSubjects: 'meeting/inSelectSubjects',
            voteMembers: 'meeting/voteMembers',
            userCanVote: 'meeting/userCanVote'
        }),
        isEnd: function(){
            return this.$store.state.meeting.isEnd;
        },
        tabIndex: function(){
            return getTabIndex(this);
        },
        meeting: function(){
            return getMeeting(this);
        },
        manage: function(){
            return getManage(this);
        },
        curTabStatus: function(){
            return getCurTabStatus(this, this.inSelectSubjects.length + (this.comIndex - 1));
        },
        user() {
            return this.$store.state.meeting.user || {};
        },
        isSupervisorUser() {
            return this.meeting.supervisorUserId == this.user.userId;
        },
        filteringRate() {
             return this.$store.state.meeting.voteInfo.filterVoteRate || 0;
        },
        filteringVoteMap() {
            return this.$store.state.meeting.voteInfo.filteringVoteMap || {};
        },
        submitAfterUserFilteringVotes() {
            return this.$store.state.meeting.voteInfo.userFilterVotes || [];
        },
        publishFilteringVoteFlag() {
            return this.$store.state.meeting.voteInfo.publishFilteringVoteFlag || false;
        },
        voteStep: function(){
            return this.$store.state.meeting.voteInfo.voteStep || 1;
        },
    },
    watch: {
        needFilteringSubjects: {
            handler () {
                if (!this.manage) {
                    var votes = [];
                    this.needFilteringSubjects.forEach(element => {
                        votes.push({
                            subjectId: element.id,
                            voteOpinion: 1
                        });
                    });
                    this.filteringVotes = votes;
                }
            },
            deep: true
        },
        filteringVoteMap: {
            handler () {
                this.updateSubjectFilteringVoteDetail();
            },
            deep: true
        }
    },
    mounted () {
        console.log("预投票tab-" + this.meetingId);

        // if(this.manage && this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
        //     this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000)
        // }

        var votes = [];
        this.needFilteringSubjects.forEach(element => {
            votes.push({
                subjectId: element.id,
                voteOpinion: 1
            });
        });
        this.filteringVotes = votes;

        this.updateSubjectFilteringVoteDetail();

        Object.assign(this.filteringVotes, this.submitAfterUserFilteringVotes);

        if (this.submitAfterUserFilteringVotes.length > 0) {
            this.submit = true;
        }
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
        }),
        startVote: function() {
            if(this.voteStep <= 1) { 
                alert('先进入【投票】进行人员复核，才可启动预投票！！！');
            } else {
                this.tabSwitch({index: (this.inSelectSubjects.length + (this.comIndex - 1))});
                alert("成功开启预投票");
            }
        },
        voteOpinionChange: function () {

        },
        submitFilteringVoteResult: function () {
            submitFilteringVoteResult(this.meeting.id, this.filteringVotes).then(res => {
                alert("提交成功");
                this.submit = true;
            });
        },
        publishFilteringVoteResult: function (index) {
            var disabledSubjectIds = [];
            var subjectFilteringVoteDetail = this.subjectFilteringVoteDetail;
            for (var subjectId in subjectFilteringVoteDetail) {
                var detail = subjectFilteringVoteDetail[subjectId];
                if (detail.pass == 2) {
                    disabledSubjectIds.push(subjectId);
                }
            }
            publishFilteringVoteResult(this.meeting.id, this.filteringVoteMap, index, disabledSubjectIds).then(res => {
                alert("公布结果成功");
            });
        },
        updateSubjectFilteringVoteDetail: function () {
            var passInfos = [0, 0];
            var subjectFilteringVoteDetail = {};
            for (var userId in this.filteringVoteMap) {
                var userVotes = this.filteringVoteMap[userId];
                userVotes.forEach(voteInfo => {
                    var detail = subjectFilteringVoteDetail[voteInfo.subjectId];
                    if (!detail) {
                        subjectFilteringVoteDetail[voteInfo.subjectId] = {
                            1: 0,
                            3: 0,
                            4: 0
                        }
                        detail = subjectFilteringVoteDetail[voteInfo.subjectId];
                    }
                    detail[voteInfo.voteOpinion]++;
                    // if (voteInfo.voteOpinion == '1') {
                    //     detail.passVoteCount += 1;
                    // } else {
                    //     detail.notPassVoteCount += 1;
                    // }
                });
            }
            this.subjectFilteringVoteDetail = subjectFilteringVoteDetail;
            for (var subjectId in subjectFilteringVoteDetail) {
                var detail = subjectFilteringVoteDetail[subjectId];
                var minPassVoteNum = Math.ceil(this.voteMembers.length * 0.75);
                detail.pass = detail[1] >= minPassVoteNum ? 1 : 2;
                if (detail.pass == 1) {
                    passInfos[0]++;
                } else {
                    passInfos[1]++;
                }
            }
            this.passInfos = [];
            Object.assign(this.passInfos, passInfos);
            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
            });
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    legend {
        width: 100%;
    }
    legend > div {
        display: inline-block;
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
</style>
