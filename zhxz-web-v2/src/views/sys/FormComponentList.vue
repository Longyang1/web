<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>XX列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/formComponents'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                	<!--
                                    <span class="title" style="margin-right: 14px;">部门名称:</span>
                                    <input @click="officeClick" type="text" readonly="readonly" v-model="officeName" placeholder="点击选择部门">
                                    -->
                                </template>
                                <template slot="searchBtnAfter">
                                    <button @click="create" type="button" class="btn btn-outline btn-info pull-right"><i class="fa fa-paste"></i>&nbsp;&nbsp;创建XX</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">表单配置树类型</th>
												<th style="text-align:center;">表单配置树类型代码</th>
												<th style="text-align:center;">表单配置节点类型</th>
												<th style="text-align:center;">表单配置节点类型代码</th>
												<th style="text-align:center;">节点名称</th>
												<th style="text-align:center;">节点编码</th>
												<th style="text-align:center;">节点显示顺序</th>
												<th style="text-align:center;">节点图标</th>
												<th style="text-align:center;">可用状态</th>
												<th style="text-align:center;">节点父ID</th>
												<th style="text-align:center;">节点层级编码</th>
												<th style="text-align:center;">节点级别</th>
												<th style="text-align:center;">节点全称</th>
												<th style="text-align:center;">节点描述</th>
												<th style="text-align:center;">节点参数</th>
												<th style="text-align:center;">表单组件类别</th>
												<th style="text-align:center;">表单组件类别代码</th>
												<th style="text-align:center;">组件显示文本</th>
												<th style="text-align:center;">关联前端组件</th>
												<th style="text-align:center;">组件数据存储方式</th>
												<th style="text-align:center;">组件数据存储方式代码</th>
												<th style="text-align:center;">组件数据存储表名</th>
												<th style="text-align:center;">组件数据类型</th>
												<th style="text-align:center;">组件数据类型代码</th>
												<th style="text-align:center;">组件缺省值</th>
												<th style="text-align:center;">组件有效性</th>
												<th style="text-align:center;">组件有效性代码</th>
												<th style="text-align:center;">组件正则表达式</th>
												<th style="text-align:center;">组件提示语</th>
												<th style="text-align:center;">组件长度</th>
												<th style="text-align:center;">组件宽度</th>
												<th style="text-align:center;">组件高度</th>
												<th style="text-align:center;">组件样式</th>
												<th style="text-align:center;">组件事件</th>
												<th style="text-align:center;">组件数据源</th>
												<th style="text-align:center;">组件数据源参数</th>
												<th style="text-align:center;">数据列表有效性</th>
												<th style="text-align:center;">数据列表有效性代码</th>
												<th style="text-align:center;">数据列表选择个数</th>
												<th style="text-align:center;">备注</th>
												<th style="text-align:center;">创建人</th>
												<th style="text-align:center;">创建时间</th>
												<th style="text-align:center;">修改人</th>
												<th style="text-align:center;">修改时间</th>
                                                <th style="text-align:center;">更新时间</th>
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
													<td style="text-align:center;">{{ item.formConfigType }}</td>
													<td style="text-align:center;">{{ item.formConfigTypeDict }}</td>
													<td style="text-align:center;">{{ item.formConfigNodeType }}</td>
													<td style="text-align:center;">{{ item.formConfigNodeTypeDict }}</td>
													<td style="text-align:center;">{{ item.nodeName }}</td>
													<td style="text-align:center;">{{ item.nodeCode }}</td>
													<td style="text-align:center;">{{ item.nodeOrder }}</td>
													<td style="text-align:center;">{{ item.nodeIcon }}</td>
													<td style="text-align:center;">{{ item.availableStatus }}</td>
													<td style="text-align:center;">{{ item.nodeParentId }}</td>
													<td style="text-align:center;">{{ item.nodeLayerCode }}</td>
													<td style="text-align:center;">{{ item.nodeLevel }}</td>
													<td style="text-align:center;">{{ item.nodeFullName }}</td>
													<td style="text-align:center;">{{ item.nodeDesc }}</td>
													<td style="text-align:center;">{{ item.nodeParam }}</td>
													<td style="text-align:center;">{{ item.formComponentCatalog }}</td>
													<td style="text-align:center;">{{ item.formComponentCatalogDict }}</td>
													<td style="text-align:center;">{{ item.componentDisplayText }}</td>
													<td style="text-align:center;">{{ item.frontComponent }}</td>
													<td style="text-align:center;">{{ item.componentSaveType }}</td>
													<td style="text-align:center;">{{ item.componentSaveTypeDict }}</td>
													<td style="text-align:center;">{{ item.componentDataSaveTable }}</td>
													<td style="text-align:center;">{{ item.componentDataType }}</td>
													<td style="text-align:center;">{{ item.componentDataTypeDict }}</td>
													<td style="text-align:center;">{{ item.componentDefaultValue }}</td>
													<td style="text-align:center;">{{ item.componentValidity }}</td>
													<td style="text-align:center;">{{ item.componentValidityDict }}</td>
													<td style="text-align:center;">{{ item.regularExpression }}</td>
													<td style="text-align:center;">{{ item.componentTips }}</td>
													<td style="text-align:center;">{{ item.componentLength }}</td>
													<td style="text-align:center;">{{ item.componentWidth }}</td>
													<td style="text-align:center;">{{ item.componentHeight }}</td>
													<td style="text-align:center;">{{ item.componentClass }}</td>
													<td style="text-align:center;">{{ item.componentEvent }}</td>
													<td style="text-align:center;">{{ item.componentDictSrc }}</td>
													<td style="text-align:center;">{{ item.componentDictParam }}</td>
													<td style="text-align:center;">{{ item.dataListValidity }}</td>
													<td style="text-align:center;">{{ item.dataListValidityDict }}</td>
													<td style="text-align:center;">{{ item.componentDataSelectCount }}</td>
													<td style="text-align:center;">{{ item.componentRemark }}</td>
													<td style="text-align:center;">{{ item.createBy }}</td>
													<td style="text-align:center;">{{ item.createDate }}</td>
													<td style="text-align:center;">{{ item.updateBy }}</td>
													<td style="text-align:center;">{{ item.updateDate }}</td>
                                                    <td style="text-align:center;">{{ item.updateDate | moment }}</td>
                                                    <td style="text-align:center;">
                                                        <a @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
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
import { del } from '@/api/sys/formComponent'
import Base from "@/views/base/Base"

