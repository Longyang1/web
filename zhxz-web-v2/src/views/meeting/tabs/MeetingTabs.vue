<template>
    <div style="background:black;">
        <marquee v-if="!manage"  scrollamount="3" direction=left style="color:white;font-weight: bold;">{{ user.realName }}<span v-if="member && member.meetingMemberTypeDict != 8">{{ getRoleInfo() }}</span>，您正在参加{{ meeting.meetingName }}！</marquee>
        <marquee v-if="manage" direction=left style="color:white;font-weight: bold;">会议管理员，您正在参加{{ meeting.meetingName }}！</marquee>
        <div class="visible-lg-block light l-light"><i></i></div>
        <div class="visible-md-block light md l-light"><i></i></div>
        <div class="visible-lg-block light r-light"><i></i></div>
        <div class="visible-md-block light md r-light"><i></i></div>
        <div class='line' ref="line">
            <div class="line-center"></div>
        </div>
        <div class="layui-tab" lay-filter="docDemoTabBrief" style="margin: 0;text-align: center!important;"><!-- height:50px -->
            <ul class="layui-tab-title">
                <template v-for="(item, index) in meetingSessions">
                    <li 
                        v-if="canDispaly(item) && item.viewTypeDict != 'MeetingSubjectTab'"
                        :class="tabClass(((subTabIndex) > index || subTabIndex == -1 ) ? index : (index - 1 + inSelectSubjects.length))" 
                        @click="tabClick(((subTabIndex) > index || subTabIndex == -1 ) ? index : (index - 1 + inSelectSubjects.length))"
                        :key="'t_' + index"
                        ref="tab">{{ item.name }}</li>
                    <li 
                        v-if="canDispaly(item) && refresh && item.viewTypeDict == 'MeetingSubjectTab' && inSelectSubjects && inSelectSubjects.length > 0" 
                        class="subject-select"
                        id="subject-select"
                        :key="'t_' + index">
                        <div :class="{'layui-unselect layui-form-select': true, 'layui-form-selected': subjectSelected}">
                            <div class="layui-select-title">
                                <input 
                                    @click="subjectSelectClick" 
                                    type="text" 
                                    placeholder="请选择" 
                                    :value="getIndex(inSelectSubjects[subjectSelectedIndex].id) + '、' + inSelectSubjects[subjectSelectedIndex].subjectName" 
                                    readonly="" 
                                    :class="{'layui-input layui-unselect': true, 'subject-all-end': allEnd, 'subject-this': tabIndex == index}" 
                                    :style="{width: (subTabWidth + 'px')}">
                                <input v-if="false" @click="subjectSelectClick" type="text" placeholder="请选择" :value="getIndex(inSelectSubjects[subjectSelectedIndex].id) + '、' + inSelectSubjects[subjectSelectedIndex].subjectName" readonly="" :class="{'visible-md-block layui-input layui-unselect': true, 'subject-all-end': allEnd, 'subject-this': tabIndex == index}" style="width: 115px;">
                                <i class="layui-edge"></i>
                            </div>
                            <dl class="layui-anim layui-anim-upbit" style="background-color: rgba(37,150,184,0.8) !important;max-width: 410px;">
                                <template v-for="(item,subIndex) in inSelectSubjects">
                                    <dd 
                                        v-if="disabledSubjectIds.indexOf(item.id) == -1" 
                                        @click="subjectSelect(subIndex)" 
                                        :key="item.id" 
                                        :lay-value="item.subjectName" 
                                        :class="{'subject-end': tabStatus[subIndex + index] == 3, 'layui-this': subIndex == subjectSelectedIndex}" :title="item.subjectName">{{ getIndex(item.id) }}.{{ item.subjectName }}</dd>
                                </template>
                            </dl>
                        </div>
                    </li>
                </template>
                <!-- <li :class="tabClass(0)" @click="tabClick(0)">现场签到</li>
                <li :class="tabClass(1)" @click="tabClick(1)">会议开始</li>
                <li :class="tabClass(2)" @click="tabClick(2)">出席会议</li>
                <li v-if="inSelectSubjects && inSelectSubjects.length > 0" id="subject-select" class="subject-select">
                    <div :class="{'layui-unselect layui-form-select': true, 'layui-form-selected': subjectSelected}">
                        <div class="layui-select-title">
                            <input @click="subjectSelectClick" type="text" placeholder="请选择" :value="getIndex(inSelectSubjects[subjectSelectedIndex].id) + '、' + inSelectSubjects[subjectSelectedIndex].subjectName" readonly="" :class="{'visible-lg-block layui-input layui-unselect': true, 'subject-all-end': allEnd, 'subject-this': tabIndex == 3}" style="width: 410px;">
                            <input @click="subjectSelectClick" type="text" placeholder="请选择" :value="getIndex(inSelectSubjects[subjectSelectedIndex].id) + '、' + inSelectSubjects[subjectSelectedIndex].subjectName" readonly="" :class="{'visible-md-block layui-input layui-unselect': true, 'subject-all-end': allEnd, 'subject-this': tabIndex == 3}" style="width: 115px;">
                            <i class="layui-edge"></i>
                        </div>
                        <dl class="layui-anim layui-anim-upbit" style="background-color: rgba(37,150,184,0.8) !important;    max-width: 410px;">
                            <dd v-for="(item,index) in inSelectSubjects" v-if="disabledSubjectIds.indexOf(item.id) == -1" @click="subjectSelect(index)" :key="item.id" :lay-value="item.subjectName" :class="{'subject-end': tabStatus[index + 3] == 3, 'layui-this': index == subjectSelectedIndex}" :title="item.subjectName">{{ getIndex(item.id) }}.{{ item.subjectName }}</dd>
                        </dl>
                    </div>
                </li>
                <li v-if="tabStep == 0 && false" :class="tabClass(inSelectSubjects.length + tabStep + 3)" @click="tabClick(tabStep + 3 + inSelectSubjects.length)">预投票</li>
                <li :class="tabClass(inSelectSubjects.length + tabStep + 4)" @click="tabClick(tabStep + 4 + inSelectSubjects.length)">投票</li>
                <li :class="tabClass(inSelectSubjects.length + tabStep + 5)"  @click="tabClick(tabStep + 5 + inSelectSubjects.length)">投票结果</li>
                <li :class="tabClass(inSelectSubjects.length + tabStep + 6)"  @click="tabClick(tabStep + 6 + inSelectSubjects.length)">监票说明</li>
                <li :class="tabClass(inSelectSubjects.length + tabStep + 7)"  @click="tabClick(tabStep + 7 + inSelectSubjects.length)">会议结束</li> -->
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { getManage, getTabIndex, getUserMap, getMeetingSubjects, getSubjectSelectedIndex, getMembers, getMeetingMemberTypeDicts } from "@/utils/meetingUtils";
import meetingTabMixin from '@/mixin/meetingTabMixin'

