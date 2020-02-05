<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="项目基本信息">
	                	<template slot="main">
							<layui-item>
		                        <layui-inline-input
									label="项目名称"
									lay-verify="required"
									placeholder="请输入项目名称"
									v-model="projectInfo.projectName"
									:cssStyle="{width: '537px', display: 'inline-block'}">
								</layui-inline-input>
							</layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="项目别名" 
									lay-verify="required"
		                            placeholder="请输入项目别名"
		                            v-model="projectInfo.projectAliasName"></layui-inline-input>
								<layui-inline-select
									label="项目年度"
									lay-verify="required"
									placeholder="请选择项目年度"
									v-model="projectInfo.projectYear"
									:items="projectYeats">
								</layui-inline-select>
		                    </layui-item>
							<layui-item>
								<layui-inline-dict-linkage-select
									label="项目类型"
									type="PROJECT_TYPE_DICT"
									lay-verify="required"
									v-model="projectInfo.projectTypeDict"></layui-inline-dict-linkage-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="业务范围类型"
									lay-verify="required"
		                            v-model="projectInfo.projectMajorDict"
		                            :items="projectMajorDicts"></layui-inline-select>
								<layui-inline-select
		                            label="项目阶段类型"
									lay-verify="required"
		                            v-model="projectInfo.projectPhaseDict"
		                            :items="projectPhaseDicts"></layui-inline-select>
							</layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="项目状态"
									lay-verify="required"
		                            v-model="projectInfo.projectStatusDict"
		                            :items="projectStatusDicts"></layui-inline-select>
		                        <layui-inline-select
		                            label="项目合同状态"
									lay-verify="required"
		                            v-model="projectInfo.projectContractStatusDict"
		                            :items="projectContractStatusDicts"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="项目合同名称" 
									lay-verify="required"
		                            placeholder="请输入项目合同名称"
		                            v-model="projectInfo.projectContractName"></layui-inline-input>
		                        <layui-inline-input
		                            label="项目合同编号"
									lay-verify="required" 
		                            placeholder="请输入项目合同编号"
		                            v-model="projectInfo.projectContractNo"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="预算金额（万元）" 
									type="number"
									lay-verify="required"
		                            placeholder="请输入项目预算金额"
		                            v-model="projectInfo.projectBudgetFund"></layui-inline-input>
		                        <layui-inline-input
		                            label="项目工期(个月)" 
									type="number"
									lay-verify="required"
		                            placeholder="请输入项目工期"
		                            v-model="projectInfo.projectDuration"></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-date
									label="计划开始日期"
									type="date"
									lay-verify="required"
									placeholder="点击选择日期"
									name="projectPlanStartDate"
									v-model="projectInfo.projectPlanStartDate"/>
								<layui-inline-date
									label="计划结束日期"
									type="date"
									lay-verify="required"
									placeholder="点击选择日期"
									name="projectPlanEndDate"
									v-model="projectInfo.projectPlanEndDate"/>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="客户名称" 
									lay-verify="required"
		                            placeholder="请输入客户名称"
		                            v-model="projectInfo.customerName"
									:cssStyle="{width: '537px', display: 'inline-block'}"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="客户联系人" 
									lay-verify="required"
		                            placeholder="请输入客户联系人"
		                            v-model="projectInfo.customerLinkName"></layui-inline-input>
		                        <layui-inline-input
		                            label="客户联系电话" 
									lay-verify="required"
		                            placeholder="请输入客户联系电话"
		                            v-model="projectInfo.customerLinkTel"></layui-inline-input>
		                    </layui-item>
							<layui-item>
                                <layui-inline-textarea
                                    label="项目介绍"
									lay-verify="required"
                                    placeholder="请输入项目介绍"
									style="width: 53%"
                                    v-model="projectInfo.projectDetail"></layui-inline-textarea>
                            </layui-item>
							<layui-item>
                                <layui-inline-textarea
                                    label="备注"
                                    placeholder="请输入备注"
									style="width: 53%"
                                    v-model="projectInfo.remark"></layui-inline-textarea>
                            </layui-item>
						</template>
					</layui-fieldset>
					<layui-fieldset label="成本&利润中心">
						<template slot="main">
							<layui-item>
								<layui-inline-select
		                            label="实施成本中心"
									lay-verify="required"
		                            v-model="projectInfo.projectCostCenterDict"
		                            :items="projectCostCenterDicts"></layui-inline-select>
								<layui-inline-select
		                            label="核算成本中心"
									lay-verify="required"
		                            v-model="projectInfo.projectAccountCenterDict"
		                            :items="projectAccountCenterDicts"></layui-inline-select>
		                    </layui-item>
							<layui-item>
								<layui-inline-select
		                            label="利润中心"
									lay-verify="required"
		                            v-model="projectInfo.projectProfitCenterDict"
		                            :items="projectProfitCenterDicts"></layui-inline-select>
		                    </layui-item>
						</template>	
					</layui-fieldset>
					<layui-fieldset label="项目角色">
						<template slot="main">
							<layui-item>
								<layui-inline-input
                                    label="项目总监" 
                                    placeholder="点击选择项目总监"
                                    func="selectMember"
                                    @selectMember="selectMember(1)"
                                    :value="userMap[projectInfo.projectInspectorId] ? userMap[projectInfo.projectInspectorId] : ''"
									lay-verify="required"
                                    :readonly="true"></layui-inline-input>
								<layui-inline-input
                                    label="项目经理" 
                                    placeholder="点击选择项目经理"
                                    func="selectMember"
                                    @selectMember="selectMember(2)"
                                    :value="userMap[projectInfo.projectPmId] ? userMap[projectInfo.projectPmId] : ''"
									lay-verify="required"
                                    :readonly="true"></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-input
									label="项目所属部门"
									placeholder="请选择项目所属部门"
									@officeClick="officeClick(0)"
									func="officeClick"
									lay-verify="required"
									:value="officeNameMap[projectInfo.projectDeptId]">
								</layui-inline-input>
								<layui-inline-input
                                    label="配置管理员" 
                                    placeholder="点击选择配置管理员"
                                    func="selectMember"
                                    @selectMember="selectMember(3)"
                                    :value="userMap[projectInfo.projectCmId] ? userMap[projectInfo.projectCmId] : ''"
									lay-verify="required"
                                    :readonly="true"></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-input
                                    label="测试负责人" 
                                    placeholder="点击选择测试负责人"
                                    func="selectMember"
                                    @selectMember="selectMember(4)"
                                    :value="userMap[projectInfo.projectTmId] ? userMap[projectInfo.projectTmId] : ''"
									lay-verify="required"
                                    :readonly="true"></layui-inline-input>
		                    </layui-item>
						</template>	
					</layui-fieldset>
					<file-upload
                        :attachmentBusinessId="projectInfo.id"
                        attachmentBusinessType="project_info"
                        module="project"
                        ref="fileUpload"/>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveProjectInfo"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/project/projectInfo'
