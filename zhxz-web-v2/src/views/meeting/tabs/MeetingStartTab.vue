<template>
    <div>
        <div class="tab-title">{{ meetingSessions[comIndex].name }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div class="row row-background">
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
                                    <button @click="tabSwitch({index: comIndex, templateField: 'meetingStartContent'})" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}"><i class="fa fa-circle-o" aria-hidden="true"></i>启动会议</button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span>在此点击启动会议</span>
                                    <button v-if="manage" @click="next(comIndex)" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': manage, 'col-lg-9 col-md-9': !manage}" :style="{height: rolHeight + 'px'}">
                                <div class="top row" ref="meetingContent">
                                    <!-- <span style="font-weight: bold;">{{ meetingSessions[comIndex].title ? meetingSessions[comIndex].title : '主持人宣布' }}</span> -->
                                    <span v-if="!meetingSessions[comIndex].title" style="font-weight: bold;">主持人宣布</span>
                                    <span v-if="meetingSessions[comIndex].title" style="font-weight: bold;">{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                    <div class="meeting-content" v-html="meeting.meetingStartContent"></div>
                                </div>
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
             rolHeight: 100340,
        }
    },
    computed: {

    },
    mounted () {
        console.log("会议开始tab-" + this.meetingId);

        if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
            this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000)
        }
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
        }),
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
