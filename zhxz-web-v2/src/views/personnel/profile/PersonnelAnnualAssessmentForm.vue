<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content" style="border-width: 1px;">
                <layui-form>
					<layui-item>
						<layui-inline-input
							label="考核年度" 
							placeholder="请输入考核年度"
							type="number"
							v-model="personnelAnnualAssessment.assessmentYear"></layui-inline-input>
						<select-office-input
							label="考核所在部门"
							placeholder="请点击选择考核所在部门"
							@clickNodeAfter="clickNodeAfter"
							:officeName="personnelAnnualAssessment.officeName"
							v-model="personnelAnnualAssessment.officeId"></select-office-input>
					</layui-item>
					<layui-item>
						<layui-inline-input
							label="考核人员职务" 
							placeholder="请输入考核人员职务"
							v-model="personnelAnnualAssessment.personnelDuty"></layui-inline-input>
						<layui-inline-select
							label="考核结果"
							v-model="personnelAnnualAssessment.assessmentResultDict"
							:items="assessmentResultDicts"></layui-inline-select>
					</layui-item>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelAnnualAssessment"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelAnnualAssessment'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'

export default {
	name: 'PersonnelAnnualAssessmentForm',
	mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
			assessmentTypeDicts: [],
			assessmentResultDicts: [],
            personnelAnnualAssessment: {
                id: this.personnelAnnualAssessmentId,
				personnelId: this.personnelId || '',
				assessmentYear: (new Date().getFullYear() - 1),
				assessmentType: '',
				assessmentTypeDict: '',
				userUid: '',
				personnelName: '',
				officeName: '',
				officeId: '',
				personnelDuty: '',
				assessmentResult: '',
				assessmentResultDict: '',
            },
        }
	},
	props: {
		personnelAnnualAssessmentId: {
			type: String,
			default: ''
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
		clickNodeAfter(node) {
			this.personnelAnnualAssessment.officeName = node.name;
		},
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelAnnualAssessment), token).then(result => {
					alert(result.msg);
					if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
	                	this.backListView(this.personnelAnnualAssessment.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if (this.personnelAnnualAssessment.id) {
                get(this.personnelAnnualAssessment.id).then(result => {
                    var data = result.data;
                    if (data) {
						this.personnelAnnualAssessment =  data.personnelAnnualAssessment || this.personnelAnnualAssessment;
                    }
                });
            }
            
        	getDicts('ASSESSMENT_TYPE_DICT,ASSESSMENT_RESULT_DICT,').then(result => {
                var data = result.data;
                if (data) {
                    this.assessmentTypeDicts = result.data[0] || [];
                    this.assessmentResultDicts = result.data[1] || [];
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

				form.on('submit(savePersonnelAnnualAssessment)', function(data){
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