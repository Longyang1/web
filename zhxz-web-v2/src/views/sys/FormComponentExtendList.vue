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
                                :url="'./sys/formComponentExtends'"
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
												<th style="text-align:center;">组件ID</th>
												<th style="text-align:center;">数据名称</th>
												<th style="text-align:center;">数据编码</th>
												<th style="text-align:center;">列表数据源</th>
												<th style="text-align:center;">数据参数</th>
												<th style="text-align:center;">数据显示顺序</th>
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
													<td style="text-align:center;">{{ item.componentId }}</td>
													<td style="text-align:center;">{{ item.dataName }}</td>
													<td style="text-align:center;">{{ item.dataCode }}</td>
													<td style="text-align:center;">{{ item.dataDictSrc }}</td>
													<td style="text-align:center;">{{ item.dataParam }}</td>
													<td style="text-align:center;">{{ item.dataDisplayOrder }}</td>
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
import { del } from '@/api/sys/formComponentExtend'
import Base from "@/views/base/Base"

export default {
	extends: Base,
    data () {
        return {
        	menuId: 'FormComponentExtendList',
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
            getDicts('DATA_DICT_SRC,').then(result => {
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
            this.page['list'] = data.formComponentExtends || [];
        },
        create: function() {
         	this.$parent.closeTabByName('FormComponentExtendForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "formComponentExtend",
                "name": "FormComponentExtendForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(formComponentExtend) {
         	this.$parent.closeTabByName('FormComponentExtendForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "formComponentExtend",
                "name": "FormComponentExtendForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                id: formComponentExtend.id,
            });
        },
        del: function(formComponentExtend) {
            confirm('确定删除该记录吗？', () => {
                del(formComponentExtend.id).then(result => {
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