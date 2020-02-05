<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#2b64ce;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">笔试情况</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>笔试时间</td>
                    <td>笔试地点</td>
                    <td>笔试内容</td>
                    <td>笔试成绩</td>
                    <td>笔试情况</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelWrittenExaminations" :key="item.id">
                    <td>{{ item.writtenTime | moment('YYYY.MM.DD HH:mm') }}</td>
                    <td>{{ item.writtenLocation }}</td>
                    <td>{{ item.writtenContent }}</td>
                    <td>{{ item.score }}</td>
                    <td>{{ item.writtenSituation }}</td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '笔试情况编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
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
import PersonnelWrittenExaminationForm from '@/views/personnel/profile/PersonnelWrittenExaminationForm'
import { del } from '@/api/personnel/personnelWrittenExamination'

export default {
    name: 'PersonnelWrittenExamination',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelWrittenExaminations: [],
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelWrittenExaminations(this.personnelId).then(res => {
                    this.personnelWrittenExaminations = Object.assign([], res.data || []);
                });
            }
        },
        add: function (writtenExaminationId, title) {
            var order =  1 + (this.personnelWrittenExaminations.length > 0 ? Number(this.personnelWrittenExaminations[this.personnelWrittenExaminations.length - 1].writtenOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelWrittenExaminationForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelWrittenExaminationId: (writtenExaminationId || null),
                        order: (writtenExaminationId ? '' : order)
                    }
                },
                area:['722px', 'auto'],
                title: title || ("笔试情况" + this.personnelId ? '编辑' : '添加')
			});
        },
        del: function (writtenExaminationId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(writtenExaminationId).then(res => {
                    this.personnelWrittenExaminations.splice(index, 1);
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
