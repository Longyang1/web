<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>供应商信息查询</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./bm/bmCompanyInfos'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination"
								:btnCenter="true">
                                <template slot="searchBtnBefore">
                                    <div class="search-condition-row">
                                        <span class="title title-text">企业名称：</span>
                                        <input type="text" v-model="otherParam.name" placeholder="请输入企业名称">
                                        <span class="title title-text">企业编号：</span>
                                        <input type="text" v-model="otherParam.companyNo" placeholder="请输入企业编号">
                                        <span class="title title-text">统一社会代码：</span>
                                        <input type="text" v-model="otherParam.orgno" placeholder="请输入统一社会代码">
                                    </div>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;" >企业名称</th>
												<th style="text-align:center;" >企业编号</th>
												<th style="text-align:center;" >档案编号</th>
												<th style="text-align:center;" >统一社会信用代码</th>
												<th style="text-align:center;" >成立时间</th>
												<th style="text-align:center;" >注册资本（万元）</th>
												<th style="text-align:center;" >最后更新时间</th>
                                                <th style="text-align:center;" >操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
                                                    <td style="text-align:center;color: #1E9FFF" :title="item.name" @click="deal(item.id)">
                                                        {{ item.name }}</td>
													<td style="text-align:center;" :title="item.companyNo">{{ item.companyNo }}</td>
													<td style="text-align:center;" :title="item.fileNo">{{ item.fileNo }}</td>
													<td style="text-align:center;" :title="item.orgno">{{ item.orgno }}</td>
													<td style="text-align:center;">{{ item.setupTime | moment('YYYY-MM-DD') }}</td>
													<td style="text-align:center;">{{ item.registerCapital | thousand }}</td>
													<td style="text-align:center;">{{ item.updateDate | moment("YYYY-MM-DD HH:mm") }}</td>
                                                    <td style="text-align:center;">
                                                        <a @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>我要评价</a>
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
import { del } from '@/api/bm/bmCompanyInfo'
import Base from "@/views/base/Base"

export default {
	name: 'BmSupplierInfoSearch',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                companyBusinessTypeDict: 'supplier',
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
            this.page['list'] = data.bmCompanyInfos || [];
        },
        deal: function (id) {
            this.$parent.closeTabByName('BmCompanyInfoForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "bmCompanyInfo",
                "name": "BmCompanyInfoForm",
                "parentId": "4",
                "text": "供应商信息查看",
                "children": []
            }, 3, {
                id: id,
                isReadOnly:  true
            });
        },




    }
}
</script>

<style scoped>
    .title-text {
        width: 100px;
    }

    .search-condition-row /deep/ input {
        margin-right: 0 !important;
    }
</style>