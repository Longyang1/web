<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>流程管理</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./workflow/process/processDefinitions'"
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
                                 </template>
                                <template slot="opera">
                                    <file-upload-button 
                                        text="流程部署" 
                                        url="/api/workflow/process/deploy" 
                                        module=“workflow”
                                        exts="zip|bar|bpmn|xml|png"></file-upload-button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                         <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">流程定义名称</th>
												<th style="text-align:center;">KEY</th>
												<th style="text-align:center;width: 120px;">版本</th>
												<th style="text-align:center;width: 145px;">状态</th>
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
													<td style="text-align:center;">{{ item.name }}</td>
													<td style="text-align:center;">{{ item.key }}</td>
													<td style="text-align:center;">{{ item.version }}</td>
													<td style="text-align:center;">{{ item.isSuspended }}</td>
                                                    <!-- <td style="text-align:center;">
                                                        <a @click="handleTask(item)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>办理</a>
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
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import DeployFlowModal from './DeployFlowModal'

export default {
	name: 'ProcessManage',
    extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                processDefinitionName: '',
            },
            refresh: true,
            page: {

            },
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
        deployFlow() {
            this.$layer.iframe({
                content: {
                    content: DeployFlowModal,
                    parent: this,//当前的vue对象
                    data: [
                        
                    ]
                },
                area:['500px', "380px"],
                title: "部署流程",
            });
        },
        initData: function() {
            getDicts('').then(result => {
            	
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.processDefinitions || [];
        },
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
</style>
