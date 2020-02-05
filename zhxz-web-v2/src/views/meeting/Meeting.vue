<template>
    <div style="height:100%;overflow-y: auto">
        <div v-show="show == 1" v-cloak class="meeting-container" :style="'min-height:' + (meetingContainerMinHeight) + 'px'">  
            <div v-show='show == 1' class="layui-row tabs-fixed nav-fixed-top">
                <MeetingTabs v-if="!destroyed" :meetingId='mId'></MeetingTabs>
            </div>
            <div v-show="show == 1" class="layui-row meeting-content tab-container">
                <div v-show="!destroyed" id="meeting" class="meeting">
                    <span class="meeting-title">{{ meeting.meetingName }}</span><br>
                    <span class="meeting-time">会议时间：{{meeting.meetingTime | moment('YYYY-MM-DD')}} {{meeting.meetingStartTime | moment('HH:mm')}}-{{meeting.meetingEndTime| moment('HH:mm')}}</span>
                </div>
                <div v-show="currentTabComponent" class="tab-item">
                    <transition name="component-fade" mode="out-in">
                        <keep-alive>
                            <component v-bind:is="currentTabComponent" :meetingId='mId' :comIndex='tabIndex'></component>
                        </keep-alive>
                    </transition>
                </div>
            </div>

            <div v-if="meeting.meetingTypeDict != 6" class="collapse-box" style="width: 110px;z-index: 100000000;top:90px;">
				<div id="collapse-title" @click="close" class="collapse-title">议题列表<span class="collapse-icon"></span></div>
				<ul id="collapse-item" class="collapse-item" style="display: none;overflow-y: auto;max-height: 500px;">
					<template v-for="(item,index) in inSelectSubjects">
						<li 
                            v-if="disabledSubjectIds.indexOf(item.id) == -1"
                            @click="tabClick(index + subTabIndex)" 
                            :class="{'cur-click-sub': subjectSelectedIndex == index}"
                            :key="item.id">
							<a href="javascript:;" :class="{'subject-end': (subjectSelectedIndex != index && tabStatus[index + 3] == 3)}" :title="item.subjectName">{{ (getIndex(item.id)) + '、' + item.subjectName }}</a>
						</li>
			        </template>
				</ul>
			</div>

            <ul v-if="show == 1" class="layedit-tool-fixed f-right">
                <li 
                    v-if="!isEnd && !manage" 
                    @click="curManageTabClick(curManageTabIndex)"
                    :class="{'f-li': true, 'open': rightShortcutButtons[0] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#f3130e">
                        <img src="/img/meeting/cur-tab.png" alt="当前"/><br>当前
                    </a>
                </li>
                <li 
                    v-if="false && showSummary"
                    @click="summary()"
                    :class="{'f-li': true, 'open': rightShortcutButtons[1] == true}">
                    <a class="f-item-1 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/jy_icon.png" alt="纪要"/><br>纪要
                    </a>
                </li>
                <li 
                    v-if="false && showSupervision" 
                    @click="supervision"
                    :class="{'f-li': true, 'open': rightShortcutButtons[2] == true}">
                    <a class="f-item-2 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/db_icon.png" alt="督办"/><br>督办
                    </a>
                </li>
                <li 
                    v-if="!manage && false" 
                    @click="editNote"
                    :class="{'f-li': true, 'open': rightShortcutButtons[3] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/note_icon.png" alt="笔记"/><br>笔记
                    </a>
                </li>
                <li 
                    v-if="manage && canVoteSubjects && canVoteSubjects && canVoteSubjects.length > 0" 
                    @click="backSubject"
                    :class="{'f-li': true, 'open': rightShortcutButtons[4] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/v-sub.png" alt="议题"/><br>议题
                    </a>
                </li>
                <li 
                    v-if="countdownShow"
                    @click="backCountdown" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[7] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/countdown.png" alt='返回计时界面'/><br>计时
                    </a>
                </li>
                <li 
                    v-if="meeting.meetingTypeDict != 6 && !isEnd && !manage && !voting && canVote && ((userCanVote == false && canVote) || userCanVote)"
                    @click="votingDraft" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[8] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/countdown.png" alt='投票草稿'/><br>草稿
                    </a>
                </li>
                <li 
                    v-if="false && !isEnd && (manage || (showPreVoting && (userCanVote || publishFilteringVoteFlag)))"
                    @click="preVoting" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[9] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/countdown.png" alt='预投'/><br>预投
                    </a>
                </li>
                <li 
                    @click="refreshMeeting()" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[10] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/refresh.png" alt='刷新'/><br>刷新
                    </a>
                </li>
                <li 
                    v-if="!isEnd && manage"
                    @click="oneKey()" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[11] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/one-key.png" alt='一键'/><br>一键
                    </a>
                </li>
                <li
                    @click="help()" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[12] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#2196f3">
                        <img src="/img/meeting/help.png" alt='帮助'/><br>帮助
                    </a>
                </li>
                <li 
                    @click="backHome" 
                    :class="{'f-li': true, 'open': rightShortcutButtons[5] == true}">
                    <a class="f-item-3 ripple" href="javascript:;" style="background:#ffb430">
                        <img src="/img/meeting/m-home.png" alt=主页/><br>主页
                    </a>
                </li>
            </ul>
        </div>
        <iframe v-if="show == 2" :src="curFileUrl" frameborder="0" width="100%" height="100%"></iframe>
        <meeting-summary v-if="show == 3" :mId="meeting.id" :meetingType="meetingTypeMap[meeting.meetingTypeDict]"></meeting-summary>
        <meeting-supervision v-if="show == 4" :mId="meeting.id" :meetingType="meetingTypeMap[meeting.meetingTypeDict]"></meeting-supervision>
        <countdown v-if="countdownShow" :class="{'hidden': show != 5}" :min="minute" :is-start='true'></countdown>
        <meeting-note v-if="show == 6" :mId='meeting.id'></meeting-note>
        <ul v-if="show >= 2" class="layedit-tool-fixed f-right">
            <!-- <li v-if="manage && show == 3" @click="exportSummary"><a class="f-item-3" href="javascript:;" style="background:#2196f3">
                <img src="/img/meeting/v-sub.png" alt="议题"/><br>导出
            </a></li> -->
            <li 
                @click="backMeeting" 
                :class="{'f-li': true, 'open': rightShortcutButtons[6] == true}"><a class="f-item-3 ripple" href="javascript:;" style="background:#ffb430">
                <img src="/img/meeting/back.png" alt=返回/><br>返回
            </a></li>
            
        </ul>
    </div>
