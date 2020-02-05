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
                                :url="'./personnel/personnelBookCategorys'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                	<!--
                                    <span class="title title-text">部门名称：</span>
                                    <input @click="officeClick" type="text" readonly="readonly" v-model="officeName" placeholder="点击选择部门">
                                    -->
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">类别名称</th>
												<th style="text-align:center;">类别类型</th>
												<th style="text-align:center;">类别类型代码</th>
												<th style="text-align:center;">所属部室</th>
												<th style="text-align:center;">负责人</th>
												<th style="text-align:center;">数据来源</th>
												<th style="text-align:center;">序号</th>
												<th style="text-align:center;">状态</th>
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
													<td style="text-align:center;">{{ item.categoryName }}</td>
													<td style="text-align:center;">{{ item.categoryType }}</td>
													<td style="text-align:center;">{{ item.categoryTypeDict }}</td>
													<td style="text-align:center;">{{ item.officeId }}</td>
													<td style="text-align:center;">{{ item.userId }}</td>
													<td style="text-align:center;">{{ item.dataSource }}</td>
													<td style="text-align:center;">{{ item.categoryOrder }}</td>
													<td style="text-align:center;">{{ item.categoryStatus }}</td>
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
import { del } from '@/api/personnel/personnelBookCategory'
import Base from "@/views/base/Base"

export default {
	name: 'PersonnelBookCategoryList',
	extends: Base,
    data () {
        return {
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
            getDicts('CATEGORY_TYPE_DICT,').then(result => {
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
            this.page['list'] = data.personnelBookCategorys || [];
        },
        create: function() {
         	this.$parent.closeTabByName('PersonnelBookCategoryForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelBookCategory",
                "name": "PersonnelBookCategoryForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(personnelBookCategory) {
         	this.$parent.closeTabByName('PersonnelBookCategoryForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelBookCategory",
                "name": "PersonnelBookCategoryForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                id: personnelBookCategory.id,
            });
        },
        del: function(personnelBookCategory) {
            confirm('确定删除该记录吗？', () => {
                del(personnelBookCategory.id).then(result => {
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