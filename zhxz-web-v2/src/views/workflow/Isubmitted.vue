<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>我提交的</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./workflow/process'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :autoSearch="true"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">流程名称：</span>
                                    <input type="text" v-model="otherParam.processDefinitionName" placeholder="请输入流程名称">
                                    <span class="title title-text">发起时间：</span>
                                    <layui-date
                                        class="date"
                                        v-model="otherParam.beginDate"
                                        name="psfd-startTime"
                                        format="yyyy/MM/dd"
                                        style="display:inline-block;padding-left: 6px;"></layui-date>
                                    至
                                    <layui-date
                                        class="date"
                                        v-model="otherParam.endDate"
                                        name="psfd-endTime"
                                        format="yyyy/MM/dd"
                                        style="display:inline-block;padding-left: 8px;"></layui-date>
                                </template>
                                <!-- <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</button>
                                </template> -->
                                <template slot="main">
                                    <table class="footable table table-stripped" style="margin-top: 20px">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">流程名称</th>
												<!-- <th style="text-align:center;width: 120px;">发起人</th> -->
												<th style="text-align:center;width: 145px;">发起时间</th>
                                                <th style="text-align:center;width: 145px;">结束时间</th>
                                                <th style="text-align:center;">当前节点</th>
                                                <th style="text-align:center;">待办人员</th>
                                                <th style="text-align:center;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;"><span @click="handleTask(item, true)" :title="item.processDefinitionName">{{ item.processDefinitionName }}</span></td>
													<!-- <td style="text-align:center;">{{ userMap[item.startUserId] }}</td> -->
													<td style="text-align:center;">{{ item.startTime | moment }}</td>
                                                    <td style="text-align:center;">{{ item.endTime | moment }}</td>
                                                    <td style="text-align:center;">
                                                        <template v-for="task in item.tasks">
                                                            {{ task.name }}
                                                        </template>
                                                    </td>
                                                    <td style="text-align:center;">
                                                        <template v-for="task in item.tasks">
                                                            <template v-for="(userId, aindex) in task.assignee.split(',')">
                                                                {{ userMap[userId] }}<template v-if="(aindex + 1) < task.assignee.split(',').length">、</template>
                                                            </template>
                                                        </template>
                                                    </td>
                                                    <td style="text-align:center;">
                                                        <a @click="handleTask(item)" style="margin-right:10px"><i class="fa fa-eye" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</a>
                                                    </td>
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
import Base from "@/views/base/Base"

export default {
	name: 'Isubmitted',
    extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                processDefinitionName: '',
                beginDate: '',
                endDate: '',
            },
            refresh: true,
            page: {

            },
            userMap: {},
            processViewMap: {}
        }
    },
    computed: {

    },
    watch: {
       
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            getDicts('PROCESS_VIEW').then(result => {
                let data = result.data;
            	this.processViewMap = data[0].array2Obj('value', 'label');
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.processInstances || [];
            this.userMap = {};
            Object.assign(this.userMap, data.userMap);
        },
        handleTask(process) {
            var parent = this.$parent.closeTabByName ? this.$parent : this.$parent.$parent;
            let viewName = this.processViewMap[process.processDefinitionKey];
         	parent.closeTabByName(viewName);
            parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "cmsArticle",
                "name": viewName,
                "parentId": "4",
                "text": "任务办理",
                "children": [

                ]
            }, 3, {
                id: process.businessKey,
                enableFlow: true,
                listView: "Isubmitted",
                processKey: process.processDefinitionKey
            });
        }
    }
}
</script>

<style scoped>
.footable_table td > span {
    color: rgb(30, 159, 255);
}
.footable_table td > span.color_0 {
    color: rgb(30, 159, 255);
}
.footable_table td > span.color_1 {
    color: #FFB800;;
}
.footable_table td > span.color_2 {
    color: red;
}
.footable_table td > span.color_9 {
    color: rgb(30, 159, 255);
}
.tab-background /deep/ .layui-form-select input {
    height: 26px;
    border-color: #ced2d7;
}
.tab-background /deep/ .search-condition-row > div input {
    width: 95px !important;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ced2d7;
}
.tab-background /deep/ .search-condition-row .date input {
    width: 90px !important;
}
</style>
