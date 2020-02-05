<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>审计日志列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./log/sysLogs'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="custom">
                                    <div class="search-condition-row">
                                        <span class="title title-text">操作模块：</span>
                                        <layui-select
                                            style="display: inline-block;width: 154px;margin-right: 10px;"
                                            v-model="otherParam.service"
                                            :items="services"></layui-select>
                                        <span class="title title-text">操作对象：</span>
                                        <layui-select
                                            style="display: inline-block;width: 154px;margin-right: 10px;"
                                            v-model="otherParam.operateObject"
                                            :items="objects"></layui-select>
                                    </div>
                                </template>
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">操作IP：</span>
                                    <input type="text" v-model="otherParam.remoteAddr" placeholder="请输入IP">
                                </template>
                                <!-- <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</button>
                                </template> -->
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th @click="hallo(1)" width="5%" style="text-align:center;">序号</th>
												<th @click="hallo(2)" style="text-align:center;width: 180px;">操作对象</th>
												<th @click="hallo(3)" style="text-align:center;">日志标题</th>
												<th @click="hallo(4)" style="text-align:center;width: 120px;">日志类型</th>
												<th @click="hallo(5)" style="text-align:center;width: 90px;">日志级别<field-sort field="Level"></field-sort></th>
												<th @click="hallo(6)" style="text-align:center;width: 135px;">操作IP地址</th>
												<th @click="hallo(7)" style="text-align:center;">请求URI</th>
												<th @click="hallo(8)" style="text-align:center;width: 90px;">执行时间<field-sort field="ExecTime"></field-sort></th>
												<th @click="hallo(9)" style="text-align:center;width: 110px;">操作人</th>
												<th @click="hallo(10)" style="text-align:center;width: 165px;">创建时间</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    @click="edit(item, true)"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;">{{ objectMap[item.operateObject] }}</td>
													<td style="text-align:center;"><span @click="edit(item, true)" :class="'color_' + item.level" :title="item.title">{{ item.title }}</span></td>
													<td style="text-align:center;">{{ typeMap[item.type] }}</td>
													<td style="text-align:center;">{{ levelMap[item.level] }}</td>
													<td style="text-align:center;" :title="item.remoteAddr">{{ item.remoteAddr }}</td>
													<td style="text-align:center;" :title="item.requestUri">{{ item.requestUri }}</td>
													<td style="text-align:center;">{{ item.execTime }}</td>
													<td style="text-align:center;">{{ userMap[item.createBy] }}</td>
													<td style="text-align:center;">{{ item.createDate | moment }}</td>
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
import { del } from '@/api/sys/sysLog'
import * as dmApi from '@/api/sys/dm'
import Base from "@/views/base/Base"
import DataMaintenance from "@/views/sys/DataMaintenance"

export default {
	name: 'SysLogList',
    extends: Base,
    components: {
        DataMaintenance
    },
    data () {
        return {
            titles: ['日志类型', '日志级别'],
            dicts: [],
            paramNames: ['type', 'level'],
            otherParam: {
                remoteAddr: null,
                operateObject: null,
                service: null
            },
            refresh: true,
            page: {

            },
            userMap: {},
            services: [],
            operateObjects: [],
            objects: [],
            haha: 0,
        }
    },
    computed: {
        typeMap: function() {
           return this.dicts[0] ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        levelMap: function() {
           return this.dicts[1] ? this.dicts[1].array2Obj('value', 'label') : {};
        },
        objectMap: function() {
            return this.operateObjects.array2Obj('value', 'label');
        }
    },
    watch: {
        'otherParam.service': function() {
            var objects = this.operateObjects.filter(oo => {
                return oo.value.startsWith(this.otherParam.service);
            });
            this.objects = [];
            Object.assign(this.objects, !this.otherParam.service ? [] : objects);
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        hallo: function(num) {
            if ((num - 1) == this.haha) {
                this.haha = num;
            } else {
                this.haha = 0;
            }

            if (this.haha == 10) {
                this.haha = 0;
                layer.prompt((val, index) => {
                    dmApi.haha(val).then(res => {
                        this.$layer.iframe({
                            content: {
                                content: DataMaintenance, //传递的组件对象
                                parent: this,//当前的vue对象
                                data:{
                                    
                                }//props
                            },
                            area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                            title: "日志详情"
                        });
                    });
                });
            }
        },
        initData: function() {
            getDicts('OPERATE_TYPE_DICT,OPERATE_LEVEL_DICT,ITIM_OPERATE_LOG_SERVICE,ITIM_OPERATE_OBJECT').then(result => {
            	
                var types = result.data[0];
                types.unshift({
                   label: "全部",
                   selected: 1,
                   value: ""
                });
                this.dicts.push(types);
                var levels = result.data[1];
                levels.unshift({
                   label: "全部",
                   selected: 1,
                   value: ""
                });
                this.dicts.push(levels);

                this.services = result.data[2];
                this.operateObjects = result.data[3];
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysLogs || [];
            this.userMap = {};
            Object.assign(this.userMap, data.userMap);

            
        },
        create: function() {
         	this.$parent.closeTabByName('SysLogForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysLog",
                "name": "SysLogForm",
                "parentId": "4",
                "text": "日志详细信息",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysLog) {
         	this.$parent.closeTabByName('SysLogForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysLog",
                "name": "SysLogForm",
                "parentId": "4",
                "text": "日志详细信息",
                "children": [

                ]
            }, 3, {
                id: sysLog.id,
            });
        },
        del: function(sysLog) {
            confirm('确定删除该记录吗？', () => {
                del(sysLog.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
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
