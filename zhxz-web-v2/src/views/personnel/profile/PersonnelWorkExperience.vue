<template>
    <div class="table-box">
        <div style="margin-bottom: 10px;">
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">工作经历</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
            <!-- <span @click="filterResult(2)" class="iconfont icon-gongzuo" :style="{'padding-right': (canEdit && workType == 2) ? '10px' : '0px'}"> 全部工作经历</span>
            <span v-if="userType == 1" @click="filterResult(1)" class="iconfont icon-huaxia" :style="{'padding-right': canEdit ? '10px' : '0px'}"> 行内档案履历</span> -->
        </div>
        <!-- <div>
            <h5 v-if="workType == 1" style="color: #05afef;background: #e5f5fb;font-weight: bold;padding: 2px;margin-bottom: 10px;">“行内档案履历”是个人进入华夏银行工作以来的履历，与行内人力资源系统和个人档案同步，由系统自动生成，官方信息不可自行维护。</h5>
            <h5 v-if="workType == 2" style="color: #05afef;background: #e5f5fb;font-weight: bold;padding: 2px;margin-bottom: 10px;">“全部工作经历”是个人参加工作以来（包括行外工作）的所有详细工作经历，由个人自行维护，确保内容真实详尽。</h5>
        </div> -->
        <div class="work-box" style="padding-left: 8px;background:#fcfcfc;border: 1px solid #dce8fd;">
            <template v-for="(item, index) in personnelWorkExperiences">
                <div 
                    v-if="workType == item.workTypeDict"
                    :key='item.id' 
                    style="display: flex;padding-right: 10px;padding-left: 5px;">
                    <div class="time-interval">
                        <p v-if="item.startTime">{{ item.startTime | moment('YYYY.MM') }}</p>
                        <p v-if="!item.startTime">****</p>
                        <p style="padding: 8px 0px;color: #333333;font-size: 12px;">至</p>
                        <p v-if="item.endTime">{{ item.endTime | moment('YYYY.MM') }}</p>
                        <p v-if="!item.endTime">今</p>
                    </div>
                    <div class="item-detail">
                        <span></span>
                        <div style="padding-top: 4px;display: flex">
                            <div v-if="item.workTypeDict == 1" style="position: absolute;left: 400px;">
                                <img height="32px" src="/static/images/personnel/huaxialogo.png" alt="" srcset="">
                            </div>
                            <div class="logo-box">
                                <img v-if="item.workTypeDict == 1" height="32px" src="/static/css/image/favicon.ico" alt="" srcset="">
                                <img v-if="item.workTypeDict != 1" src="/static/images/personnel/bank-logo.png" alt="" srcset="">
                            </div>
                            <div v-if="item.workTypeDict != 1" style="display: inline-block;padding-left: 12px;flex: 1">
                                <div style="padding-bottom: 14px">工作单位:<span style="padding-left: 10px;color: #333333;font-weight: bold">{{ item.unit }}</span></div>
                                <span style="padding-right: 30px">部门：{{ item.department }}</span><span style="padding-right: 30px">岗位/职务：{{ item.job }}</span>
                                <a v-if="canEdit" @click="del(item.id, index)" href="javascript:void(0);" class="pull-right btn btn-xs btn-white" style="color: red"><i style="color: red" class="fa fa-trash text-warning"></i> 删除</a> 
                                <a v-if="canEdit" @click="add(item.id)" href="javascript:void(0);" class="pull-right btn btn-xs btn-white" style="margin-right: 8px;color: rgb(43, 100, 206);"><i class="iconfont icon-xiugai" style="color: rgb(43, 100, 206);font-size: 12px;"></i> 编辑</a>
                            </div>
                            <div v-if="item.workTypeDict == 1" style="display: inline-block;padding-left: 12px;flex: 1">
                                <div style="padding-bottom: 14px">工作单位:<span style="padding-left: 10px;color: #333333;font-weight: bold">{{ item.unit }}</span></div>
                                <span style="padding-right: 30px">部门：{{ item.department }}</span><span style="padding-right: 30px">岗位/职务：{{ item.job }}</span>
                                <a v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" v-if="canEdit && false" @click="del(item.id, index)" href="javascript:void(0);" class="pull-right btn btn-xs btn-white" style="color: red"><i style="color: red" class="fa fa-trash text-warning"></i> 删除</a> 
                                <a v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" v-if="canEdit && false" @click="add(item.id)" href="javascript:void(0);" class="pull-right btn btn-xs btn-white" style="margin-right: 8px;color: rgb(43, 100, 206);"><i class="iconfont icon-xiugai" style="color: rgb(43, 100, 206);font-size: 12px;"></i> 编辑</a>
                            </div>
                        </div>
                        <ul>
                            <li>
                                <pre style="background: rgb(252, 252, 252);">{{ item.workContent }}</pre>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import * as personnelApi from '@/api/personnel/personnel'
import PersonnelWorkExperienceForm from '@/views/personnel/profile/PersonnelWorkExperienceForm'
import { del } from '@/api/personnel/personnelWorkExperience'

export default {
    name: 'PersonnelWorkExperience',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelWorkExperiences: [],
            workType: 2 || this.userType,
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        filterResult: function(workType) {
            this.workType = workType;
        },
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelWorkExperiences(this.personnelId).then(res => {
                    this.personnelWorkExperiences = res.data || [];
                });
            }
        },
        add: function (personnelWorkExperienceId, title) {
            var order =  1 + (this.personnelWorkExperiences.length > 0 ? Number(this.personnelWorkExperiences[this.personnelWorkExperiences.length - 1].workOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelWorkExperienceForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelWorkExperienceId: personnelWorkExperienceId || null,
                        order: (personnelWorkExperienceId ? '' : order)
                    }
                },
                area:['722px', 'auto'],
                title: title || ("工作经历" + (personnelWorkExperienceId ? '编辑' : '添加'))
			});
        },
        del: function (personnelWorkExperienceId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelWorkExperienceId).then(res => {
                    this.personnelWorkExperiences.splice(index, 1);
                    alert(res.msg)
                });
            });
        }
    }
}
</script>

<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
<style lang="less" scoped>
.time-interval {
    display: inline-block;
    padding-right: 20px;
    min-width: 82px;
}
.item-detail {
    display: inline-block;
    border-left: 1px dashed #dfe3e8;
    vertical-align: top;
    padding-left: 20px;
    min-height: 100px;
    flex: 1;
    position: relative;
}
.item-detail > span {
    height: 10px;
    width: 10px;
    display: inline-block;
    background: #05afef;
    border-radius: 5px;
    position: absolute;
    left: -5.5px;
    margin-top: 25px;
}
.logo-box {
    display: inline-block;
    height: 50px;
    width:50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #e4e7f0;
    background: #fcfdff;
    vertical-align: top;
}
.item-detail > ul {
    padding-bottom: 30px;
    padding-top: 20px
}
.item-detail > ul > li {
    padding-bottom: 14px;
    line-height: 28px;
}
.item-detail > div > div > div a {
    float: right;
}
.work-box > div:first-child {
    padding-top: 20px;
}
.work-box > div:last-child {
    padding-bottom: 20px;
}
pre{
    white-space: pre-wrap;       
    white-space: -moz-pre-wrap;  
    white-space: -pre-wrap;      
    white-space: -o-pre-wrap;    
    word-wrap: break-word;       
}
</style>