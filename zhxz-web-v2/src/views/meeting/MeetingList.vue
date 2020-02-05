<template>
    <div class="tab-background">
        <div class="tab-header">
			<p>会议列表</p>
		</div>
        <pagination
            :url="'./meeting/meetingInfos'"
            :titles="titles"
            :paramNames="paramNames"
            :dicts="dicts"
            :otherParam="otherParam"
            @handleSearchResult="handleSearchResult"
            ref="searchBox">
            <template slot="dict0">
                <layui-date
                    v-model="otherParam.startTime"
                    name="startTime"
                    style="display:inline-block;padding-left: 6px;"></layui-date>
                 至
                <layui-date
                    v-model="otherParam.endTime"
                    name="endTime"
                    style="display:inline-block;padding-left: 8px;"></layui-date>
            </template>
            <template slot="searchBtnBefore">
                <span class="title title-text">会议名称：</span>
                <input type="text" v-model="otherParam.meetingName" placeholder="输入会议关键字">
            </template>
            <template slot="main">
                <div class="search-result-box">
                    <div
                        v-for="(meeting) in meetings"
                        class="item"
                        :key="meeting.id">
                        <img @click="attendingMeeting(meeting)" :src="'/api/file/pub/' + meeting.meetingPic" width="255" height="196" style="cursor: pointer">
                        <div class="right">
                            <div class="">
                                <span :title="meeting.meetingName" class="meeting-name">
                                    <span @click="attendingMeeting(meeting)" style="cursor: pointer;">{{meeting.meetingName}}</span>
                                    <sup :class="'joinIsNoMeeting status_' + meeting.meetingStatusDict" style="font-size: 10px; padding: 2px 4px;">{{ meetingStatusMap[meeting.meetingStatusDict]}}</sup>
                                </span>
                                <div class="meeting-btn-group">
                                    <span
                                        v-if="userNoteMap[meeting.id]"
                                        @click="showMeetingNote(userNoteMap[meeting.id], meeting.id)"
                                        style="background: #37add1;cursor: pointer">
                                        笔记
                                    </span>
                                    <span v-if="false && meeting.meetingTypeDict != 1" @click="supervision(meeting)" style="background: rgb(39, 185, 61);cursor: pointer">督办</span>
                                    <span v-if="false" @click="summary(meeting)" style="background: rgb(215, 142, 56);cursor: pointer">纪要</span>
                                </div>
                            </div>
                            <div v-if="refresh" class="subject-index">
                                <span class="title">议题</span>
                                <template v-for="(sub,index) in meetingInfoSubjects[meeting.id]">
                                    <span
                                        v-if="index % range == 0 && startIndexs[meeting.id] == (index + 1)"
                                        @click="showIndexRangeMeetingSubjects(meeting.id, index + 1)"
                                        class="active"
                                        :key="sub.id + index + 'active'">
                                        {{ index + 1 }}-{{ !((index + range) > meetingInfoSubjects[meeting.id].length) ? (index + range) : meetingInfoSubjects[meeting.id].length }}
                                    </span>
                                    <span
                                        v-if="index % range == 0 && startIndexs[meeting.id] != (index + 1)"
                                        @click="showIndexRangeMeetingSubjects(meeting.id, index + 1)"
                                        :key="sub.id + index + ''">
                                        {{ index + 1 }}-{{ !((index + range) > meetingInfoSubjects[meeting.id].length) ? (index + range) : meetingInfoSubjects[meeting.id].length }}
                                    </span>
                                </template>
                            </div>
                            <div class="subject-list" style="min-height: 88px;">
                                <template v-for="(sub,index) in meetingInfoSubjects[meeting.id]">
                                    <p
                                        v-if="(index + 1) >= startIndexs[meeting.id] && (index + 1) < (startIndexs[meeting.id] + range)"
                                        :key="'sub' + sub.id">
                                        <span>{{ index + 1 }}.</span>
                                        <span>{{ sub.subjectName }}</span>
                                    </p>
                                </template>
                            </div>
                            <div class="meeting-time-room">
                                <span class="title">时间:</span>
                                <span>{{meeting.meetingTime | moment('YYYY-MM-DD')}}</span>
                                <span>{{meeting.meetingStartTime | moment('HH:mm')}}-{{meeting.meetingEndTime | moment('HH:mm')}}</span>
                                <img src="/img/meeting/border.png" class="meetingTimeBorderImg">
                                <span class="title">地址:</span>
                                <span>{{meeting.meetingRoom}}</span>
                                <button  @click="attendingMeeting(meeting)" :class="{'layui-btn layui-btn-sm layui-btn-blue': true, 'layui-btn-red': meeting.testFlag == 'y'}" style="float: right;">{{ meeting | btnTxt(userId) }}</button>
                            </div>
                        </div>
                        <br class="clear">
                    </div>

                </div>
            </template>
        </pagination>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { getNewMeetingStatus, getSignInMeeting } from '@/api/meeting/meeting';
