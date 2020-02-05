<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>人员配置列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./meeting/meetingConfMembers'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">作用域：</span>
                                    <input @click="officeClick" type="text" readonly="readonly" v-model="officeNameMap[otherParam.officeId]" placeholder="点击选择作用域">
                                </template>
                                <template slot="opera">
                                    <button @click="createConf" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建配置</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th class="center" width="5%">序号</th>
                                                <th class="center">作用域</th>
                                                <th class="center">会议类型</th>
                                                <th class="center">人员类型</th>
                                                <th class="center">人员数量  &nbsp;(A/B角) </th>
                                                <th class="center">更新时间</th>
                                                <th class="center">操作</th>
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
                                                    <td style="text-align:center;">{{ meetingTypeMap[item.meetingTypeDict] }}</td>
                                                    <td style="text-align:center;">{{ memberTypeMap[item.memberTypeDict] }}</td>
                                                    <td style="text-align:center;">{{ item.numberArole + '/' + item.numberBrole }}</td>
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
import { delMeetingConfMember } from '@/api/meeting/confMember'
import OfficeTree from '@/components/OfficeTree'

import Base from "@/views/base/Base"
export default {
    name: 'ConfMemberList',
	extends: Base,
    data () {
        return {
            titles: ['会议类型', '人员类型'],
            dicts: [],
            paramNames: ['meetingTypeDict', 'memberTypeDict'],
            otherParam: {
                'officeId': null
            },
            refresh: true,
            page: {

            },
            officeNameMap: {},
            dictLabelsMap: {},
            officeName: '',
        }
    },
    computed: {
        meetingTypeMap: function() {
            return this.dicts[0] ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        memberTypeMap: function() {
            return this.dicts[1] ? this.dicts[1].array2Obj('value', 'label') : {};
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            getDicts('MEETING_TYPE_DICT,MEETING_MEMBER_TYPE_DICT').then(result => {
                if(result.data){
                    result.data.forEach(element => {
                         element.unshift({
                            label: "全部",
                            selected: 1,
                            value: ""
                        });
                        this.dicts.push(element);
                    });
                }
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.confMembers || [];
            this.officeNameMap = Object.assign(this.officeNameMap, data.officeNameMap || {});
        },
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
        createConf: function() {
            this.$parent.closeTabByName("ConfMemberAdd");
            this.$nextTick(() => {

            });
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "conf-member-add",
                "name": "ConfMemberAdd",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "人员配置信息创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(confMember) {
            // this.$router.push({
            //     name: 'ConfMemberAdd',
            //     params: {
            //        id: confMember.id,
            //     }
            // });
            this.$parent.closeTabByName("ConfMemberAdd");
            this.$nextTick(() => {
                
            });
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "conf-member-add",
                "name": "ConfMemberAdd",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "人员配置信息编辑",
                "children": [

                ]
            }, 3, {
                id: confMember.id,
                officeId: confMember.officeId,
                officeName: this.officeNameMap[confMember.officeId]
            });
        },
        del: function(confMember) {
            confirm('确定删除该配置吗？', () => {
                delMeetingConfMember(confMember.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }
    .ibox-content /deep/ .search-box {
        padding-left: 0;
        margin-left: 0;
    }
    .center {
        text-align: center;
    }
    .title-text {
        width: 61px;
    }
</style>