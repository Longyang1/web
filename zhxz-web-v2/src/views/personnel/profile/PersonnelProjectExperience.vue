<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">{{ text }}</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>项目名称</td>
                    <td>项目角色</td>
                    <td>开始时间</td>
                    <td>结束时间</td>
                    <td>项目描述</td>
                    <td>项目职责</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelProjectExperiences" :key="item.id">
                    <td>{{ item.projectName }}</td>
                    <td>{{ item.role }}</td>
                    <td>{{ item.startTime | moment('YYYY.MM.DD') }}</td>
                    <td>{{ item.endTime | moment('YYYY.MM.DD') }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.projectDuty }}</td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '项目经验编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
                        <span @click="del(item.id, index)" style="color: red"><i class="fa fa-trash" aria-hidden="true"></i> 删除</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import * as personnelApi from '@/api/personnel/personnel'
import { getDicts } from '@/api/dict'
import PersonnelProjectExperienceForm from '@/views/personnel/profile/PersonnelProjectExperienceForm'

export default {
    name: 'PersonnelProjectExperience',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelProjectExperiences: [],
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelProjectExperiences(this.personnelId).then(res => {
                    this.personnelProjectExperiences = Object.assign([], res.data || []);
                });
            }
        },
        add: function (personnelProjectExperienceId, title) {
            var order =  1 + (this.personnelProjectExperiences.length > 0 ? Number(this.personnelProjectExperiences[this.personnelProjectExperiences.length - 1].projectOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelProjectExperienceForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelProjectExperienceId: (personnelProjectExperienceId || null),
                        order: (personnelProjectExperienceId ? '' : order)
                    }
                },
                area:['722px', 'auto'],
                title: title || ("项目经验" + (personnelProjectExperienceId ? '编辑' : '添加'))
			});
        },
        del: function (personnelProjectExperienceId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelProjectExperienceId).then(res => {
                    this.personnelProjectExperiences.splice(index, 1);
                    alert(res.msg)
                });
            });
        }
    }
}
</script>

<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
<style lang="less" scoped>
</style>
