import Vue from 'vue'
import { getMeetingData, getMeetingInitData, sendTabSwitchMsg, sendSignMsg, sendNextMsg, sendVoteMsg, sendMemberReviewMsg, voteResultSubmit, publishVoteResult, updateSubjectResultPass, endMeeting } from '@/api/meeting/meeting'
import { calSignInfo, calVoteResult, calPassInfo, calVoteRateInfo, verifyVoteResultByTotalScore, handleScoreResultJson2String, updateSubjectsVoteDetailMap } from '@/utils/meetingUtils'
import { GET_MEETING_INIT_DATA, TAB_SWITCH, SET_TAB_INDEX, UPDATE_MEETING_INIT_DATA, SIGN, UPDATE_SIGN_INFO, UPDATE_TAB_STATUS, NEXT, 
        UPDATE_MEETINGINFO, UPDATE_MEMBER_VOTE_FLAG, UPDATE_VOTE_SUBJECTIDS, VOTE, SET_CUR_VOTE_SUBJECT_TAB_INDEX, MEMBER_REVIEW,
        UPDATE_MEMBERS_VOTERIGHT, NEXT_VOTE_STEP, UPDATE_MEMBER_SIGN_STATUS, VOTE_RESULT_SUBMIT, UPDATE_VOTEINFO,
        UPDATE_MY_VOTE_DETAIL_MAP, PUBLISH_VOTE_RESULT, END_MEETING, SET_CUR_MANAGE_TAB_INDEX, UPDATE_SUBJECT_VOTE_PASS, UPDATE_SHOW,
        UPDATE_SUBJECTS, UPDATE_MINUTE, UPDATE_COUNTDOWN_SHOW, UPDATE_SUBJECT_VOTEMEMBERCOUNT, UPDATE_MEMBER_SUBJECT_VOTES, UPDATE_FILTERING_VOTE_MAP, UPDATE_VOTING_DRAFT_DESTORY,
        ADD_PRINCIPAL } from '@/store/mutation-types'
// initial state
// shape: [{ id, quantity }]
const state = {
    signStatus: 1,
    signInfo: {

    },
    voteInfo: {
        voteRateInfo: {},//key: 议题ID  value: 投票率
        voteSubjectIds: [],
        curVoteSubjectIds: [],
        curVoteSubjectTabIndex: -1,
        voteStep: 1,
        userVoteResultsMap: {},// key 投票人ID v: 投过的议题投票详情
        subjectsVoteDetail: {},
        myVoteDetailMap: {},
        passSubjectCount: [0,0],
        filteringVoteMap: {},
        filterVoteRate: 0,
        userFilterVotes: [],
        publishFilteringVoteFlag: false,
    },
    meeting: {},
    meetingSubjects: [],
    user: {},
    manage: false,
    members: [],
    userMap: {},
    userOfficeMap: {},
    officeNameMap: {},
    meetingDicts: [],
    tabStatus: [],
    tabIndex: -1,
    curManageTabIndex: -1,
    subjectSelectedIndex: 0,
    firstClickTab: true,
    isEnd: false,
    show: 0,
    curFileUrl: null,
    minute: -1,
    countdownShow: false,
    memberSubjectVotes: [],
    subjectVoteRefresh: true,
    disabledSubjectIds: [],
    votingDraftRefresh: false,
    votingDraftDestory: 1,
    meetingSessions: [],
    subTabIndex: 3,
}

