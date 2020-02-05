<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>栏目列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./cms/cmsCategorys'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                	
                                    <span class="title title-text">栏目名称：</span>
                                    <input type="text" v-model="otherParam.name" placeholder="请输入栏目名称">
                                   
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">父级编号</th>
												<th style="text-align:center;">栏目模块</th>
												<th style="text-align:center;">栏目名称</th>
												<th style="text-align:center;">链接</th>
												<th style="text-align:center;">目标</th>
												<th style="text-align:center;">描述</th>
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
													<td style="text-align:center;">{{ item.parentId }}</td>
													<td style="text-align:center;">{{ item.module }}</td>
													<td style="text-align:center;">{{ item.name }}</td>
													<td style="text-align:center;">{{ item.href }}</td>
													<td style="text-align:center;">{{ item.target }}</td>
													<td style="text-align:center;">{{ item.description }}</td>
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
import { del } from '@/api/cms/cmsCategory'
import Base from "@/views/base/Base"

export default {
	name: 'CmsCategoryList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                name: ''
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
            getDicts('').then(result => {
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
            this.page['list'] = data.cmsCategorys || [];
        },
        create: function() {
         	this.$parent.closeTabByName('CmsCategoryForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "cmsCategory",
                "name": "CmsCategoryForm",
                "parentId": "4",
                "text": "栏目创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(cmsCategory) {
         	this.$parent.closeTabByName('CmsCategoryForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "cmsCategory",
                "name": "CmsCategoryForm",
                "parentId": "4",
                "text": "栏目信息更新",
                "children": [

                ]
            }, 3, {
                id: cmsCategory.id,
            });
        },
        del: function(cmsCategory) {
            confirm('确定删除该记录吗？', () => {
                del(cmsCategory.id).then(result => {
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