import { getMeetingSubjects } from '@/api/meeting/meetingInfo'
import { getLoginStatus } from '@/api/login';
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import MeetingSummaryPreview from "@/views/meeting/MeetingSummaryPreview.vue";
import MeetingSupervisionPreview from "@/views/meeting/MeetingSupervisionPreview.vue";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Base from "@/views/base/Base"
import { getToken } from '@/utils/auth';

export default {
    name: 'MeetingList',
	extends: Base,
    components: {

    },
    filters: {
        btnTxt:  function (value, userId) {
            if (value) {
                var meeting = value;
                if (meeting.testFlag == 'y') {
                    return "测试会议";
                }
                if (meeting.meetingStatusDict == 1 && meeting.createBy == userId) {
                    return '开启会议';
                }
                if (meeting.meetingStatusDict == 1 && meeting.createBy != userId) {
                    return '查看议题信息';
                }
                if (meeting.meetingStatusDict == 2) {
                    return '参加会议';
                }
                if (meeting.meetingStatusDict == 3) {
                    return '查看会议信息';
                }
            }
            return '';
        }
    },
    data () {
        return {
            titles: ['会议时间', '会议状态', '会议类型'],
            dicts: [],
            paramNames: ['timeType', 'meetingStatusDict', 'meetingTypeDict'],
            otherParam: {
                'startTime': '',
                'endTime': '',
                'meetingName': '',
                'ignoreStatus': '4'
            },
            meetingTimes: [{"label":"全部", value:"", selected: 1},{"label":"本周", value:"1"},{"label":"本月", value:"2"},{"label":"下月", value:"3"}],
            meetingStatus: [{"label":"全部", value:"", selected: 1}],
            meetingTypes: [{"label":"全部", value:"", selected: 1}],
            meetings: [],
            page: {},
            meetingInfoSubjects: {},
            moderatorUserMap: {},
            userNoteMap: {},
            userId:"",
            inputPageNo:"",
            curNoteMeetingId: "",
            startIndexs: {},
            range: 4,
            refresh: true,
            updateMeetingStatusTimer: null,
            autoToSignPageTimer: null,
            stompClient: null,
            connectCount: 0
        }
    },
    props: [],
    computed: {
        meetingStatusMap: function(){
            return this.dicts[1] ? this.dicts[1].array2Obj("value", 'label') : [];
        },
        meetingTypeMap: function() {
            return this.meetingTypes.array2Obj("value", 'label');
        },
        activeMenuIds: function(){
            return this.$store.state.home.activeMenuIds;
        },
        meetingIds: function(){
    		var meetingIds = [];
    		if(this.meetings){
    			for(var i = 0; i < this.meetings.length; i++){
    				if(this.meetings[i].meetingStatusDict != 4) {
                        meetingIds.push(this.meetings[i].id);
                    }
    			}
    		}
    		return meetingIds;
    	}
    },
    mounted () {
        var _this = this;
        this.initData();
        this.$nextTick(() => {
            function isPC() {
                var userAgentInfo = navigator.userAgent;
                var Agents = ["Android", "iPhone",
                            "SymbianOS", "Windows Phone",
                            "iPad", "iPod"];
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            }
            if (!isPC()) {
                if($(".layout-button-right").length <= 0 && $(".layout-button-left").length <= 0){
                    $.parser.parse($("body"));
                }
                setTimeout(() => {
                    $(".layout-button-left").trigger('click');
                }, 1500);
            }
        });

        this.updateMeetingStatus();

        this.wsMsgSubscribe();
    },
    methods: {
        wsMsgSubscribe: function() {
            var _this = this;
            var token = getToken();
            var socket = new SockJS(process.env.VUE_APP_WS_HOST + '/endpointWisely?authToken=' + token); // 链接SockJS 的endpoint 名称为"/endpointWisely"
            var stompClient = Stomp.over(socket);
            _this.stompClient = stompClient;
            stompClient.connect({"username" : "admin","password" : "admin"}, function(frame) {// 链接Web
                _this.connectCount = 0;
                stompClient.subscribe('/user/queue/signed', function(response) { // 订阅/topic/getResponse
                    var res = JSON.parse(response.body);
                    if(res.data.signType == 'start_sign'){
                        // _this.attendingMeeting(res.data);
                        _this.$router.push({
                            name: 'Meeting',
                            params: {
                                meetingId: res.data.meetingId
                            }
                        });
                    }
                });
            },  function(error){
                console.log('连接失败【' + error + '】');
                if (_this.connectCount++ < 10) {
                    setTimeout(() => {
                        _this.wsMsgSubscribe();
                    }, 200);
                }
            });
        },
        initData: function(){
            getDicts('meeting_type_dict,meeting_status_dict').then(result => {
                var mt = result;
                if(mt.status == 200){
        			//this.meetingTypes.concat(mt.data.data);
                    var data = mt.data;
                    var _dicts = [];
                    _dicts.push(this.meetingTimes);
        			var mts = data[0];
        			mts.unshift(this.meetingTypes[0]);
        			this.meetingTypes = mts;
        			var mtStatus = data[1];
        			mtStatus.splice(mtStatus.length - 1, 1);
        			mtStatus.unshift(this.meetingStatus[0]);
                    this.meetingStatus = mtStatus;
                    _dicts.push(this.meetingStatus);
                    _dicts.push(this.meetingTypes);
                    this.dicts = _dicts;
                }
                this.dicts.forEach(element => {
                    element.forEach((item, index) => {
                        item.selected = index == 0 ? 1 : 0;
                    });
                });
            });
        },
        attendingMeeting: function(meeting){
            if (meeting.testFlag == 'y') {
                alert("本次会议为测试会，会议中产生的相关数据可能被丢弃，如果正式开会，请" + (meeting.createBy == this.curUser.userId ? '' : '提醒会议管理员') + "将会议【会议测试标志置为否】");
                setTimeout(() => {
                    var meetingId = meeting.id;
                    this.$router.push({
                        name: 'Meeting',
                        params: {
                            meetingId
                        }
                    });
                }, 3000);
            } else {
                var meetingId = meeting.id;
                this.$router.push({
                    name: 'Meeting',
                    params: {
                        meetingId
                    }
                });
            }
        },
        showIndexRangeMeetingSubjects: function(meetingId, index){
        	var obj = {};
        	obj[meetingId] = index;
        	this.startIndexs = Object.assign({}, this.startIndexs, obj);
        },
        // gotoPage: function(pageNo){
        //     this.$refs.searchBox.$emit('search', pageNo);
        // },
        handleSearchResult: function(data){

            //this.meetingInfoSubjects = data.meetingInfoSubjects || [];
            this.moderatorUserMap = data.moderatorUserMap ? data.moderatorUserMap : {};
            this.page = data.page || {};
            this.userId = data.userId;
            if(this.page.list){
                for(var i = 0; i < this.page.list.length; i++){
                    this.startIndexs[this.page.list[i].id] = 1;
                }
            }
            this.meetings = this.page.list || [];
            this.meetings.forEach(meeting => {
                getMeetingSubjects(meeting.id).then(res => {
                    // Object.assign()
                    this.meetingInfoSubjects[meeting.id] = res.data ? (res.data.meetingSubjects || []) : [];
                    this.refreshed();
                });
            });

        },
        summary: function(meeting){
            if(this.userId == meeting.createBy){
                this.$store.commit('meeting/UPDATE_SHOW', {
                    show: 0
                });
                this.$router.push({
                    name: 'MeetingSummary',
                    params: {
                        meetingId: meeting.id,
                        meetingType: this.meetingTypeMap[meeting.meetingTypeDict]
                    }
                });
            } else {
                this.$layer.iframe({
                    content: {
                        content: MeetingSummaryPreview, //传递的组件对象
                        parent: this,//当前的vue对象
                        data:{
                            mId: meeting.id,
                        }//props
                    },
                    area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                    title:"会议纪要"
                });
            }
        },
        supervision: function(meeting){
            if(this.userId == meeting.createBy){
                this.$store.commit('meeting/UPDATE_SHOW', {
                    show: 0
                });
                this.$router.push({
                    name: 'MeetingSupervision',
                    params: {
                        meetingId: meeting.id,
                        meetingType: this.meetingTypeMap[meeting.meetingTypeDict]
                    }
                });
            } else {
                this.$layer.iframe({
                    content: {
                        content: MeetingSupervisionPreview, //传递的组件对象
                        parent: this,//当前的vue对象
                        data:{
                            mId: meeting.id,
                        }//props
                    },
                    area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                    title:"会议纪要"
                });
            }
        },
        updateMeetingStatus: function() {
            // this.updateMeetingStatusTimer = setInterval(() => {
            //     if(!this.meetingIds || this.meetingIds.length <= 0) {
            //         clearInterval(this.updateMeetingStatusTimer);
            //         this.updateMeetingStatusTimer = null;
            //         return;
            //     }
            //     getNewMeetingStatus(this.meetingIds).then(result => {
            //         var newStatusData = result.data;
            //         if (newStatusData) {
            //             this.meetings.forEach(ele => {
            //                 if(newStatusData[ele.id]){
            //                     ele.meetingStatusDict = newStatusData[ele.id];
            //                 }
            //             });
            //             this.$set(this.meetings, 0, this.meetings[0]);
            //         }
            //     }).catch(error => {
            //         console.log(error);
            //         clearInterval(this.updateMeetingStatusTimer);
            //         this.updateMeetingStatusTimer = null;
            //     });
            // }, 1000 * 5);
        },
        autoToSignPage: function() {
            setInterval(() => {
                getSignInMeeting().then(result => {
                    if(result.data){
                        clearInterval(this.autoToSignPageTimer);
                        this.autoToSignPageTimer = null;
                        this.attendingMeeting(result.data);
                    }
                });
            }, 1000 * 2);
        }
    },
    destroyed() {
        if(this.stompClient){
            this.stompClient.disconnect(function () {
                console.log("断开链接");
            });
        }
    }
}
</script>

