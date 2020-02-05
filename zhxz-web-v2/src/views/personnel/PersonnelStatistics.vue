<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>行员信息统计</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <pagination
                            v-if="initPage"
                            :url="'./personnel/statPersonnelInfos'"
                            :titles="titles"
                            :paramNames="paramNames"
                            :dicts="dicts"
                            :otherParam="otherParam"
                            :showEmptyDataMsg="false"
                            :notShowBtn="true"
                            @handleSearchResult="handleSearchResult"
                            :autoSearch="true"
                            ref="pagination">
                            <!-- <template slot="dict0">
                                <layui-date
                                    v-model="otherParam.startTime"
                                    name="startTime"
                                    style="display:inline-block;padding-left: 6px;"></layui-date>
                                至
                                <layui-date
                                    v-model="otherParam.endTime"
                                    name="endTime"
                                    style="display:inline-block;padding-left: 8px;"></layui-date>
                            </template> -->
                            <template slot="opera">
                                <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="edit()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-level-up" aria-hidden="true"></i>&nbsp;&nbsp;数据订正</button>
                            </template>
                        </pagination>
                        <staff-composition-analysis :statPersonnelInfo="statPersonnelInfo"></staff-composition-analysis>
                        <personnel-changes :items="statPersonnelInfos" :top100StatPersonnelInfos="top100StatPersonnelInfos"></personnel-changes>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StaffCompositionAnalysis from '@/views/personnel/block/StaffCompositionAnalysis'
import PersonnelChanges from '@/views/personnel/block/PersonnelChanges'
import { getDicts } from '@/api/dict';
import { del, exportPersonInfo } from '@/api/personnel/personnel'
import Base from "@/views/base/Base"
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/api/file'
var curYear = new Date().getFullYear();
var curMonth = new Date().getMonth() + 1;
import { getPersonnelCenterConfigs } from '@/api/personnel/personnelCenterConfig'
import { getOfficesByCenterCode } from '@/api/personnel/personnelJobManage'
import { getPersonnelCenterOrgs } from '@/api/personnel/personnelCenterOrg'
import StatPersonnelInfoForm from '@/views/personnel/StatPersonnelInfoForm'

