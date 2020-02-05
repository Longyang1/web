<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">资质和证书</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>获得时间</td>
                    <td>名称</td>
                    <td>颁发单位</td>
                    <td>级别</td>
                    <td>专业或方向</td>
                    <td>相关文件</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelCertifications" :key="item.id">
                    <td>{{ item.getTime | moment('YYYY.MM.DD') }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.issuingUnit }}</td>
                    <td>{{ item.level }}</td>
                    <td>{{ item.majorDirection }}</td>
                    <td><a v-if="attaMap[item.id]" :href="'/api/file/pub/' + attaMap[item.id].attachmentSavePath" target="_blank">{{ attaMap[item.id].attachmentName }}</a></td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '资质与证书编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
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
import PersonnelCertificationForm from '@/views/personnel/profile/PersonnelCertificationForm'
import { del } from '@/api/personnel/personnelCertification'
import { getAttaments } from '@/api/file'

export default {
    name: 'PersonnelCertification',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelCertifications: [],
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
                personnelApi.getPersonnelCertifications(this.personnelId).then(res => {
                    this.personnelCertifications = Object.assign([], res.data || []);
                    var cerIds = [];
                    this.personnelCertifications.forEach(ele => {
                        cerIds.push(ele.id);
                    });
                    if (cerIds.length > 0) {
                        getAttaments({
                            businessIds: cerIds.join(','),
                            attachmentBusinessType: 'personnel_certification'
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
        add: function (personnelCertificationId, title) {
            var order = (this.personnelCertifications.length > 0 ? Number(this.personnelCertifications[this.personnelCertifications.length - 1].cerOrder || 0) : 0) + 1;
            this.$layer.iframe({
                content: {
                    content: PersonnelCertificationForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelCertificationId: (personnelCertificationId || null),
                        order: (personnelCertificationId ? '' : order)
                    }
                },
                area:['722px', 'auto'],
                title: title || "资质和证书添加"
			});
        },
        del: function (personnelCertificationId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelCertificationId).then(res => {
                    this.personnelCertifications.splice(index, 1);
                    alert(res.msg)
                });
            });
        }
    }
}
</script>

<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
