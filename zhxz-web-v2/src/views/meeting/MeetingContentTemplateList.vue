<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>会议内容模板列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./meeting/meetingContentTemplates'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">模板名称：</span>
                                    <input type="text" v-model="otherParam.name"/>
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建会议内容模板</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">模板名称</th>
												<th style="text-align:center;">会议类型</th>
												<th style="text-align:center;">模板内容类型</th>
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
													<td style="text-align:center;">{{ item.name }}</td>
													<td style="text-align:center;">{{ meetingTypeMap[item.meetingTypeDict] }}</td>
													<td style="text-align:center;">{{ contentTypeMap[item.contentTypeDict] }}</td>
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
import { del } from '@/api/meeting/meetingContentTemplate'
import Base from "@/views/base/Base"

export default {
    name: 'MeetingContentTemplateList',
	extends: Base,
    data () {
        return {
            menuId: 'MeetingContentTemplateList',
            titles: ['会议类型', '内容类型'],
            dicts: [],
            paramNames: ['meetingTypeDict', 'contentTypeDict'],
            otherParam: {
                name: ''
            },
            refresh: true,
            page: {

            },
        }
    },
    computed: {
        meetingTypeMap: function() {
           return this.dicts[0] ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        contentTypeMap: function() {
           return this.dicts[1] ? this.dicts[1].array2Obj('value', 'label') : {};
        },
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            getDicts('MEETING_TYPE_DICT,CONTENT_TYPE_DICT').then(result => {
                if (result.data) {
                    result.data.forEach((ele, index) => {
                        var types = result.data[index];
                        types.unshift({
                           label: "全部",
                           selected: 1,
                           value: ""
                        });
                        this.dicts.push(types);
                    });
                }
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.meetingContentTemplates || [];
        },
        create: function() {
            this.$parent.closeTabByName('MeetingContentTemplateForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "meetingContentTemplate",
                "name": "MeetingContentTemplateForm",
                "parentId": "4",
                "text": "会议内容模板创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(meetingContentTemplate) {
            this.$parent.closeTabByName('MeetingContentTemplateForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "meetingContentTemplate",
                "name": "MeetingContentTemplateForm",
                "parentId": "4",
                "text": "会议内容模板更新",
                "children": [

                ]
            }, 3, {
                id: meetingContentTemplate.id,
            });
        },
        del: function(meetingContentTemplate) {
            confirm('确定删除该记录吗？', () => {
                del(meetingContentTemplate.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
    .title-text {
        width: 61px;
    }
</style>