// getters
const getters = {
    canVoteSubjects: state => {
        return state.meetingSubjects ? state.meetingSubjects.filter(ms => (state.disabledSubjectIds.indexOf(ms.id) == -1 &&  ms.subjectVoteFlag == 'y')) : [];
        // if(state.manage){
        // } else {
        //     return state.meetingSubjects ? state.meetingSubjects.filter(ms => state.voteInfo.voteSubjectIds.indexOf(ms.id) != -1) : [];
        // }
    },
    inSelectSubjects: state => {
        return state.meetingSubjects;//.filter(ms => (ms.projectId || ms.subjectVoteFlag != 'y'));
    },
    userCanVote: state => {
        var index = state.members.indexOf(state.user.userId + "", 'userId');
        return index != -1 ? (state.members[index].memberVoteFlag == 'y') : false;
    },
    curVoteSubjects: state => {
        function checkOffice(subject){
            return true;
            // * * 科管会  副主任委员可投所有的票
            if(state.manage || !subject.projectId || (state.meeting.meetingTypeDict == 2 && state.user.userId == state.meeting.viceChairmanUserId)){
                return true;
            }
            var userOfficeId = state.userMap[state.user.userId].officeId;
            return state.projectInfoMap[subject.id].officeId != userOfficeId;
        }
        var index = state.members.indexOf(state.user.userId, 'userId');
        var userCanVote = index != -1 ? (state.members[index].memberVoteFlag == 'y') : false;
        return (state.meetingSubjects && userCanVote) ? state.meetingSubjects.filter(ms => ( state.disabledSubjectIds.indexOf(ms.id) == -1 && ms.subjectVoteFlag == 'y') && (state.isEnd || (state.voteInfo.voteSubjectIds.indexOf(ms.id) != -1 && !state.voteInfo.myVoteDetailMap[ms.id])) && checkOffice(ms)) : [];
    },
    votedSubjects: state => {
        var index = state.members.indexOf(state.user.userId, 'userId');
        var userCanVote = true;//index != -1 ? (state.members[index].memberVoteFlag == 'y') : false;
        return (state.meetingSubjects && userCanVote) ? state.meetingSubjects.filter(ms => ( state.disabledSubjectIds.indexOf(ms.id) == -1 && ms.subjectVoteFlag == 'y') && (state.isEnd || (state.voteInfo.voteSubjectIds.indexOf(ms.id) != -1))) : [];
    },
    needFilteringSubjects: state => {
        return state.meetingSubjects ? state.meetingSubjects.filter(ms => ms.meetingSubjectTypeDict == '9') : [];
    },
    votingCandidates: state => {
        // 已经签到 去除列席人员 会议类型非部务会时去除主任委员
        // const checkPrincipalSigned = (member) => {
        //     member.userId;
        //     state.members.indexOf()
        // }
        return state.members.filter(member => member.signInStatus == 'y' && state.meeting.meetingTypeDict && member.meetingMemberTypeDict != 8 && 
               member.userId != state.meeting.chairmanUserId && member.userId != state.meeting.moderatorUserId && member.userId != state.meeting.supervisorUserId);
    },
    voteMembers: state => {
        return state.members.filter(member => member.memberVoteFlag == 'y');
    },
    noStartStatus: state => {
        return 2;
    },
    role: state => {
        if(state.user.userId == state.meeting.chairmanUserId){
            return "5";
        }
        if(state.user.userId == state.meeting.viceChairmanUserId) {
            return "6";
        }
        return null;
    },
    voting: state => {
        var voting = false;
        state.voteInfo.voteSubjectIds.forEach(subId => {
            if (!state.voteInfo.myVoteDetailMap[subId]) {
                voting = true;
                return;
            }
        });
        return voting;
    }
}

