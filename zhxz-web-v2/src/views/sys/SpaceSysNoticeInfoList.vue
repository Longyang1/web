<template>
    <div class="view-product">
        <div class="row">
            <div class=" custom-panel">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5><span class="custom-border">&nbsp;</span>通知公告</h5>
                    </div>
                    <div class="ibox-content">
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
                                <table class="footable table table-stripped" style="text-align:left">
                                    <tbody id="meetingTbody" class="footable_table">
                                        <template v-for="(item, index) in page.list">
                                            <tr
                                                :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}"
                                                style="display: table-row;"
                                                :key="item.id">
                                                <td width="3%" style="text-align:center;"><i class="fa fa-circle text-navy"></i></td>
                                                <td style="text-align:left;width:60%">
                                                    <span href="javascrip:void(0)" @click="toSimpleNotice(item)" style="color: #1E9FFF">{{item.infoTitle}}</span>
                                                </td>
                                                <td style="text-align:center;">{{ item.pubTime | moment('YYYY-MM-DD')}}</td>
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
</template>

<script>
import Base from "@/views/base/Base"
import {get,addViewCount,getNoticeInfos} from '@/api/sys/sysNoticeInfo'
import SpaceSysNoticeInfo from '@/views/sys/SpaceSysNoticeInfo';
import SysTodoListVue from './SysTodoList.vue';

export default {
	extends: Base,
    data () {
        return {
            menuId: 'SysNoticeInfoList',
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
        addViewCount: function(item){
            addViewCount(JSON.stringify(item)).then(result => {
                this.$refs.pagination.refresh();
            });
        },
        toSimpleNotice: function (item) {
            this.addViewCount(item);
			this.$layer.iframe({
			content: {
				content: SpaceSysNoticeInfo,//传递的组件对象
				parent: this,//当前的vue对象
				data: {
					sysNoticeId:item.id
				}
			},
			area: ['1000px', '800px'],
			title: "通知公告"
			})
		},
    }
}
</script>

<style scoped>

</style>
