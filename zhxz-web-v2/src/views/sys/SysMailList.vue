<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>系统邮件</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysMails'"
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
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">接收地址</th>
												<th style="text-align:center;">邮件主题</th>
												<th style="text-align:center;">邮件内容</th>
												<th style="text-align:center;">发送状态</th>
												<th style="text-align:center;">发送日志</th>
												<th style="text-align:center;">定时发送时间</th>
												<th style="text-align:center;">平台发送时间</th>
												<th style="text-align:center;">创建时间</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;">{{ item.receiveAddress }}</td>
													<td style="text-align:center;">{{ item.mailSubject }}</td>
													<td style="text-align:center;">{{ item.mailContent }}</td>
													<td style="text-align:center;">{{ item.mailStatus }}</td>
													<td style="text-align:center;">{{ item.mailSendResult }}</td>
                                                    <td style="text-align:center;">{{ item.scheduleTime | moment}}</td>
													<td style="text-align:center;">{{ item.sendTime | moment}}</td>
													<td style="text-align:center;">{{ item.createDate | moment}}</td>
                                                   
                                                </tr>
                                            </template>
                                        </tbody>
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
import { del } from '@/api/sys/sysMail'
import Base from "@/views/base/Base"

export default {
	name: 'SysMailList',
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
            this.page['list'] = data.sysMails || [];
        },
        create: function() {
         	this.$parent.closeTabByName('SysMailForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysMail",
                "name": "SysMailForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysMail) {
         	this.$parent.closeTabByName('SysMailForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysMail",
                "name": "SysMailForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                mailId: sysMail.mailId,
            });
        },
        del: function(sysMail) {
            confirm('确定删除该记录吗？', () => {
                del(sysMail.mailId).then(result => {
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