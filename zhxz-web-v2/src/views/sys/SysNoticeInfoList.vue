<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>通知公告管理</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysNoticeInfos'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title" style="margin-right: 14px;">标题：</span>
                                    <input type="text"  v-model="otherParam.infoTitle" placeholder="请输入标题关键字">
                                </template>
                                <template slot="opera">
                                    <button v-authorize="'ITIM.SYS.NOTICE'" @click="create" type="button" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;新增</button>
                                    <!-- <button @click="create" type="button" class="btn btn-outline btn-info pull-left layui-btn-lg layui-btn-blue"><i class="fa fa-paste"></i>&nbsp;&nbsp;新增</button> -->
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
                                                <th style="text-align:center;">标题</th>
												<th style="text-align:center;width:8%">是否置顶</th>
												<th style="text-align:center;width:8%">浏览次数</th>
												<th style="text-align:center;width:12%">发布时间</th>
                                                <th style="text-align:center;width:8%">显示顺序</th>
												<th style="text-align:center;width:8%">最后更新人员</th>
                                                <th style="text-align:center;width:14%">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}"
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;"><span href="javascrip:void(0)" @click="edit(item)"  style="color: #1E9FFF">{{ item.infoTitle }}</span></td>
                                                    <td style="text-align:center;">{{ regularFlagsMap[item.topFlag] }}</td>
													<td style="text-align:center;">{{ item.viewCount }}</td>
													<td style="text-align:center;">{{ item.pubTime | moment('YYYY-MM-DD')}}</td>
                                                    <td style="text-align:center;">{{ item.infoDispOrder }}</td>
													<td style="text-align:center;">{{ userNameMap[item.updateBy].userName }}</td>
                                                    <td style="text-align:center;">
                                                        <span @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</span>
                                                        <span @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</span>
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
import { del ,addViewCount} from '@/api/sys/sysNoticeInfo'
import Base from "@/views/base/Base"

export default {
    name:'SysNoticeInfoList',
	extends: Base,
    data () {
        return {
        	menuId: 'SysNoticeInfoList',
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                infoTitle:null
            },
            refresh: true,
            page: {

            },
            userNameMap:[],
            regularFlagsMap:
			{
                y:'置顶',
                n:''

			},

        }
    },
    computed: {

    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysNoticeInfos || [];
            this.userNameMap = data.userNameMap || [];
        },
        create: function() {
         	this.$parent.closeTabByName('SysNoticeInfoForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysNoticeInfo",
                "name": "SysNoticeInfoForm",
                "parentId": "4",
                "text": "新建通知公告",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysNoticeInfo) {
         	this.$parent.closeTabByName('SysNoticeInfoForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysNoticeInfo",
                "name": "SysNoticeInfoForm",
                "parentId": "4",
                "text": "通知公告信息修改",
                "children": [

                ]
            }, 3, {
                id: sysNoticeInfo.id,
            });
        },
        del: function(sysNoticeInfo) {
            confirm('确定删除该记录吗？', () => {
                del(sysNoticeInfo.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        },
    }
}
</script>

<style scoped>

</style>
