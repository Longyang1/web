<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">培训情况</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>培训时间</td>
                    <td>培训名称</td>
                    <td>培训地点</td>
                    <td>培训说明</td>
                    <td>培训成果或证明</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelTrainings" :key="item.id">
                    <td>{{ item.trainTime | moment('YYYY年MM月')}}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.location }}</td>
                    <td>{{ item.content }}</td>
                    <td><a v-if="attaMap[item.id]" :href="'/api/file/pub/' + attaMap[item.id].attachmentSavePath" target="_blank">{{ attaMap[item.id].attachmentName }}</a></td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '培训情况编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
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
    name: 'PersonnelTraining',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelTrainings: [],
            attas: []
        }
    },
    computed: {
        attaMap: function() {
            var attaMap = {};
            this.attas.forEach(ele => {
                attaMap[ele.attachmentBusinessId] = ele;
            });
            return attaMap;
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelTrainings(this.personnelId).then(res => {
                    this.personnelTrainings = Object.assign([], res.data || []);
                    var trainIds = [];
                    this.personnelTrainings.forEach(ele => {
                        trainIds.push(ele.id);
                    });
                    if (trainIds.length > 0) {
                        getAttaments({
                            businessIds: trainIds.join(','),
                            attachmentBusinessType: 'personnel_training'
                        }).then(res => {
                            var data = res.data;
                            if (data) {
                                this.attas = Object.assign([], data.attachmentInfos || []);
                            }
                        });
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