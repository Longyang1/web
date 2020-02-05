<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content" style="overflow-x: hidden">
                <layui-form>
                    <template>
                        <layui-item>
                            <layui-inline-input
                                style="padding-right: 18px"
                                label="工作单位" 
                                placeholder="请输入工作单位"
                                v-model="personnelWorkExperience.unit"
                                :block='true'></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="工作部门" 
                                placeholder="请输入工作部门"
                                v-model="personnelWorkExperience.department"></layui-inline-input>
                            <layui-inline-input
                                label="岗位/职务" 
                                placeholder="请输入岗位/职务"
                                v-model="personnelWorkExperience.job"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-date
                                label="开始时间" 
                                placeholder="请输入开始时间"
                                v-model="personnelWorkExperience.startTime"
                                :readonly="false"
                                name="pwstartTime"
                                type="date"></layui-inline-date>
                            <layui-inline-date
                                label="结束时间" 
                                placeholder="请输入结束时间"
                                v-model="personnelWorkExperience.endTime"
                                :readonly="false"
                                name="pwendTime"
                                type="date"></layui-inline-date>
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 18px"
                                label="主要工作内容" 
                                placeholder="请输入主要工作内容"
                                v-model="personnelWorkExperience.workContent"></layui-inline-textarea>
                        </layui-item>
                        <!-- <layui-item>
                            <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelWorkExperience.workOrder"
                                type="number"></layui-inline-input>
                        </layui-item> -->
                    </template>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelWorkExperience"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelWorkExperience'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelWorkExperienceForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            personnelWorkExperience: {
                id: this.personnelWorkExperienceId,
				personnelId: this.personnelId,
				workOrder: this.order,
				unit: '',
				department: '',
				job: '',
				workContent: '',
				startTime: '',
				endTime: '',
            },
        }
    },
    props: {
        personnelWorkExperienceId: {
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
	            saveOrUpdate(JSON.stringify(this.personnelWorkExperience), token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelWorkExperience.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelWorkExperience.id){
                get(this.personnelWorkExperience.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelWorkExperience =  Object.assign({}, data.personnelWorkExperience || {});
                        this.personnelWorkExperience.startTime = formatDate(this.personnelWorkExperience.startTime, 'YYYY-MM-DD');
                        this.personnelWorkExperience.endTime = formatDate(this.personnelWorkExperience.endTime, 'YYYY-MM-DD');
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

				form.on('submit(savePersonnelWorkExperience)', function(data){
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
    .ibox-content {
        border-width: 1px 0px;
    }
</style>