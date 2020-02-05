<template>
    <div class="view-product" v-cloak style="overflow-y: hidden;">
        <div class="animated fadeInRight">
            <div class="flow ibox-content">
				<flow-view
					v-if="initAfterFlag"
					:processKey="processKey"
					:businessKey="cmsArticle.id"
					:status="cmsArticle.publishStatus"
					:enableFlow="cmsenableFlow != null ? cmsenableFlow : enableFlow">
					<layui-form>
						<layui-fieldset label="基本信息">
							<template slot="main">
								<layui-item v-if="!simpleMode">
									<layui-inline-input
										label="所属栏目" 
										placeholder="请点击选择所属栏目"
										v-model="category.name"></layui-inline-input>
								</layui-item>
								<layui-item>
									<layui-inline-input
										label="标题" 
										placeholder="请输入标题"
										v-model="cmsArticle.title"
										layVerify='required'
										:readonly="globalReadonly"
										:block="true"></layui-inline-input>
								</layui-item>
								<layui-item v-if="!simpleMode">
									<layui-inline-input
										label="文章链接" 
										placeholder="请输入文章链接"
										v-model="cmsArticle.link"
										:readonly="globalReadonly"
										:block="true"></layui-inline-input>
								</layui-item>
								<layui-item v-if="false">
									<layui-inline-input
										label="标题颜色" 
										placeholder="请输入标题颜色"
										:readonly="globalReadonly"
										v-model="cmsArticle.color"></layui-inline-input>
								</layui-item>
								<layui-item v-if="false">
									<layui-inline-input
										label="文章图片" 
										placeholder="请输入文章图片"
										:readonly="globalReadonly"
										v-model="cmsArticle.image"></layui-inline-input>
								</layui-item>
								<layui-item v-if="!simpleMode">
									<layui-inline-input
										label="关键字" 
										placeholder="请输入关键字"
										v-model="cmsArticle.keywords"
										:readonly="globalReadonly"
										:block="true"></layui-inline-input>
								</layui-item>
								<layui-item v-if="!simpleMode">
									<layui-inline-input
										label="描述、摘要" 
										placeholder="请输入描述、摘要"
										v-model="cmsArticle.description"
										:readonly="globalReadonly"
										:block="true"></layui-inline-input>
								</layui-item>
								<layui-item>
									<layui-inline-date
										label="发布时间" 
										placeholder="请选择发布时间"
										name="cmsarticlepublishdate"
										layVerify='required'
										type="datetime"
										:readonly="globalReadonly"
										v-model="cmsArticle.publishDate"></layui-inline-date>
									<layui-inline-input
										label="权重" 
										placeholder="请输入权重，越大越靠前"
										:readonly="globalReadonly"
										v-model="cmsArticle.weight"></layui-inline-input>
									<layui-inline-switch
										label="置顶"
										:readonly="globalReadonly"
										v-model="topFlag"></layui-inline-switch>
								</layui-item>
								<layui-item v-if="false">
									<layui-inline-input
										label="权重期限" 
										placeholder="请输入权重期限"
										:readonly="globalReadonly"
										v-model="cmsArticle.weightDate"></layui-inline-input>
								</layui-item>
								<layui-item v-if="false">
									<layui-inline-input
										label="推荐位，多选" 
										placeholder="请输入推荐位，多选"
										v-model="cmsArticle.posid"></layui-inline-input>
								</layui-item>
								<layui-item v-if="false">
									<layui-inline-input
										label="自定义内容视图" 
										placeholder="请输入自定义内容视图"
										v-model="cmsArticle.customContentView"></layui-inline-input>
								</layui-item>
								<layui-item v-if="false">
									<layui-inline-input
										label="视图配置" 
										placeholder="请输入视图配置"
										v-model="cmsArticle.viewConfig"></layui-inline-input>
								</layui-item>
								<layui-item>
									<layui-inline-textarea
										label="备注信息" 
										placeholder="请输入备注信息"
										:disabled="globalReadonly"
										v-model="cmsArticle.remarks"></layui-inline-textarea>
								</layui-item>
							</template>
						</layui-fieldset>
						<layui-fieldset label="正文信息">
							<template slot="main">
								<layui-item>
									<layui-inline-ue
										label="正文" 
										placeholder="请输入正文信息"
										:ueConfig="ueConfig"
										v-model="cmsArticleData.content"></layui-inline-ue>
								</layui-item>
							</template>
						</layui-fieldset>
						<file-upload
							:attachmentBusinessId="cmsArticle.id"
							attachmentBusinessType="cms_article"
							module="cms"
							:readonly="globalReadonly"
							ref="fileUpload"/>
						<layui-inline v-show="false" class="btn-group-center">
							<button ref="saveBtn" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveCmsArticle"><i class="fa fa-save"></i> 保存</button>
							<button ref="publishBtn" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="publishCmsArticle"><i class="fa fa-save"></i> 保存</button>
							<button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
						</layui-inline>
					</layui-form>
				</flow-view>
            </div>
        </div>
		<flow-btn-group
			v-if='initAfterFlag'
			:processKey="processKey"
			:businessKey="cmsArticle.id"
			:status="cmsArticle.publishStatus"
			:createBy="cmsArticle.createBy"
			:enableFlow="cmsenableFlow != null ? cmsenableFlow : enableFlow">
			<button class="layui-btn layui-btn-lg layui-btn-blue" @click="toClick('saveBtn')"><i class="fa fa-save"></i> 保存</button>
            <button class="layui-btn layui-btn-lg layui-btn-orange" @click="toClick('publishBtn')"><i class="fa fa-paper-plane" aria-hidden="true"></i> 发布</button>
		</flow-btn-group>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/cms/cmsArticle'
