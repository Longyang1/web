export function get(obj, property, defaultValue) {
    var meetingMap = obj.$store.state.meeting;
    return meetingMap ? meetingMap[property] : defaultValue;
}
export function getTabIndex(obj) {
    return get(obj, 'tabIndex', 0);
}
export function getMeeting(obj) {
    return get(obj, 'meeting', {});
}
export function getMembers(obj){
    return get(obj, 'members', []);
}
export function getUserMap(obj){
    return get(obj, 'userMap', {});
}
export function getDicts(obj, index){
    var dicts = get(obj, 'meetingDicts', []);
    return dicts.length > index ? dicts[index] : [];
}
export function getMeetingMemberTypeDicts(obj){
    var dicts = get(obj, 'meetingDicts', []);
    return dicts.length > 4 ? dicts[4] : [];
}
export function getOfficeNameMap(obj){
    return get(obj, 'officeNameMap', {});
}
export function getManage(obj) {
    return get(obj, 'manage', false);
}
export function handleResult(res, func){
    if(res.status == 200){
        func();
    } else {
        alert(res.msg);
    }
}

export function calSignInfo(members){
    
    var _membes = JSON.parse(JSON.stringify(members));
    _membes = _membes.filter(member => ("7" != member.meetingMemberTypeDict && "8" != member.meetingMemberTypeDict && "100" != member.meetingMemberTypeDict));
    var signedMembers = members.filter(member => ("7" != member.meetingMemberTypeDict && "8" != member.meetingMemberTypeDict && member.signInStatus == 'y'));
    return {
        'signRate': Math.round(signedMembers.length / _membes.length * 100),
        'signNum': signedMembers.length,
        'notSignNum': (_membes.length - signedMembers.length)
    };
}

export function getCurTabStatus(obj, tabIndex){
    return get(obj, 'tabStatus', [])[tabIndex];
}

export function getMeetingSubjects(obj){
    return get(obj, 'meetingSubjects', []);
}

export function getSubjectSelectedIndex(obj){
    return get(obj, 'subjectSelectedIndex', 1);
}
/**
 * 根据参会人员投票情况计算整体议题的通过（不通过）与 每个议题投票的结果详情
 * return {subjectsVoteDetail,passSubjectCount}
 */
export function calVoteResult(subjectVoteDetailMap, subjects, votingPassRate, meetingMembers) {
    console.log(subjectVoteDetailMap)
    console.log(meetingMembers)
    return calVoteResultRole2(subjectVoteDetailMap, subjects, votingPassRate, meetingMembers);
}