<style scoped>
    .tab-background /deep/ .search-box {
        padding: 0 40px;
    }
    .item {
        width: 935px;
        transition: all .3s linear;
        box-sizing: border-box;
        padding: 20px;
        overflow: hidden;
        padding-left: 0;
    }
    .item img {
        margin-right: 20px;
        float: left;
    }
    .item .right {
        float: left;
        width: 620px;
        /* padding: 0.06rem 0; */
    }
    .item .right div:first-child {
        border-bottom: 1px solid #bdc7c7;
        position: relative;
    }
    .item span, .item p {
        font-size: 14px;
    }
    .item .meeting-name {
        width: 70%;
        font-size: 20px;
        color: #1c1414;
    }
    .item .meeting-name span {
        font-size: 20px;
    }
    .item .meeting-name span:first-child {
        word-break: break-all;
        /* width: 396px; */
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        /* max-width: 388px; */
        max-width: 512px;
    }
    .meeting-btn-group {
        display: inline-block;
        right: 0;
        position: absolute;
    }
    .meeting-btn-group span{
        font-size: 12px;
        float: left;
        height: 24px;
        line-height: 24px;
        border-radius: 12px;
        padding: 0 13px;
        margin-left: 8px;
        color: #fff;
    }
    sup {
        color: #fff;
        top: -1.5em;
        margin-left: 4px;
    }
    .status_1{
        background:#87a7e8;
    }
    .status_2{
        background:#21bb2f;
    }
    .status_3{
        background:#c7c8cd;
    }
    .subject-index {
        margin-top: 18px;
        margin-bottom: 5px;
        font-size: 12px;
    }
    .subject-index span {
        color: #956e0f;
        padding: 0px 8px;
        cursor: pointer;
    }
    .subject-index span:first-child{
        padding-right: 4px;
        color: #333333;
        padding-left: 0;
        cursor: none;
    }
    .subject-index span.active, .subject-index span:hover {
        color: #21bb2f;
    }
    .subject-list > p {
        margin: 0;
        display: block;
        height: 22px;
        line-height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
    }
    .meeting-time-room {
        margin-top: 12px;
        color: #956e0f;
        margin-top: 8px;
        color: #956e0f;
        height: 26px;
        line-height: 26px;
    }
    .meeting-time-room span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
    }
    .meeting-time-room img {
        float: none;
        margin: 0;
        padding-right: 8px;
        padding-left: 8px;
    }
    .meeting-time-room span:last-child {
        width: 80px;
        height: 28px;
        font-size: 12px;
        color: #f1f4fb;
        line-height: 28px;
        text-align: center;
        /* margin: 0.04rem 0; */
        cursor: pointer;
        float: right;
        margin-top: -5px;
    }
    .meeting-time-room span.attending-meeting {
        background: url('/img/meeting/joinMeeting.png');
        background-size: 100% 100%;
    }
    .meeting-time-room span.attending-meeting:hover {
        background: url('/img/meeting/joinMeetingMouse.png');
        background-size: 100% 100%;
    }
    .tab-background /deep/ .layui-laypage.layui-laypage-default {
        margin-right: 10px;
    }
    .tab-background /deep/ .search-condition-row > div > input {
        width: 90px !important;
        height: 26px;
        line-height: 26px;
        border: 1px solid #ced2d7;
    }
    .layui-btn-red {
        background: #ff5722;
    }
 </style>
