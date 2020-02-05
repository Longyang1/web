<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>短信列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysSmss'"
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
												<th style="text-align:center;width: 110px;">手机号码</th>
												<th style="text-align:center;">短信内容</th>
												<th style="text-align:center;">结果</th>
												<th style="text-align:center;width: 140px;">平台发送时间</th>
												<th style="text-align:center;">短信业务类型</th>
                                                <th v-if="false" style="text-align:center;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;width: 110px;">{{ item.receivePhone }}</td>
													<td style="text-align:center;">{{ item.smsContent }}</td>
													<td style="text-align:center;">{{ item.moSmsContent }}</td>
													<td style="text-align:center;width: 140px;">{{ item.sendTime | moment('YYYY-MM-DD HH:mm') }}</td>
													<td style="text-align:center;">{{ item.businessType }}</td>
                                                    <td v-if="false" style="text-align:center;">
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
import { del } from '@/api/sys/sysSms'
import Base from "@/views/base/Base"

export default {
	name: 'SysSmsList',
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
            this.page['list'] = data.sysSmss || [];
        },
        create: function() {
         	this.$parent.closeTabByName('SysSmsForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysSms",
                "name": "SysSmsForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysSms) {
         	this.$parent.closeTabByName('SysSmsForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysSms",
                "name": "SysSmsForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                smsId: sysSms.smsId,
            });
        },
        del: function(sysSms) {
            confirm('确定删除该记录吗？', () => {
                del(sysSms.smsId).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
.table tr td {
    white-space: normal;
}
</style>