</template>
<script>
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { getTabIndex, getMeeting, getManage, handleResult, getSubjectSelectedIndex, getCurTabStatus } from '@/utils/meetingUtils'
import { getLoginStatus } from '@/api/login'
import MeetingTabs from './tabs/MeetingTabs.vue'
import MeetingSignTab from './tabs/MeetingSignTab.vue'
import MeetingStartTab from './tabs/MeetingStartTab.vue'
import MeetingAttendTab from './tabs/MeetingAttendTab.vue'
import MeetingSubjectTab from './tabs/MeetingSubjectTabV2'
import MeetingVoteTab from './tabs/MeetingVoteTab.vue'
import MeetingVoteResultTab from './tabs/MeetingVoteResultTab.vue'
import MeetingSupervisoryVoteTab from './tabs/MeetingSupervisoryVoteTab'
import MeetingEndTab from './tabs/MeetingEndTab.vue'
import MeetingAgendaTab from './tabs/MeetingAgendaTab'
import MeetingPdf from './MeetingPdf.vue'
import MeetingSummary from './MeetingSummary.vue'
import MeetingSummaryPreview from './MeetingSummaryPreview.vue'
import MeetingSupervision from "@/views/meeting/MeetingSupervision.vue"
import MeetingSupervisionPreview from "@/views/meeting/MeetingSupervisionPreview.vue"
import MeetingVoteResultReviewTab from './tabs/MeetingVoteResultReviewTab'
import MeetingNote from './MeetingNote.vue';
import Countdown from '@/components/Countdown.vue';
import { submitMemberSubjectVotes, oneKey } from '@/api/meeting/meeting'
let _ = require('lodash')
import VotingDraft from './VotingDraft'
import SubjectFilteringTab from './tabs/SubjectFilteringTab'
import { getToken } from '@/utils/auth';
import meetingTabMixin from '@/mixin/meetingTabMixin'

