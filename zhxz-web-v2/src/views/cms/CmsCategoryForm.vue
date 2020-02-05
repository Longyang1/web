<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="栏目信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="父级栏目" 
		                            placeholder="请点击选择父级栏目"
		                            v-model="cmsCategory.parentId"
									func="openCategoryTreeModal"
									@openCategoryTreeModal="openCategoryTreeModal"></layui-inline-input>
		                        <layui-inline-input
		                            label="所属站点" 
		                            placeholder="请点击选择站点"
		                            :value="siteNameMap[cmsCategory.siteId]"
									func="siteSelect"
									@siteSelect="siteSelect"></layui-inline-input>
		                    </layui-item>
							<!-- <layui-item>
		                        <layui-inline-input
		                            label="所有父级编号" 
		                            placeholder="请输入所有父级编号"
		                            v-model="cmsCategory.parentIds"></layui-inline-input>
		                    </layui-item> -->
							<!-- <layui-item>
		                        <layui-inline-input
		                            label="归属机构" 
		                            placeholder="请输入归属机构"
		                            v-model="cmsCategory.officeId"></layui-inline-input>
		                    </layui-item> -->
							<layui-item>
		                        <layui-inline-input
		                            label="栏目名称" 
		                            placeholder="请输入栏目名称"
		                            v-model="cmsCategory.name"></layui-inline-input>
		                        <layui-inline-select
		                            label="栏目模块" 
		                            placeholder="请输入栏目模块"
									:items="modules"
		                            v-model="cmsCategory.module"></layui-inline-select>
		                    </layui-item>
							<layui-item v-if="cmsCategory.module == 'link'">
		                        <layui-inline-input
		                            label="链接" 
		                            placeholder="请输入链接"
		                            v-model="cmsCategory.href"></layui-inline-input>
		                        <layui-inline-input
		                            label="目标" 
		                            placeholder="请输入目标"
		                            v-model="cmsCategory.target"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="关键字" 
		                            placeholder="请输入关键字"
		                            v-model="cmsCategory.keywords"></layui-inline-input>
								<layui-inline-input
		                            label="排序" 
		                            placeholder="请输入排序"
									type="number"
		                            v-model="cmsCategory.sort"></layui-inline-input>
		                    </layui-item>
							<!-- <layui-item>
		                        <layui-inline-input
		                            label="栏目图片" 
		                            placeholder="请输入栏目图片"
		                            v-model="cmsCategory.image"></layui-inline-input>
		                    </layui-item> -->
							
							<layui-item>
		                        <layui-inline-input
		                            label="是否在导航中显示" 
		                            placeholder="请输入是否在导航中显示"
		                            v-model="cmsCategory.inMenu"></layui-inline-input>
		                        <layui-inline-input
		                            label="是否在分类页中显示列表" 
		                            placeholder="请输入是否在分类页中显示列表"
		                            v-model="cmsCategory.inList"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="展现方式" 
		                            placeholder="请输入展现方式"
		                            v-model="cmsCategory.showModes"></layui-inline-input>
		                        <layui-inline-input
		                            label="是否允许评论" 
		                            placeholder="请输入是否允许评论"
		                            v-model="cmsCategory.allowComment"></layui-inline-input>
								<layui-inline-input
		                            label="简化表单" 
		                            placeholder="请输入简化表单"
		                            v-model="cmsCategory.simpleMode"></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-input
		                            label="是否需要审核" 
		                            placeholder="请输入是否需要审核"
		                            v-model="cmsCategory.isAudit"></layui-inline-input>
								<layui-inline-input
									v-if="cmsCategory.isAudit == 'y'"
		                            label="流程KEY" 
		                            placeholder="请输入流程KEY"
		                            v-model="cmsCategory.processKey"></layui-inline-input>
							</layui-item>
							<!-- <layui-item>
		                        <layui-inline-input
		                            label="自定义列表视图" 
		                            placeholder="请输入自定义列表视图"
		                            v-model="cmsCategory.customListView"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="自定义内容视图" 
		                            placeholder="请输入自定义内容视图"
		                            v-model="cmsCategory.customContentView"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="视图配置" 
		                            placeholder="请输入视图配置"
		                            v-model="cmsCategory.viewConfig"></layui-inline-input>
		                    </layui-item> -->
							<div class="c-textarea">
								<layui-item>
									<layui-inline-textarea
										label="描述" 
										placeholder="请输入描述"
										v-model="cmsCategory.description"></layui-inline-textarea>
								</layui-item>
								<layui-item>
									<layui-inline-textarea
										label="备注信息" 
										placeholder="请输入备注信息"
										v-model="cmsCategory.remarks"></layui-inline-textarea>
								</layui-item>
							</div>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveCmsCategory"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/cms/cmsCategory'
import Base from "@/views/base/Base"
import CategoryTree from '@/views/cms/CategoryTree'
import SiteSelectList from '@/views/cms/components/SiteSelectList'

export default {
	name: 'CmsCategoryForm',
	extends: Base,
    data () {
        return {
            cmsCategory: {
                id: this.$route.params.id,
				parentId: '',
				parentIds: '',
				siteId: '',
				officeId: '',
				module: 'article',
				name: '',
				image: '',
				href: '',
				target: '',
				description: '',
				keywords: '',
				sort: '',
				inMenu: '',
				inList: '',
				showModes: '',
				allowComment: '',
				isAudit: '',
				customListView: '',
				customContentView: '',
				viewConfig: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
				remarks: '',
				delFlag: '',
			},
			modules: [],
			siteNameMap: {},
        }
    },
    computed: {
       	
	},
	watch: {
        
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
		getSelectItem: function(selectedItem, layerid) {
			this.cmsCategory.siteId  = selectedItem.id;
			this.siteNameMap[selectedItem.id] = selectedItem.name;
			this.$layer.close(layerid);
		},
		siteSelect: function() {
			this.$layer.iframe({
				content: {
					content: SiteSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
						isMultiSelect: false
					}
				},
				area: [_w() * 0.8, _h() * 0.8],
				title: "站点选择"
            });
		},
		openCategoryTreeModal: function() {
			this.$layer.iframe({
				content: {
					content: CategoryTree, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
						
					}
				},
				area: ['auto', 'auto'],
				title: "栏目选择"
            });
		},
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.cmsCategory), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.cmsCategory.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.cmsCategory.id){
                get(this.cmsCategory.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.cmsCategory =  data.cmsCategory || this.cmsCategory;
                    }
                });
            }
            
        	getDicts('CMS_CATEGORY_MODULE').then(result => {
                var data = result.data;
                if(data){
					this.modules = data[0] || [];
                }
            });
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

				form.on('submit(saveCmsCategory)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
.view-product /deep/ .layui-form-pane .layui-form-label {
    width: 180px;
}
.view-product /deep/ .layui-form-pane .layui-input-block {
    margin-left: 180px;
}
.view-product /deep/ .c-textarea .layui-form-pane .layui-form-label {
    width: 100%;
}
.view-product /deep/ .c-textarea .layui-form-pane .layui-input-block {
    margin-left: 0px;
}
</style>