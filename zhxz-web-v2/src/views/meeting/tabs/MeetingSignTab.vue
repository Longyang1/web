<template>
    <div>
        <div class="tab-title">{{ meetingSessions[comIndex].name }}</div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content sign-detail">
                        <div class="row row-background">
                            <div class="col-lg-3 col-md-3 visible-lg-block left-border" style="height:100340px">
                                <div class="middle">
                                    <img class="" src="/img/meeting/m_box_1.png"/>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 visible-md-block left-border" style="height:100340px">
                                <div class="middle">
                                    <img class="visible-md-block" height="180" src="/img/meeting/m_box_1.png"/>
                                </div>
                            </div>
                            <div v-if="needSign" class="col-lg-2 col-md-3">
                                <div class="top" style="padding-bottom:72px">
                                    <img src="/img/meeting/m_qd.png" alt="">
                                    <span class="title">签到统计</span>
                                </div>
                                <div class="o-btn-group">
                                    <button v-if="manage" @click="startOrEndSign(meetingId)" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': signStatus == 2, 'm-btn-finish': signStatus == 3}">
                                        <i :class="{'fa': true, 'fa-circle-o': signStatus == 1, 'fa-circle-o-notch fa-spin': signStatus == 2, 'fa-check': signStatus == 3}" aria-hidden="true"></i>
                                        <span v-if="signStatus == 1">启动签到</span>
                                        <span v-if="signStatus == 2">签到进行</span>
                                        <span v-if="signStatus == 3">签到结束</span>
                                    </button>
                                    <button v-if="!manage" @click="memberSign(meetingId)" :class="{'layui-btn layui-btn-radius m-btn': true, 'm-btn-processing': (signStatus == 3 || signStatus == 4), 'm-btn-finish': isEnd}">
                                        <i :class="{'fa': true, 'fa-circle-o': (signStatus == 1 || signStatus == 2), 'fa-circle-o-notch fa-spin': signStatus == 3, 'fa-check': signStatus == 4}" aria-hidden="true"></i>
                                        <span v-if="signStatus == 1">开始签到</span>
                                        <span v-if="signStatus == 2">点击签到</span>
                                        <span v-if="signStatus == 3">正在签到</span>
                                        <span v-if="signStatus == 4">签到成功</span>
                                    </button>
                                    <img src="/img/meeting/m_btn_bottom.png" alt="">
                                    <span v-if="signStatus == 1">{{ manage ? '点击启动签到' : '会议管理员还未开启签到功能,请耐心等待'}}</span>
                                    <span v-if="signStatus == 2">{{ manage ? '在此点击按钮可结束签到' : '在此点击完成签到'}}</span>
                                    <span v-if="signStatus == 3">{{ manage ? '签到已结束' : '正在完成签到'}}</span>
                                    <span v-if="!manage && signStatus == 4">已成功签到</span>
                                    <button v-if="manage" @click="next(comIndex)" :class="{'layui-btn layui-btn-radius m-btn-next': true, 'm-btn-next-active': curTabStatus == 4}">下一项</button>
                                </div>
                            </div>
                            <div :class="{'col-lg-7 col-md-6': needSign, 'col-lg-9 col-md-9': !needSign}">
                                <div class="top row">
                                    <div class="col-lg-4 col-md-4">
                                        <span class="sign-num">{{members.length - members.filter(m => m.principal).length}}</span><br>
                                        <span class="sign-num-des">应签到</span>
                                    </div>
                                    <div class="col-lg-4 col-md-4">
                                        <span class="sign-num y-sign-num">{{signInfo.signNum}}</span><br>
                                        <span class="sign-num-des">已签到</span>
                                    </div>
                                    <div class="col-lg-4 col-md-4">
                                        <span class="sign-num n-sign-num">{{signInfo.notSignNum}}</span><br>
                                        <span class="sign-num-des">未签到</span>
                                    </div>
                                </div>
                                <div class="sign-rate">
                                    <div lay-showpercent="true" lay-filter="sign-bar" class="layui-progress layui-progress-big">
                                        <div lay-percent="0%" class="layui-progress-bar" :style="{'background-color': 'rgb(39, 194, 76)', width: signInfo.signRate + '%'}">
                                            <span class="layui-progress-text" style="padding: 0px;padding-left: 10px;padding-right: 10px;">{{ signInfo.signRate }}%</span>
                                        </div>
                                    </div>
                                    <span style="padding-left: 2px;">签到率</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br class="clear">
                </dd>
            </dl>
        </div>
        <div class="timelineMajor">
            <dl class="timelineMinor">
                <dd class="timelineEvent">
                    <div class="wrapper wrapper-content">
                        <div class="row">
                            <div class="col-sm-12 no-left-border">
                                <ul class="sortable-list connectList agile-list">
                                    <li class="success-element">
                                        <div class="agile-detail">
                                            <div style="text-align: right;font-size: 20px">
                                                <div class="sign-result" style="float: left;">
                                                    <i class="fa fa-bar-chart text-warning"></i> 签到信息
                                                </div>
                                                <button v-if="manage && false" @click="exportSignPDF" class="btn btn-info vote-pdf" type="button"><i class="fa fa-file-pdf-o"></i> 导出签到统计PDF</button>
                                                <br class="clear">
                                            </div>
                                            <table class="subject-child-table sign-table" style="font-size:14px">
                                                <tr>
                                                    <th>序号</th>
                                                    <th>人员名单</th>
                                                    <th>任职部门</th>
                                                    <th>参会角色</th>
                                                    <th>签到状态</th>
                                                    <th>签到时间</th>
                                                    <th v-if="manage && !isEnd">操作</th>
                                                </tr>
                                                <tbody v-if="refresh">
                                                    <tr v-for="(member, index) in members" :key="member.id">
                                                        <template  v-if="member.meetingMemberTypeDict != 100">
                                                            <td>{{ index + 1}}</td>
                                                            <td v-if="!member.principal">{{ userMap[member.userId] }}</td>
                                                            <td v-if="member.principal">{{ userMap[member.principal] }}({{ userMap[member.userId] }})</td>
                                                            <td>{{ userOfficeMap[member.userId] ? userOfficeMap[member.userId].orgName : '' }}</td>
                                                            <td>{{ meetingMemberTypeDicts | dictValue(member.meetingMemberTypeDict) }}</td>
                                                            <td v-if="member.signInStatus != 'y' && (!member.principal || (members[members.indexOf(member.principal, 'userId')].signInStatus != 'y'))"><i class="fa fa-circle-o text-warning"></i> 未签到</td>
                                                            <td v-if="member.signInStatus == 'y' || (member.principal && members[members.indexOf(member.principal, 'userId')].signInStatus == 'y')"><i class="fa fa-check-circle text-warning"></i> 已签到</td>
                                                            <td style="min-width: 120px;">{{ (!member.principal ? member.signInTime : (members[members.indexOf(member.principal, 'userId')].signInTime)) | moment }}</td>
                                                            
                                                            <template v-if="manage && !isEnd">
                                                                <td v-if="signStatus == 2 && member.signInStatus != 'y' && (!member.principal || (members[members.indexOf(member.principal, 'userId')].signInStatus != 'y'))" style="color: red;font-weight: bold;">
                                                                    <span @click="memberSign({meetingId: meetingId, userId: (member.principal || member.userId) })"><i class="fa fa-sign-in"></i> 代签到</span>
                                                                    <span @click="selectPrincipal(member)"><i class="fa fa-user-plus" aria-hidden="true"></i> 委托</span>
                                                                </td>
                                                                <td v-if="signStatus == 2 && (member.signInStatus == 'y' || (member.principal && members[members.indexOf(member.principal, 'userId')].signInStatus == 'y'))" style="color: #919ca0;font-weight: bold;">
                                                                    <span><i class="fa fa-sign-in"></i> 代签到</span>
                                                                    <span><i class="fa fa-user-plus" aria-hidden="true"></i> 委托</span>
                                                                </td>
                                                                <td v-if="signStatus != 2" style="color: #919ca0;font-weight: bold;">
                                                                    <span><i class="fa fa-sign-in"></i> 代签到</span>
                                                                    <span><i class="fa fa-user-plus" aria-hidden="true"></i> 委托</span>
                                                                </td>
                                                            </template>
                                                        </template>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </li>
                                </ul>
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
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import { getManage, getMembers, getUserMap, getOfficeNameMap, getMeetingMemberTypeDicts, getCurTabStatus } from '@/utils/meetingUtils'
import { getSignResultPDFUrl } from '@/api/meeting/meeting'
import { downloadFile } from '@/api/file'
import { updateMember } from '@/api/meeting/meetingInfo'
import Base from "@/views/base/Base"
import UserSelectList from '@/components/UserSelectList'
import meetingTabMixin from '@/mixin/meetingTabMixin'