// actions
const actions = {
    [GET_MEETING_INIT_DATA]({ commit }, meetingId) {
        return new Promise((resolve, reject) => {
            getMeetingData(meetingId).then(results => {
                var meetingDicts = results[0].data || [];
                var meetingInfoData = results[1].data || {};
                var meeting = meetingInfoData.meetingInfo || {};
                var subjectData = results[2].data;
                var meetingSubjects = subjectData.meetingSubjects || [];
                var officeNameMap = subjectData.officeNameMap || {};
                var userMap = subjectData.userMap || {};
                var meetingMemberData = results[3].data || {};
                var members = meetingMemberData.meetingMembers || [];
                Object.assign(userMap, meetingMemberData.userMap || {});
                var userOfficeMap = meetingMemberData.userOfficeMap || {};
                var cacheData = results[4].data || {};
                var meetingFieldMap = cacheData.meetingFieldMap || {};
                for (const key in meetingFieldMap) {
                    if (meetingFieldMap.hasOwnProperty(key)) {
                        const value = meetingFieldMap[key];
                        meeting[key] = value;
                    }
                }
                var voteData = results[5].data || {};
                var user = {
                    userId: JSON.parse(localStorage.getItem("user")).userId,
                }
                var meetingSessions = results[6].data || {};
                var data = Object.assign({
                    user,
                    meetingDicts,
                    meeting,
                    meetingSubjects,
                    members,
                    userMap,
                    userOfficeMap,
                    officeNameMap,
                    meetingSessions
                }, cacheData, voteData);
                commit(UPDATE_MEETING_INIT_DATA, data);
                var tabIndex = state.isEnd ? 0 : (cacheData.tabIndex >= 0 && state['tabStatus'][data.tabIndex] != 1)  ? cacheData.tabIndex  : (state['manage'] ? 0 : state.subTabIndex);
                // commit(SET_TAB_INDEX, tabIndex);
                commit(SET_CUR_MANAGE_TAB_INDEX, tabIndex);
                resolve()
            }).catch(error => {
                 reject(error)
            });
        })
    },
    [TAB_SWITCH]({ commit }, param) {
        if(!state.manage || state.isEnd){
            return;
        }
        return new Promise((resolve, reject) => {
            sendTabSwitchMsg(state.meeting.id, param.index, param.templateField).then(response => {
                const data = response.data
                commit(SET_TAB_INDEX, param.index);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [SIGN]({ commit }, param) {
        
        var meetingId = param;
        if(state.signStatus == 3 || state.signStatus == 4 || state.isEnd){
            return;
        }
        var send = false;
        if(!state.manage){// 参会人员 signStatus = 2 时说明管理员已启动签到  此时可以进行签到
            if(state.signStatus != 2){
               return;
            }
            commit(UPDATE_MEMBER_SIGN_STATUS, 3);//state.signStatus = 3; // 参会人员 -- 签到中
            send = true;
        } else {
            if(state.signStatus == 3){// 管理员端 已结束签到 无需再次结束签到
                return;
            }
            if(state.signStatus == 1){
                if(param.userId) {
                    return;
                }
            }
            if(state.signStatus == 2){
                if(param.userId) {
                    confirm("确定代签到吗?", function(){
                        return new Promise((resolve, reject) => {
                            sendSignMsg(param.meetingId, param.userId).then(response => {
                                const data = response.data
                                alert(response.msg);
                                resolve()
                            }).catch(error => {
                                reject(error)
                            });
                        })
                    });
                } else if(state.signInfo.signRate != 100){
                    confirm("确定要结束签到吗?", function(){
                        return new Promise((resolve, reject) => {
                            sendSignMsg(meetingId).then(response => {
                                const data = response.data
                                resolve()
                            }).catch(error => {
                                reject(error)
                            });
                        })
                    });
                    // if(confirm("确定要结束签到吗?")){
                    //     send = true;
                    // } 
                    return;
                } else {
                    send = true;
                }
            } else {
                send = true;
            }
        }
        // 签到率验证
        if(send){
            return new Promise((resolve, reject) => {
                sendSignMsg(meetingId).then(response => {
                    const data = response.data
                    resolve()
                }).catch(error => {
                    reject(error)
                });
            })
        }
    },
    [NEXT]({ commit }, pindex) {
        var index = pindex;
        if(state.tabStatus[index] != 4){
            return;
        }
        
        // 在议题页面启动的下一项功能
        // var exit = false;
        // var inSelectSubjects = this.getters['meeting/inSelectSubjects'];
        // if (index >= state.subTabIndex && (inSelectSubjects.length + state.subTabIndex) > index) {
        //     exit = true;
        //     index += 1;
        //     while ((index < (inSelectSubjects.length + state.subTabIndex)) && exit) {
        //         console.log(index);
        //         var subId = inSelectSubjects[index - state.subTabIndex].id;
        //         if (state.disabledSubjectIds.indexOf(subId) == -1) {
        //             exit = false;
        //         } else {
        //             index += 1;
        //         }
        //     }
        // } else {
        //     index++;
        // }
        // if (exit && (index == (inSelectSubjects.length + state.subTabIndex))) {
        //     index++;
        // }
        index++;
        console.log(index);
        return new Promise((resolve, reject) => {
            sendNextMsg(state.meeting.id, pindex).then(response => {
                commit(SET_TAB_INDEX, index);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [MEMBER_REVIEW]({ commit }, index) {
        if(!state.manage || state.voteInfo.voteStep != 1 || state.isEnd){
            return;
        } 
        confirm('确定将当前勾选的人员作为投票人员吗,一旦提交将无法再次进行人员复核,确定要人员复核吗?', function(){
            return new Promise((resolve, reject) => {
                sendMemberReviewMsg(state.meeting.id, state.members.filter(member => member.memberVoteFlag == 'y')).then(response => {
                    //commit(SET_TAB_INDEX, index + 1);
                    alert('人员复核成功');
                    commit(NEXT_VOTE_STEP);
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        })
        // if(confirm('确定将当前勾选的人员作为投票人员吗,一旦提交将无法再次进行人员复核,确定要人员复核吗?')){
            
        // }
    },
    [VOTE]({ commit }, param) {
        var step = state.voteInfo.voteStep;
        var flag = param.flag;
        if(!state.manage || state.isEnd || step == 1 || step == 4){
            return;
        } 
       
        // 加入确认提示 --
        confirm('确定要关闭投票功能吗？(一旦关闭，将无法使用投票功能)', function() {
            sendVoteMsg(state.meeting.id, param.index, (state.voteInfo.voteSubjectIds || []), param.flag).then(response => {
                //commit(SET_TAB_INDEX, index + 1);
                if(!param.flag){
                    commit(UPDATE_TAB_STATUS, {
                        index: param.index,
                        status: 4
                    })
                } else {
                    commit(UPDATE_SUBJECT_VOTEMEMBERCOUNT, response.data);
                }
                if(!param.flag){
                    commit(NEXT_VOTE_STEP, step == 2 ? 2 : 1);
                }
                alert(param.flag ? "成功开启投票功能" : "成功关闭投票功能");
            })
        }, !flag);
       
    },
    [VOTE_RESULT_SUBMIT]({ commit }, params) {
        let memberVotes = params.memberVotes;
        if (state.manage || state.isEnd) {
            return;
        } 
        var err = verifyVoteResultByTotalScore(memberVotes);
        if (err) {
            var index = state.meetingSubjects.indexOf(err.subjectId, 'id');
            msg('第' + (err.index + 1) + '个议题【' + state.meetingSubjects[index].subjectName + '】 ' + err.errMsg);
            return;
        }
        return new Promise((resolve, reject) => {
            confirm('确定提交吗？', () => {
                // 表决意见弃权 - 打分项清零 
                memberVotes.forEach(element => {
                    if(element.voteOpinionDict == 4){
                        var scoreResultJson = element.scoreResultJson;
                        if(scoreResultJson){
                            for (const key in scoreResultJson) {
                                if (scoreResultJson.hasOwnProperty(key)) {
                                    scoreResultJson[key] = 0;
                                }
                            }
                        }
                    }
                });
                var _memVotes = JSON.parse(JSON.stringify(memberVotes));
                
                handleScoreResultJson2String(_memVotes);
                
                voteResultSubmit(state.meeting.id, _memVotes, params.signature).then(response => {
                    //commit(SET_TAB_INDEX, index + 1);
                    alert('投票成功');
                    commit(UPDATE_MY_VOTE_DETAIL_MAP, memberVotes)
                    memberVotes.forEach(element => {
                        commit('UPDATE_MEMBER_SUBJECT_VOTES', element);
                    });
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        });
    },
    [PUBLISH_VOTE_RESULT]({ commit }, index) {
        if(!state.manage || state.isEnd){
            return;
        } 
        return new Promise((resolve, reject) => {
            
            var subjectsVoteDetail = JSON.parse(JSON.stringify(state.voteInfo.subjectsVoteDetail));
            var curVoteDetail = {};
            
            for(var key in subjectsVoteDetail) {
                if (state.voteInfo.voteSubjectIds.indexOf(key) != -1) {
                    curVoteDetail[key] = subjectsVoteDetail[key];
                }
            }
            publishVoteResult(state.meeting.id, index, curVoteDetail, state.voteInfo.passSubjectCount).then(response => {
                //commit(SET_TAB_INDEX, index + 1);
                alert('公布结果成功');
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [UPDATE_SUBJECT_VOTE_PASS]({ commit }, param) {
        
        // if(state.meetingSubjects[state.meetingSubjects.indexOf(param.subjectId, 'id')].resultPass == param.passType){
        //     return;
        // }
        var msg = "确定将审议结果为【" + param.passName + "】吗？"
        confirm(msg, function(){
            return new Promise((resolve, reject) => {
                updateSubjectResultPass(state.meeting.id, param.subjectId, param.passType, param.review).then(response => {
                    //alert(response.msg);
                    // state.voteInfo.subjectsVoteDetail[param.subjectId].pass = param.passType;
                    // Vue.set(state.voteInfo, 'subjectsVoteDetail', state.voteInfo.subjectsVoteDetail);
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        });
    },
    [END_MEETING]({ commit }, index) {
        // if(!state.manage || state.isEnd){
        //     return;
        // } 
        return new Promise((resolve, reject) => {
            endMeeting(state.meeting.id, index).then(response => {
                //commit(SET_TAB_INDEX, index + 1);
                alert("会议结束操作成功");
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
}

// mutations
const mutations = {
    [SET_TAB_INDEX](state, index) {
        
        if(!state.isEnd){
            if(!state.manage && state.tabStatus[index] == 1 && !(index >= state.subTabIndex && this.getters['meeting/inSelectSubjects'].length + state.subTabIndex > index)){
                state.firstClickTab = false;
                return;
            }
            // // // 在有投票议题的情况下
            // if(!state.manage && !state.firstClickTab && this.getters['meeting/curVoteSubjects'].length == 0 && this.getters['meeting/inSelectSubjects'].length + 3 == index){
            //     state.firstClickTab = false;
            //     return;
            // }
        }
        
        var tabIndex = -1;
        if(index < state.subTabIndex || state.subTabIndex == -1){
            tabIndex = index;
        } else if(index >= state.subTabIndex && this.getters['meeting/inSelectSubjects'].length + state.subTabIndex > index){
            state.subjectSelectedIndex = index - state.subTabIndex;
            tabIndex = state.subTabIndex;
        } else {
            tabIndex = index - this.getters['meeting/inSelectSubjects'].length + 1;
        }
       
        if (!state.manage && state.meetingSessions[tabIndex] && state.meetingSessions[tabIndex].viewShowTypeDict == 'manage') {
            var copyTabIndex = tabIndex;
            for(var i = tabIndex - 1; i >= 0; i--) {
                if (state.meetingSessions[tabIndex].viewShowTypeDict != 'manage') {
                    tabIndex = i;
                }
            }
            if (copyTabIndex == tabIndex) {
                return;
            }
        }
        state.tabIndex = tabIndex;
        state.firstClickTab = false;
    },
    [SET_CUR_MANAGE_TAB_INDEX](state, index) {
        if(!state.isEnd){
            if(!state.manage && state.tabStatus[index] == 1 && !(index >= state.subTabIndex && this.getters['meeting/inSelectSubjects'].length + state.subTabIndex > index)){
                return;
            }
            // 在有投票议题的情况下
            // if(!state.manage && !state.firstClickTab && this.getters['meeting/curVoteSubjects'].length == 0 && this.getters['meeting/inSelectSubjects'].length + 4 == index){
            //     return;
            // }
        }
        state.curManageTabIndex = index;
    },
    [UPDATE_MEETING_INIT_DATA](state, data) {

        state.subjectSelectedIndex = 0;

        state['meeting'] = data.meeting || {};
        state['user'] = data['user'] || {};
        state['manage'] = state['meeting'].createBy == data.user.userId;
        state['members'] = data.members || [];
        state['userMap'] = data.userMap || {};
        state.userOfficeMap = data.userOfficeMap || {};
        state['officeNameMap'] = data.officeNameMap || {};
        state['meetingDicts'] = data.meetingDicts || [];
        state['meetingSubjects'] = data.meetingSubjects || [];
        state.meetingSessions = data.meetingSessions;
        state.subTabIndex = state.meetingSessions.indexOf('MeetingSubjectTab', 'viewTypeDict');
        var msd = state['meeting'].meetingStatusDict;
        state['signStatus'] = data.canSign || 1;
        if(state['signStatus'] >= 2){
            var index = state['members'].indexOf(state['user'].userId, 'userId');
            if(index != -1 && state['members'][index].signInStatus == 'y'){
                state['signStatus'] = 4;
            }
        }
        var tabStatus = data.tabStatus;
        if (!state['manage']) {
            for(var i = state.subTabIndex, len = this.getters['meeting/inSelectSubjects'].length + state.subTabIndex; i < len; i++){
                if (tabStatus[i] == 1) {
                    tabStatus[i] = 2;
                }
            }
            
            var subjectLen = this.getters['meeting/inSelectSubjects'].length;
            var tabIndex = 0;
            for(var i = 0; i < tabStatus.length; i++) {
                if(i < state.subTabIndex || state.subTabIndex == -1){
                    tabIndex = i;
                } else if(i >= state.subTabIndex && subjectLen + state.subTabIndex > i) {
                    tabIndex = state.subTabIndex;
                } else {
                    tabIndex = i - subjectLen + 1;
                }
                var session = state.meetingSessions[tabIndex];
                if (session && session.beforePublic == 'y' && (tabStatus[i] == 1)) {
                    tabStatus[i] = 2;
                }
            }
            if(state.signStatus != 1 && tabStatus[0] == 1){
                tabStatus[0] = 2;
            }
            // if(data.tabIndex >= 0 && tabStatus[data.tabIndex] == 1){
                //     tabStatus[data.tabIndex] = 2;
                // }
        } else {
            for(var i = 0, len = tabStatus.length; i < len; i++){
                if(tabStatus[i] == 1){
                    tabStatus[i] = 2;
                }
            }
        }
        state.voteInfo.voteStep = data.voteStep || 1;
        if(state.voteInfo.voteStep != 1 && tabStatus[this.getters['meeting/inSelectSubjects'].length + state.subTabIndex] == 1){
            tabStatus[this.getters['meeting/inSelectSubjects'].length + state.subTabIndex] = 2;
        }
        state['tabStatus'] = tabStatus || [];

        state.isEnd = state.meeting.meetingStatusDict == 3;

        // 根据参会人员投票情况计算整体议题的通过（不通过）与 每个议题投票的结果详情
        if (!state.isEnd) {
            state.voteInfo.voteSubjectIds = data.voteSubjectIds ? data.voteSubjectIds.split(",") : [];
            state.voteInfo.curVoteSubjectIds =  state.voteInfo.voteSubjectIds;
        }
        var meetingSubjects = state['meetingSubjects'].filter(sub => {
            return (state.voteInfo.curVoteSubjectIds.indexOf(sub.id) != -1 || state.isEnd);
        });
        var result = calVoteResult(data.subjectsVoteDetailMap, state['meetingSubjects'], state.meeting.votingPassRate, state.members);
        state.voteInfo.subjectsVoteDetail = result.subjectsVoteDetail;
        state.voteInfo.passSubjectCount = calPassInfo(state.voteInfo.subjectsVoteDetail, meetingSubjects);//result.passSubjectCount;
        state.voteInfo.voteRateInfo = result.voteRateInfo;
        state.voteInfo.userVoteResultsMap = data.userVoteResultsMap || {};
        state.voteInfo.myVoteDetailMap = data.myVoteDetailMap || {};
        
        Vue.set(state, 'signInfo', calSignInfo(state.members));

       
        if(state.isEnd){
            var index = state.members.indexOf(state.user.userId, 'userId');
            state.signStatus = state.manage ? 3 : (state.members[index].signInStatus == 'y' ? 4 : 1)
        }
        
        state.tabIndex = state.isEnd ? 0 : (data.tabIndex >= 0 && state['tabStatus'][data.tabIndex] != 1)  ? data.tabIndex  : (state['manage'] ? 0 : state.subTabIndex);
        state.curManageTabIndex = state.tabIndex;

        if(state.manage){
            state.voteInfo.voteSubjectIds = data.voteSubjectIds ? data.voteSubjectIds.split(",") : [];
        } else {
            if(!state.isEnd){
                state.voteInfo.voteSubjectIds = data.voteSubjectIds ? data.voteSubjectIds.split(',') : [];
                state.memberSubjectVotes = data.memberSubjectVotes || [];
                state.voteInfo.userFilterVotes = data.userFilterVotes || [];
            }
        }
        state.voteInfo.filteringVoteMap = data.filteringVoteMap || {};

        var submitUserCount = 0;
        for (var userId in state.voteInfo.filteringVoteMap) {
            submitUserCount++;
        }
        var rate = Math.round(submitUserCount / (state.members.filter(member => member.memberVoteFlag == 'y')).length * 100);
        Vue.set(state.voteInfo, 'filterVoteRate', rate);

        state.voteInfo.publishFilteringVoteFlag = data.publishFilteringVoteFlag || false;

        state.disabledSubjectIds = data.disabledSubjectIds || [];

        // 如果是审定会-一票否决人 为主任委员
        // if(state.meeting.meetingTypeDict == 2){
        //     state.meeting.oneVoteVetoUserId = state.meeting.chairmanUserId;
        // }
    },
    [UPDATE_SIGN_INFO](state, data) {
        
        if(data.type){
            // 签到状态信息
            if(data.type == 'start_sign'){
                // 非管理员端可以开始签到
                state['signStatus'] = 2;
                // TODO 签到率为100% 自动结束签到
            } else if(data.type == 'end_sign'){
                // 签到结束 禁止签到
                state['signStatus'] = state.manage ? 3 : 4;
            }
        } else {
            // 参会人员的签到信息
            var members = state['members'];
            if (data instanceof Array) {
                data.forEach(item => {
                    var memberId = item.memberId + "";
                    var index = members.indexOf(memberId, 'userId');
                    if(index == -1){
                        console.log('未找到');
                        return;
                    }
                    if(memberId == state.user.userId){
                        state.signStatus = 4;
                    }
                    var member = members[index];
                    member['signInTime'] = Number(item.signInTime);
                    member['signInStatus'] = 'y';
                    Vue.set(state.members, index, member);
                });
            } else {
                var memberId = data.memberId + "";
                var index = members.indexOf(memberId, 'userId');
                if(index == -1){
                    console.log('未找到');
                    return;
                }
                if(memberId == state.user.userId){
                    state.signStatus = 4;
                }
                var member = members[index];
                member['signInTime'] = Number(data.signInTime);
                member['signInStatus'] = 'y';
                Vue.set(state.members, index, member);
            }
            // TODO 管理员端 判定 签到率 100% 自动结束签到功能
        }
        Vue.set(state, 'signInfo', calSignInfo(state.members));
    },
    [UPDATE_MEMBER_SIGN_STATUS](state, status){
        state.signStatus = status;
    },
    [UPDATE_TAB_STATUS](state, data) {
        //state['tabStatus'];
        Vue.set(state.tabStatus, data.index, data.status);
    },
    [UPDATE_MEETINGINFO](state, data){
        Vue.set(state.meeting, data.templateField, data.fieldValue);
    },
    [UPDATE_MEMBER_VOTE_FLAG](state, userId) {
        if(!state.manage || state.voteInfo.voteStep != 1){
            return;
        }
        var members = state['members'];
        var index = members.indexOf(userId, 'userId');
        if(index != -1){
            var voteMember = members[index];
            voteMember.memberVoteFlag = voteMember.memberVoteFlag == 'y' ? 'n' : 'y';
            Vue.set(state.members, index, voteMember);
        }
    },
    [UPDATE_VOTE_SUBJECTIDS](state, subId){
        var voteSubjectIds = state.voteInfo.voteSubjectIds;
        var curVoteSubjectIds = [];
        if(subId instanceof Array) {
            voteSubjectIds = [];
            var subIds = subId;
            subIds.forEach(subId => {
                if(!state.voteInfo.myVoteDetailMap[subId]){
                    voteSubjectIds.push(subId);
                }
            });
            curVoteSubjectIds = subId;
            if (voteSubjectIds.length == 0) {
                voteSubjectIds = JSON.parse(JSON.stringify(curVoteSubjectIds));
            }
        } else {
            if(!subId){
                var canVoteSubjects = state.meetingSubjects.filter(ms => ms.subjectVoteFlag == 'y');
                voteSubjectIds = voteSubjectIds.length != canVoteSubjects.length ? canVoteSubjects.map(sub => {
                    return sub.id;
                }): [];
            } else {
                var index = voteSubjectIds.indexOf(subId);
                if(index == -1){
                    voteSubjectIds.push(subId);
                } else {
                    voteSubjectIds.splice(index, 1);
                }
            }
        }
        Vue.set(state.voteInfo, 'voteSubjectIds', voteSubjectIds);
        Vue.set(state.voteInfo, 'curVoteSubjectIds', curVoteSubjectIds);
        
        var meetingSubjects = state['meetingSubjects'].filter(sub => {
            return (state.voteInfo.curVoteSubjectIds.indexOf(sub.id) != -1 || state.isEnd);
        });
        var result = calVoteResult(state.voteInfo.subjectsVoteDetail, state['meetingSubjects'], state.meeting.votingPassRate, state.members);
        Vue.set(state.voteInfo, 'subjectsVoteDetail', result.subjectsVoteDetail);
        Vue.set(state.voteInfo, 'voteRateInfo', result.voteRateInfo);
        //state.voteInfo.passSubjectCount = result.passSubjectCount;
        //calPassInfo(state.voteInfo.subjectsVoteDetail, meetingSubjects);
        Vue.set(state.voteInfo, 'passSubjectCount',  calPassInfo(result.subjectsVoteDetail, meetingSubjects));//result.passSubjectCount);
        
        if (!state.manage) {
            Vue.set(state.voteInfo, 'voteStep', 3);
        }
    },
    [SET_CUR_VOTE_SUBJECT_TAB_INDEX](state, cvsIndex) {
        Vue.set(state.voteInfo, 'curVoteSubjectTabIndex', cvsIndex);
    },
    [UPDATE_MEMBERS_VOTERIGHT](state, voteRightMap) {
        //Vue.set(state.voteInfo, 'curVoteSubjectTabIndex', cvsIndex);
        
        console.log(voteRightMap);
        if (voteRightMap) {
            for (const key in voteRightMap) {
                if (voteRightMap.hasOwnProperty(key)) {
                    const voteFlag = voteRightMap[key];
                    var index = state.members.indexOf(key + "", 'userId');
                    if (index != -1) {
                        var member = state.members[index];
                        member.memberVoteFlag = voteFlag || 'n';
                        Vue.set(state.members, index, member);
                    }
                }
            }
        }
        // state.members.map(ele => {
        //     ele.memberVoteFlag = voteRightMap[ele.userId + ''] || 'n';
        //     return ele;
        // });    
    },
    [NEXT_VOTE_STEP](state, increment) {
        if(state.voteInfo.voteStep == 4){
            return;
        }
        if(!increment){
            Vue.set(state.voteInfo, 'voteStep', ++state.voteInfo.voteStep);
        } else {
            Vue.set(state.voteInfo, 'voteStep', state.voteInfo.voteStep + increment);
        }
       
    },
    [UPDATE_VOTEINFO](state, data) {
        
        if (data.fromMsg) {
            // 非管理员 非一票否决人
            if (!state.manage) {
                let subjectVoteDetail = data.subjectVoteDetail;
                for (let subjectId in subjectVoteDetail) {
                    let index = state.meetingSubjects.indexOf(subjectId, 'id');
                    if (index != -1) {
                        let subject = state.meetingSubjects[index];
                        if (!subject.resultReview) {
                            subject.resultReview = subjectVoteDetail[subjectId].pass || '';
                            Vue.set(state.meetingSubjects, index, subject);
                        }
                    }
                }
                Vue.set(state.voteInfo, 'subjectsVoteDetail', data.subjectVoteDetail);
                Vue.set(state.voteInfo, 'passSubjectCount', data.passSubjectCount);
                // state.voteInfo.passSubjectCount = [];
                // state.voteInfo.passSubjectCount.push(data.passSubjectCount[0]);
                // state.voteInfo.passSubjectCount.push(data.passSubjectCount[1]);
                // (state.user.userId != state.meeting.oneVoteVetoUserId
                return false;
            }
        }
        var voteUser = data.voteUser;
        if (!voteUser) {
            return;
        }
        
        var voteInfo = state.voteInfo;
        var userVoteResults = voteInfo.userVoteResultsMap[voteUser];
        if (!userVoteResults) {
            userVoteResults = [];
        }
        data.voteResults.forEach(element => {
            if (userVoteResults.indexOf(element.subjectId, 'subjectId') == -1) {
                userVoteResults.push(element);
            }
        });
        
        voteInfo.userVoteResultsMap[voteUser] = userVoteResults;

        
        Vue.set(state.voteInfo, 'userVoteResultsMap', voteInfo.userVoteResultsMap);
        state.voteInfo.subjectsVoteDetail = updateSubjectsVoteDetailMap(voteInfo.userVoteResultsMap);
        if (state.manage) {
            var meetingSubjects = state['meetingSubjects'].filter(sub => {
                return (state.voteInfo.curVoteSubjectIds.indexOf(sub.id) != -1 || state.isEnd);
            });
            var result = calVoteResult(state.voteInfo.subjectsVoteDetail, state['meetingSubjects'], state.meeting.votingPassRate, state.members);
            Vue.set(state.voteInfo, 'subjectsVoteDetail', result.subjectsVoteDetail);
            Vue.set(state.voteInfo, 'voteRateInfo', result.voteRateInfo);
            //state.voteInfo.passSubjectCount = result.passSubjectCount;
            //calPassInfo(state.voteInfo.subjectsVoteDetail, meetingSubjects);
            Vue.set(state.voteInfo, 'passSubjectCount',  calPassInfo(result.subjectsVoteDetail, meetingSubjects));//result.passSubjectCount);
        } else {
            var voteRateInfo = calVoteRateInfo(state.voteInfo.subjectsVoteDetail, state['meetingSubjects'], state.members.filter(member => member.memberVoteFlag == 'y').length);
            Vue.set(state.voteInfo, 'voteRateInfo', voteRateInfo);
        }
    },
    [UPDATE_MY_VOTE_DETAIL_MAP](state, memberVotes){
        memberVotes.forEach(ele => {
            if(!state.voteInfo.myVoteDetailMap[ele.subjectId]){
                state.voteInfo.myVoteDetailMap[ele.subjectId] = {
                    subjectId: ele.subjectId
                };
                Vue.set(state.voteInfo.myVoteDetailMap, ele.subjectId, {
                    subjectId: ele.subjectId
                });
            }
        });
        Vue.set(state.voteInfo, 'myVoteDetailMap', state.voteInfo.myVoteDetailMap);
        state.subjectVoteRefresh = !state.subjectVoteRefresh;
    },
    [UPDATE_SHOW](state, data) {
        state.show = data.show;
        if (data.atta) {
            var atta = data.atta;
            var filePath = "";
            var index = atta.attachmentSavePath.lastIndexOf('.');
            var fileName = [atta.attachmentSavePath.substring(0, index)];
            fileName.push(atta.attachmentSavePath.substring(index + 1, atta.attachmentSavePath.length));
            var suff = ".pdf"
            if(fileName[1] == "xlsx" || fileName[1] == "xls"){
                var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if(isiOS){
                    filePath = "/api/file/pub/" + atta.attachmentSavePath;
                } else {
                    filePath = "/api/file/pub/" + fileName[0] + ".html";
                }
            } else {
                //filePath = "../../../pub/upload/" + atta.attachmentSavePath;
                filePath = "/js/pdfjs/web/viewer.html?file=/api/file/pub/" + fileName[0] + ".pdf";
            }
            state.curFileUrl = filePath;
        } else if(data.url) {
            state.curFileUrl =  "/js/pdfjs/web/viewer.html?file=" + data.fileUrl;
        }
    },
    [UPDATE_SUBJECTS](state, data){
        let review = data.review;
        state.meetingSubjects.forEach((subject, i) => {
            if(subject.id == data.subjectId){
                let pass = subject.resultPass;
                if (review == true) {
                    subject.resultReview = data.resultPass;
                } else {
                    subject.resultPass = data.resultPass;
                }
               
                Vue.set(state.meetingSubjects, i, subject);
                // var result = calVoteResult(state.voteInfo.subjectsVoteDetail, state['meetingSubjects']);
                // state.voteInfo.subjectsVoteDetail = result.subjectsVoteDetail;
                if(!review && data.resultPass == 4) {
                    state.voteInfo.passSubjectCount[0] =  state.voteInfo.passSubjectCount[0] - 1;
                    state.voteInfo.passSubjectCount[1] =  state.voteInfo.passSubjectCount[1] + 1;
                    Vue.set(state.voteInfo, 'passSubjectCount', state.voteInfo.passSubjectCount);
                }

                if(!review && pass == 4 && data.resultPass == 1) {
                    state.voteInfo.passSubjectCount[0] =  state.voteInfo.passSubjectCount[0] + 1;
                    state.voteInfo.passSubjectCount[1] =  state.voteInfo.passSubjectCount[1] - 1;
                    Vue.set(state.voteInfo, 'passSubjectCount', state.voteInfo.passSubjectCount);
                }

                if (review) {
                    var meetingSubjects = state['meetingSubjects'].filter(sub => {
                        return (state.voteInfo.curVoteSubjectIds.indexOf(sub.id) != -1 || state.isEnd);
                    });

                    Vue.set(state.voteInfo, 'passSubjectCount',  calPassInfo(state.voteInfo.subjectsVoteDetail, meetingSubjects));
                }
                //state.voteInfo.voteRateInfo = result.voteRateInfo;
                return;
            }
        });
    },
    [UPDATE_MINUTE](state, minute){
        state.minute = minute;
    },
    [UPDATE_COUNTDOWN_SHOW](state, countdownShow) {
        state.countdownShow = countdownShow;
    },
    [UPDATE_SUBJECT_VOTEMEMBERCOUNT](state, data) {
        if(data){
            for(var subjectId in data) {
                var index = state.meetingSubjects.indexOf(subjectId, 'id');
                if(index != -1) {
                    var subject = state.meetingSubjects[index];
                    subject.voteMemberCount = data[subjectId] || 0;
                    Vue.set(state.meetingSubjects, index, subject);
                }
            }
        }
    },
    [UPDATE_MEMBER_SUBJECT_VOTES](state, subjectVoteParam) {
        var subjectVote = JSON.parse(JSON.stringify(subjectVoteParam));
        if (subjectVote instanceof Array) {
            state.memberSubjectVotes = subjectVote;
            Vue.set(state.memberSubjectVotes, 0, subjectVote[0]);
        } else if(subjectVote){
            var index = state.memberSubjectVotes.indexOf(subjectVote.subjectId, 'subjectId');
            if (index == -1) {
                state.memberSubjectVotes.push(subjectVote);
            } else {
                Vue.set(state.memberSubjectVotes, index, subjectVote);
            }
        }
       
        if (state.votingDraftDestory == 1) {
            // state.votingDraftDestory = 2;
        } else if(state.votingDraftDestory == 2) {
            state.votingDraftRefresh = !state.votingDraftRefresh;
        }
    },
    [UPDATE_FILTERING_VOTE_MAP](state, msg) { 
        if (msg.userId) {
            var userFilterVoteMsg = msg;
            Vue.set(state.voteInfo.filteringVoteMap, userFilterVoteMsg.userId, userFilterVoteMsg.filteringVotes);
        } else {
            Vue.set(state.voteInfo, 'filteringVoteMap', msg.filteringVoteResult);
            state.disabledSubjectIds = [];
            Object.assign(state.disabledSubjectIds, msg.disabledSubjectIds);
            Vue.set(state.voteInfo, 'publishFilteringVoteFlag', true);
        }

        var submitUserCount = 0;
        for (var userId in state.voteInfo.filteringVoteMap) {
            submitUserCount++;
        }
        var rate = Math.round(submitUserCount / (state.members.filter(member => member.memberVoteFlag == 'y')).length * 100);
        Vue.set(state.voteInfo, 'filterVoteRate', rate);
    },
    [UPDATE_VOTING_DRAFT_DESTORY](state, flag) { 
        state.votingDraftDestory = flag;
    },
    [ADD_PRINCIPAL](state, data) {
        
        var userId = data.userId;
        var principal = data.principal;
        var index = state.members.indexOf(userId, 'userId');
        if (index != -1) {
            var member = state.members[index];
            member.principal = principal.userId;
            state.members.remove(principal.userId, 'userId');
            principal.meetingMemberTypeDict = "100";
            state.members.push(principal);
        }
        Object.assign(state.userMap, data.userMap || {});
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}