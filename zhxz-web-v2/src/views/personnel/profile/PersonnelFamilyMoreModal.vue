<template>
    <div class="table-box" style="margin-top: 41px;">
        <div>
            <table  
                v-for="(item, index) in personnelFamilys" 
                :key="item.id" 
                :class="'f-table f-table-' + (index % 4)">
                <tr class="title">
                    <td style="width: 100px">关系</td>
                    <td style="width: 50%">姓名</td>
                    <td style="width: 50%">出生年月</td>
                    <td style="min-width: 110px">政治面貌</td>
                    <td v-if="item.relationshipDict == 3" style="min-width: 130px">户口所在地</td>
                    <td v-if="item.relationshipDict == 3" style="width: 100px">最高学历</td>
                    <td v-if="item.relationshipDict == 3" style="width: 100px">最高学位</td>
                </tr>
                <tr>
                    <td rowspan="3">{{ item.relationshipDict == "***" ? item.relationshipDict : relationshipMap[item.relationshipDict] }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.birthday | moment('YYYY.MM') }}</td>
                    <td>{{ item.politicalDict == "***" ? item.politicalDict : politicalMap[item.politicalDict] }}</td>
                    <td v-if="item.relationshipDict == 3">{{ item.accountLocationProvince == "***" ? item.accountLocationProvince : areaMap[item.accountLocationProvince] }}{{ item.accountLocationCity == "***" ? item.accountLocationCity : areaMap[item.accountLocationCity] }}</td>
                    <td v-if="item.relationshipDict == 3">{{ item.highestEducationDict == "***" ? item.highestEducationDict : highestEducationMap[item.highestEducationDict] }}</td>
                    <td v-if="item.relationshipDict == 3">{{ item.highestDegreeDict == "***" ? item.highestDegreeDict : highestDegreeMap[item.highestDegreeDict] }}</td>
                </tr>
                <tr class="title">
                    <td>行业</td>
                    <td>工作单位</td>
                    <td>职务</td>
                    <td v-if="item.relationshipDict == 3">工作单位所在城市</td>
                    <td v-if="item.relationshipDict == 3" colspan="2">最高技术职称</td>
                </tr>
                <tr>
                    <td>{{ item.unitCategoryDict == "***" ? item.unitCategoryDict : unitCategoryMap[item.unitCategoryDict] }}</td>
                    <td>{{ item.workUnit }}</td>
                    <td>{{ item.job }}</td>
                    <td v-if="item.relationshipDict == 3">{{ item.workUnitProvince == "***" ? item.workUnitProvince : areaMap[item.workUnitProvince] }}{{ item.workUnitCity == "***" ? item.workUnitCity : areaMap[item.workUnitCity] }}</td>
                    <td v-if="item.relationshipDict == 3" colspan="2">{{ item.highestTechnicalTitle }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import * as personnelApi from '@/api/personnel/personnel'
import PersonnelFamilyForm from '@/views/personnel/profile/PersonnelFamilyForm'
import { get } from '@/api/personnel/personnelFamily'
import { getDicts } from '@/api/dict'

export default {
    name: 'PersonnelFamilyMoreModal',
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
    props: {
        personnelFamilyId: {
            type: String,
            default: null
        },
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
        initData: function () {
            if (this.personnelFamilyId) {
                get(this.personnelFamilyId).then(res => {
                    var data = res.data;
                    if (data) {
                        this.personnelFamilys.push(data.personnelFamily || {});
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
    /* background: #FFFFCC; */
    background: #e0f4fb!important;
}
.f-table-1 tr.title td {
    /* background: #CCFFCC; */
    background: #e0f4fb!important;
}
.f-table-2 tr.title td {
    /* background: #FCEDED; */
    background: #e0f4fb!important;
}
.f-table-3 tr.title td {
    /* background: #FEEBFC; */
    background: #e0f4fb!important;
}
table tr td {
    padding: 2px;
}
.table-box > div:first-child {
    border-bottom: none;
}
</style>

