<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>我的项目空间</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./project/projectInfos/myProjectInfoSpace'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                @handleLevelTab='handleLevelTab'
                                ref="pagination">
                                <template slot="searchBtnBefore">	
                                    <span class="title title-text" style="margin-right: 14px;">关键字：</span>
                                    <input type="text" v-model="otherParam.projectName" placeholder="输入项目名称关键字">
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">项目名称</th>
												<th style="text-align:center;">项目编号</th>
												<th style="text-align:center;">项目类型</th>
												<th style="text-align:center;">项目合同名称</th>
												<th style="text-align:center;">客户名称</th>
												<th style="text-align:center;">项目经理</th>
												<th style="text-align:center;">项目所属部门</th>
												<th style="text-align:center;">项目状态</th>
												<th style="text-align:center;">操作状态</th>
                                                <!-- <th style="text-align:center;">操作</th> -->
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;">{{ item.projectName }}</td>
													<td style="text-align:center;">{{ item.projectNumber }}</td>
													<td style="text-align:center;">{{ projectTypeDictsMap[item.projectTypeDict] }}</td>
													<td style="text-align:center;">{{ item.projectContractName }}</td>
													<td style="text-align:center;">{{ item.customerName }}</td>
													<td style="text-align:center;">{{ item.projectPmId }}</td>
													<td style="text-align:center;">{{ item.projectDeptId }}</td>
													<td style="text-align:center;">{{ projectStatusDictsMap[item.projectStatusDict] }}</td>
													<td style="text-align:center;">{{ projectOperateStatusDictsMap[item.projectInfoOperateStatusDict] }}</td>
                                                    <!-- <td style="text-align:center;">
                                                        <a @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                    </td> -->
                                                </tr>
                                            </template>
                                        </tbody>
                                        <tfoot>
                                        </tfoot>
                                    </table>
                                </template>
                            </pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict';
import { del } from '@/api/project/projectInfo'
import {getDictByTypeValue} from '@/api/dict';
import Base from "@/views/base/Base"

export default {
	name: 'MyProjectInfoSpace',
	extends: Base,
    data () {
        return {
            titles: ['项目一级分类', '项目二级分类', '项目状态', '项目操作状态', '项目阶段类型'],
            dicts: [],
            paramNames: ['PROJECT_TYPE_ONE_DICT','PROJECT_TYPE_TWO_DICT','projectStatusDict','projectInfoOperateStatusDict','projectPhaseDict'],
            otherParam: {
                projectName:"",
                createBySelf: false
            },
            refresh: true,
            page: {

            },
            projectOperateStatusDicts: [],
            projectTypeDicts: [],
            projectStatusDicts: [],
        }
    },
    computed: {
        projectOperateStatusDictsMap: function() {
            return this.projectOperateStatusDicts.array2Obj('value', 'label');
        },
        projectTypeDictsMap: function() {
            return this.projectTypeDicts.array2Obj('value', 'label');
        },
        projectStatusDictsMap: function() {
            return this.projectStatusDicts.array2Obj('value', 'label');
        },
        projectPhaseDictsMap: function() {
            return this.projectPhaseDicts.array2Obj('value', 'label');
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            var _this=this;
            getDicts('PROJECT_TYPE_ONE_DICT,PROJECT_TYPE_TWO_DICT,PROJECT_STATUS_DICT,PROJECT_INFO_OPERATE_STATUS_DICT,PROJECT_PHASE_DICT,PROJECT_TYPE_DICT').then(result => {
                if (result.data) {
                    this.projectStatusDicts = result.data[2];
                    this.projectOperateStatusDicts = result.data[3];
                    this.projectPhaseDicts = result.data[4];
                    this.projectTypeDicts = result.data[5];
                    result.data.forEach((element,index) => {
                        element.unshift({
                            label: "全部",
                            selected: 1,
                            value: index == 0 ? "all" : ''
                        });
                        if(index===1){
                            this.dicts.push([]);
                        }else{
                            this.dicts.push(element);
                        }
                    });
                }
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.projectInfos || [];
        },
        toView: function (item) {
            this.$parent.closeTabByName('ProDetailed');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "ProDetailed",
                "name": "ProDetailed",
                "parentId": "4",
                "text": '查看项目详情',
                "children": []
            }, 3, {
                id: item.id,
                onlyRead: true,
            });
        },
        handleLevelTab: function (paramName, dictValue) {
            var _this = this;
            if (paramName === 'PROJECT_TYPE_ONE_DICT') {
                if (dictValue != 'all') {
                    getDictByTypeValue('PROJECT_TYPE_TWO_DICT', dictValue).then(result => {
                    if (result.data) {
                        var linkageTypes = result.data;
                        linkageTypes.unshift({
                            label: "全部",
                            selected: 1,
                            value: ""
                        });
                        this.$set(this.dicts, 1, result.data);
                    }


                    });
                    return true;
                } else {
                    this.$set(this.dicts, 1, []);
                    return true;
                }
            } else {
                return true;
            }
        },
        edit: function(projectInfo) {
         	this.$parent.closeTabByName('ProjectInfoForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "projectInfo",
                "name": "ProjectInfoForm",
                "parentId": "4",
                "text": "项目信息更新",
                "children": [

                ]
            }, 3, {
                id: projectInfo.id,
            });
        },
        del: function(projectInfo) {
            confirm('确定删除该记录吗？', () => {
                del(projectInfo.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>

</style>