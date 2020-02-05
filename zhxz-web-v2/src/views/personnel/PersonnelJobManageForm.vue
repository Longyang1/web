<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="岗位信息">
	                	<template slot="main">
		                	<layui-item>
		                        <!-- <layui-inline-select
		                            label="中心" 
		                            placeholder="请输入中心代码"
		                            v-model="personnelJobManage.centerCode"
                                    valKey="centerCode"
                                    labelKey="centerName"
                                    :items="centers"></layui-inline-select> -->
		                        <layui-inline-input
                                    v-if="personnelJobManage.jobManageType == 'zh'"
		                            label="所属部室" 
		                            placeholder="点击选择所属部室"
                                    :value="officeNameMap[personnelJobManage.officeId]"
                                    func="officeClick"
                                    :readonly="true"
                                    @officeClick="officeClick(1)"></layui-inline-input>
                                <layui-inline-input
                                    v-if="personnelJobManage.jobManageType == 'fh'"
		                            label="部门" 
		                            placeholder="请输入部门"
                                    v-model="personnelJobManage.officeName"></layui-inline-input>
                                <layui-inline-input
		                            label="岗位名称" 
		                            placeholder="请输入岗位名称"
		                            v-model="personnelJobManage.jobName"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="岗位代码" 
		                            placeholder="请输入岗位代码"
                                    layVerify="required"
		                            v-model="personnelJobManage.jobCode"></layui-inline-input>
                                <layui-inline-input
		                            label="序号" 
		                            placeholder="请输入序号"
                                    type="number"
		                            v-model="personnelJobManage.jobOrder"></layui-inline-input>
		                    </layui-item>
                            <layui-item v-if="personnelJobManage.jobManageType == 'zh'">
		                        <layui-inline-input
		                            label="编制" 
		                            placeholder="请输入编制"
                                    type="number"
		                            v-model="personnelJobManage.jobPreparation"></layui-inline-input>
                                <layui-inline-input
		                            label="轮岗期限（年）" 
		                            placeholder="请输入轮岗期限"
                                    type="number"
		                            v-model="personnelJobManage.rotationPeriod"></layui-inline-input>
		                    </layui-item>
                            <layui-item>
                                <layui-inline-textarea
		                            label="岗位描述" 
		                            placeholder="请输入岗位描述"
		                            v-model="personnelJobManage.jobDesc"></layui-inline-textarea>
                            </layui-item>
						</template>
					</layui-fieldset>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelJobManage"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelJobManage'
import * as personnelCenterConfigApi from '@/api/personnel/personnelCenterConfig'
import Base from "@/views/base/Base"

export default {
	name: 'PersonnelJobManageForm',
	extends: Base,
    data () {
        return {
            personnelJobManage: {
                id: this.$route.params.id,
                jobManageType: this.$route.params.jobManageType || 'zh',
				centerCode: '',
				officeId: '',
				jobName: '',
				jobCode: '',
				jobStatus: '',
                jobDesc: '',
                jobOrder: ''
            },
            centers: [],
            officeNameMap: {}
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
        clickNodeAfter: function(node){
            this.personnelJobManage.officeId = node.id;
            this.officeNameMap[node.id] = node.name;
            this.$layer.closeAll();
        },
    	officeClick: function(){
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        orgId: this.curUser.department.id
                    }
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: "部门/处室选择"
			});
    	},
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelJobManage), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.personnelJobManage.id == null, this.personnelJobManage.jobManageType == 'zh' ? 'PersonnelJobManageList' : 'FhPersonnelJobManageList');
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelJobManage.id){
                get(this.personnelJobManage.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelJobManage =  data.personnelJobManage || this.personnelJobManage;
                        this.officeNameMap = Object.assign(this.officeNameMap, data.officeNameMap || {});
                    }
                });
            }

            personnelCenterConfigApi.getPersonnelCenterConfigs({
                officeId: this.curUser.department.id
            }).then(res => {
                var data = res.data;
                if (data) {
                    this.centers = data.personnelCenterConfigs || [];
                }
                
            });
            
        	// getDicts('').then(result => {
            //     var data = result.data;
            //     if(data){
            //     }
            // });
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

				form.on('submit(savePersonnelJobManage)', function(data){
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