export default {
	extends: Base,
    data () {
        return {
        	menuId: 'FormComponentList',
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                
            },
            refresh: true,
            page: {

            },
        }
    },
    computed: {
    	//
        //linkageTypeMap: function() {
        //    return this.dicts[0].array2Obj('value', 'label');
        //}
        //
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            getDicts('FORM_CONFIG_TYPE_DICT,FORM_CONFIG_NODE_TYPE_DICT,FORM_COMPONENT_CATALOG_DICT,COMPONENT_SAVE_TYPE_DICT,COMPONENT_DATA_TYPE_DICT,COMPONENT_VALIDITY_DICT,COMPONENT_DICT_SRC,COMPONENT_DICT_PARAM,DATA_LIST_VALIDITY_DICT,').then(result => {
            	//
                //var linkageTypes = result.data[0];
                //linkageTypes.unshift({
                //    label: "全部",
                //    selected: 1,
                //    value: ""
                //});
                //this.dicts.push(linkageTypes);
                //
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.formComponents || [];
        },
        create: function() {
         	this.$parent.closeTabByName('FormComponentForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "formComponent",
                "name": "FormComponentForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(formComponent) {
         	this.$parent.closeTabByName('FormComponentForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "formComponent",
                "name": "FormComponentForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                id: formComponent.id,
            });
        },
        del: function(formComponent) {
            confirm('确定删除该记录吗？', () => {
                del(formComponent.id).then(result => {
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