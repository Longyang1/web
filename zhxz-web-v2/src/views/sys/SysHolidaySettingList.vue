<template>
    <div class="tab-background float-e-margins">
         <div class="tab-header">
			<p>节假日维护</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysHolidaySettings'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title" style="margin-right: 14px;">节假日：</span>
                                    <input  type="text" v-model="otherParam.holidayName" placeholder="请输入">                                 
                                </template>
                                <template slot="opera">
                                    <button @click="create" type="button" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;新增</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">节假日名称</th>
												<th style="text-align:center;width:10%">节假日类型</th>									
												<th style="text-align:center;width:10%">节假工作类型</th>
                                                <th style="text-align:center;width:26%">时间</th>
												<th style="text-align:center;width:10%">最后更新人员</th>								
                                                <th style="text-align:center;width:15%">最后更新时间</th>
                                                <th style="text-align:center;width:14%">操作</th>                                     
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;">{{ item.holidayName }}</td>
													<td style="text-align:center;">{{ holidayTypeDicts[item.holidayTypeDict] }}</td>											
													<td style="text-align:center;">{{ holidayWorkTypeDicts[item.holidayWorkTypeDict] }}</td>	
                                                    <td style="text-align:center;">{{ item.startTime | moment('YYYY-MM-DD ')}}至&nbsp;{{ item.endTime | moment('YYYY-MM-DD ')}}</td>										
													<td style="text-align:center;">{{userNameMap[item.updateBy].userName }}</td>
                                                    <td style="text-align:center;">{{ item.updateDate | moment('YYYY-MM-DD hh:mm') }}</td>
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
import { del } from '@/api/sys/sysHolidaySetting'
import Base from '@/views/base/Base'
export default {
    extends: Base,
    name:'SysHolidaySettingList',
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
               holidayName:null
            },
            refresh: true,
            page: {

            },
            userNameMap:[],
        }
    },
    computed: {
    	//创建map结构，存储holidayType为value，holidayTypeDict为key；以便在页面展示中文值
        holidayTypeDicts:function() {
            return this.dicts[0] ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        holidayWorkTypeDicts:function() {
            return this.dicts[1] ? this.dicts[1].array2Obj('value', 'label') : {};
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            //this.$refs.pagination.refresh();
            getDicts('HOLIDAY_TYPE_DICT,HOLIDAY_WORK_TYPE_DICT,').then(result => {
                this.dicts=result.data || [];
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysHolidaySettings || [];
            this.userNameMap = data.userNameMap || [];
        },
        //新增，跳转到下面"name"指定的.vue文件
        create: function() {
            this.$parent.closeTabByName("SysHolidaySettingForm");
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysHolidaySetting",
                "name": "SysHolidaySettingForm",
                "parentId": "4",
                "text": "新增节假日",
                "children": [

                ]
            }, 3);
        },
         //修改，跳转到下面"name"指定的.vue文件，并且携带参数 id: sysHolidaySetting.id,
        edit: function(sysHolidaySetting) {
            this.$parent.closeTabByName("SysHolidaySettingForm");
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysHolidaySetting",
                "name": "SysHolidaySettingForm",
                "parentId": "4",
                "text": "修改节假日",
                "children": [

                ]
            }, 3, {
                id: sysHolidaySetting.id,
            });
        },
        del: function(sysHolidaySetting) {
            confirm('确定删除该记录吗？', () => {
                del(sysHolidaySetting.id).then(result => {
                    alert("删除成功");
                    //刷新页面
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>

</style>