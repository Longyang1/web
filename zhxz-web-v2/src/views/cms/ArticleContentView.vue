<template>
    <div class="tab-background float-e-margins sys-notice" style="position:relative;top:20px">
        <div style="width:80%;text-align:center;font-size:14px;position:relative;left:10%">
            <div><h2 style="word-wrap:break-word">{{ cmsArticle.title }}</h2></div>
            <div style="margin:10px">发布时间： {{ cmsArticle.publishDate | moment }} &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;浏览次数：{{ cmsArticle.hits }}  
            </div>
        </div>
        <hr style="height:2px;align:center;width:80%;position:relative;left:10%">
        <div style="width:80%;position:relative;left:10%;font-size:16px;" v-html="cmsArticleData.content"></div>
        <hr style="align:center;width:80%;position:relative;left:10%">
        <div style="width:80%;position:relative;left:10%;font-size:16px;">
            <file-upload
                label="附件"
                :attachmentBusinessId="cmsArticle.id"
                attachmentBusinessType="cms_article"
                :canUpload="false"
                module="cms"
                :canDelete="false"/>
        </div>
        <div v-if="enableKnow && knowFlag != 'y'" class="layui-footer">
            <button v-if="!knowSuccess" @click="know()" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-check"></i> 已经知晓</button>
            <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
        </div> 
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import BaseModal from "@/views/base/BaseModal"
import { get, know } from '@/api/cms/cmsArticle'

export default {
	name: 'ArticleContentView',
	extends: BaseModal,
    data () {
        return {
            cmsArticle: {},
            cmsArticleData: {},
            knowSuccess: false
        }
	},
	props: {
        articleId: {
            type: String,
			default: ''
        },
	    layerid: {
			type: String,
			default: null
        },
        enableKnow: {
            type: Boolean,
			default: false
        },
        knowFlag: {
            type: String,
			default: 'n'
        }
	},
    computed: {
       	
	},
	watch: {
        
    },
    mounted () {
        if (this.$parent.openContentModalAfter) {
            this.$parent.openContentModalAfter();
        }
        this.initData();
    },
    methods: {
        initData: function(){
            if(this.articleId){
                get(this.articleId).then(result => {
                    var data = result.data;
                    if (data) {
						var cmsArticle =  data.cmsArticle || this.cmsArticle;this.cmsArticle = cmsArticle;
						var articleDataMap = data.articleDataMap || {};
						this.cmsArticleData = articleDataMap[this.articleId] || this.cmsArticleData;
                    }
                });
            }
        },
        know() {
            confirm("确认已知晓吗？", () => {
                know(this.articleId).then(res => {
                    this.knowSuccess = true;
                    alert(res.msg);
                    if (this.$parent.knowAfter) {
                        this.$parent.knowAfter(this.articleId);
                    }
                });
            });
        }
    }
}
</script>

<style scoped>
.layui-footer {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    background-color: #eee;
}
</style>