<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>已处理</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./workflow/tasks'"
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
                                    <span class="title title-text">节点名称：</span>
                                    <input type="text" v-model="otherParam.taskName" placeholder="请输入节点名称">
                                    <span class="title title-text">发起人：</span>
                                    <select-user-input style="width: 95px;display: inline;" type="simple" v-model="otherParam.startUserId" placeholder="请选择发起人"></select-user-input>
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
												<th style="text-align:center;">节点名称</th>
												<th style="text-align:center;width: 120px;">发起人</th>
												<th style="text-align:center;width: 145px;">发起时间</th>
                                                <th style="text-align:center;width: 145px;">处理时间</th>
                                                <th style="text-align:center;width: 145px;">处理结果</th>
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
													<td style="text-align:center;">{{ item.processDefinitionName }}</td>
													<td style="text-align:center;"><span @click="handleTask(item, true)" :title="item.name">{{ item.name }}</span></td>
													<td style="text-align:center;">{{ userMap[item.startUserId] }}</td>
													<td style="text-align:center;">{{ item.createTime | moment }}</td>
                                                    <td style="text-align:center;">{{ item.endTime | moment }}</td>
                                                    <td :class="'result-' + item.deleteReason" style="text-align:center;">{{ approvalResultMap[item.deleteReason] }}</td>
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
	name: 'Processed',
    extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                taskType: 'processed',
                taskName: '',
                processDefinitionName: '',
                startUserId: '',
                beginDate: '',
                endDate: '',
            },
            refresh: true,
            page: {

            },
            userMap: {},
            processViewMap: {},
            approvalResultMap: {}
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
            getDicts('PROCESS_VIEW,APPROVAL_RESULT').then(result => {
                let data = result.data;
                this.processViewMap = data[0].array2Obj('value', 'label');
                this.approvalResultMap = (data[1] || []).array2Obj('value', 'label');
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.tasks || [];
            this.userMap = {};
            Object.assign(this.userMap, data.userMap);
        },
        handleTask(task) {
            console.log(task.processConfig)
            var parent = this.$parent.closeTabByName ? this.$parent : this.$parent.$parent;
            let viewName = this.processViewMap[task.processKey];
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
                id: task.processBusinessKey,
                enableFlow: true,
                listView: "ToProcessed",
                processKey: task.processKey
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
    .result-3 {
        color: #fb8f76;
    }
    .result-4 {
        color: #28d88b;
    }
    .result-5 {
        color: #ed4014;
    }
    .result-6 {
        color: #ffa024;
    }
    .result-7 {
        color: #1e88f5;
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
