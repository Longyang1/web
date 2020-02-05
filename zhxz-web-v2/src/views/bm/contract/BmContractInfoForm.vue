<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="合同信息">
	                	<template slot="main">
		                	<layui-item>
								<layui-inline-select
											lay-verify="required"
											:readonly="isReadOnly"
											:width="540"
											v-model="bmContractInfo.contractTypeDict"
											label="合同类型"
											style="margin-right: 0px"
											:items="bmContractDicts"
											class="d_xinyong">
										</layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="合同名称" 
		                            placeholder="请输入合同名称"
									layVerify=required
									:cssStyle="{width:'540px'}"
		                            v-model="bmContractInfo.contractName"
									:block="true"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="合同编号" 
		                            placeholder="请输入合同编号"
									layVerify=required
		                            v-model="bmContractInfo.contractNo"></layui-inline-input>
								<layui-inline-date
		                            label="合同签订日期" 
									layVerify=required
		                            placeholder="请输入合同签订日期"
									name="contractSignDate"
		                            v-model="bmContractInfo.contractSignDate"/>
		                    </layui-item>
							<layui-item>
								<!-- <layui-inline-select
									lay-verify="required"
									:readonly="isReadOnly"
									:width="540"
									v-model="bmContractInfo.companyId"
									label="供应商"
									style="margin-right: 0px"
									name = 'companyId'
									:items="companyDictList"
									class="d_xinyong">
								</layui-inline-select> -->
								<layui-inline-input
		                            label="供应商" 
		                            placeholder="请输入或选择"
									layVerify=required
									:cssStyle="{width:'540px'}"
		                            v-model="bmContractInfo.companyNames"></layui-inline-input>
								<span v-if=" !isReadOnly">
									<span>
										<i @click="openCompanyModal"
											class="fa fa-plus text-warning select-pros"><label>选择</label></i>
									</span>
								</span>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="联系人" 
		                            placeholder="请输入联系人姓名"
									layVerify=required
		                            v-model="bmContractInfo.linkName"></layui-inline-input>
								<layui-inline-input
		                            label="联系人电话" 
									lay-verify="linkTel"
		                            placeholder="请输入联系人电话"
									name="linkTel"
		                            v-model="bmContractInfo.linkTel"/></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-select
											lay-verify="required"
											:readonly="isReadOnly"
											:width="540"
											v-model="bmContractInfo.projectInfoId"
											label="项目名称"
											style="margin-right: 0px"
											name = 'projectId'
											:items="projectDictList"
											class="d_xinyong">
										</layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="合同责任部门" 
		                            placeholder="请输入合同责任部门"
									layVerify=required
		                            v-model="bmContractInfo.deptId"></layui-inline-input>
								<layui-inline-input
		                            label="合同负责人" 
									layVerify=required
		                            placeholder="请输入合同负责人"
									name="contractManagerId"
		                            v-model="bmContractInfo.contractManagerId"/></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="币种" 
		                            placeholder="请选择币种"
									layVerify=required
									name = "currency"
									:items="dicts[1]"
		                            v-model="bmContractInfo.currency"></layui-inline-select>
								<layui-inline-select
		                            label="核算成本中心" 
									layVerify=required
		                            placeholder="请输入核算成本中心"
									name="account_center"
									:items="dicts[2]"
		                            v-model="bmContractInfo.accountCenterDict"/></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-date
		                            label="合同开始时间" 
		                            placeholder="请选择合同开始时间"
									layVerify=required
									name="contractStartTime"
		                            v-model="bmContractInfo.contractStartTime"></layui-inline-date>
								<layui-inline-date
		                            label="合同结束时间" 
									layVerify=required
		                            placeholder="请选择合同结束时间"
									name="contractEndTime"
		                            v-model="bmContractInfo.contractEndTime"></layui-inline-date>
		                    </layui-item>

							<layui-item>
		                        <layui-inline-input
		                            label="合同含增值税金额" 
									layVerify=required
									:type="'number'"
		                            placeholder="请输入合同含增值税金额"
		                            v-model="bmContractInfo.contractAmount"></layui-inline-input>
		                        <layui-inline-input
		                            label="合同不含增值税金额" 
									layVerify=required
									:type="'number'"
		                            placeholder="请输入合同不含增值税金额"
		                            v-model="bmContractInfo.contractPretaxAmount"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        
		                    </layui-item>
							<!-- <layui-item>
		                        <layui-inline-date
		                            label="合同开始时间" 
		                            placeholder="请输入合同开始时间"
									name = 'serviceStartTime'
		                            v-model="bmContractInfo.serviceStartTime"/>
		                        <layui-inline-date
		                            label="合同结束时间" 
		                            placeholder="请输入合同结束时间"
									name = 'serviceEndTime'
		                            v-model="bmContractInfo.serviceEndTime"/>
		                    </layui-item> -->
							<layui-item>
		                        <layui-inline-input
		                            label="维保年限" 
									:type="'number'"
		                            placeholder="请输入维保年限"
		                            v-model="bmContractInfo.maintainYear"></layui-inline-input>
								<layui-inline-select
		                            label="合同结算类型" 
									layVerify=required
		                            placeholder="请选择合同结算类型"
									name="contractBalanceTypeDict"
									:items="dicts[3]"
		                            v-model="bmContractInfo.contractBalanceTypeDict"/></layui-inline-select>
		                    </layui-item>
							<layui-item>
								<layui-inline-textarea
		                            label="合同含增值税金额补充说明" 
		                            placeholder="请输入合同含增值税金额补充说明"
		                            v-model="bmContractInfo.contractAmountRemark"></layui-inline-textarea>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
		                            label="维保年限说明" 
		                            placeholder="请输入维保年限说明"
		                            v-model="bmContractInfo.maintainYearsRemark"></layui-inline-textarea>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
		                            label="备注" 
		                            placeholder="请输入备注"
		                            v-model="bmContractInfo.remark"></layui-inline-textarea>
		                    </layui-item>
							<!--上传附件-->
							<layui-item>
								<file-upload
										label="附件" id="anchor-7"
										:attachmentBusinessId="bmContractInfo.id"
										attachmentBusinessType="bm_contract_info"
										module="BmContractInfoForm"
										type="2"
										:readonly="isReadOnly"
										:canUpload="isCanUpload"
										ref="fileUploadMain"/>
							</layui-item>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveBmContractInfo"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get,getCompanyDictList,getSupplierById } from '@/api/bm/bmContractInfo'
