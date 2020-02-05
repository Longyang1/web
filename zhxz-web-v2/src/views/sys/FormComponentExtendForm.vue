<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="XX信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="组件ID" 
		                            placeholder="请输入组件ID"
		                            v-model="formComponentExtend.componentId"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="数据名称" 
		                            placeholder="请输入数据名称"
		                            v-model="formComponentExtend.dataName"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="数据编码" 
		                            placeholder="请输入数据编码"
		                            v-model="formComponentExtend.dataCode"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="列表数据源"
		                            v-model="formComponentExtend.dataDictSrc"
		                            :items="dataDictSrcs"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="数据参数" 
		                            placeholder="请输入数据参数"
		                            v-model="formComponentExtend.dataParam"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="数据显示顺序" 
		                            placeholder="请输入数据显示顺序"
		                            v-model="formComponentExtend.dataDisplayOrder"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建人" 
		                            placeholder="请输入创建人"
		                            v-model="formComponentExtend.createBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建时间" 
		                            placeholder="请输入创建时间"
		                            v-model="formComponentExtend.createDate"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="修改人" 
		                            placeholder="请输入修改人"
		                            v-model="formComponentExtend.updateBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="修改时间" 
		                            placeholder="请输入修改时间"
		                            v-model="formComponentExtend.updateDate"></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
                    <layui-inline>
                        <button class="layui-btn" lay-submit lay-filter="saveFormComponentExtend"><i class="fa fa-save"></i> 保存</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/formComponentExtend'
import Base from "@/views/base/Base"

export default {
	extends: Base,
    data () {
        return {
        	menuId: 'FormComponentExtendForm',
			dataDictSrcs: [],
            formComponentExtend: {
                id: this.$route.params.id,
				componentId: '',
				dataName: '',
				dataCode: '',
				dataDictSrc: '',
				dataParam: '',
				dataDisplayOrder: '',
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
            saveOrUpdate(JSON.stringify(this.formComponentExtend)).then(result => {
                alert(result.msg);
                this.backListView(this.formComponentExtend.id == null);
            });
    	},
        initData: function(){
            if(this.formComponentExtend.id){
                get(this.formComponentExtend.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.formComponentExtend =  data.formComponentExtend || this.formComponentExtend;
                    }
                });
            }
            
        	getDicts('DATA_DICT_SRC,').then(result => {
                var data = result.data;
                if(data){
                    this.dataDictSrcs = result.data['序号'] || [];
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

				form.on('submit(saveFormComponentExtend)', function(data){
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