<template>
    <div class="vote-result">
        <div class="tab-title">{{ meetingSessions[comIndex].name }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div v-if="manage" class="row row-background">
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
                                    <button 
                                        @click="publishVoteResult(inSelectSubjects.length + (comIndex - 1))" 
                                        :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}">
                                        <i class="fa fa-circle-o" aria-hidden="true"></i>
                                        审议结果
                                    </button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span>点击审议结果按钮后参与人员参与审议投票结果</span>
                                    <button v-if="manage" @click="next(inSelectSubjects.length + (comIndex - 1))" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': manage, 'col-lg-9 col-md-9': !manage}" style="height:100340px">
                                <div class="top row" ref="meetingContent">
                                    <!-- <span style="font-weight: bold;">{{ meetingSessions[comIndex].title ? meetingSessions[comIndex].title : '说明' }}</span> -->
                                    <span v-if="!meetingSessions[comIndex].title" style="font-weight: bold;">{{ '说明' }}</span>
                                    <span v-if="meetingSessions[comIndex].title" style="font-weight: bold;">{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                    <div class="meeting-content">审议投票结果：</div>
                                </div>
                            </div>
                        </div>
                        <subject-voting-result :enableReview="true"></subject-voting-result>
                    </div>
                    <br class="clear">
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import { getTabIndex, getMeeting, getManage, getCurTabStatus, getUserMap, getDicts } from '@/utils/meetingUtils'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import { getVoteResultPDFUrl, generateVoteResultPDF } from '@/api/meeting/meeting'
import { getAttaments, checkFileExist } from '@/api/file'
import meetingTabMixin from '@/mixin/meetingTabMixin'
import SubjectVotingResult from '@/views/meeting/tabs/SubjectVotingResultV2'

export default {
    mixins: [meetingTabMixin],
    components: {
        SubjectVotingResult
    },
    data () {
        return {
            rolHeight: 100340,
            subjectVoteRemarkInfos: [],
            refresh: true,
            allShowRemark: false,
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
    },
    watch: {
        'subjectVoteRemarkInfo': {
            handler () {
                var showCount = 0, notShowCount = 0;
                for (var subjectId in this.subjectVoteRemarkInfo) {
                    if (this.subjectVoteRemarkInfo[subjectId] == true) {
                        showCount++;
                    } else {
                        notShowCount++;
                    }
                }
                if (this.canVoteSubjects.length == showCount) {
                    this.allShowRemark = true;
                }
            },
            deep: true
        }
    },
    mounted () {
        console.log("出席会议tab-" + this.meetingId);
        // if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
        //     this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000)
        // }
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
            publishVoteResult: 'meeting/PUBLISH_VOTE_RESULT',
        }),
        
       
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
    .subject-child-table td {
        border: 1px solid wheat;
    }
    td.remark {
        /* border: 1px dashed; */
    }
</style>
