<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>联动列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                :url="'./meeting/meetingConfLinkages'"
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
                                    <button @click="createConf" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建配置</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
                                                <th width="15%" style="text-align:center;">主控方</th>
                                                <th width="15%" style="text-align:center;">联动类型</th>
                                                <th width="40%" style="text-align:center;">值集合</th>
                                                <th width="25%" style="text-align:center;">更新时间</th>
                                                <th width="20%" style="text-align:center;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table" v-if="refresh">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
                                                    <td v-if="linkageTypeMap[item.typeDict].desc.startsWith('org')" style="text-align:center;">{{ officeNameMap[item.officeId] }}</td>
                                                    <td v-if="linkageTypeMap[item.typeDict].desc.startsWith('dict')" style="text-align:center;">
                                                        {{ typeDictMap[item.typeDict] | dictValue(item.officeId) }}
                                                    </td>
                                                    <td style="text-align:center;">{{ linkageTypeMap[item.typeDict].label }}</td>
                                                    <td style="text-align:center;">
                                                        <template v-for="key in item.dictKey.split(',')">
                                                            <template v-if="item.dictKey">{{ confDictMap[key] }} </template>
                                                        </template>
                                                    </td>
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
import { delMeetingConfLinkage } from '@/api/meeting/confLinkage'
import OfficeTree from '@/components/OfficeTree'
import Base from "@/views/base/Base"

export default {
    name: 'ConfLinkageList',
    extends: Base,
    data () {
        return {
            titles: ['联动类型'],
            dicts: [],
            paramNames: ['typeDict'],
            otherParam: {
                'officeId': null
            },
            page: {

            },
            officeNameMap: {},
            officeName: '',
            confDicts: [],
            typeDictMap: {}
        }
    },
    computed: {
        linkageTypeMap: function() {
            return this.dicts[0] ? this.dicts[0].array2Obj('value') : {};
        },
        confDictMap: function() {
            return this.confDicts.array2Obj('id', 'label') || {};
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            getDicts('LINKAGE_TYPE').then(result => {
                console.log(result);
                var linkageTypes = result.data[0];
                var types = [];
                var searchTypes = [];
                linkageTypes.forEach(element => {
                    if (element.desc.startsWith('dict')) {
                        types.push(element.value);
                        searchTypes.push(element.desc.split(':')[1]);
                    }
                });
                linkageTypes.unshift({
                    label: "全部",
                    selected: 1,
                    value: ""
                });
                this.dicts.push(linkageTypes);
                getDicts(searchTypes.join(',')).then(result => {
                    var dicts = result.data || [];
                    dicts.forEach((ele, index) => {
                        this.typeDictMap[types[index] + ""] = ele;
                    });
                    this.refreshed();
                });
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.meetingConfLinkages || [];
            this.officeNameMap = Object.assign(this.officeNameMap, data.officeNameMap || {});
            this.confDicts = data.dicts || [];
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
            this.$parent.closeTabByName("ConfLinkageAdd");
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "conf-linkage-add",
                "name": "ConfLinkageAdd",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "联动配置信息创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(confLinkage) {
            this.$parent.closeTabByName("ConfLinkageAdd");
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "conf-linkage-add",
                "name": "ConfLinkageAdd",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "联动配置信息更新",
                "children": [

                ]
            }, 3, {
                confId: confLinkage.id,
                officeId: confLinkage.officeId,
                officeName: this.officeNameMap[confLinkage.officeId],
            });
        },
        del: function(confLinkage) {
            confirm('确定删除该配置吗？', () => {
                delMeetingConfLinkage(confLinkage.id).then(result => {
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
    .title-text {
        width: 61px;
    }
</style>