function calVoteResultRole2(subjectVoteDetailMap, subjects, votingPassRate, meetingMembers, reviewInfo) {

    let passSubjectCount = [0, 0, 0, 0, 0, 0, 0];
    // var passCount = 0, notPassCount = 0;
    let voteRateInfo = {};

    // 投票表决结果
    let zrMembers = meetingMembers.filter(mm => {
        // 主任委员
        return mm.meetingMemberTypeDict == '5';
    });
    let fzrMembers = meetingMembers.filter(mm => {
        // 副主任委员
        return mm.meetingMemberTypeDict == '6';
    });
    // 主任 副主任委员
    let zfMembers = zrMembers.concat(fzrMembers);
    console.log(zfMembers);
    console.log(subjects);
    for (let i = 0; i < subjects.length; i++) {
        let subject = subjects[i];
        let subjectVoteDetail = subjectVoteDetailMap[subject.id];
        if (subjectVoteDetail) {
            console.log(subject.subjectName);
            console.log(subjectVoteDetail);
            // 投票率
            let curVoteCount = getCurVoteCount(subjectVoteDetail, 10);
            let voteRate = curVoteCount / subject.voteMemberCount;
            voteRateInfo[subject.id] = Math.round(voteRate * 100);
           
            // 1. 通过
            // 1.1 主任、副主任必须投 同意票
            let zfAllVotedPass = checkMembersVoted(zfMembers, subjectVoteDetail, [1]);
            console.log(zfAllVotedPass)
            if (zfAllVotedPass) {
                // 1.2 所有参与表决委员（包括主任委员和副主任委员）的2/3及以上投“同意”票
                let votedPassMemberCount = subjectVoteDetail[1] || 0;
                let minVotedPassMemberCount = Math.ceil(subject.voteMemberCount * (2 / 3));
                if (votedPassMemberCount >= minVotedPassMemberCount) {
                    // 则 表决结果为 通过
                    let result = 1;
                    subjectVoteDetail['pass'] = result;
                    subjectVoteDetail['review'] = result;
                    if (subject.resultReview) {
                        result = subject.resultReview;
                    }
                    passSubjectCount[result]++;
                    console.log(subject.subjectName + "：" + '通过')
                    continue;
                }
            }

            // 2 有条件通过
            // 2.1 主任、副主任必须投 同意或者有条件通过票
            let zfAllVotedPassOrConditionPass = checkMembersVoted(zfMembers, subjectVoteDetail, [1, 2]);
            console.log(zfAllVotedPassOrConditionPass);
            if (zfAllVotedPassOrConditionPass) {
                // 2.2 所有参与表决委员（包括主任委员和副主任委员）的2/3及以上投“同意”票或者“有条件同意”票
                let votedPassOrConditionPassMemberCount = (subjectVoteDetail[1] || 0) + (subjectVoteDetail[2] || 0);
                let minVotedPassOrConditionPassMemberCount = Math.ceil(subject.voteMemberCount * (2 / 3));
                if (votedPassOrConditionPassMemberCount >= minVotedPassOrConditionPassMemberCount) {
                    // 则 表决结果为 有条件通过
                    let result = 3;
                    subjectVoteDetail['pass'] = result;
                    subjectVoteDetail['review'] = result;
                    if (subject.resultReview) {
                        result = subject.resultReview;
                    }
                    passSubjectCount[result]++;
                    console.log(subject.subjectName + "：" + '有条件通过')
                    continue;
                }
            }

            // 3 否决
            // 3.1 主任委员投“不同意”票
            let zrAllVotedNotPass = checkMembersVoted(zrMembers, subjectVoteDetail, [3]);
            console.log(zrAllVotedNotPass);
            let passResultFj = true;
            
            if (!zrAllVotedNotPass) {
                // 3.2 至少一名副主任委员投“不同意”票
                let fzrVotedNotPass = checkMembersVoted(fzrMembers, subjectVoteDetail, [3], 1);
                if (!fzrVotedNotPass) {
                    // 3.3 所有参与表决委员（包括主任委员和副主任委员）的1/3以上（不含1/3）投“不同意”票
                    let votedNotPassMemberCount = subjectVoteDetail[3] || 0;
                    let minVotedNotPassMemberCount = Math.ceil(subject.voteMemberCount * (1 / 3));
                    if (votedNotPassMemberCount <= minVotedNotPassMemberCount) {
                        passResultFj = false;
                    }
                }
            }

            if (passResultFj) {
                // 则 表决结果为 否决
                let result = 4;
                subjectVoteDetail['pass'] = result;
                subjectVoteDetail['review'] = result;
                if (subject.resultReview) {
                    result = subject.resultReview;
                }
                passSubjectCount[result]++;
                console.log(subject.subjectName + "：" + '不通过')
                continue;
            }

            // 4 续议
            let result = 5;
            subjectVoteDetail['pass'] = result;
            subjectVoteDetail['review'] = result;
            if (subject.resultReview) {
                result = subject.resultReview;
            }
            passSubjectCount[result]++;
            console.log(subject.subjectName + "：" + '续议')
        } else {
            voteRateInfo[subject.id] = 0;
        }
    }

    return {
        subjectsVoteDetail: subjectVoteDetailMap,
        passSubjectCount,
        voteRateInfo
    }
}

function checkMembersVoted(votedMembers, subjectVoteDetail, voteOpinions, minVotedMemberCount) {
    if (!votedMembers || votedMembers.length <= 0) {
        return false;
    }
    // 投 票 人员ID集合
    let count = 0;
    voteOpinions.forEach(voteOpinion => {
        let votedMemberIds = subjectVoteDetail['member_' + voteOpinion] || [];
        count += votedMemberIds.filter(memberId => {
            return votedMembers.indexOf(memberId, 'userId') != -1;
        }).length;
    });
    return count >= (minVotedMemberCount || votedMembers.length);
}

