<template>
    <div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div :class="{'wrapper wrapper-content': true}">
                        <div class="row row-background left-border vote-result">
                            <div class="col-sm-12 explain-sign">
                                <fieldset class="layui-elem-field" style="border: none;text-align: left;">
                                    <div class="top">
                                        <!-- <img style="padding-bottom: 12px;" src="/img/meeting/hx_logo.png" alt="" srcset=""> -->
                                        <span class="title">会议议程</span>
                                        <div>
                                            <img style="width: 70%;" src="/img/meeting/myc_line.png" alt="" srcset="">
                                        </div>
                                    </div>
                                    <div class="main-item">
                                        <div style="background: url(/img/meeting/bg_1.png) no-repeat;">
                                            <img src="/img/meeting/meeting.png" alt="" srcset="">
                                            <span>会议时间/地点</span>
                                        </div>
                                    </div>
                                    <div class="main-item" style="border: none;">
                                        <table class="meeting-table">
                                            <tr>
                                                <td style="text-align: center">时间</td>
                                                <td class="td_2">{{ meeting.meetingStartTime | moment('YYYY年MM月DD日 HH:mm') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: center">地点</td>
                                                <td class="td_2">{{ meeting.meetingRoom }}</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div class="main-item">
                                        <div style="background: url(/img/meeting/bg_2.png) no-repeat;">
                                            <img src="/img/meeting/subject.png" alt="" srcset="">
                                            <span>会议议题</span>
                                        </div>
                                    </div>
                                    <div class="main-item" style="border: none;">
                                        <table class="c_subject-table">
                                            <tr>
                                                <td style="width: 60px;">序号</td>
                                                <td>议题名称</td>
                                                <td style="width: 120px;">主办部门</td>
                                                <td style="width: 120px;">汇报人</td>
                                                <td style="width: 120px;">备注</td>
                                            </tr>
                                            <tr 
                                                v-for="(item, index) in inSelectSubjects" 
                                                :key="index">
                                                <td>{{ index + 1 }}</td>
                                                <td class="td_2"><span @click="tabClick(index + subTabIndex)" >{{ item.subjectName }}</span></td>
                                                <td><i v-if="officeNameMap[item.officeId]" class="iconfont icon-bumen" style="color: #0ab8ed"></i> {{ officeNameMap[item.officeId] }}</td>
                                                <td><i v-if="userMap[item.reportUserId]" class="iconfont icon-ren" style="color: #0ab8ed"></i> {{ userMap[item.reportUserId] }}</td>
                                                <td>{{ item.remark }}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import {getTabIndex, getMeeting, getMembers, getManage, getCurTabStatus, getSubjectSelectedIndex, getUserMap, getOfficeNameMap, getDicts} from '@/utils/meetingUtils'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import meetingTabMixin from '@/mixin/meetingTabMixin'

export default {
    mixins: [meetingTabMixin],
    data () {
        return {
            
        }
    },
    mounted () {
        console.log("会议开始议程tab-" + this.meetingId);
    },
    methods: {
        ...mapMutations({
            tabClick: "meeting/SET_TAB_INDEX"
        }),

    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .top {
        text-align: center;
    }
    .top .title {
        font-size: 40px;
        color: #222222;
        padding-left: 12px;
    }
    .main-item {
        border-bottom: 1px solid rgb(5, 175, 239);
        margin: 20px 30px;
    }
    .main-item p {
        display: inline-block;
        font-size: 16px;
        color: #fff;
        font-size: 16px;
        background: #05afef;
        color: #fff;
        padding-left: 6px;
        width: auto;
        margin: 0;
    }
    .main-item > div > span {
        font-size: 16px;
        color: #fff;
    }
    .main-item img {
        padding-left: 10px;
        padding-right: 2px;
    }
    table {
        margin-bottom: 30px;
        width: 100%;
    }
    table tr {
        height: 40px;
        color: #222222;
        font-size: 14px;
    }
    table tr td {
        border: 1px solid #e4e7f0;
        background: #fff;
    }
    table tr td:first-child {
        width: 80px;
    }
    table tr .td_2 {
        text-align: left;
        padding-left: 38px;
    }
    .meeting-table tr td:first-child {
        background: #f5f8fe;
    }
    .c_subject-table tr:first-child td {
        text-align: center;
        font-size: 14px;
        color: #333333;
        background: #f5f8fe;
    }
    table span {
        cursor: pointer;
        color: rgb(30, 159, 255);
    }
</style>