import Base from "@/views/base/Base"
import {formatDate} from "../../../utils/formatUtils";
import ChooseSupplierInfoList from '@/views/bm/contract/ChooseSupplierInfoList' 
import bus from '@/assets/js/event.js'

export default {
	name: 'BmContractInfoForm',
	extends: Base,
    data () {
        return {
            bmContractInfo: {
				id: this.$route.params.id,
				contractType: '',
				contractTypeDict: '',
				contractName: '',
				contractNo: '',
				contractSignDate: '',
				companyId: '',
				companyNames: '',
				linkName: '',
				linkTel: '',
				projectInfoId: '',
				projectName: '',
				deptId: '',
				contractManagerId: '',
				currency: '',
				currencyDict: '',
				accountCenter: '',
				accountCenterDict: '',
				contractAmount: '',
				contractPretaxAmount: '',
				contractAmountRemark: '',
				contractBalanceType: '',
				contractBalanceTypeDict: '',
				contractStartTime: '',
				contractEndTime: '',
				maintainYear: '',
				maintainYearsRemark: '',
				contractState: '',
				contractStateDict: '',
				deleteState: '',
				remark: '',
			},
			bmContractDicts:[],
			companyDictList:[],
			projectDictList:[],
			currencyDicts:[],
			dicts:[],
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
				this.bmContractInfo.deleteState = '0';
	            saveOrUpdate(JSON.stringify(this.bmContractInfo), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.bmContractInfo.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.bmContractInfo.id){
                get(this.bmContractInfo.id).then(result => {
                    var data = result.data;
                    if(data) {
						this.bmContractInfo =  data.bmContractInfo || this.bmContractInfo;
						this.bmContractInfo.contractSignDate = formatDate(this.bmContractInfo.contractSignDate, "YYYY-MM-DD") ;
						this.bmContractInfo.contractStartTime = formatDate(this.bmContractInfo.contractStartTime, "YYYY-MM-DD") ;
						this.bmContractInfo.contractEndTime = formatDate(this.bmContractInfo.contractEndTime, "YYYY-MM-DD") ;
                    }
                });
            }
            
        	getDicts('BM_CONTRACT_TYPE,CURRENCY_DICT,PROJECT_ACCOUNT_CENTER_DICT,CONTRACT_BALANCE_TYPE').then(result => {
				var data = result.data;
				this.dicts = data;
                if(data){
					this.bmContractDicts = data[0];
					this.currencyDicts = data[1];
                }
			});
			getCompanyDictList().then(result => {
                var data = result.data;
                if(data){
					this.companyDictList = data.map.companyDictList;
					this.projectDictList = data.map.projectDictList;
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
					
					// title: function(value){
					//     if(value.length < 10){
					//     	// return '标题至少得10个字符哟';
					//     }
					// },
					
					
					// content: function(value){
					//     layedit.sync(editIndex);
					// },
					linkTel: function(value,item) {
						
						if (value.length == 0) {
							return "必填项不能为空";
						}
						let phoneReg = /^1\d{10}$/;
						if (!phoneReg.test(value)) {    
							return '手机号码不符合规则';
						}
					},
				});

				form.on('submit(saveBmContractInfo)', function(data){
					_this.save();
					return false;
				});
        	});
		},
		openCompanyModal: function () {
			this.$layer.iframe({
				content: {
					content: ChooseSupplierInfoList, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
						selectedSupplierId: this.selectedSupplierId
					}//props
				},
				area: ['1300px', '700px'],
				title: "企业列表"
			});
		},
		selectSupplierAfter: function (id) {
			if(id){
				getSupplierById(id).then(res => {
					this.bmCompanyInfo = Object.assign({}, res.data.bmCompanyInfo || {});
					this.bmCompanyInfo.setupTime = formatDate(this.bmCompanyInfo.setupTime, 'YYYY-MM-DD');
					this.scMainBusTypeList = this.bmCompanyInfo.scMainBusType ? this.bmCompanyInfo.scMainBusType.split(",") : [];
					var bmCompanyInfo = Object.assign({}, res.data.bmCompanyInfo || {});
					this.bmContractInfo.companyNames = bmCompanyInfo.name;
					this.bmContractInfo.companyId = bmCompanyInfo.id;
				});
			}
		},
    }
}
</script>

<style scoped>

</style>