<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>单据流水号规则</p>
		</div>       
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysSerialNumbers'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title" style="margin-right: 14px;">规则名称：</span>
                                    <input  type="text"  v-model="otherParam.ruleName" placeholder="请输入">
                                </template>
                                <template slot="opera">
                                    <!--<button @click="create" type="button" class="btn btn-outline btn-info pull-left layui-btn-lg layui-btn-blue"><i class="fa fa-paste"></i>&nbsp;&nbsp;新增</button>-->
                                    <button @click="create" type="button" class="layui-btn layui-btn-icon layui-btn-primary"><i
                                            class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;新增
                                    </button>
                                </template>
                                <template slot="main">                           
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">规则名称</th>
												<th style="text-align:center;">修改人</th>
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
													<td style="text-align:center;">{{ item.ruleName }}</td>										
													<td style="text-align:center;">{{userNameMap[item.updateBy].userName }}</td>
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
import { del } from '@/api/sys/sysSerialNumber'
import Base from '@/views/base/Base'
export default {
    extends: Base,
    name:'SysSerialNumberList',
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                ruleName:null
            },
            refresh: true,
            page: {
            },
            userNameMap:{

            },
        }
    },
    computed: {
       /** linkageTypeMap: function() {
            return this.dicts[0].array2Obj('value', 'label');
        }
        */
    },
    mounted () {
        this.initData();
    },
    methods: {
        //初始化方法
        initData: function() {
            getDicts('RESET_CYCLE_DICT,').then(result => {         	
                var linkageTypes = result.data[0];
                //设置第一个值
                linkageTypes.unshift({
                    label: "全部",
                    selected: 1,
                    value: ""
                });
                //将linkageTypes推送添加到dicts
                this.dicts.push(linkageTypes);
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysSerialNumbers || [];
            this.userNameMap = data.userNameMap || [];
        },
        //新增，跳转到下面"name"指定的.vue文件
        create: function() {
            this.$parent.closeTabByName("SysSerialNumberForm");
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysSerialNumber",
                "name": "SysSerialNumberForm",
                "parentId": "4",
                "text": "新增流水号规则",
                "children": [
                ]
            }, 3);
        },
        //修改，跳转到下面"name"指定的.vue文件，并且携带参数  id:sysSerialNumber.id,
        edit: function(sysSerialNumber) {
            this.$parent.closeTabByName("SysSerialNumberForm");          
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysSerialNumber",
                "name": "SysSerialNumberForm",
                "parentId": "4",
                "text": "修改流水号规则",
                "children": [
                ]
            }, 3, {
                id:sysSerialNumber.id,
            });
        },
        del: function(sysSerialNumber) {
            confirm('确定删除该记录吗？', () => {
                del(sysSerialNumber.id).then(result => {
                    alert("删除成功");
                    //刷新页面
                    this.$refs.pagination.refresh();
                });
            });
        },
    }
}
</script>

<style scoped>

</style>