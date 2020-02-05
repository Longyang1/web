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
                                    <button 
                                        @click="tabSwitch({index: comIndex, templateField: 'attendanceContent'})" 
                                        :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': curTabStatus != noStartStatus, 'btn-disabled': isEnd}">
                                        <i class="fa fa-circle-o" aria-hidden="true"></i>会议开始</button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span>点击会议开始按钮后参会人员阅读{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                    <button v-if="manage" @click="next(comIndex)" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': manage, 'col-lg-9 col-md-9': !manage}" style="height:100340px">
                                <div style="float: right; margin-bottom: 4px;padding-right: 20px;padding-top: 5px">
                                    <button @click="exportAttendanceContent" type="button" class="btn btn-info vote-pdf"><i aria-hidden="true" class="fa fa-file-word-o"></i> 导出</button> 
                                </div>
                                <div class="top row" ref="meetingContent">
                                    <span v-if="!meetingSessions[comIndex].title" style="font-weight: bold;">{{ meeting.meetingName + '出席说明' }}</span>
                                    <span v-if="meetingSessions[comIndex].title" style="font-weight: bold;">{{ meetingSessions[comIndex].title | replaceMeetingName(meeting) }}</span>
                                    <div class="meeting-content" v-html="meeting.attendanceContent"></div>
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
import { exportAttendanceContent, exportFile } from '@/api/meeting/meeting'
import { downloadFile } from '@/api/file'
import Base from '@/views/base/Base'

export default {
    extends: Base,
    mixins: [meetingTabMixin],
    data () {
        return {
            rolHeight: 100340,
        }
    },
    computed: {
        
    },
    mounted () {
        console.log("出席会议tab-" + this.meetingId);
        if(this.rolHeight < (this.$refs.meetingContent.offsetHeight + 100000)){
            this.rolHeight = (this.$refs.meetingContent.offsetHeight + 100000)
        }
    },
    methods: {
        ...mapActions({
            tabSwitch: 'meeting/TAB_SWITCH',
            next: 'meeting/NEXT',
        }),
        exportAttendanceContent: function() {
            exportFile(this.meetingId).then(res => {
                this.download(res);
                alert("文件导出成功");
            });
            return;
            //加载层-风格4
            var layId = layer.msg('文件生成中', {
                icon: 16,
                shade: 0.01
            });
            exportAttendanceContent(this.meetingId).then(response => {
                layer.close(layId);
                layId = layer.msg('文件导出中', {
                    icon: 16,
                    shade: 0.01
                });
                setTimeout(() => {
                    downloadFile({
                        path: response.data,
                        fileName: "出席说明"
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