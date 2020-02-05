<template>
    <div class="view-product" v-cloak>
        <div class="animated" style="overflow-x: hidden">
            <div class="ibox-content">
                <layui-form>
                    <template>
                        <layui-item>
                            <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelWrittenExamination.writtenOrder"></layui-inline-input>
                            <layui-inline-date
                                label="笔试时间" 
                                placeholder="请输入笔试时间"
                                v-model="personnelWrittenExamination.writtenTime"
                                :readonly="false"
                                name="pwewrittenTime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"></layui-inline-date>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="笔试地点" 
                                placeholder="请输入笔试地点"
                                v-model="personnelWrittenExamination.writtenLocation"></layui-inline-input>
                            <layui-inline-input
                                label="笔试成绩" 
                                placeholder="请输入笔试成绩"
                                v-model="personnelWrittenExamination.score"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 18px;"
                                label="笔试情况" 
                                placeholder="请输入笔试情况"
                                v-model="personnelWrittenExamination.writtenSituation"></layui-inline-textarea>
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 18px;"
                                label="笔试内容" 
                                placeholder="请输入笔试内容"
                                v-model="personnelWrittenExamination.writtenContent"></layui-inline-textarea>
                        </layui-item>
                    </template>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelWrittenExamination"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelWrittenExamination'
import BaseModal from "@/views/base/BaseModal"
import { formatDate } from '@/utils/formatUtils'
import personnelProfileMixin from '@/mixin/personnelProfileMixin'

export default {
    name: 'PersonnelWrittenExaminationForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            personnelWrittenExamination: {
                id: this.personnelWrittenExaminationId,
                personnelId: this.personnelId,
				writtenOrder: this.order,
				writtenTime: '',
				writtenLocation: '',
				writtenSituation: '',
				score: '',
				writtenContent: '',
            },
        }
    },
    props: {
        personnelWrittenExaminationId: {
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
                var pwe = JSON.parse(JSON.stringify(this.personnelWrittenExamination));
                pwe.writtenTime += ":00"; 		
	            saveOrUpdate(JSON.stringify(pwe), token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelWrittenExamination.id == null);
                    }          
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelWrittenExamination.id){
                get(this.personnelWrittenExamination.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelWrittenExamination =  Object.assign({}, data.personnelWrittenExamination || {});
                        this.personnelWrittenExamination.writtenTime = formatDate(this.personnelWrittenExamination.writtenTime, 'YYYY-MM-DD HH:mm');
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

				form.on('submit(savePersonnelWrittenExamination)', function(data){
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