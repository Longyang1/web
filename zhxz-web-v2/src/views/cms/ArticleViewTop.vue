<template>
    <div class="col-sm-7 custom-panel" style="width: 100%"> 
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5><span class="custom-border"><span style="padding-left: 8px;">{{ title }}</span></span></h5>
                <div class="ibox-tools">
                    <a @click="toView(viewName, {title: title})" style="color: #098cba">更多<i class="fa fa-angle-double-right"></i></a>
                </div>
            </div>
            <div class="ibox-content">
                <table class="notify-table table-stripped small">
                    <tbody>
                        <tr 
                            v-for="(item, index) in cmsArticles" 
                            :key="index" 
                            :class="{'not-read': readStatusMap[item.id] != 'y' }">
                                <td class="no-borders">
                                    <i class="fa fa-circle text-navy"></i>
                                </td>
                                <td class="no-borders">
                                    <span href="javascrip:void(0)" @click="preview(item)" :title="item.title" style="color: #1E9FFF">{{ item.title }}</span>
                                    <img v-if="pubDayMap[item.id] <= 7" src="/img/new.png" style="padding-left: 2px;"/>
                                    <img v-if="item.weight >= 999" src="/img/ding.png" style="padding-left: 2px;"/>
                                </td>
                                <td class="no-borders" style="width:20%">
                                    {{ item.publishDate | moment('YYYY-MM-DD') }}
                                </td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict';
import { addReadingRecord, addHits, getCmsArticles } from '@/api/cms/cmsArticle'
import Base from "@/views/base/Base"
import ArticleContentView from "@/views/cms/ArticleContentView"
import * as cmsCategoryApi from '@/api/cms/cmsCategory'

export default {
	name: 'ArticleViewList',
	extends: Base,
    data () {
        return {
            cmsArticles: [],
            userMap: {},
            readStatusMap: {},
            pubDayMap: {},
            title: this.categoryName,
            knowMap: {},
        }
    },
    props: {
        pageSize: {
            type: Number,
            default: 5
        },
        categoryId: {
            type: String,
            default: ''
        },
        categoryName: {
            type: String,
            default: ''
        },
        viewName: {
            type: String,
            default: 'ArticleViewList'
        },
        enableKnow: {
            type: Boolean,
            default: false
        }
    },
    computed: {

    },
    mounted () {
        if (!this.categoryName) {
            cmsCategoryApi.get(this.categoryId).then(res => {
                var data = res.data || {};
                this.title = (data.cmsCategory || {}).name;
            });
        }
        this.getArtivleData();
    },
    methods: {
        knowAfter(articleId) {
            this.knowMap[articleId] = 'y';
        },
        openContentModalAfter: function() {
            this.getArtivleData();
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
        getArtivleData: function() {
            getCmsArticles({
                pageNo: 1,
                pageSize: this.pageSize,
                categoryId: this.categoryId,
                publishStatus: 4,
            }).then(res => {
                var data = res.data || {};
                this.cmsArticles = data.cmsArticles || [];
                this.userMap = data.userMap || {};
                this.pubDayMap = data.pubDayMap || {};
                this.readStatusMap = data.readStatusMap || {};
                this.knowMap = data.knowMap || {};
            });
        },

    }
}
</script>

<style scoped>
.ibox {
    margin-bottom: 10px;
}

.custom-panel {
    padding-left: 5px;
    padding-right: 5px;
}

.custom-panel .ibox-title {
    height: 32px;
    padding: 8px 10px;
    color: #305894;
    font-family: "Tahoma";
    font-weight: 500;
}

.ibox-title .custom-border {
    background: url(/img/title_tb.jpg) no-repeat left;
    margin-right: 6px;
}

.custom-panel .ibox-content {
    padding: 10px;
}

.notify-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: -10px;
}

.notify-table>tbody>tr>td {
    border-top: 1px solid #e7eaec;
    line-height: 1.5;
    padding: 8px;
    vertical-align: middle;
    margin: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    display: table-cell;
    cursor: pointer;
    font-size: 12px;
    color: #5a5a5a;
}

.notify-table td:first-child {
    width: 18px;
    padding-right: 0;
}

.notify-table td:first-child i {
    font-size: 10px;
}

.notify-table .label {
    margin-left: 5px;
}

.notify-table td:last-child {
    width: 90px;
    text-align: right;
}

.custom-label-blue {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    color: #1890ff;
}

.custom-label-green {
    border: 1px solid #b7eb8f;
    background-color: #f6fffd;
    color: #52c41a;
}
.not-read .text-navy, .not-read span {
    color:#FF5722!important;
}
</style>