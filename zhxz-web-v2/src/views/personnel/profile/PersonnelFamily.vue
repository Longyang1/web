<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">家庭情况</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>关系</td>
                    <td>姓名</td>
                    <!-- <td>出生年月</td>
                    <td>政治面貌</td> -->
                    <td>工作单位</td>
                    <td>行业</td>
                    <td>职务</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelFamilys" :key="item.id">
                    <td>{{ item.relationshipDict == "***" ? item.relationshipDict : relationshipMap[item.relationshipDict] }}</td>
                    <td><span @click="showMore(item.id)" title="点击查看更多信息" class="l-cursor" style="color: rgb(30, 159, 255);">{{ item.name }}</span></td>
                    <!-- <td>{{ item.birthday | moment('YYYY.MM') }}</td>
                    <td>{{ politicalMap[item.politicalDict] }}</td> -->
                    <td>{{ item.workUnit }}</td>
                    <td>{{ item.unitCategoryDict == "***" ? item.unitCategoryDict : unitCategoryMap[item.unitCategoryDict] }}</td>
                    <td>{{ item.job }}</td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '家庭情况编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
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
import PersonnelFamilyForm from '@/views/personnel/profile/PersonnelFamilyForm'
import PersonnelFamilyMoreModal from '@/views/personnel/profile/PersonnelFamilyMoreModal'
import { del } from '@/api/personnel/personnelFamily'
import { getDicts } from '@/api/dict'

export default {
    name: 'PersonnelFamily',
    mixins: [personnelProfileMixin],
    data () {
        return {
            politicalDicts: [],
            unitCategorys: [],
            personnelFamilys: [],
            highestEducationDicts: [],
            highestDegreeDicts: [],
            areaMap: {},
            relationshipDicts: [],
        }
    },
    computed: {
        politicalMap: function() {
            return this.politicalDicts.array2Obj('value', 'label');
        },
        unitCategoryMap: function() {
            return this.unitCategorys.array2Obj('value', 'label');
        },
        highestEducationMap: function() {
            return this.highestEducationDicts.array2Obj('value', 'label');
        },
        highestDegreeMap: function() {
            return this.highestDegreeDicts.array2Obj('value', 'label');
        },
        relationshipMap: function() {
            return this.relationshipDicts.array2Obj('value', 'label');
        }
	},
    mounted () {
        this.initData();
    },
    methods: {
        showMore: function(personnelFamilyId) {
            this.$layer.iframe({
                content: {
                    content: PersonnelFamilyMoreModal, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelFamilyId: (personnelFamilyId || null),
                        order: (personnelFamilyId ? '' : order)
                    }
                },
                area:['80%', 'auto'],
                title: "家庭情况详细信息"
			});
        },
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelFamilys(this.personnelId).then(res => {
                    var data = res.data;
                    if (data) {
                        this.personnelFamilys = Object.assign([], data.personnelFamilies || []);
                        this.areaMap = Object.assign({}, data.areaMap || {});
                    }
                });
            }

            getDicts('RELIGION_DICT,UNIT_CATEGORY_DICT,PERSONNEL_EDUCATION_DICT,PERSONNEL_DEGREE_DICT,RELATIONSHIP_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.politicalDicts = result.data[0] || [];
                    this.unitCategorys = result.data[1] || [];
                    this.highestEducationDicts = result.data[2] || [];
                    this.highestDegreeDicts = result.data[3] || [];
                    this.relationshipDicts = data[4] || [];
                }
            });
        },
        add: function (personnelFamilyId, title) {
            var order =  1 + (this.personnelFamilys.length > 0 ? Number(this.personnelFamilys[this.personnelFamilys.length - 1].familyOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelFamilyForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelFamilyId: (personnelFamilyId || null),
                        order: (personnelFamilyId ? '' : order)
                    }
                },
                area:['730px', 'auto'],
                title: title || "家庭情况添加"
			});
        },
        del: function (personnelFamilyId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelFamilyId).then(res => {
                    this.personnelFamilys.splice(index, 1);
                    alert(res.msg)
                });
            });
        }
    }
}
</script>

<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
<style lang="less" scoped>
.f-table {
    margin-bottom: 20px;
}
.f-table span {
    cursor: pointer;
}
.f-table-0 tr.title td {
    background: #FFFFCC;
}
.f-table-1 tr.title td {
    background: #CCFFCC;
}
.f-table-2 tr.title td {
    background: #FCEDED;
}
.f-table-3 tr.title td {
    background: #FEEBFC;
}
table tr td {
    padding: 2px;
}
</style>