export default {
    extends: Base,
    mixins: [meetingTabMixin],
    data () {
        return {
            refresh: true,
            meetingMemberId: null
        }
    },
    computed:  {
        members: function(){
            return getMembers(this).filter(member => ("7" != member.meetingMemberTypeDict && "8" != member.meetingMemberTypeDict));
        },
        member: function() {
            return this.members[this.members.indexOf(this.user.userId + "", 'userId')];
        },
        meetingMemberTypeDicts: function(){
            return getMeetingMemberTypeDicts(this);
        },
        signStatus: function(){
            return this.$store.state.meeting.signStatus;
        },
        signInfo: function(){
            return this.$store.state.meeting.signInfo;
        },
        needSign: function() {
            return this.manage || (this.member && '7' != this.member.meetingMemberTypeDict && '8' != this.member.meetingMemberTypeDict);
        }
    },
    watch: {
        // members() {
        //     console.log(this.members);
        //     this.refresh = false;
        //     this.$nextTick(() => {
        //         this.refresh = true;
        //     });
        // }
    },
    mounted () {
        console.log("签到tab-" + this.meetingId);
    },
    methods: {
        ...mapActions({
            startOrEndSign: 'meeting/SIGN',
            memberSign: 'meeting/SIGN',
            next: 'meeting/NEXT',
        }),
        exportSignPDF: function(){
            //加载层-风格4
            var layId = layer.msg('文件生成中', {
                icon: 16,
                shade: 0.01
            });
            getSignResultPDFUrl(this.meetingId).then(response => {
                layer.close(layId);
                layId = layer.msg('文件导出中', {
                    icon: 16,
                    shade: 0.01
                });
                setTimeout(() => {
                    downloadFile({
                        path: response.data,
                        fileName: "签到结果"
                    }).then(res => {
                        this.download(res);
                        layer.close(layId);
                        alert("文件导出成功");
                    });
                }, 2000);
                // window.open("/api/file/pub/" + response.data, '_blank');
            }).catch(error => {
                layer.close(layId);
            });
        },
        selectPrincipal: function(member){
			this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						isMultiUser: false
					}
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
            });
            this.meetingMemberId = member.id;
        },
        getSelectUser: function(user) {
            confirm("确定委托吗？", () => {
                console.log(user);
                updateMember(this.meetingId, this.meetingMemberId, 'principal', user.userId).then(res => {
                    alert('委托成功');
                });
                this.$layer.closeAll();
            });
        }
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .sign-num {
        font-size: 40px;
        color: #343a47;
    }
    .sign-num-des{
        font-size: 20px;
        color: #5a6575;
    }
    .y-sign-num {
        color: #426c9a;
    }
    .n-sign-num {
        color: #ea4c4c;
    }
    .sign-rate {
        padding-top: 50px;
    }
    .sign-rate div {
        vertical-align: middle;
        width: 85%;
        display: inline-block;
    }
    .wrapper-content > .row > div.no-left-border {
        border-left: none;
    }
    span:first-child {
        padding-right: 6px;
    }
</style>
