<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="XX信息">
	                	<template slot="main">
		                								<layui-item>
		                        <layui-inline-input
		                            label="人员ID" 
		                            placeholder="请输入人员ID"
		                            v-model="personnelInterview.personnelId"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="序号" 
		                            placeholder="请输入序号"
		                            v-model="personnelInterview.interviewOrder"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="面试时间" 
		                            placeholder="请输入面试时间"
		                            v-model="personnelInterview.interviewTime"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="面试地点" 
		                            placeholder="请输入面试地点"
		                            v-model="personnelInterview.interviewLocation"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="面试小组成员" 
		                            placeholder="请输入面试小组成员"
		                            v-model="personnelInterview.interviewPanelMember"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="背景调查" 
		                            placeholder="请输入背景调查"
		                            v-model="personnelInterview.backgroundCheck"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="面试情况" 
		                            placeholder="请输入面试情况"
		                            v-model="personnelInterview.interviewSituation"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="综合得分" 
		                            placeholder="请输入综合得分"
		                            v-model="personnelInterview.score"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="考察结论" 
		                            placeholder="请输入考察结论"
		                            v-model="personnelInterview.result"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建人" 
		                            placeholder="请输入创建人"
		                            v-model="personnelInterview.createBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建时间" 
		                            placeholder="请输入创建时间"
		                            v-model="personnelInterview.createDate"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="修改人" 
		                            placeholder="请输入修改人"
		                            v-model="personnelInterview.updateBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="修改时间" 
		                            placeholder="请输入修改时间"
		                            v-model="personnelInterview.updateDate"></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
                    <layui-inline>
                        <button class="layui-btn" lay-submit lay-filter="savePersonnelInterview"><i class="fa fa-save"></i> 保存</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelInterview'
import Base from "@/views/base/Base"

export default {
	name: 'PersonnelInterviewForm',
	extends: Base,
    data () {
        return {
            personnelInterview: {
                id: this.$route.params.id,
				personnelId: '',
				interviewOrder: '',
				interviewTime: '',
				interviewLocation: '',
				interviewPanelMember: '',
				backgroundCheck: '',
				interviewSituation: '',
				score: '',
				result: '',
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
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelInterview), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.personnelInterview.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelInterview.id){
                get(this.personnelInterview.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelInterview =  data.personnelInterview || this.personnelInterview;
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

				form.on('submit(savePersonnelInterview)', function(data){
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