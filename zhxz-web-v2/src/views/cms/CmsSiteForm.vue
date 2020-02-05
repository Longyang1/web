<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="站点信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="站点名称" 
		                            placeholder="请输入站点名称"
		                            v-model="cmsSite.name"
									:block="true"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="站点标题" 
		                            placeholder="请输入站点标题"
		                            v-model="cmsSite.title"
									:block="true"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="站点Logo" 
		                            placeholder="请输入站点Logo"
		                            v-model="cmsSite.logo"></layui-inline-input>
		                        <layui-inline-input
		                            label="站点域名" 
		                            placeholder="请输入站点域名"
		                            v-model="cmsSite.domain"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="关键字" 
		                            placeholder="请输入关键字"
		                            v-model="cmsSite.keywords"
									:block="true"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
		                            label="描述" 
		                            placeholder="请输入描述"
		                            v-model="cmsSite.description"></layui-inline-textarea>
		                    </layui-item>
							<layui-item v-if="false">
		                        <layui-inline-input
		                            label="主题" 
		                            placeholder="请输入主题"
		                            v-model="cmsSite.theme"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
		                            label="版权信息" 
		                            placeholder="请输入版权信息"
		                            v-model="cmsSite.copyright"></layui-inline-textarea>
		                    </layui-item>
							<layui-item v-if="false">
		                        <layui-inline-input
		                            label="自定义站点首页视图" 
		                            placeholder="请输入自定义站点首页视图"
		                            v-model="cmsSite.customIndexView"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
		                            label="备注信息" 
		                            placeholder="请输入备注信息"
		                            v-model="cmsSite.remarks"></layui-inline-textarea>
		                    </layui-item>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveCmsSite"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/cms/cmsSite'
import Base from "@/views/base/Base"

export default {
	name: 'CmsSiteForm',
	extends: Base,
    data () {
        return {
            cmsSite: {
                id: this.$route.params.id,
				name: '',
				title: '',
				logo: '',
				domain: '',
				description: '',
				keywords: '',
				theme: '',
				copyright: '',
				customIndexView: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
				remarks: '',
				delFlag: '',
            },
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
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.cmsSite), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.cmsSite.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.cmsSite.id){
                get(this.cmsSite.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.cmsSite =  data.cmsSite || this.cmsSite;
                    }
                });
            }
            
        	getDicts('').then(result => {
                var data = result.data;
                if(data){
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

				form.on('submit(saveCmsSite)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>

</style>