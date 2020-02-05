<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>用户组列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysCustomGroups'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title" style="margin-right: 14px;">用户组名称：</span>
                                    <input type="text" v-model="otherParam.groupName" placeholder="请输入用户组名称">
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建用户组</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">组名称</th>
												<th style="text-align:center;">用户数量</th>
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
													<td style="text-align:center;">{{ item.groupName }}</td>
													<td style="text-align:center;">{{ item.userIdInfo ? item.userIdInfo.split(',').length : 0 }}</td>
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
import { del } from '@/api/sys/sysCustomGroup'
import Base from "@/views/base/Base"

export default {
    name: 'SysCustomGroupList',
	extends: Base,
    data () {
        return {
        	menuId: 'SysCustomGroupList',
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                groupName: ''
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
            
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysCustomGroups || [];
        },
        create: function() {
         	this.$parent.closeTabByName('SysCustomGroupForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysCustomGroup",
                "name": "SysCustomGroupForm",
                "parentId": "4",
                "text": "用户组创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysCustomGroup) {
         	this.$parent.closeTabByName('SysCustomGroupForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysCustomGroup",
                "name": "SysCustomGroupForm",
                "parentId": "4",
                "text": "用户组信息更新",
                "children": [

                ]
            }, 3, {
                id: sysCustomGroup.id,
            });
        },
        del: function(sysCustomGroup) {
            confirm('确定删除该记录吗？', () => {
                del(sysCustomGroup.id).then(result => {
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