export default {
    mixins: [meetingTabMixin],
    components: {
        MeetingTabs,
        MeetingSignTab,
        MeetingStartTab,
        MeetingAttendTab,
        MeetingSubjectTab,
        MeetingVoteTab,
        MeetingPdf,
        MeetingVoteResultTab,
        MeetingEndTab,
        MeetingSupervisoryVoteTab, 
        MeetingSummary, 
        MeetingSupervision,
        Countdown, 
        MeetingNote, 
        SubjectFilteringTab,
        MeetingAgendaTab,
        MeetingVoteResultReviewTab
    },
    data () {
        return {
            currentTabComponent: null,
            componentMap: {
                MeetingSignTab,
                MeetingStartTab,
                MeetingAttendTab,
                MeetingSubjectTab,
                SubjectFilteringTab,
                MeetingVoteTab,
                MeetingVoteResultTab,
                MeetingSupervisoryVoteTab,
                MeetingEndTab,
                MeetingAgendaTab,
                MeetingVoteResultReviewTab
            },
            components: [],
            mId: this.$route.params.meetingId,
            meetingContainerMinHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
            rightShortcutButtons: [false, false, false, false, false, false, false, false, false, false, false, false],
            stompClient: null,
            voting: false,
            connectCount: 0,
            destroyed: true,
        }
    },
    computed: {
        ...mapGetters({
            needFilteringSubjects: 'meeting/needFilteringSubjects',
            votingCandidates: 'meeting/votingCandidates',
        }),
        canVote() {
            return this.votingCandidates.indexOf(this.user.userId, 'userId') != -1;
        },
        publishFilteringVoteFlag() {
            return this.$store.state.meeting.voteInfo.publishFilteringVoteFlag || false;
        },
        curVoteSubjectTabIndex: function(){
            return this.$store.state.meeting.voteInfo.curVoteSubjectTabIndex;
        },
        curManageTabIndex: function(){
            return this.$store.state.meeting.curManageTabIndex;
        },
        show: function(){
            return this.$store.state.meeting.show || -1;
        },
        curFileUrl: function(){
            return this.$store.state.meeting.curFileUrl;//.replace('', process.env.API_HOST)
        },
        meetingTypeMap: function(){
            return this.$store.state.meeting.meetingDicts[0].array2Obj("value", 'label');
        },
        minute: function() {
            return this.$store.state.meeting.minute;
        },
        countdownShow: function(){
            return this.$store.state.meeting.countdownShow;
        },
        showSummary: function() {
            return this.manage || (this.meeting.meetingTypeDict != 1 && this.meeting.meetingTypeDict != 2);
        },
        showSupervision: function() {
            return this.manage || (this.meeting.meetingTypeDict != 1 && this.meeting.meetingTypeDict != 2);
        },
        subjectsVoteDetail: function() {
            return this.$store.state.meeting.voteInfo.subjectsVoteDetail || {};
        },
        memberSubjectVotes: function() {
            return this.$store.state.meeting.memberSubjectVotes || [];
        },
        showPreVoting() {
            return this.needFilteringSubjects.length > 0 ? getCurTabStatus(this, this.inSelectSubjects.length + this.subTabIndex) != 1 : false;
        },
    },
    watch: {
        tabIndex: function(){
            this.tabSwitch(this.tabIndex);
        },
        memberSubjectVotes: {
            handler() {
               if (!this.manage) {
                   this.submitMemberSubjectVotes();
               }
            },
            deep: true
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

    },
    mounted () {
       
        this.$store.dispatch('meeting/GET_MEETING_INIT_DATA', this.mId).then(() => {
            this.$store.commit('meeting/SET_TAB_INDEX', this.tabIndex);
            this.destroyed = false;
            this.meetingSessions.forEach(item => {
                this.components.push(this.componentMap[item.viewTypeDict]);
            });
            
            if(this.currentTabComponent == null){
                this.tabSwitch(this.tabIndex);
            }
            var _this = this;
            $(document).click(function(e){
                var _con = $("#layui-tab-title-outer");
                if(!(!_con.is(e.target) && (_con.has(e.target).length ===0))){
                return;
                }
                var _con = $(".collapse-box");
                if(!_con.is(e.target) && (_con.has(e.target).length ===0)){
                    var ex = $("#collapse-item").data('close');
                    if(ex){
                        _this.close();
                    }
                }
            });
            $(document).on('touchstart', function(e){
                var _con = $("#layui-tab-title-outer");
                if(!(!_con.is(e.target) && (_con.has(e.target).length ===0))){
                return;
                }
                var _con = $(".collapse-box");
                if(!_con.is(e.target) && (_con.has(e.target).length ===0)){
                    var ex = $("#collapse-item").data('close');
                    if(ex){
                        _this.close();
                    }
                }
            });
            this.$store.commit('meeting/UPDATE_SHOW', {
                show: 1
            });
            if(!this.isEnd){
                this.wsMsgSubscribe();
            }
        }).catch(() => {
            if(this.show == 0){
                //alert("获取会议失败");
            }
        })

        var voting = false;
        this.voteSubjectIds.forEach(subId => {
            if (!this.myVoteDetailMap[subId]) {
                voting = true;
                return;
            }
        });
        this.voting = voting;
    },
    methods: {
        ...mapMutations({
            tabClick: "meeting/SET_TAB_INDEX"
        }),
        wsMsgSubscribe: function(){
            var _this = this;
            var token = getToken();
            var socket = new SockJS(process.env.VUE_APP_WS_HOST + '/endpointWisely?authToken=' + token); // 链接SockJS 的endpoint 名称为"/endpointWisely"
            // var socket = new SockJS(process.env.API_HOST + '/endpointWisely');
            var stompClient = Stomp.over(socket);
            _this.stompClient = stompClient;
            //stompClient.client('ws://192.168.205.36:8080/endpointWisely');
            stompClient.connect({"username" : "admin","password" : "admin"}, function(frame) {// 链接Web
                _this.connectCount = 0;
                stompClient.subscribe('/user/queue/signed', function(response) { // 订阅/topic/getResponse
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        _this.$store.commit('meeting/UPDATE_SIGN_INFO', (!(res.data instanceof Array)) ? {'type': res.data.signType, meetingId: _this.mId} : res.data);
                    });
                });

                stompClient.subscribe('/user/topic/tabSwitch', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        if(!_this.manage && _this.tabStatus[res.data.index] == 1){
                            _this.$store.commit('meeting/UPDATE_TAB_STATUS', {
                                index: res.data.index,
                                status: 2
                            });
                        }
                        var tabIndex = -1;
                        var index = res.data.index;
                        if(index < _this.subTabIndex || _this.subTabIndex == -1){
                            tabIndex = index;
                        } else if(index >= _this.subTabIndex && _this.inSelectSubjects.length + _this.subTabIndex > index){
                            // _this.subjectSelectedIndex = index - _this.subTabIndex;
                            tabIndex = _this.subTabIndex;
                        } else {
                            tabIndex = index -  _this.inSelectSubjects.length + 1;
                        }
                        if (_this.meetingSessions[tabIndex].viewTypeDict != 'MeetingSignTab') {
                            _this.$store.commit('meeting/SET_TAB_INDEX', res.data.index);
                        }
                        _this.$store.commit('meeting/SET_CUR_MANAGE_TAB_INDEX', res.data.index);
                    });
                });
                
                stompClient.subscribe('/user/queue/tabStatus', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        _this.$store.commit('meeting/UPDATE_TAB_STATUS', res.data);
                    });
                });
                
                stompClient.subscribe('/user/queue/varReplace', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        _this.$store.commit('meeting/UPDATE_MEETINGINFO', res.data);
                    });
                });
                
                stompClient.subscribe('/user/vote/meetingVoteFlag', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        if(res.data.flag){
                            _this.$store.commit('meeting/UPDATE_VOTE_SUBJECTIDS', res.data.voteSubjectIds.split(","));
                        }
                    });
                });
                
                stompClient.subscribe('/user/vote/memberRight', function(response) { 
                    var res = JSON.parse(response.body);
                    _this.$store.commit('meeting/UPDATE_MEMBERS_VOTERIGHT', res);
                    // handleResult(res, function(){
                    // });
                });
                
                stompClient.subscribe('/user/vote/userVoteRusult', function(response) { 
                    var res = JSON.parse(response.body);
                    if(res){
                        _this.$store.commit('meeting/UPDATE_VOTEINFO', res);
                        // if(_this.meeting.meetingTypeDict == 2 && _this.manage) {
                        //     for(var key in _this.subjectsVoteDetail){
                        //         var ele = _this.subjectsVoteDetail[key];
                        //         if(ele.pass == 1 && ele['member_2'].indexOf(_this.meeting.oneVoteVetoUserId) != -1){
                        //             _this.$store.dispatch('meeting/UPDATE_SUBJECT_VOTE_PASS', {
                        //                 subjectId: key, 
                        //                 passType: 3,
                        //                 confirm: false
                        //             });
                        //         }
                        //     }
                        // }
                    }
                });

                stompClient.subscribe('/user/vote/result', function(response) { 
                    var res = JSON.parse(response.body);
                    if(res){
                        res.fromMsg = true;
                        _this.$store.commit('meeting/UPDATE_VOTEINFO', res);
                    }
                });
                
                stompClient.subscribe('/user/vote/subjectPass', function(response) { 
    				var res = JSON.parse(response.body);
    				if (res) {
                        _this.$store.commit('meeting/UPDATE_SUBJECTS', res);
    				}
                });
               
                stompClient.subscribe('/user/vote/userFilteringVote', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        if(res){
                            _this.$store.commit('meeting/UPDATE_FILTERING_VOTE_MAP', res.data);
                        }
                    });
                });

                stompClient.subscribe('/user/vote/filteringResult', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        if(res){
                            _this.$store.commit('meeting/UPDATE_FILTERING_VOTE_MAP', res.data);
                        }
                    });
                });

                stompClient.subscribe('/user/queue/addPrincipal', function(response) { 
                    var res = JSON.parse(response.body);
                    handleResult(res, function(){
                        if(res){
                            _this.$store.commit('meeting/ADD_PRINCIPAL', res.data);
                        }
                    });
                });
            }, function(error){
        		 //document.getElementById("container").innerHTML = "连接失败";
                console.log('连接失败【' + error + '】');
                if (_this.connectCount++ < 10) {
                    setTimeout(() => {
                        _this.wsMsgSubscribe();
                    }, 200);
                }
                // _this.wsMsgSubscribe();
        	});
        },
        tabSwitch: function(){
            this.currentTabComponent = (this.tabIndex > this.components.length)  ? null : this.components[this.tabIndex];
        },
        showSummaryOrSupervision: function(){
            return this.manage || !(this.meeting.meetingTypeDict == 1);
        },
        startBtnAnimation: function(index, func){
            this.$set(this.rightShortcutButtons, index, true);
        	setTimeout(() => {
                this.$set(this.rightShortcutButtons, index, false);
                if (func) {
                    func();
                }
        	}, 500);
        },
        curManageTabClick: function(manageTabIndex){
            this.startBtnAnimation(0, () => {
                this.tabClick(manageTabIndex);
            });
        },
        backSubject: function(){
            this.startBtnAnimation(4, () => {
                if(this.curVoteSubjectTabIndex > 0){
                    this.tabClick(this.curVoteSubjectTabIndex);
                }
            });
           
        },
        editNote: function(){
            this.startBtnAnimation(3, () => {
                // this.$layer.iframe({
                //     content: {
                //         content: MeetingNote, //传递的组件对象
                //         parent: this,//当前的vue对象
                //         data:{
                //             mId: this.meeting.id,
                //             height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8
                //         }//props
                //     },
                //     area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                //     title:"会议笔记",
                //     shadeClose: false
                // });
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show: 6
                });
            });
        },
        supervision: function(){
            this.startBtnAnimation(2, () => {
                if(this.manage){
                    this.$store.commit("meeting/UPDATE_SHOW", {
                        show: 4
                    });
                } else {
                    this.$layer.iframe({
                            content: {
                            content: MeetingSupervisionPreview, //传递的组件对象
                            parent: this,//当前的vue对象
                            data:{
                                mId: this.meeting.id,
                            }//props
                        },
                        area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                        title:"会议督办"
                    });
                }
            });
        },
        summary: function(){
            this.startBtnAnimation(1, () => {
                if(this.manage){
                    this.$store.commit("meeting/UPDATE_SHOW", {
                        show: 3
                    });
                } else {
                    this.$layer.iframe({
                        content: {
                            content: MeetingSummaryPreview, //传递的组件对象
                            parent: this,//当前的vue对象
                            data:{
                                mId: this.meeting.id,
                            }//props
                        },
                        area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                        title:"会议纪要"
                    });
                }
            });
        },
        backHome: function(){
            this.startBtnAnimation(5, () => {
                this.$router.push({
                    name: 'Home',
                    query: {
                        toPath: 'MeetingList'
                    }
                });
            });
        },
        close: function(){
            var ex = $("#collapse-item").data('close');
    		if(!ex){
    			$("#collapse-item").css({"width": '460px'}).data('close', true);
    		} else {
    			$("#collapse-item").css({"width": '110px'}).data('close', false);
    		}
    		$("#collapse-item").slideToggle(500);
    		if(!ex){
    			$("#collapse-title").attr('style', "width:460px;");
    		} else {
    			$("#collapse-title").attr('style', "width:110px;");
    		}
        },
        backMeeting: function(){
            //this.startBtnAnimation(0);
            this.startBtnAnimation(6, () => {
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show: 1
                });
            });
        },
        refreshMeeting: function() {
            this.startBtnAnimation(10, () => {
                location.reload();
            });
        },
        backCountdown: function() {
            this.startBtnAnimation(7, () => {
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show: 5
                });
            });
        },
        submitMemberSubjectVotes: _.debounce(function () {
            submitMemberSubjectVotes(this.meeting.id, this.memberSubjectVotes).then(res => {
                console.log('submit 成功');
            });
        }, 2000),
        votingDraft: function() {
            this.startBtnAnimation(8, () => {
                this.$layer.iframe({
                    content: {
                        content: VotingDraft, //传递的组件对象
                        parent: this,//当前的vue对象
                        data:{
                            mId: this.meeting.id,
                        }//props
                    },
                    area:['90%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                    title:"投票草稿"
                });
            });
        },
        preVoting: function () {
            this.startBtnAnimation(9, () => {
                this.tabClick(this.inSelectSubjects.length + 3);
            });
        },
        getIndex: function (subjectId) {
            var curSubIndex = this.inSelectSubjects.indexOf(subjectId, 'id');
            var count = 0;
            this.disabledSubjectIds.forEach(element => {
                var index = this.inSelectSubjects.indexOf(element, 'id');
                if (index < curSubIndex) {
                    count++;
                }
            });
            return curSubIndex - count + 1;
        },
        oneKey: function() {
            this.startBtnAnimation(11, () => {
                oneKey(this.meeting.id).then(res => {
                    alert(res.msg);
                });
            });
        },
        help() {
            this.startBtnAnimation(12, () => {
                var show = 2;
                let atta = {
                    attachmentSavePath: 'meeting/help.pdf'
                }
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show,
                    atta
                });
            });
        }
    },
    destroyed() {
        if(this.stompClient){
            this.stompClient.disconnect(function () {
                console.log("断开链接");
            });
        }
        this.destroyed = true;
        this.$layer.closeAll();
    },
}
</script>