export default {
    mixins: [meetingTabMixin],
    components: {
        
    },
    data() {
        return {
            subjectSelected: false,
            optionIndex: 0,
            subTabWidth: 0,
            refresh: false,
        };
    },
    computed: {
        subjectSelectedIndex: function(){
            return getSubjectSelectedIndex(this);
        },
        allEnd: function(){
            if(this.inSelectSubjects && allSubjectsEnd(this.inSelectSubjects, this.disabledSubjectIds, this.tabStatus)){
                return true;
            }
            function allSubjectsEnd(inSelectSubjects, disabledSubjectIds, tabStatus){
                for(var i = 3; i < inSelectSubjects.length + 3; i++){
                    if(disabledSubjectIds.indexOf(inSelectSubjects[i - 3].id) == -1 && tabStatus[i] != 3){
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        tabStep() {
            return this.needFilteringSubjects.length > 0 ? 0 : 0;// -1
        },
        disabledSubjectIds: function () {
            return this.$store.state.meeting.disabledSubjectIds || [];
        }
    },
    watch: {
        disabledSubjectIds: function() {
            this.optionIndex = 0;
        },
    },
    mounted () {
        this.globalClick((e) => {
            if(this.subjectSelected && $(e.target).parents('#subject-select').length <= 0){
                this.subjectSelected = !this.subjectSelected;
            } 
        });

        this.refresh = false;
        this.$nextTick(() => {
            this.refresh = true;
            var w = this.$refs.line.clientWidth;
            var tw = 0;
            this.meetingSessions.forEach((ele, index) => {
                var tab = this.$refs['tab'][index];
                tw += tab ? tab.clientWidth : 0;
            });
            var subW = w - tw;
            this.subTabWidth = subW > 410 ? 410 : subW;
        });
            
    },
    methods: {
        tabClass: function(index) {
            var subTabIndex = this.subTabIndex;
            return (
                'tab-status ' +
                (this.manage ? "manage " : "member ") +
                "tab-status-" +
                this.tabStatus[index] +
                (((index < subTabIndex || subTabIndex == -1) ? index : (index - this.inSelectSubjects.length + 1)) == this.tabIndex ? " layui-this" : "")
            );
        },
        ...mapMutations({
            tabClick: "meeting/SET_TAB_INDEX"
        }),
        subjectSelectClick: function(){
            this.subjectSelected = !this.subjectSelected;
        },
        subjectSelect: function(index){
            //this.subjectNameSelected = this.meetingSubjects[index].subjectName;
            this.subjectSelectClick();
            this.tabClick(this.subTabIndex + index);
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
        getRoleInfo: function() {
            
            var role = this.role;
            var member = JSON.parse(JSON.stringify(this.member));
            var userId = member.userId;
            var index = this.members.indexOf(userId, 'principal');
            if (index != -1) {
                member = this.members[index];
                if(member.userId == this.meeting.chairmanUserId){
                    role = "5";
                } else if(member.userId == this.meeting.viceChairmanUserId) {
                    role = "6";
                }
                role = role ? this.meetingMemberTypeMap[role] : this.meetingMemberTypeMap[member.meetingMemberTypeDict];
                return "您受" + this.userMap[member.userId] + role + "委托"
            }
            return role ? this.meetingMemberTypeMap[role] : this.meetingMemberTypeMap[member.meetingMemberTypeDict]
        },
        canDispaly: function (meetingSession) {
            if (meetingSession.viewShowTypeDict == 'all') {
                return true;
            } else if (meetingSession.viewShowTypeDict == 'manage') {
                return this.manage;
            }
            return true;
        }
    }
};
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .layui-tab-title {
        display: inline-block;
        border: none;
        /* background: url('/img/meeting/topBJ.png') */
    }
    .layui-tab-title .layui-this:after {
        border: none;
    }
    .layui-tab-title li,
    .layui-tab-title .layui-this {
        color: #f6fdff;
    }
    .layui-tab-title li.tab-status {
        margin-right: 10px;
        height: 30px;
        line-height: 30px;
        /* margin-top: 10px; */
        border-radius: 2px;
    }
    .layui-tab-title li:last-child {
        margin-right: 0;
    }
    .line {
        display: flex;
        position: absolute;
        top: 34px;
        width: 75%;
        left: 12.5%;
    }
    .line-center {
        flex: 1;
        height: 4px;
        background: red;
    }
    .light {
        top: 0px;
        width: 152px;
        height: 50px;
        background: url("/img/meeting/m_light_top.png") no-repeat top center;
        position: absolute;
    }
    .light i {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 5px;
        left: -3px;
        background: url("/img/meeting/m_light.png") no-repeat top center;
    }
    .l-light {
        left: 0%;
    }
    .r-light {
        right: 0%;
    }
    .md.r-light {
        right: 0%;
    }
    .md.l-light {
        left: 0%;
    }
    li.subject-select {
        padding-left: 0px;
        /* margin-top: 10px; */
        padding-right: 0px;
        margin-right: 10px;
    }
    .subject-select .layui-unselect.layui-form-select input{
        height: 30px;
        border: none;
    }
    .subject-select .layui-form-select dl dd:hover {
        background: rgba(68,154,189,0.8) !important;
        background: linear-gradient(rgba(68,154,189,0.8),rgba(68,154,189,0.8)) !important;
    }
    // .layui-form-select dl dd.layui-this {
    // filter: alpha(opacity=100 finishopacity=50 style=1 startx=0,starty=0,finishx=0,finishy=150) progid:DXImageTransform.Microsoft.gradient(startcolorstr=#ffeec9,endcolorstr=#a79023,gradientType=0);
    //         -ms-filter: alpha(opacity=100 finishopacity=50 style=1 startx=0,starty=0,finishx=0,finishy=150) progid:DXImageTransform.Microsoft.gradient(startcolorstr=#ffeec9,endcolorstr=#a79023,gradientType=0);
    //         background: #a79023;
    //         background: -moz-linear-gradient(top, #d5c075, #a18b3e);
    //         background: -webkit-gradient(linear, 0 0, 0 bottom, from(#d5c075), to(#a18b3e));
    //         background: -o-linear-gradient(top, #d5c075, #a18b3e);
    // }
    .marquee {
        white-space: nowrap;
        overflow: -webkit-marquee;
        width: 80%;
        -webkit-marquee-direction: left;
        -webkit-marquee-speed: normal;
        -webkit-marquee-style: scroll;
        -webkit-marquee-repetition: 10;
    }
    .layui-form-select dl {
        text-align: left;
    }
</style>