function calVoteResultRole1(subjectVoteDetailMap, subjects, votingPassRate) {
    var passSubjectCount = [0, 0, 0];
    // var passCount = 0, notPassCount = 0;
    var voteRateInfo = {};
    votingPassRate = votingPassRate ? Number(votingPassRate) : 0.75;
    subjects.forEach(element => {
        
        var subjectVoteDetail = subjectVoteDetailMap[element.id];
        if(subjectVoteDetail){
            // console.log((subjectVoteDetail['1'] ? subjectVoteDetail['1'] : 0) + (subjectVoteDetail['2'] ? subjectVoteDetail['2'] : 0) + (subjectVoteDetail['3'] ? subjectVoteDetail['3'] : 0) + (subjectVoteDetail['4'] ? subjectVoteDetail['4'] : 0));
            // console.log( element.voteMemberCount);
            // console.log('---------------');
            // var voteRate = ((subjectVoteDetail['1'] ? subjectVoteDetail['1'] : 0) + (subjectVoteDetail['2'] ? subjectVoteDetail['2'] : 0) + (subjectVoteDetail['3'] ? subjectVoteDetail['3'] : 0) + (subjectVoteDetail['4'] ? subjectVoteDetail['4'] : 0)) / element.voteMemberCount;
            // voteRateInfo[element.id] = Math.round(voteRate * 100);
            var count = getCurVoteCount(subjectVoteDetail, 10);
            var voteRate = count / element.voteMemberCount;
            // var voteRate = ((subjectVoteDetail['1'] ? Number(subjectVoteDetail['1']) : 0) + (subjectVoteDetail['2'] ? Number(subjectVoteDetail['2']) : 0) + (subjectVoteDetail['3'] ? Number(subjectVoteDetail['3']) : 0) + (subjectVoteDetail['4'] ? Number(subjectVoteDetail['4']) : 0)) / element.voteMemberCount;
            console.log('voteRate:' + element.voteMemberCount + " - " + voteRate);
            voteRateInfo[element.id] = Math.round(voteRate * 100);
            if(element.resultPass != 3 && element.resultPass != 4){
                // var passRate = ((subjectVoteDetail['1'] ? subjectVoteDetail['1'] : 0) + (subjectVoteDetail['2'] ? subjectVoteDetail['2'] : 0)) / element.voteMemberCount;
                var passCount = ((subjectVoteDetail['1'] ? Number(subjectVoteDetail['1']) : 0) + (subjectVoteDetail['2'] ? Number(subjectVoteDetail['2']) : 0));
                var continuedDiscussionCount = subjectVoteDetail['5'] ? Number(subjectVoteDetail['5']) : 0;
                var minPassVoteNum = Math.ceil(element.voteMemberCount * votingPassRate);
                subjectVoteDetail['pass'] = passCount >= minPassVoteNum ? 1 : (continuedDiscussionCount >= Math.ceil(element.voteMemberCount * 0.75) ? 5 : 2);
                if(passCount >= minPassVoteNum){
                    passSubjectCount[0]++;
                } else if(continuedDiscussionCount >= Math.ceil(element.voteMemberCount * 0.75)) {
                    passSubjectCount[2]++;
                } else {
                    passSubjectCount[1]++;
                }
            } else {
                subjectVoteDetail['pass'] = element.resultPass;
                if(element.resultPass == 1 || element.resultPass == 3){
                    passSubjectCount[0]++;
                } else {
                    passSubjectCount[1]++;
                }
            }
        } else {
            voteRateInfo[element.id] = 0;
        }
    });
    // passSubjectCount[0] = passCount;
    // passSubjectCount[1] = notPassCount;
    return {
        subjectsVoteDetail: subjectVoteDetailMap,
        passSubjectCount: passSubjectCount,
        voteRateInfo: voteRateInfo
    }
}

function getCurVoteCount(subjectVoteDetail, maxOptionNum) {
    var count = 0;
    for(var i = 1; i <= maxOptionNum; i++) {
        count += subjectVoteDetail[i] ? Number(subjectVoteDetail[i]) : 0;
    }
    return count;
}

export function calVoteRateInfo(subjectVoteDetailMap, subjects, voteMemberCount){
    var voteRateInfo = {};
    
    subjects.forEach(element => {
        
        var subjectVoteDetail = subjectVoteDetailMap[element.id];
        
        if (subjectVoteDetail) {
            var count = getCurVoteCount(subjectVoteDetail, 10);
            var voteRate = count / voteMemberCount;
            console.log('voteRate:' + element.voteMemberCount + " - " + voteRate);
            voteRateInfo[element.id] = Math.round(voteRate * 100);
        } else {
            voteRateInfo[element.id] = 0;
        }
    });
    return voteRateInfo;
}

export function calPassInfo(subjectVoteDetailMap, subjects){
    var passSubjectCount = [0, 0, 0, 0, 0, 0, 0];
    subjects.forEach(element => {
        var subjectVoteDetail = subjectVoteDetailMap[element.id];
        if (subjectVoteDetail && subjectVoteDetail['pass']) {
            let pass = (subjectVoteDetail['pass'] == element.resultReview || !element.resultReview) ? subjectVoteDetail['pass'] : element.resultReview;
            passSubjectCount[pass]++;
        }
    });
    // passSubjectCount[0] = passCount;
    // passSubjectCount[1] = notPassCount;
    return passSubjectCount;
}