<style src="../../assets/css/meeting/screen.css" scoped></style>
<style src="../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .meeting-container {
        background: #3a3c48 url('/img/meeting/touming.png');
        /* font-size: 14px; */
    }
    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active for below version 2.1.8 */ {
        opacity: 0;
    }
    .panel-fit, .panel-fit body, #app {
        overflow-y: auto;
    }
    .tabs-fixed {
        position: fixed;
        width: 100%;
        border-bottom: 1px solid red;
        z-index: 9999;
    }
    .tab-container {
        padding-top: 70px;
        height: 100%;
        width: 100%;
        text-align: center;
    }
    .meeting-title {
        font-size: 24px;
        color: rgb(217, 198, 130);
        margin-bottom: 14px;
        display: inline-block;
    }
    .meeting-time {
        font-size: 13px;
        color: #bfc3c9;
    }
    .tab-item {
        margin: 30px 30px
    }
    dd.timelineEvent {
        padding-left: 0;
    }
    .tab-item /deep/ .cpdf .center {
        padding-top: 0;
    }
    .tab-item /deep/ .cpdf .center .contor {
        position: fixed;
    }

    .f-right {
        right: 0;
        top: 20%;
        border-top: none;
        z-index: 999999999;
    }
    .f-right li {
        width: 44px;
        height: 40px;
        margin-bottom: 20px;
    }
    .f-right li>a {
        display: block;
        width: 100%;
        /* height: 100%; */
        padding-top: 4px;
        color: #fff;
        font-size: 12px;
        text-align: center;
    }
    .f-right li>a.f-item-1 {
        background-color: #d78e38;
    }
    .f-right li>a.f-item-2 {
        background-color: #27b93d;
    }
    .f-right li>a.f-item-3 {
        background-color: #37add1;
    }
    .f-right li>a>img {
        margin-bottom: 2px;
    }
    .offset-box {
        padding: 0;
    }
    .collapse-box {
        width: 460px;
        position: fixed;
        left: 0;
        top: 12%;
    }
    .collapse-box .collapse-title {
        color: #fff;
        font-size: 16px;
        background-color: #867ec9;
        height: 40px;
        line-height: 40px;
        padding-left: 11px;
        padding-right: 11px;
        cursor: pointer;
    }
    .collapse-title .collapse-icon {
        width: 19px;
        height: 16px;
        display: block;
        float: right;
        background: url("/img/meeting/collapse_icon.png") center center no-repeat;
        position: relative;
        top: 12px;
    }
    .collapse-box .collapse-item {
        background-color: #40397f;
        padding-top: 8px;
        padding-bottom: 8px;
        border: 1px solid #666877;
        display: none;
    }
    .collapse-box .collapse-item li>a {
        display: block;
        color: #f6fdff;
        font-size: 14px;
        padding-left: 16px;
    }
    .collapse-box .collapse-item li>a:hover,
    .collapse-box .collapse-item li>a:focus {
        background-color: #ceab2f;
    }
    .ripple {
        position: relative;
        overflow: hidden;
    }
    
    .ripple:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10, 10);
        opacity: 0;
        transition: transform .3s, opacity .5s;
    }
    
    .ripple:active:after {
        transform: scale(0, 0);
        opacity: .3;
        transition: 0s;
    }
    
    .bac td{
        background-color: #d5f3f5;
    }
    
    #collapse-item li a {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .f-li > a {
        width: 44px;
        height: 44px;
    }
</style>