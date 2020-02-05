<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="XX信息">
	                	<template slot="main">
		                								<layui-item>
		                        <layui-inline-input
		                            label="表单模板ID" 
		                            placeholder="请输入表单模板ID"
		                            v-model="formTemplateComponent.templateId"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="组件ID" 
		                            placeholder="请输入组件ID"
		                            v-model="formTemplateComponent.componentId"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="选项组件设置值" 
		                            placeholder="请输入选项组件设置值"
		                            v-model="formTemplateComponent.optionComponentValue"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="结构组件设置值" 
		                            placeholder="请输入结构组件设置值"
		                            v-model="formTemplateComponent.tableComponentValue"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="复合组件设置值" 
		                            placeholder="请输入复合组件设置值"
		                            v-model="formTemplateComponent.multiComponentValue"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建人" 
		                            placeholder="请输入创建人"
		                            v-model="formTemplateComponent.createBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建时间" 
		                            placeholder="请输入创建时间"
		                            v-model="formTemplateComponent.createDate"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="修改人" 
		                            placeholder="请输入修改人"
		                            v-model="formTemplateComponent.updateBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="修改时间" 
		                            placeholder="请输入修改时间"
		                            v-model="formTemplateComponent.updateDate"></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
                    <layui-inline>
                        <button class="layui-btn" lay-submit lay-filter="saveFormTemplateComponent"><i class="fa fa-save"></i> 保存</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/formTemplateComponent'
import Base from "@/views/base/Base"

export default {
	extends: Base,
    data () {
        return {
        	menuId: 'FormTemplateComponentForm',
            formTemplateComponent: {
                id: this.$route.params.id,
				templateId: '',
				componentId: '',
				optionComponentValue: '',
				tableComponentValue: '',
				multiComponentValue: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
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
            saveOrUpdate(JSON.stringify(this.formTemplateComponent)).then(result => {
                alert(result.msg);
                this.backListView(this.formTemplateComponent.id == null);
            });
    	},
        initData: function(){
            if(this.formTemplateComponent.id){
                get(this.formTemplateComponent.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.formTemplateComponent =  data.formTemplateComponent || this.formTemplateComponent;
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

				form.on('submit(saveFormTemplateComponent)', function(data){
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