export function verifyVoteResultByTotalScore(memberVotes){
    var err = null;
    memberVotes.forEach((element, index) => {
        
        // 1. 议题必须选择表决项
        if(!element.voteOpinionDict){
            err = {
                subjectId: element.subjectId,
                errMsg: '议题表决意见未选(必选项),请先选择再提交',
                index: index
            }
            return;
        }
        // 2. 非同意 必须要填写意见
        if(element.voteOpinionDict != 1 && (!element.remark || element.remark.trim() == "")){
            err = {
                subjectId: element.subjectId,
                errMsg: '表决意见选择非【同意】时,意见为必填项,请您先填写意见,再提交',
                index: index
            }
            return;
        }
        if(element.scoreResultJson){
            var totalScore = calTotalScore(element.scoreResultJson);
            // 3. 当平均分小于等于2分,不能选择同意或者有条件同意
            if((element.voteOpinionDict == 1 || element.voteOpinionDict == 2) && totalScore < 15){
                err = {
                    subjectId: element.subjectId,
                    errMsg: '总分为' + totalScore + '分,当总分小于15分,不能选择同意或者有条件同意,请重新打分或者更改表决意见',
                    index: index
                }
                return;
            }
            // 4. 平均分高于4分,表决意见不能选择反对
            if(element.voteOpinionDict == 3 && totalScore >= 15){
                err = {
                    subjectId: element.subjectId,
                    errMsg: '总分高于15分,表决意见不能选择反对',
                    index: index
                }
                return;
            }
        }
    });
    return err;
}
export function verifyVoteResultByAverageScore(memberVotes){
    var err = null;
    memberVotes.forEach((element, index) => {
        
        // 1. 议题必须选择表决项
        if(!element.voteOpinionDict){
            err = {
                subjectId: element.subjectId,
                errMsg: '议题表决意见未选(必选项),请先选择再提交',
                index: index
            }
            return;
        }
        if(element.scoreResultJson){
            // 2. 有条件同意 必须要填写意见
            if(element.voteOpinionDict == 2 && (!element.remark || element.remark.trim() == "")){
                err = {
                    subjectId: element.subjectId,
                    errMsg: '表决意见选择有条件同意时,意见为必填项,请您先填写意见,再提交',
                    index: index
                }
                return;
            }
            var aveScore = calAverageScore(element.scoreResultJson);
            // 3. 当平均分小于等于2分,不能选择同意或者有条件同意
            if((element.voteOpinionDict == 1 || element.voteOpinionDict == 2) && aveScore <= 2){
                err = {
                    subjectId: element.subjectId,
                    errMsg: '平均分为' + aveScore + '分,当平均分小于等于2分,不能选择同意或者有条件同意,请重新打分或者更改表决意见',
                    index: index
                }
                return;
            }
            // 4. 平均分高于4分,表决意见不能选择反对
            if(element.voteOpinionDict == 3 && aveScore >= 4){
                err = {
                    subjectId: element.subjectId,
                    errMsg: '平均分高于4分,表决意见不能选择反对',
                    index: index
                }
                return;
            }
        }
    });
    return err;
}
function calTotalScore(scoreResultJson){
    if(!scoreResultJson){
        return 0;
    }
    var totalScore = 0;
    for (const key in scoreResultJson) {
        if (scoreResultJson.hasOwnProperty(key)) {
            const score = scoreResultJson[key];
            totalScore += score;
        }
    }
    return totalScore;
}
function calAverageScore(scoreResultJson){
    if(!scoreResultJson){
        return 0;
    }
    var itemCount = 0;
    var totalScore = 0;
    for (const key in scoreResultJson) {
        if (scoreResultJson.hasOwnProperty(key)) {
            const score = scoreResultJson[key];
            itemCount++;
            totalScore += score;
        }
    }
    return totalScore / itemCount;
}

export function handleScoreResultJson2String(_memVotes) {
    _memVotes.forEach(element => {
        if(element.scoreResultJson){
            element.scoreResultJson = JSON.stringify(element.scoreResultJson);
        }
    });
}

export function updateSubjectsVoteDetailMap(userVoteResultsMap){
    var subjectsVoteDetailMap = {};
    for (const voteMemberId in userVoteResultsMap) {
        if (userVoteResultsMap.hasOwnProperty(voteMemberId)) {
            const userVoteResults = userVoteResultsMap[voteMemberId] || [];
            userVoteResults.forEach(ele => {
                var subjectsVoteDetail = subjectsVoteDetailMap[ele.subjectId];
                if(!subjectsVoteDetail){
                    subjectsVoteDetail = {};
                }
                var count = subjectsVoteDetail[ele.voteOpinionDict];
                if(!count){
                    count = 0;
                    subjectsVoteDetail['member_' + ele.voteOpinionDict] = [];
                }
                count++;
                var voteMemberIds = subjectsVoteDetail['member_' + ele.voteOpinionDict];
                voteMemberIds.push(voteMemberId);
                subjectsVoteDetail[ele.voteOpinionDict] = count;
                subjectsVoteDetailMap[ele.subjectId] = subjectsVoteDetail;
            });
        }
    }
    return subjectsVoteDetailMap;
}