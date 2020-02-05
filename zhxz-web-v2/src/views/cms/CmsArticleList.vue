<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>{{ title }}</p>
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
                                	
                                    <span class="title title-text" style="width: auto">标题：</span>
                                    <input type="text" v-model="otherParam.title" placeholder="请输入标题">
                                   
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th v-if="false" style="text-align:center;">栏目</th>
												<th style="text-align:center;">标题<field-sort field="Title"></field-sort></th>
												<th style="text-align:center;width: 100px;">权重<field-sort field="Weight"></field-sort></th>
                                                <th style="text-align:center;width: 100px;">置顶</th>
												<th style="text-align:center;width: 100px;">点击数<field-sort field="Hits"></field-sort></th>
												<th style="text-align:center;width: 120px;">创建者</th>
                                                <th style="text-align:center;width: 120px;">状态</th>
												<th style="text-align:center;width: 180px;">发布时间<field-sort field="PublishDate"></field-sort></th>
                                                <th style="text-align:center;width: 340px;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td v-if="false" style="text-align:center;">{{ item.categoryId }}</td>
													<td style="text-align:center;" :title="item.title"><span @click="edit(item, true)" class="l-cursor" :style="{color: 'rgb(30, 159, 255)'}">{{ item.title }}</span></td>
													<td style="text-align:center;">{{ item.weight }}</td>
                                                    <td style="text-align:center;">{{ item.weight >= 999 ? '是' : "否" }}</td>
													<td style="text-align:center;">{{ item.hits }}</td>
													<td style="text-align:center;">{{ userMap[item.createBy] }}</td>
                                                    <td style="text-align:center;">{{ publishStatusMap[item.publishStatus] }}</td>
													<td style="text-align:center;">{{ item.publishDate | moment }}</td>
                                                    <td style="text-align:center;">
                                                        <a @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-edit" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>{{ (curUser.userId == item.createBy && item.publishStatus == 1) ? '修改' : "查看" }}</a>
                                                        <!-- <a v-if="curUser.userId == item.createBy && item.publishStatus == 1" @click="publish(item, true)" style="margin-right:10px"><i class="fa fa-play" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>发布</a> -->
                                                        <!-- <a v-if="curUser.userId == item.createBy && item.publishStatus == 11" @click="cancelPublish(item, true)" style="margin-right:10px"><i class="fa fa-stop" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>取消发布</a> -->
                                                        <a @click="preview(item)" style="margin-right:10px"><i class="fa fa-eye" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>预览</a>
                                                        <a v-if="enableKnow" @click="viewKnowDetail(item)" style="margin-right:10px"><i class="fa fa-list-ol" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>知晓详情</a>
                                                        <a v-if="curUser.userId == item.createBy && item.publishStatus == 1" @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
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
import { del, publish, cancelPublish } from '@/api/cms/cmsArticle'
import Base from "@/views/base/Base"
import ArticleContentView from "@/views/cms/ArticleContentView"
import ArticleReadKnowView from "@/views/cms/ArticleReadKnowView"

export default {
	name: 'CmsArticleList',
	extends: Base,
    data () {
        return {
            titles: ['状态'],
            dicts: [],
            paramNames: ['publishStatus'],
            otherParam: {
                title: '',
                categoryId: this.categoryId
            },
            refresh: true,
            page: {

            },
            userMap: {},
        }
    },
    props: {
        title: {
            type: String,
            default: "文章列表"
        },
        text: {
            type: String,
            default: "文章信息"
        },
        categoryId: {
            type: String,
            default: ""
        },
        simpleMode: {
            type: Boolean,
            default: false
        },
        listView: {
            type: String,
            default: "CmsArticleList"
        },
        enableKnow: {
            type: Boolean,
			default: false
        },
        processKey: {
            type: String,
            default: "ARTICLE_PUBLISH"
        },
        taskName: {
            type: String,
            default: ""
        }
    },
    computed: {
    	
        publishStatusMap: function() {
           return this.dicts[0].array2Obj('value', 'label');
        }
        //
    },
    mounted () {
        this.initData();
    },
    methods: {
        cancelPublish() {
            confirm("确定取消发布吗？", () => {
                cancelPublish(article.id).then(res => {
                    alert(res.msg);
                    this.$refs.pagination.refresh();
                });
            })
        },
        viewKnowDetail(article) {
            this.$layer.iframe({
				content: {
					content: ArticleReadKnowView, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                       articleId: article.id,
                       type: 'know',
                       knowFlag: 'y'
					}
				},
				area: [((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8 + "px"), ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: article.title + " 知晓详情"
            });
        },
        preview: function(article) {
            this.$layer.iframe({
				content: {
					content: ArticleContentView, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                       articleId: article.id,
					}
				},
				area: [((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8 + "px"), ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "预览"
            });
        },
        publish: function(article) {
            confirm("确定发布吗？", () => {
                publish(article.id).then(res => {
                    alert(res.msg);
                    this.$refs.pagination.refresh();
                });
            })
        },
        initData: function() {
            getDicts('ARTICLE_PUBLISH_STATUS,APPROVAL_STATUS').then(result => {
            	
                var publishStatus = result.data[0] || [];
                publishStatus.unshift({
                   label: "全部",
                   selected: 1,
                   value: "",
                   order: 0,
                });
                var status = result.data[1] || [];
                this.dicts.push(dictsConcatAfterOrder(publishStatus, status));
                //
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.cmsArticles || [];
            this.userMap = data.userMap || {};
        },
        create: function() {
         	var parent = this.$parent.closeTabByName ? this.$parent : this.$parent.$parent;
         	parent.closeTabByName('CmsArticleForm');
            parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "cmsArticle",
                "name": "CmsArticleForm",
                "parentId": "4",
                "text": this.text + "创建",
                "children": [

                ]
            }, 3, {
                categoryId: this.categoryId,
                listView: this.listView,
                simpleMode: this.simpleMode,
                enableFlow: this.enableFlow,
                taskName: this.taskName,
                processKey: this.processKey
            });
        },
        edit: function(cmsArticle) {
         	var parent = this.$parent.closeTabByName ? this.$parent : this.$parent.$parent;
         	parent.closeTabByName('CmsArticleForm');
            parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "cmsArticle",
                "name": "CmsArticleForm",
                "parentId": "4",
                "text": this.text + "更新",
                "children": [

                ]
            }, 3, {
                id: cmsArticle.id,
                simpleMode: this.simpleMode,
                enableFlow: this.enableFlow,
                listView: this.listView,
                taskName: this.taskName,
                processKey: this.processKey
            });
        },
        del: function(cmsArticle) {
            confirm('确定删除该记录吗？', () => {
                del(cmsArticle.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>

</style>