export default {
	name: 'PersonnelStatistics',
    extends: Base,
    components: {
        StaffCompositionAnalysis,
        PersonnelChanges
    },
    data () {
       
        return {
            titles: ['年份', '统计周期'],// , '月份'
            dicts: [],
            paramNames: ['statYear', 'statCycle', 'center', 'officeId', 'level'],//'statMonth',
            otherParam: {
                pageSize: 31,
            },
            years: [{"label": curYear, value: curYear, selected: 1}],// , {"label": curYear - 1, value: curYear - 1}
            cycles: [{"label": "年", value: "year", selected: 1}], // , {"label": '月', value: "month"}
            months: [],
            statPersonnelInfo: {},
            statPersonnelInfos: [],
            initPage: false,
            top100StatPersonnelInfos: [],
        }
    },
    mounted () {
        this.initDicts();
    },
    methods: {
        edit: function() {
            this.$layer.iframe({
                content: {
                    content: StatPersonnelInfoForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        statPersonnelInfoId: this.statPersonnelInfo.id
                    }
                },
                area:['730px', 'auto'],
                title: ("统计数据订正")
			});
        },
        initDicts: function() {
            this.dicts.push(this.years);
            this.dicts.push(this.cycles);
            
            // for (let index = 1; index <= 12; index++) {
            //     this.months.push({
            //         label: index + "月",
            //         value: index,
            //         selected: (index == curMonth ? 1 : 0)
            //     });
            // }
            // this.dicts.push([]);

            var officeId = this.curUser.office.id;
            var departmentId = this.curUser.department.id;
            var userUid = this.curUser.username;
            getPersonnelCenterConfigs({
                officeId,
                departmentId,
                userUid
            }).then(res => {
                var data = res.data;
                if (data) {
                    var centers = data.personnelCenterConfigs || [];
                    var centerDicts = [{
                        label: '全部',
                        value: '',
                        selected: 1
                    }];
                    if (centers.length > 0) {
                        centers.forEach(element => {
                            if (element.centerName != "金融科技公司") {
                                centerDicts.push({
                                    label: element.centerName,
                                    value: element.centerCode,
                                    selected: 0
                                });
                            }
                        });

                        this.dicts.push(centerDicts);
                        this.dicts.push([{
                            label: '全部',
                            value: '',
                            selected: 1
                        }]);
                        this.titles.push('中心');
                        this.titles.push('处室');
                        this.titles.push('行员级别');
                        getDicts("STAT_PERSONNEL_LEVEL").then(res => {
                            var data = res.data || [[{
                                label: '全部',
                                value: '',
                                selected: 1
                            }]];
                            data[0][0].selected = 1;
                            this.dicts.push(data[0]);
                            this.initPage = true;
                        });
                    } else {
                        this.otherParam.officeId = this.curUser.office.id;
                        this.initPage = true;
                    }
                }
            }).catch(err => {
                this.initPage = true;
            });
        },
        resetNextLevel: function(paramName) {
            return paramName == "center";
        },
        handleLevelTab: function(paramName, dictValue) {
            
            if (paramName == "center") {
                var offices = [{
                    label: '全部',
                    value: '',
                    selected: 1
                }];
                if (dictValue != '') {
                    getPersonnelCenterOrgs({
                        centerCode: dictValue,
                    }).then(res => {
                        var data = res.data || {};
                        var officeNameMap = data.officeNameMap || {};
                        var centerOrgs = data.personnelCenterOrgs || [];
                        centerOrgs.forEach(elem => {
                            offices.push({
                                label: officeNameMap[elem.officeId],
                                value: elem.officeId,
                                selected: 0
                            });
                        });
                        this.dicts.splice(3, 1, offices);
                        this.$refs.pagination.refresh();
                    });
                } else {
                    this.dicts.splice(3, 1, offices);
                    return true;
                }
                return true;
            } else if (paramName == "statCycle") {
                // this.dicts[2] = dictValue == 'year' ? [] : this.months;
                // this.dicts[2].forEach(ele => {
                //     if (ele.selected == 1) {
                //         this.$set(this.otherParam, 'statMonth', ele.value);
                //         return;
                //     }
                // });
                // return true;
            }
            return true;
        },
        handleSearchResult: function(data) {
            var statPersonnelInfos = data.statPersonnelInfos || [];
            if (statPersonnelInfos.length > 0) {
                this.statPersonnelInfo = Object.assign({}, statPersonnelInfos[0]);
                statPersonnelInfos.splice(0, 1);
                if (this.dicts[2] && this.dicts[2].indexOf(1, 'selected') == 0) {
                    statPersonnelInfos.sort((a1, a2) => {
                        var a1Index = this.dicts[2].indexOf(a1.officeName, 'label');
                        var a2Index = this.dicts[2].indexOf(a2.officeName, 'label');
                        return a2Index - a1Index;
                    });
                }
                this.statPersonnelInfos = Object.assign([], statPersonnelInfos || []);
            } else {
                this.statPersonnelInfo = Object.assign({}, {});
                this.statPersonnelInfos = Object.assign([], []);
            }
            this.statPersonnelInfos = Object.assign([], data.centerStatPersonnelInfos || this.statPersonnelInfos);
            this.top100StatPersonnelInfos = [];
            Object.assign(this.top100StatPersonnelInfos, data.top100StatPersonnelInfos || []);
            
            if (!this.dicts[3] || !this.dicts[3][0].selected) {
                Object.assign(this.statPersonnelInfos, this.top100StatPersonnelInfos || []);
            }
        }
    }
    
}
</script>

<style scoped>
* /deep/ .ibox-content {
    padding: 0;
}
</style>


