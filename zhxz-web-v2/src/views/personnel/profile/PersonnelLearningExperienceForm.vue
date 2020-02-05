<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content" style="overflow-x: hidden; min-width: 740px">
                <layui-form>
                    <template>
                        <layui-item>
                            <layui-inline-input
                                label="毕业院校" 
                                placeholder="请输入毕业院校"
                                v-model="personnelLearningExperience.graduatedSchool"></layui-inline-input>
                            <layui-inline-input
                                label="专业" 
                                placeholder="请输入专业"
                                v-model="personnelLearningExperience.major"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <!-- <layui-inline-input
                                label="学历" 
                                placeholder="请输入学历"
                                v-model="personnelLearningExperience.education"></layui-inline-input>
                            <layui-inline-input
                                label="学位" 
                                placeholder="请输入学位"
                                v-model="personnelLearningExperience.degree"></layui-inline-input> -->
                            <layui-inline-select
                                label="学历"
                                v-model="personnelLearningExperience.educationDict"
                                :items="educationDicts"></layui-inline-select>
                            <layui-inline-select
                                label="学位"
                                v-model="personnelLearningExperience.degreeDict"
                                :items="degreeDicts"></layui-inline-select>
                        </layui-item>
                        <layui-item>
                            <layui-inline-date
                                label="开始时间" 
                                placeholder="请输入开始时间"
                                v-model="personnelLearningExperience.startTime"
                                :readonly="false"
                                name="lstartTime"
                                type="date"></layui-inline-date>
                            <layui-inline-date
                                label="结束时间" 
                                placeholder="请输入结束时间"
                                v-model="personnelLearningExperience.endTime"
                                :readonly="false"
                                name="lendTime"
                                type="date"></layui-inline-date>
                        </layui-item>
                        <layui-item>
                            <layui-inline-select
                                v-if="personnelLearningExperience.educationDict != '0'"
                                label="学习形式"
                                v-model="personnelLearningExperience.learningWayDict"
                                :items="learningWayDicts"
                                :up="true"></layui-inline-select>
                            <!-- <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelLearningExperience.learnOrder"
                                type="number"></layui-inline-input> -->
                            <file-upload-input
                                :attachmentBusinessId="personnelLearningExperience.id"
                                attachmentBusinessType="personnel_learning_experience"
                                module="personnel"
                                name="jyjlfile"
                                label="相关证明文件"
                                v-model="attachmentId"></file-upload-input>
                        </layui-item>
                    </template>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelLearningExperience"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelLearningExperience'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelLearningExperienceForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
			educationDicts: [],
			degreeDicts: [],
			learningWayDicts: [],
            personnelLearningExperience: {
                id: this.personnelLearningExperienceId,
				personnelId: this.personnelId,
				learnOrder: this.order,
				graduatedSchool: '',
				major: '',
				education: '',
				educationDict: '',
				degree: '',
				degreeDict: '',
				learningWay: '',
				learningWayDict: '',
				startTime: '',
				endTime: '',
            },
            attachmentId: ''
        }
    },
    props: {
        personnelLearningExperienceId: {
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
	            saveOrUpdate(JSON.stringify(this.personnelLearningExperience), this.attachmentId,  token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelLearningExperience.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelLearningExperience.id){
                get(this.personnelLearningExperience.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelLearningExperience =  Object.assign({}, data.personnelLearningExperience || this.personnelLearningExperience);
                        this.personnelLearningExperience.startTime = formatDate(this.personnelLearningExperience.startTime, 'YYYY-MM-DD');
                        this.personnelLearningExperience.endTime = formatDate(this.personnelLearningExperience.endTime, 'YYYY-MM-DD');
                    }
                });
            }
            
        	getDicts('PERSONNEL_EDUCATION_DICT,PERSONNEL_DEGREE_DICT,LEARNING_TYPE_DICT').then(result => {
                var data = result.data;
                if(data){
                    this.educationDicts = result.data[0] || [];
                    this.degreeDicts = result.data[1] || [];
                    this.learningWayDicts = result.data[2] || [];
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

				form.on('submit(savePersonnelLearningExperience)', function(data){
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
        /* border-width: 0px;
        padding: 20px;
        padding-right: 0; */
        padding: 20px 0px;
        padding-left: 30px;
    }
</style>