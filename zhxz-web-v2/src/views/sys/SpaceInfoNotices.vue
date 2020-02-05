<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>通知公告</p>
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
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="10%" style="text-align:center;">序号</th>
                                                <th style="text-align:center;">标题</th>
                                                <th style="text-align:center;width:15%">发布时间</th>
                                                <th style="text-align:center;width:10%">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}"
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
                                                    <td style="text-align:left;" :class="{'not-read': readStatusMap[item.id] != 'y' }">
                                                        <span href="javascrip:void(0)" @click="toSimpleNotice(item)"  style="color: #1E9FFF">{{ item.infoTitle }}</span>
                                                        <img v-if="item.pubDay <= 7" src="/static/images/new.png"/>
                                                    </td>
                                                    <td style="text-align:center;">{{ item.pubTime | moment('YYYY-MM-DD')}}</td>
                                                    <td style="text-align:center;">
                                                        <span @click="toSimpleNotice(item)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</span>
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
import Base from "@/views/base/Base"
import { get, addViewCount, getNoticeInfos, addReadingRecord } from '@/api/sys/sysNoticeInfo'
import SpaceSysNoticeInfo from '@/views/sys/SpaceSysNoticeInfo';
import SysTodoListVue from './SysTodoList.vue';

export default {
    name: 'SpaceInfoNotices',
	extends: Base,
    data () {
        return {
            menuId: 'SpaceInfoNotices',
            sysNoticeInfos:[],
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                infoTitle:null
            },
            refresh: true,
            page: {

            },
            readStatusMap: {},
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
            this.readStatusMap = data.readStatusMap || {};
        },
        addViewCount: function(item){
            addViewCount(JSON.stringify(item)).then(result => {
                this.$refs.pagination.refresh();
            });
        },
        toSimpleNotice: function (item) {
            addReadingRecord(item.id).then(res => {
                this.readStatusMap[item.id] = 'y';
            });
            this.addViewCount(item.id);
			this.$layer.iframe({
                content: {
                    content: SpaceSysNoticeInfo,//传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        sysNoticeId:item.id
                    }
                },
                area: ['50%', '600px'],
                title: "通知公告"
			})
		  },
    }
}
</script>

<style scoped>
    .not-read .text-navy, .not-read span {
        color:#FF5722!important;
    }
    .table tr td {
        white-space: normal;
    }
</style>
