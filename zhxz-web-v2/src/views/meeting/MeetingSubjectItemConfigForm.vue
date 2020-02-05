<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="议题事项信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="事项名称" 
		                            placeholder="请输入事项名称"
		                            v-model="meetingSubjectItemConfig.name"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="事项代码" 
		                            placeholder="请输入事项代码"
		                            v-model="meetingSubjectItemConfig.code"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="输入类型" 
		                            placeholder="请选择输入类型"
									:items="inputTypes"
		                            v-model="meetingSubjectItemConfig.type"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="组件类型" 
		                            placeholder="请选择组件类型"
									:items="componentTypes"
		                            v-model="meetingSubjectItemConfig.component"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="关联字典" 
		                            placeholder="请选择关联字典"
									:items="dictTypes"
									labelKey="dictTypeName"
									valKey="dictTypeCode"
		                            v-model="meetingSubjectItemConfig.dictType"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="事项排序" 
		                            placeholder="请输入事项排序"
		                            v-model="meetingSubjectItemConfig.itemOrder"></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveMeetingSubjectItemConfig"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/meeting/meetingSubjectItemConfig'
import Base from "@/views/base/Base"
import { getDictTypes } from '@/api/dict'

export default {
	name: 'MeetingSubjectItemConfigForm',
	extends: Base,
    data () {
        return {
            meetingSubjectItemConfig: {
                id: this.$route.params.id,
				name: '',
				code: '',
				dictType: '',
				itemOrder: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
			},
			dictTypes: [],
			inputTypes: [],
			componentTypes: [],
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
	            saveOrUpdate(JSON.stringify(this.meetingSubjectItemConfig), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.meetingSubjectItemConfig.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.meetingSubjectItemConfig.id){
                get(this.meetingSubjectItemConfig.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.meetingSubjectItemConfig =  data.meetingSubjectItemConfig || this.meetingSubjectItemConfig;
                    }
                });
            }
			
			getDicts('INPUT_TYPE,COMPONENT_TYPE').then(res => {
				let data = res.data;
				if (data) {
					this.inputTypes = data[0] || [];
					this.componentTypes = data[1] || [];
				}
			});
			
        	getDictTypes().then(result => {
                var data = result.data || {};
                this.dictTypes = data.sysDictTypes || [];
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

				form.on('submit(saveMeetingSubjectItemConfig)', function(data){
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