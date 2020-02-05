<template>
    <div class="view-product" v-cloak>
        <div class="animated" style="overflow-x: hidden">
            <div class="ibox-content">
                <layui-form>
                    <template>
                        <layui-item>
                            <!-- <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelTraining.traintOrder"
                                type="number"></layui-inline-input> -->
                            <layui-inline-input
                                style="padding-right: 18px"
                                label="培训名称" 
                                placeholder="请输入培训名称"
                                v-model="personnelTraining.name"
                                :block='true'></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="培训地点" 
                                placeholder="请输入培训地点"
                                v-model="personnelTraining.location"></layui-inline-input>
                            <layui-inline-date
                                label="培训时间" 
                                placeholder="请输入培训时间"
                                v-model="personnelTraining.trainTime"
                                :readonly="false"
                                name="pttrainTime"
                                type="date"></layui-inline-date>
                            <!-- <layui-inline-date
                                label="结束时间" 
                                placeholder="请输入结束时间"
                                v-model="personnelTraining.endTime"
                                :readonly="false"
                                name="ptendTime"
                                type="date"></layui-inline-date> -->
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 20px"
                                label="培训说明" 
                                placeholder="请输入培训说明"
                                v-model="personnelTraining.content"></layui-inline-textarea>
                        </layui-item>
                        <layui-item>
                            <file-upload-input
                                :attachmentBusinessId="personnelTraining.id"
                                attachmentBusinessType="personnel_training"
                                module="personnel"
                                name="pxcgzmfile"
                                label="培训成果或证明"
                                v-model="attachmentId"></file-upload-input>
                        </layui-item>
                    </template>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelTraining"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelTraining'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelTrainingForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            personnelTraining: {
                id: this.personnelTrainingId,
                personnelId: this.personnelId,
                name: '',
				trainOrder: this.order,
				location: '',
				content: '',
				trainTime: '',
            },
            attachmentId: '',
        }
    },
    props: {
        personnelTrainingId: {
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
	            saveOrUpdate(JSON.stringify(this.personnelTraining), this.attachmentId, token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelTraining.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelTraining.id){
                get(this.personnelTraining.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelTraining =  Object.assign({}, data.personnelTraining || this.personnelTraining);
                        this.personnelTraining.trainTime = formatDate(this.personnelTraining.trainTime, 'YYYY-MM-DD');
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

				form.on('submit(savePersonnelTraining)', function(data){
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