<template>
    <div class="view-product" v-cloak>
        <div class="animated" style="overflow-x: hidden">
            <div class="ibox-content">
                <layui-form>
                    <template>
                        <layui-item>
                            <layui-inline-input
                                label="项目名称" 
                                placeholder="请输入项目名称"
                                v-model="personnelProjectExperience.projectName"></layui-inline-input>
                            <layui-inline-input
                                label="项目角色" 
                                placeholder="请输入项目角色"
                                v-model="personnelProjectExperience.role"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 18px"
                                label="项目职责" 
                                placeholder="请输入项目职责"
                                v-model="personnelProjectExperience.projectDuty"></layui-inline-textarea>
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 18px"
                                label="项目描述" 
                                placeholder="请输入项目描述"
                                v-model="personnelProjectExperience.description"></layui-inline-textarea>
                        </layui-item>
                        <layui-item>
                            <layui-inline-date
                                label="开始时间" 
                                placeholder="点击选择开始时间"
                                v-model="personnelProjectExperience.startTime"
                                :readonly="false"
                                name="ppestarttime"
                                type="date"></layui-inline-date>
                            <layui-inline-date
                                label="结束时间" 
                                placeholder="点击选择结束时间"
                                v-model="personnelProjectExperience.endTime"
                                :readonly="false"
                                name="ppeendtime"
                                type="date"></layui-inline-date>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelProjectExperience.projectOrder"></layui-inline-input>
                        </layui-item>
                    </template>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelProjectExperience"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelProjectExperience'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'

export default {
	name: 'PersonnelProjectExperienceForm',
	mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            personnelProjectExperience: {
                id: this.personnelProjectExperienceId,
                personnelId: this.personnelId,
				projectOrder: this.order,
				projectName: '',
				role: '',
				projectDuty: '',
				description: '',
				startTime: '',
				endTime: '',
            },
        }
    },
    props: {
        personnelProjectExperienceId: {
            type: String,
            default: null
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
	            saveOrUpdate(JSON.stringify(this.personnelProjectExperience), token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelProjectExperience.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelProjectExperience.id){
                get(this.personnelProjectExperience.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelProjectExperience =  Object.assign({}, data.personnelProjectExperience || {});
                        this.personnelProjectExperience.startTime = formatDate(this.personnelProjectExperience.startTime, 'YYYY-MM-DD');
                        this.personnelProjectExperience.endTime = formatDate(this.personnelProjectExperience.endTime, 'YYYY-MM-DD');
                    }
                });
            }
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

				form.on('submit(savePersonnelProjectExperience)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
.view-product {
    padding-bottom: 0px;
}
</style>