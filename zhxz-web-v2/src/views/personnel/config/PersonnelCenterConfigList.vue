<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>中心列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./personnel/personnelCenterConfigs'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">部门名称：</span>
                                    <input @click="officeClick" type="text" readonly="readonly" v-model="officeNameMap[otherParam.officeId]" placeholder="点击选择部门">
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建中心</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">所属部门</th>
												<th style="text-align:center;">中心名称</th>
												<th style="text-align:center;">中心代码</th>
												<!-- <th style="text-align:center;">状态</th> -->
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
													<td style="text-align:center;">{{ officeNameMap[item.officeId] }}</td>
													<td style="text-align:center;">{{ item.centerName }}</td>
													<td style="text-align:center;">{{ item.centerCode }}</td>
													<!-- <td style="text-align:center;">{{ item.centerStatus }}</td> -->
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
import { del } from '@/api/personnel/personnelCenterConfig'
import Base from "@/views/base/Base"
import OfficeTree from '@/components/OfficeTree'

export default {
	name: 'PersonnelCenterConfigList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                officeId: ''
            },
            refresh: true,
            page: {

            },
            officeNameMap: {},
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
        clickNodeAfter: function(node){
            this.otherParam.officeId = node.id;
            this.officeName = node.name;
            this.officeNameMap[node.id] = node.name;
            this.$layer.closeAll();
        },
    	officeClick: function(){
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: [
                       
                    ]
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title:"部门选择"
			});
    	},
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
            this.page['list'] = data.personnelCenterConfigs || [];
            this.officeNameMap = data.officeNameMap || {};
        },
        create: function() {
         	this.$parent.closeTabByName('PersonnelCenterConfigForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelCenterConfig",
                "name": "PersonnelCenterConfigForm",
                "parentId": "4",
                "text": "中心创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(personnelCenterConfig) {
         	this.$parent.closeTabByName('PersonnelCenterConfigForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelCenterConfig",
                "name": "PersonnelCenterConfigForm",
                "parentId": "4",
                "text": "中心信息更新",
                "children": [

                ]
            }, 3, {
                id: personnelCenterConfig.id,
            });
        },
        del: function(personnelCenterConfig) {
            confirm('确定删除该记录吗？', () => {
                del(personnelCenterConfig.id).then(result => {
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