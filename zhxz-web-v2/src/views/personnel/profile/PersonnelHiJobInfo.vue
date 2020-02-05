<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">历史岗位信息</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit && false" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td width=300>起止年月</td>
                    <td>部门</td>
                    <td>处室</td>
                    <td>岗位</td>
                    <td v-if="canEdit && false">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelHiJobInfos" :key="item.id">
                    <td>{{ item.startTime | moment('YYYY年MM月') }}--{{ item.endTime | moment('YYYY年MM月') }}</td>
                    <td>{{ get(item, 0) }}</td>
                    <td>{{ get(item, 1)  }}</td>
                    <td>{{ get(item, 2)  }}</td>
                    <td v-if="canEdit && false" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '培训情况修改')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
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
import PersonnelTrainingForm from '@/views/personnel/profile/PersonnelTrainingForm'
import { del } from '@/api/personnel/personnelTraining'
import { getAttaments } from '@/api/file'

export default {
    name: 'PersonnelHiJobInfo',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelHiJobInfos: [],
        }
    },
    computed: {
    
    },
    mounted () {
        this.initData();
    },
    methods: {
        get: function(hiJob, index) {
            var arr = hiJob.remark.split(',');
            return arr.length <= index ? "" : arr[index];
        },
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelHiJobInfos(this.personnelId).then(res => {
                    var data = res.data;
                    if (data) {
                        this.personnelHiJobInfos = Object.assign([], data || []);
                    }
                });
            }
        },
        add: function (personnelTrainingId, title) {
            var order =  1 + (this.personnelTrainings.length > 0 ? Number(this.personnelTrainings[this.personnelTrainings.length - 1].trainOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelTrainingForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelTrainingId: (personnelTrainingId || null),
                        order: (personnelTrainingId ? '' : order)
                    }
                },
                area:['722px', 'auto'],
                title: title || ("培训情况" + (this.personnelTrainingId ? '编辑' : '添加'))
			});
        },
        del: function (personnelTrainingId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelTrainingId).then(res => {
                    this.personnelTrainings.splice(index, 1);
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