import { formatDate } from '@/utils/formatUtils'
import Base from "@/views/base/Base"
import UserSelectList from '@/components/UserSelectList'
import OfficeTree from '@/components/OfficeTree'

export default {
	name: 'ProjectInfoForm',
	extends: Base,
    data () {
        return {
			projectTypeDicts: [],
			projectMajorDicts: [],
			projectPhaseDicts: [],
			projectStatusDicts: [],
			projectContractStatusDicts: [],
			projectCostCenterDicts: [],
			projectAccountCenterDicts: [],
			projectProfitCenterDicts: [],
			projectInfoOperateStatusDicts: [],
            projectInfo: {
                id: this.$route.params.id,
				projectName: '',
				projectAliasName: '',
				projectYear: '',
				projectType: '',
				projectTypeDict: '',
				projectMajor: '',
				projectMajorDict: '',
				projectPhase: '',
				projectPhaseDict: '',
				projectNumber: '',
				projectDetail: '',
				remark: '',
				projectStatus: '',
				projectStatusDict: '',
				projectContractStatus: '',
				projectContractStatusDict: '',
				projectContractName: '',
				projectContractNo: '',
				projectBudgetFund: '',
				projectDuration: '',
				projectPlanStartDate: '',
				projectPlanEndDate: '',
				customerName: '',
				customerLinkName: '',
				customerLinkTel: '',
				projectCostCenter: '',
				projectCostCenterDict: '',
				projectAccountCenter: '',
				projectAccountCenterDict: '',
				projectProfitCenter: '',
				projectProfitCenterDict: '',
				projectInspector: '',
				projectInspectorId: '',
				projectPm: '',
				projectPmId: '',
				projectDeptId: '',
				projectCm: '',
				projectCmId: '',
				projectTm: '',
				projectTmId: '',
				projectAuditStatus: '',
				projectAuditDate: '',
				projectInfoOperateStatus: '',
				projectInfoOperateStatusDict: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
			},
			projectYeats: [],
			userMap: {},
			officeNameMap: {},
			curSelectUserIndex: 0,
			officeClickIndex: 0,
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
	            saveOrUpdate(JSON.stringify(this.projectInfo), token).then(result => {
	                alert(result.msg);
					this.resetToken(result);
	                //this.backListView(this.projectInfo.id == null, 'ProjectInfoListSelf');
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
		},
		officeClick: function (index) {
            this.officeClickIndex = index;
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this, //当前的vue对象
                    data: []
                },
                area: [
                    'auto',
                    (window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight) *
                    0.8 +
                    'px'
                ],
                title: '部门选择'
            });
		},
		clickNodeAfter: function (node) {
            this.officeNameMap[node.id]=node.name;
            this.projectInfo.projectDeptId = node.id;
            this.$layer.closeAll();
        },
        selectMember: function(index){
            this.curSelectUserIndex = index;
			this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						isMultiUser: false
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
            });
		},
		getSelectUser: function(user, office) {
			this.userMap[user.userId] = user.userName;
			switch(this.curSelectUserIndex) {
				case 1:
					this.$set(this.projectInfo, 'projectInspectorId', user.userId);
					break;
				case 2:
					this.$set(this.projectInfo, 'projectPmId', user.userId);
					break;
				case 3:
					this.$set(this.projectInfo, 'projectCmId', user.userId);
					break;
				case 4:
					this.$set(this.projectInfo, 'projectTmId', user.userId);
					break;
				default:
					break;
			}
            this.$layer.closeAll();
        },
        initData: function(){
            if(this.projectInfo.id){
                get(this.projectInfo.id).then(result => {
                    var data = result.data;
                    if(data) {
						this.projectInfo =  data.projectInfo || this.projectInfo;
						this.projectInfo.projectPlanStartDate = formatDate(this.projectInfo.projectPlanStartDate, 'YYYY-MM-DD');
						this.projectInfo.projectPlanEndDate = formatDate(this.projectInfo.projectPlanEndDate, 'YYYY-MM-DD');
						this.userMap = data.userMap || {};
						this.officeNameMap = data.officeNameMap || {};
                    }
                });
            }
            
        	getDicts('PROJECT_TYPE_DICT,PROJECT_MAJOR_DICT,PROJECT_PHASE_DICT,PROJECT_STATUS_DICT,CONTRACT_STATE_DICT,PROJECT_YEAR,PROJECT_COST_CENTER_DICT,PROJECT_ACCOUNT_CENTER_DICT,PROJECT_PROFIT_CENTER_DICT').then(result => {
                var data = result.data;
                if(data){
                    this.projectTypeDicts = result.data[0] || [];
                    this.projectMajorDicts = result.data[1] || [];
                    this.projectPhaseDicts = result.data[2] || [];
                    this.projectStatusDicts = result.data[3] || [];
					this.projectContractStatusDicts = result.data[4] || [];
					this.projectYeats = result.data[5] || [];
					this.projectCostCenterDicts = result.data[6] || [];
					this.projectAccountCenterDicts = result.data[7] || [];
					this.projectProfitCenterDicts = result.data[8] || [];
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

				form.on('submit(saveProjectInfo)', function(data){
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