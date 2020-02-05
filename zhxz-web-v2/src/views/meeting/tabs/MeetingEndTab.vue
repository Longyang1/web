<template>
    <div>
        <div class="tab-title">{{ meetingSessions[comIndex].name }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div class="row row-background left-border">
                            <div class="col-sm-12 explain-sign">
								<span v-if="!meetingSessions[comIndex].title" class="explain-sign-text-center explain-sign-text-title">{{ meeting.meetingName }}<br>会议圆满结束</span>
                                <span v-if="!meetingSessions[comIndex].title" class="explain-sign-text-center explain-sign-text-title">{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                <div v-html="meeting.meetingEndContent" style="padding: 0 20px;text-align:left;"></div>
                                <button v-if="manage" @click="endMeeting(inSelectSubjects.length + (comIndex - 1))" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}" style="margin-top: 10px;margin-bottom:10px"><i class="fa fa-circle-o" aria-hidden="true"></i>会议圆满结束</button>
                                <button v-if="!manage" @click="backHome" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != 1}" style="margin-top: 10px;margin-bottom:10px"><i class="fa fa-circle-o" aria-hidden="true"></i>退出会议</button>
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
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import meetingTabMixin from '@/mixin/meetingTabMixin'

export default {
    mixins: [meetingTabMixin],
    data () {
        return {
            
        }
    },
    computed: {
        
    },
    mounted () {
        console.log("会议结束tab-" + this.meetingId);
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
            endMeeting: 'meeting/END_MEETING'
        }),
        backHome: function() {
            this.$parent.backHome();
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
