<template>
    <div class="tab-background float-e-margins">
        <div class="wrapper wrapper-content ">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center" style="padding-top: 20px">
                            <pagination
                                :url="'./cms/cmsArticleReadingRecords'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :notShowBtn="true"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                	<!--
                                    <span class="title title-text">部门名称：</span>
                                    <input @click="officeClick" type="text" readonly="readonly" v-model="officeName" placeholder="点击选择部门">
                                    -->
                                </template>
                                <template slot="opera">
                                    <!-- <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</!-->
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<!-- <th style="text-align:center;">文章ID</th> -->
												<th style="text-align:center;">姓名</th>
												<!-- <th style="text-align:center;">已经知晓标志</th> -->
												<th v-if="type == 'know'" style="text-align:center;">知晓时间<field-sort field="KnowTime"></field-sort></th>
												<th v-if="type == 'read'" style="text-align:center;">最后阅读时间<field-sort field="LastReadingTime"></field-sort></th>
												<th v-if="type == 'read'" style="text-align:center;">阅读次数</th>
                                                <!-- <th style="text-align:center;">操作</th> -->
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<!-- <td style="text-align:center;">{{ item.articleId }}</td> -->
													<td style="text-align:center;">{{ userMap[item.reader] }}</td>
													<!-- <td style="text-align:center;">{{ item.knowFlag }}</td> -->
													<td style="text-align:center;">{{ item.knowTime | moment }}</td>
													<td v-if="type == 'read'" style="text-align:center;">{{ item.lastReadingTime | moment }}</td>
													<td v-if="type == 'read'" style="text-align:center;">{{ item.readingCount }}</td>
                                                    <!-- <td style="text-align:center;">
                                                        <a @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                    </td> -->
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
import BaseModal from "@/views/base/BaseModal"

export default {
	name: 'ArticleReadKnowView',
	extends: BaseModal,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                articleId: this.articleId,
                knowFlag: this.knowFlag,
                orderField: this.type ? (this.type == 'know' ? "KnowTime" : "LastReadingTime") : '',
                orderAsc: false,
                pageSize: 20,
            },
            refresh: true,
            page: {

            },
            userMap: {}
        }
    },
    props: {
        articleId: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        knowFlag: {
            type: String,
            default: ''
        }
    },
    mounted () {
        
    },
    methods: {
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.cmsArticleReadingRecords || [];
            this.userMap = data.userMap || {};
        },
    }
}
</script>

<style scoped>

</style>