<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header" style="height:50px;border:solid 1px #e6e6e6;">
            <span><p>消息列表</p></span>
            <span @click="switchModal()" class="pull-right" style="position:relative;top:-20px;font-size:14px;right:15px">
                <i class="fa fa-list-ul">&nbsp;<a>切换为看板模式</a></i>
            </span>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="initPage"
                                :url="'./msg/sysMsgs'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :autoSearch="true"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">标题：</span>
                                    <input type="text" v-model="otherParam.title" placeholder="请输入标题">
                                </template>
                                <template slot="opera">
                                    <!-- <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</button> -->
                                    <button @click="markedRead()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="iconfont icon-quanbuyidu1" aria-hidden="true"></i>&nbsp;&nbsp;标识为已读</button>
                                    <button @click="markedAllRead()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="iconfont icon-quanbuyidu" aria-hidden="true"></i>&nbsp;&nbsp;全部已读</button>
                                    <button @click="del(null, true)" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;批量删除</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">
                                                    <layui-simple-checkbox 
                                                        @clickCheckboxAfter="checkAll"
                                                        :defautValue="2"
                                                        v-model="checkType"
                                                        :val="1"/>
                                                </th>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">标题</th>
												<th style="text-align:center;width: 120px;">消息类型</th>
												<th style="text-align:center;width: 150px;">创建时间</th>
                                                <th style="text-align:center;width: 150px;">接收时间</th>
                                                <th style="text-align:center;width: 160px;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td style="text-align:center;">
                                                        <layui-simple-checkbox
                                                            :checkedVals="checkedKeys"
                                                            @clickCheckboxAfter="check"
                                                            :val="item.id"/>
                                                    </td>
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;" :title="item.title">
                                                        <span @click="readMsg(item, true)" class="l-cursor" :style="{color: msgRecordMap[item.id][0].readStatus == 'y' ? '' : 'rgb(30, 159, 255)'}">{{ item.title }}</span>
                                                    </td>
													<td style="text-align:center;">{{ msgTypeMap[item.msgTypeDict] }}</td>
													<td style="text-align:center;">{{ item.createDate | moment }}</td>
                                                    <td style="text-align:center;">{{ msgRecordMap[item.id][0]['readingTime'] | moment }}</td>
                                                    <td style="text-align:center;">
                                                        <a @click="readMsg(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</a>
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
import { del, readMsg, readAllMsg } from '@/api/msg/sysMsg'
import Base from "@/views/base/Base"
import msgMixin from '@/mixin/msgMixin'
import bus from '@/assets/js/event.js'

export default {
	name: 'SysMsgList',
    extends: Base,
    mixins: [msgMixin],
    data () {
        return {
            titles: ['消息类型', '状态'],
            dicts: [],
            paramNames: ['msgTypeDict', 'readStatus'],
            otherParam: {
                title: '',
            },
            refresh: true,
            page: {

            },
            msgRecordMap: {},
            initPage: false,
        }
    },
    computed: {    	
        msgTypeMap: function() {
           return this.dicts[0].array2Obj('value', 'label');
        }
    },
    mounted () {
        this.initData();

        bus.$on('readMsgAfter', (data) => {
            if (this.$refs.pagination) {
                this.$refs.pagination.refresh();
            }
        });
    },
    methods: {
        initData: function() {
            getDicts('MSG_TYPE_DICT,').then(result => {
            	
                var msgTypes = result.data[0];
                msgTypes.unshift({
                   label: "全部",
                   selected: 1,
                   value: ""
                });
                this.dicts.push(msgTypes);
                this.dicts.push([
                    {
                        label: "全部",
                        selected: 0,
                        value: ""
                    },
                    {
                        label: "未读",
                        selected: 1,
                        value: "n"
                    },
                    {
                        label: "已读",
                        selected: 0,
                        value: "y"
                    }
                ]);
                this.initPage = true;
            }).catch(error => {
                this.initPage = true;
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysMsgs || [];
            this.msgRecordMap = data.msgRecordMap || {};
        },
        create: function() {
         	this.$parent.$parent.closeTabByName('SysMsgForm');
            this.$parent.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysMsg",
                "name": "SysMsgForm",
                "parentId": "4",
                "text": "消息创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysMsg) {
         	this.$parent.$parent.closeTabByName('SysMsgForm');
            this.$parent.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysMsg",
                "name": "SysMsgForm",
                "parentId": "4",
                "text": "消息信息更新",
                "children": [

                ]
            }, 3, {
                id: sysMsg.id,
            });
        },
        del: function(sysMsg, batchDelete) {
            var msgId = null;
            if (batchDelete) {
                if (this.checkedKeys.length == 0) {
                    msg('请先勾选至少一条消息，才可进行此操作。');
                    return;
                }
                msgId = this.checkedKeys.join(",");
            } else {
                msgId = sysMsg.id;
            }
            confirm('确定删除吗？', () => {
                del(msgId).then(res => {
                    alert(res.msg);
                    this.$refs.pagination.refresh();
                });
            });
        }
    },
    activated() {
        // if (this.$refs.pagination) {
        //     this.$refs.pagination.refresh();
        // }
    }
}
</script>

<style scoped>

</style>