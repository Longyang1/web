<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>{{ $route.params.title || title }}</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./cms/cmsArticles'"
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
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">标题</th>
                                                <th v-if="enableKnow" style="text-align:center;width: 120px">已知晓</th>
												<th style="text-align:center;width: 170px">发布时间</th>
                                                <th style="text-align:center;width: 170px">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
                                                    <td style="text-align:left;" :class="{'not-read': readStatusMap[item.id] != 'y' }" :title="item.title">
                                                        <span href="javascrip:void(0)" @click="preview(item)"  style="color: #1E9FFF">{{ item.title }}</span>
                                                        <img v-if="pubDayMap[item.id] <= 7" src="/img/new.png" style="padding-left: 2px;"/>
                                                        <img v-if="item.weight >= 999" src="/img/ding.png" style="padding-left: 2px;"/>
                                                    </td>
                                                    <td v-if="enableKnow" style="text-align:center;width: 120px"><i v-if="knowMap[item.id] == 'y'" class="iconfont icon-yidu" :style="{color: 'green'}" aria-hidden="true"></i></td>
													<td style="text-align:center;width: 170px">{{ item.publishDate | moment('YYYY-MM-DD') }}</td>
                                                    <td style="text-align:center;">
                                                        <a @click="preview(item)" style="margin-right:10px"><i class="fa fa-eye" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</a>
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
import { addReadingRecord, addHits } from '@/api/cms/cmsArticle'
import Base from "@/views/base/Base"
import ArticleContentView from "@/views/cms/ArticleContentView"

export default {
	name: 'ArticleViewList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                title: '',
                publishStatus: 4,
                categoryId: this.categoryId
            },
            refresh: true,
            page: {

            },
            userMap: {},
            readStatusMap: {},
            pubDayMap: {},
            knowMap: {},
        }
    },
    props: {
        title: {
            type: String,
            default: "文章列表"
        },
        categoryId: {
            type: String,
            default: ""
        },
        enableKnow: {
            type: Boolean,
            default: false
        }
    },
    computed: {

    },
    mounted () {
        this.initData();
    },
    methods: {
        knowAfter() {
            this.$refs.pagination.refresh();
        },
        openContentModalAfter: function() {
            this.$refs.pagination.refresh();
        },
        preview: function(article) {
            addReadingRecord(article.id).then(res => {
                this.readStatusMap[article.id] = 'y';
            });
            addHits(article.id).then(res => {
                
            });
            this.$layer.iframe({
				content: {
					content: ArticleContentView, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                       articleId: article.id,
                       enableKnow: this.enableKnow,
                       knowFlag: this.knowMap[article.id],
					}
				},
				area: [((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8 + "px"), ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "查看"
            });
        },
        initData: function() {
            // getDicts('ARTICLE_PUBLISH_STATUS').then(result => {
            	
            //     var publishStatus = result.data[0];
            //     publishStatus.unshift({
            //        label: "全部",
            //        selected: 1,
            //        value: ""
            //     });
            //     this.dicts.push(publishStatus);
            //     //
            // });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.cmsArticles || [];
            this.userMap = data.userMap || {};
            this.pubDayMap = data.pubDayMap || {};
            this.readStatusMap = data.readStatusMap || {};
            this.knowMap = data.knowMap || {};
        },
    }
}
</script>

<style scoped>
.not-read .text-navy, .not-read span {
    color:#FF5722!important;
}
</style>