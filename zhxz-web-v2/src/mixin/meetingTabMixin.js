import { getTabIndex, getMeeting, getManage, getCurTabStatus, getMeetingMemberTypeDicts, getMembers, getSubjectSelectedIndex, getUserMap, getOfficeNameMap, getDicts } from '@/utils/meetingUtils'
import { mapGetters } from 'vuex';

export default {
    filters: {
        replaceMeetingName: function (value, meeting) {
            if (value) {
                return value.replace(/#会议名称#/, meeting.meetingName);
            }
            return '';
        }
    },
    props: {
        meetingId: {
            type: String,
            default: ''
        },
        comIndex: {
            type: [Number, String],
            default: 0
        }
    },
    computed: {
        ...mapGetters({
            inSelectSubjects: 'meeting/inSelectSubjects',
            noStartStatus: 'meeting/noStartStatus',
            userCanVote: 'meeting/userCanVote',
            role: 'meeting/role',
            canVoteSubjects: 'meeting/canVoteSubjects',
        }),
        isEnd: function() {
            return this.$store.state.meeting.isEnd;
        },
        tabIndex: function() {
            return getTabIndex(this);
        },
        meeting: function() {
            return getMeeting(this);
        },
        manage: function() {
            return getManage(this);
        },
        curTabStatus: function() {
            var index = this.comIndex;
            if (this.subTabIndex <= this.comIndex) {
                index = this.comIndex + this.inSelectSubjects.length - 1;
            }
            return getCurTabStatus(this, index);
        },
        user: function() {
            return this.$store.state.user.user;
        },
        userMap: function() {
            return getUserMap(this);
        },
        officeNameMap: function() {
            return getOfficeNameMap(this);
        },
        userOfficeMap: function() {
            return this.$store.state.meeting.userOfficeMap;
        },
        meetingSessions() {
            return this.$store.state.meeting.meetingSessions || [];
        },
        subTabIndex() {
            return this.$store.state.meeting.subTabIndex;
        },
        tabStatus: function() {
            return this.$store.state.meeting.tabStatus || [];
        },
        meetingMemberTypeMap: function() {
            return getMeetingMemberTypeDicts(this).array2Obj('value', 'label');
        },
        members: function() {
            return getMembers(this);
        },
        member: function() {
            return this.members[this.members.indexOf(this.user.userId, 'userId')];
        },
        voteOptionMap: function() {
            return getDicts(this, 3).array2Obj('value', 'label');
        },
        ratingItemMap: function() {
            return getDicts(this, 2).array2Obj('value', 'label');
        },
        subjectSelectedIndex: function() {
            return getSubjectSelectedIndex(this);
        },
        subjectVoteRefresh: function() {
            return this.$store.state.meeting.subjectVoteRefresh;
        },
        myVoteDetailMap: function() {
            return this.$store.state.meeting.voteInfo.myVoteDetailMap || {};
        },
        voteSubjectIds: function() {
            return  this.$store.state.meeting.voteInfo.voteSubjectIds || [];
        },
        disabledSubjectIds: function () {
            return this.$store.state.meeting.disabledSubjectIds || [];
        },
        voteStep: function() {
            return this.$store.state.meeting.voteInfo.voteStep || 1;
        },
        meetingSubjects() {
            return this.$store.state.meeting.meetingSubjects;
        }
    },
    methods: {
        getSubjectIndex(subjectId) {
            let index = this.meetingSubjects.indexOf(subjectId, 'id');
            return index == -1 ? '' : (index + 1);
        }
    }
}