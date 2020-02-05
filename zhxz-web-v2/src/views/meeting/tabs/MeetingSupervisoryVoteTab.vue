<template>
    <div>
        <div class="tab-title">{{ meetingSessions[comIndex].name }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div class="row row-background left-border">
                            <div style="float: right; margin-bottom: 4px;padding-right: 20px;padding-top: 5px">
                                <button @click="exportSupervisory" type="button" class="btn btn-info vote-pdf"><i aria-hidden="true" class="fa fa-file-word-o"></i> 导出</button> 
                            </div>
                            <div id="pdfDom" class="col-sm-12 explain-sign">
								<span v-if="!meetingSessions[comIndex].title" class="explain-sign-text-center explain-sign-text-title">{{ meeting.meetingName }}<br>监票说明</span>
                                <span v-if="meetingSessions[comIndex].title" class="explain-sign-text-center explain-sign-text-title">{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                <div v-if="!isEnd" v-html="meeting.batchVoteCheckDesc" style="padding: 0 20px;text-align:left;"></div>
                                <div v-if="isEnd" v-html="meeting.voteCheckDesc" style="padding: 0 20px;text-align:left;"></div>
                                <button v-if="manage" @click="tabSwitch({index: inSelectSubjects.length + (comIndex - 1), templateField: 'batchVoteCheckDesc'})" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}" style="margin-top: 10px;"><i class="fa fa-circle-o" aria-hidden="true"></i>公布监票结果</button>
                                <br>
                                <button v-if="manage" @click="next(inSelectSubjects.length + (comIndex - 1))" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}" style="margin-top: 10px;margin-bottom:10px">下一项</button>
				            </div>
                        </div>
                        <subject-voting-result v-if="!manage" :disableOneVote="true"></subject-voting-result>
                        <template v-for="(item, index) in voteChecks">
                            <div v-if="isEnd" class="row row-background left-border" :key="'v_d_' + index" style="margin-top: 20px">
                                <div style="float: right; margin-bottom: 4px;padding-right: 20px;padding-top: 5px">
                                    <button @click="exportSupervisory(index + 1)" type="button" class="btn btn-info vote-pdf"><i aria-hidden="true" class="fa fa-file-word-o"></i> 导出</button> 
                                </div>
                                <div id="pdfDom" class="col-sm-12 explain-sign">
                                    <span v-if="!meetingSessions[comIndex].title" class="explain-sign-text-center explain-sign-text-title">{{ meeting.meetingName }}<br>监票说明</span>
                                    <span v-if="meetingSessions[comIndex].title" class="explain-sign-text-center explain-sign-text-title">{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                    <div v-html="item.voteCheckDesc" style="padding: 0 20px;text-align:left;"></div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <br class="clear">
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import { getTabIndex, getMeeting, getManage, getCurTabStatus } from '@/utils/meetingUtils'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex'; 
import { exportSupervisory } from '@/api/meeting/meeting'
import { getMeetingVoteChecks } from '@/api/meeting/meetingInfo'
import { downloadFile } from '@/api/file'
import SubjectVotingResult from '@/views/meeting/tabs/SubjectVotingResult'
import meetingTabMixin from '@/mixin/meetingTabMixin'
import Base from '@/views/base/Base'

export default {
    mixins: [meetingTabMixin],
    components: {
        SubjectVotingResult
    },
    extends: Base,
    data () {
        return {
            voteChecks: []
        }
    },
    computed: {

    },
    mounted () {
        console.log("监票说明tab-" + this.meetingId);

        getMeetingVoteChecks(this.meetingId).then(res => {
            this.voteChecks = res.data || [];
        });
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
        }),
        exportSupervisory: function(index) {
            //加载层-风格4
            var layId = layer.msg('文件生成中', {
                icon: 16,
                shade: 0.01
            });
            exportSupervisory(this.meetingId, index).then(response => {
                layer.close(layId);
                layId = layer.msg('文件导出中', {
                    icon: 16,
                    shade: 0.01
                });
                setTimeout(() => {
                    downloadFile({
                        path: response.data,
                        fileName: "监票说明"
                    }).then(res => {
                        this.download(res);
                        layer.close(layId);
                        alert("文件导出成功");
                    });
                }, 2000);
            });
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