import * as cmsCategoryApi from '@/api/cms/cmsCategory'
import { formatDate } from '@/utils/formatUtils'
import Base from "@/views/base/Base"

export default {
	name: 'CmsArticleForm',
	extends: Base,
    data () {
        return {
			cmsArticle: {
                id: this.$route.params.id,
				categoryId:  this.$route.params.categoryId || this.category.id,
				title: '',
				link: '',
				color: '',
				image: '',
				keywords: '',
				description: '',
				weight: '',
				weightDate: '',
				hits: '',
				posid: '',
				customContentView: '',
				viewConfig: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
				remarks: '',
				delFlag: '',
				publishDate: '',
				publishStatus: '',
			},
			cmsArticleData: {
				content: ''
			},
			ueConfig: {
				initialFrameHeight: 600,
			},
			topFlag: 'n',
			listView: this.$route.params.listView,
			simpleMode: this.$route.params.simpleMode || false,
			processKey: this.$route.params.processKey,
			cmsenableFlow: null,
        }
	},
	props: {
		category: {
			type: Object,
			default: () => {
				return {
					id: '1',
					name: '示例栏目'
				}
			}
		},
		enableFlow: {
            type: Boolean,
            default: true,
		},
		taskName: {
			type: String,
			default: "文章管理员审批"
		}
	},
    computed: {
       	
	},
	watch: {
        topFlag() {
			this.cmsArticle.weight = this.topFlag == 'y' ? (this.cmsArticle.weight < 999 ? 999 : this.cmsArticle.weight) : (this.cmsArticle.weight < 999 ? this.cmsArticle.weight : 0);
		},
		'cmsArticle.weight'() {
			this.topFlag = this.cmsArticle.weight >= 999 ? 'y' : 'n';
		}
    },
    mounted () {
		// this.enableFlow = true;
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
    	save: function(layerid) {  
    		this.submitHandler((token) => {
				loading();
				this.cmsArticle.publishStatus = this.submitStatus; 		
	            saveOrUpdate(JSON.stringify(this.cmsArticle), JSON.stringify(this.cmsArticleData), JSON.stringify(this.$refs.fileUpload.getAttamentIds()), this.approver, this.taskComment, token).then(result => {
					alert(result.msg);
					closeLoading();
	                this.backListView(this.cmsArticle.id == null, this.listView);
	            }).catch((error) => {
					// 此处你的业务代码
					closeLoading();
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if (this.cmsArticle.id) {
                get(this.cmsArticle.id).then(result => {
                    var data = result.data;
                    if (data) {
						var cmsArticle =  data.cmsArticle || this.cmsArticle;
						cmsArticle.publishDate = cmsArticle.publishDate ? formatDate(cmsArticle.publishDate, "YYYY-MM-DD HH:mm:ss") : "";
						if (cmsArticle.weight >= 999) {
							this.topFlag = 'y';
						}
						this.cmsArticle = cmsArticle;
						var articleDataMap = data.articleDataMap || {};
						this.cmsArticleData = articleDataMap[this.cmsArticle.id] || this.cmsArticleData;
						cmsCategoryApi.get(cmsArticle.categoryId).then(res => {
							let cmsCategory = res.data.cmsCategory || {};
							if (cmsCategory.isAudit == "y") {
								this.cmsenableFlow = true;
							}
							if (cmsCategory.isAudit == "n") {
								this.cmsenableFlow = false;
							}
							this.processKey = cmsCategory.processKey || thid.processKey;
							this.simpleMode = cmsCategory.simpleMode == 'y';
							this.initAfterFlag = true;
						}).catch(error => {
							this.initAfterFlag = true;
						});
						
					}
					
                });
            } else {
				this.cmsArticle.publishDate = formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
				cmsCategoryApi.get(this.cmsArticle.categoryId || this.category.id).then(res => {
					let cmsCategory = res.data.cmsCategory || {};
					if (cmsCategory.isAudit == "y") {
						this.cmsenableFlow = true;
					}
					if (cmsCategory.isAudit == "n") {
						this.cmsenableFlow = false;
					}
					this.processKey = cmsCategory.processKey || thid.processKey;
					this.initAfterFlag = true;
				}).catch(error => {
					this.initAfterFlag = true;
				});
			}
            
        	// getDicts('').then(result => {
            //     var data = result.data;
            //     if(data){
            //     }
            // });
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form'], function(){
        		var element = element
        		,form = layui.form;

				//自定义验证规则
				form.verify({
					title: function(value){
					    if(value.length < 10){
					    	return '标题至少得10个字符哟';
					    }
					}
					,content: function(value){
					    layedit.sync(editIndex);
					}
				});

				form.on('submit(saveCmsArticle)', function(data){
					_this.save();
					return false;
				});

				form.on('submit(publishCmsArticle)', function(data){
					layer.confirm("是否直接发布?", function(index) {
						_this.approvalSubmit(null, _this.cmsenableFlow);
						layer.close(index)
    	    		});
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>

</style>