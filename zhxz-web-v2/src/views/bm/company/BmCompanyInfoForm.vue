<template>
	<div class="tab-background float-e-margins">
		<layui-form>
			<div class="layui-tab layui-tab-brief">
				<ul class="layui-tab-title">
					<li class="layui-this">企业基本信息</li>
					<li>联系人信息</li>
					<li>法人信息</li>
				</ul>
				<div class="layui-tab-content">
					<div class="layui-tab-item layui-show">
							<layui-item>
								<layui-inline-input
										label="企业名称"
										placeholder="请输入企业名称"
										lay-verify="required"
										:readonly="isReadOnly"
										v-model="bmCompanyInfo.name"
										:cssStyle="{width: '890px', display: 'inline-block'}"
										class="d_allwidth"
								></layui-inline-input>
							</layui-item>
							<layui-item>
								<layui-inline-input
										:cssStyle="{'width':'350px'}"
										label="统一社会信息代码"
										lay-verify="required"
										:readonly="isReadOnly"
										placeholder="请输入统一社会信息代码"
										class="d_allwidth"
										v-model="bmCompanyInfo.orgno"></layui-inline-input>
								<layui-inline-select
										:width=350
										label="登记注册类型"
										lay-verify="required"
										:readonly="isReadOnly"
										v-model="bmCompanyInfo.registeRtypeDict"
										class="d_allwidth"
										:items="typeBusinessDicts"></layui-inline-select>
							</layui-item>
							<layui-item>
								<layui-inline-date
										:cssStyle="{'width':'350px'}"
										label="成立时间"
										placeholder="点击选择日期"
										lay-verify="required"
										:readonly="isReadOnly"
										name="setupTime"
										class="d_allwidth"
										v-model="bmCompanyInfo.setupTime"/>
								<layui-inline-input
										:cssStyle="{'width':'350px'}"
										type="number"
										label="注册资本（万元）"
										lay-verify="required"
										:readonly="isReadOnly"
										class="d_allwidth"
										v-model="bmCompanyInfo.registerCapital">
								</layui-inline-input>
							</layui-item>
							<layui-item>
								<layui-inline-select
										:width=350
										label="国别"
										lay-verify="required"
										:readonly="isReadOnly"
										class="d_allwidth"
										v-model="bmCompanyInfo.scCountryDict"
										:items="nationalityTypeDicts"></layui-inline-select>
								<layui-inline-select
										:width=350
										label="币种"
										lay-verify="required"
										:readonly="isReadOnly"
										v-model="bmCompanyInfo.currencyDict"
										:items="currencyDicts"
										class="d_c d_allwidth"></layui-inline-select>
							</layui-item>
							<layui-item>
								<layui-inline-input
										:cssStyle="{'width':'350px'}"
										type="number"
										label="员工人数"
										lay-verify="required"
										:readonly="isReadOnly"
										class="d_allwidth"
										v-model="bmCompanyInfo.staffCount"></layui-inline-input>
								<layui-inline-input
										:cssStyle="{'width':'350px'}"
										label="档案编号"
										:readonly="isReadOnly"
										placeholder="请输入档案编号"
										class="d_allwidth"
										v-model="bmCompanyInfo.fileNo"></layui-inline-input>
							</layui-item>
							<layui-item>
								<table class="layui-table" lay-size="sm" style="width: 800px">
									<tbody>
									<tr>
										<td style="vertical-align: middle;text-align: center;color: #333333;background-color: #FBFBFB;width: 140px;">
											主营业务类型
										</td>
										<layui-inline-checkbox
												laySkin="primary"
												lay-verify="required"
												name="mainBusiness"
												:readonly="isReadOnly"
												:items="mainBusinessTypeDicts"
												v-model="scMainBusTypeList">
										</layui-inline-checkbox>
									</tr>
									</tbody>
								</table>
							</layui-item>
							<layui-item>
								<layui-inline-textarea
										label="主营业务介绍"
										lay-verify="required"
										style="width: 1070px"
										:disabled="isReadOnly"
										v-model="bmCompanyInfo.scMainBusIntroduced"></layui-inline-textarea>
							</layui-item>
							<layui-item>
								<layui-inline-textarea
										label=" 营业范围（参考营业执照）"
										lay-verify="required"
										style="width: 1070px"
										:disabled="isReadOnly"
										v-model="bmCompanyInfo.scope"></layui-inline-textarea>
							</layui-item>
							<layui-item>
								<layui-inline-textarea
										label="注册地址"
										lay-verify="required"
										style="width: 1070px"
										:disabled="isReadOnly"
										v-model="bmCompanyInfo.address"></layui-inline-textarea>
							</layui-item>
							<layui-item>
								<layui-inline-textarea
										label="办公场地及产权归属（租用或自有产权的相关说明）"
										lay-verify="required"
										style="width: 1070px"
										:disabled="isReadOnly"
										v-model="bmCompanyInfo.officeAddress"></layui-inline-textarea>
							</layui-item>
							<layui-item>
								<layui-inline-textarea
										label="经营活动中有无重大违法或不良记录"
										style="width: 1070px"
										:disabled="isReadOnly"
										v-model="bmCompanyInfo.wrongInfo"></layui-inline-textarea>
							</layui-item>
							<!--上传附件-->
							<layui-item>
								<file-upload
										label="附件" id="anchor-7"
										:attachmentBusinessId="bmCompanyInfo.id"
										attachmentBusinessType="bm_company_info"
										module="BmCompanyInfoForm"
										type="2"
										:readonly="isReadOnly"
										:canUpload="isCanUpload"
										ref="fileUploadMain"/>
							</layui-item>
					</div>
					<div class="layui-tab-item">
						<layui-item>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="联系人姓名"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入联系人姓名"
									v-model="bmCompanyInfo.linkName"></layui-inline-input>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="联系人办公电话"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入联系人办公电话"
									v-model="bmCompanyInfo.linkTel"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="联系人手机"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入联系人手机"
									v-model="bmCompanyInfo.linkPhone"></layui-inline-input>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="联系人邮箱"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入联系人邮箱"
									v-model="bmCompanyInfo.linkMail"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-select
									:width=350
									label="联系人证件类型"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									v-model="bmCompanyInfo.linkCardTypeDict"
									:items="cardTypeDicts"></layui-inline-select>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="联系人证件号码"
									lay-verify="required"
									:readonly="isReadOnly"
									placeholder="请输入联系人证件号码"
									v-model="bmCompanyInfo.linkCardNo"
									class="d_b d_allwidth"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="销售主管姓名"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入销售主管姓名"
									v-model="bmCompanyInfo.saleName"></layui-inline-input>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="销售主管办公电话"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入销售主管办公电话"
									v-model="bmCompanyInfo.saleTel"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="销售主管手机"
									lay-verify="required"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入销售主管手机"
									v-model="bmCompanyInfo.salePhone"></layui-inline-input>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="销售主管邮箱"
									lay-verify="required"
									class="d_allwidth"
									:readonly="isReadOnly"
									placeholder="请输入销售主管邮箱"
									v-model="bmCompanyInfo.saleMail"></layui-inline-input>
						</layui-item>
					</div>
					<div class="layui-tab-item">
						<layui-item>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="法人姓名"
									lay-verify="required"
									class="d_allwidth"
									:readonly="isReadOnly"
									placeholder="请输入法人姓名"
									v-model="bmCompanyInfo.corporatename"></layui-inline-input>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="现任职位"
									class="d_allwidth"
									:readonly="isReadOnly"
									placeholder="请输入现任职位"
									v-model="bmCompanyInfo.scCorporateJob"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-select
									:width=350
									label="证件类型"
									class="d_allwidth"
									:readonly="isReadOnly"
									v-model="bmCompanyInfo.scCardTypeDict"
									:items="cardTypeDicts"></layui-inline-select>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="证件号码"
									:readonly="isReadOnly"
									placeholder="请输入证件号码"
									v-model="bmCompanyInfo.scCorporateCard"
									class="d_b d_allwidth"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="联系电话"
									:readonly="isReadOnly"
									class="d_allwidth"
									placeholder="请输入联系电话"
									v-model="bmCompanyInfo.scCorporateTel"></layui-inline-input>
							<layui-inline-input
									:cssStyle="{'width':'350px'}"
									label="邮箱"
									class="d_allwidth"
									:readonly="isReadOnly"
									placeholder="请输入邮箱"
									v-model="bmCompanyInfo.scCorporateMail"></layui-inline-input>
						</layui-item>
						<layui-item>
							<layui-inline-textarea
									label="办公地址"
									style="width: 1070px"
									:disabled="isReadOnly"
									v-model="bmCompanyInfo.scCorporateAddress"></layui-inline-textarea>
						</layui-item>
					</div>
				</div>
			</div>

			<div class="layui-form-item layui-layout-admin">
				<div class="layui-input-block">
					<div class="layui-footer" style="left: 0;text-align:center">
						<template v-if="!isReadOnly">
							<button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveBmCompanyInfo"><i class="fa fa-save"></i> 保存</button>
						</template>
						<button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
					</div>
				</div>
			</div>
		</layui-form>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/bm/bmCompanyInfo'
import {formatDate} from "../../../utils/formatUtils";
import Base from "@/views/base/Base"

export default {
	name: 'BmCompanyInfoForm',
	extends: Base,
    data () {
        return {
			typeBusinessDicts:[],
			cardTypeDicts:[],
			currencyDicts:[],
			nationalityTypeDicts:[],
			mainBusinessTypeDicts: [],
			scMainBusTypeList: [],
			companyBusinessTypeDicts: [],
			isReadOnly: this.$route.params.isReadOnly ? this.$route.params.isReadOnly : false,
			isCanUpload: true,
			bmCompanyInfo: {
				id: this.$route.params.id,
				name: '',
				orgno: '',
				scParentOrg: '',
				registeRtype: '',
				registeRtypeDict: '',
				companyBusinessType: '',
				companyBusinessTypeDict: this.$route.params.companyBusinessTypeDict,
				scCountry: '',
				scCountryDict: '',
				setupTime: '',
				scBusinessDeadlineStart: '',
				scBusinessDeadlineEnd: '',
				companyNo: '',
				companyLogo: '',
				scope: '',
				scMainBusTypeContent: '',
				scMainBusType: '',
				scMainBusIntroduced: '',
				address: '',
				officeAddress: '',
				registerCapital: '',
				currency: '',
				currencyDict: '',
				scIsOriginal: '',
				linkName: '',
				linkTel: '',
				linkPhone: '',
				linkMail: '',
				linkCardType: '',
				linkCardTypeDict: '',
				linkCardNo: '',
				linkUserUid: '',
				linkUserId: '',
				linkAccountStartDate: '',
				linkAccountEndDate: '',
				linkAccountRemark: '',
				linkAccountUpdateTime: '',
				linkAccountUpdateBy: '',
				saleName: '',
				saleTel: '',
				salePhone: '',
				saleMail: '',
				staffCount: '',
				fileNo: '',
				wrongInfo: '',
				corporatename: '',
				scCardType: '',
				scCardTypeDict: '',
				scCorporateCard: '',
				scCorporateJob: '',
				scCorporateAddress: '',
				scCorporateTel: '',
				scCorporateMail: '',
				companyServiceState: '',
				companyServiceStateDict: '',
				blacklistFlag: '',
				foreignFlag: '',
				mainCompanyFlag: '',
				remark: '',
				createDate: '',
				createBy: '',
				updateBy: '',
				updateDate: '',
				operationStatus: '',
				approveStatus: '',
			},
        }
    },
    computed: {
		typeBusinessDictsMap: function () {
			if (this.typeBusinessDicts) {
				return this.typeBusinessDicts.array2Obj('value', 'label');
			}
		},
		mainBusinessTypeDictsMap: function () {
			if (this.mainBusinessTypeDicts) {
				return this.mainBusinessTypeDicts.array2Obj('value', 'label');
			}
		},
		currencyDictsMap: function () {
			if (this.currencyDicts) {
				return this.currencyDicts.array2Obj('value', 'label');
			}
		},
		cardTypeDictsMap: function () {
			if (this.cardTypeDicts) {
				return this.cardTypeDicts.array2Obj('value', 'label');
			}
		},
		nationalityTypeDictsMap: function () {
			if (this.nationalityTypeDicts) {
				return this.nationalityTypeDicts.array2Obj('value', 'label');
			}
		},
		companyBusinessTypeDictsMap: function () {
			if (this.companyBusinessTypeDicts) {
				return this.companyBusinessTypeDicts.array2Obj('value', 'label');
			}
		}
       	
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
        initData: function(){
            if(this.bmCompanyInfo.id){
				get(this.bmCompanyInfo.id).then(res => {
					this.bmCompanyInfo = Object.assign({}, res.data.bmCompanyInfo || {});
					this.bmCompanyInfo.setupTime = formatDate(this.bmCompanyInfo.setupTime, 'YYYY-MM-DD');
					this.scMainBusTypeList = this.bmCompanyInfo.scMainBusType ? this.bmCompanyInfo.scMainBusType.split(",") : [];
				});
            }
            
        	getDicts('USER_ID_CARD_TYPE,TYPE_OF_BUSINESS,CURRENCY_DICT,NATIONALITY_TYPE,MAIN_BUSINESS_TYPE,COMPANY_BUSINESS_TYPE_DICT').then(result => {
                var data = result.data;
                if(data){
                	this.cardTypeDicts = result.data[0] || [];
					this.typeBusinessDicts = result.data[1] || [];
					this.currencyDicts = result.data[2] || [];
					this.nationalityTypeDicts = result.data[3] || [];
					this.mainBusinessTypeDicts = result.data[4] || [];
					this.companyBusinessTypeDicts = result.data[5] || [];

                }
            });
        },
		save: function(){

			//主营业务类型
			this.bmCompanyInfo.scMainBusType = this.arrToString(this.scMainBusTypeList);
			//存字典值的同时，把中文的也存上
			//国别
			this.bmCompanyInfo.scCountry=this.nationalityTypeDictsMap[this.bmCompanyInfo.scCountryDict];
			//登记注册类型
			this.bmCompanyInfo.registeRtype=this.typeBusinessDictsMap[this.bmCompanyInfo.registeRtypeDict];
			//证件类型
			//联系人
			this.bmCompanyInfo.linkCardType=this.cardTypeDictsMap[this.bmCompanyInfo.linkCardTypeDict];
			//法人
			this.bmCompanyInfo.scCardType=this.cardTypeDictsMap[this.bmCompanyInfo.scCardTypeDict];
			//币种
			this.bmCompanyInfo.currency=this.currencyDictsMap[this.bmCompanyInfo.currencyDict];


			var mainBusTypeContent = '';
			if(this.scMainBusTypeList.length>0){
				this.scMainBusTypeList.forEach(value => {
					mainBusTypeContent += this.mainBusinessTypeDictsMap[value] +' ';
				});
			}
			this.bmCompanyInfo.scMainBusTypeContent=mainBusTypeContent;


			if(this.bmCompanyInfo.companyBusinessTypeDict !== ""){
				this.bmCompanyInfo.companyBusinessType = this.companyBusinessTypeDictsMap[this.bmCompanyInfo.companyBusinessTypeDict];
			}

			let _this = this;
			this.submitHandler((token) => {
				saveOrUpdate(JSON.stringify(this.bmCompanyInfo), token).then(result => {
					alert(result.msg);

					//供应商
					if('supplier' === this.bmCompanyInfo.companyBusinessTypeDict){
						this.backListView(this.bmCompanyInfo.id == null,'BmSupplierInfoList');
					}
					//客户
					if('customer' === this.bmCompanyInfo.companyBusinessTypeDict){
						this.backListView(this.bmCompanyInfo.id == null,'BmCustomerInfoList');
					}


				}).catch((error) => {
					console.log('catch:', error);
					_this.resetToken(error);
				});
			});
		},
		arrToString: function (data) {
			return data.length <= 0 ? "" : data.join(",");
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

				form.on('submit(saveBmCompanyInfo)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>

.d_c /deep/ .layui-form-label {
	margin-left: -8px !important;
}

.d_b /deep/ .layui-form-label {
	margin-left: -9px !important;
}

.d_b /deep/ .layui-input {
	margin-left: -9px !important;
}

.d_allwidth /deep/ .layui-form-label {
	width: 180px;
}
.d_allwidth /deep/ .layui-input-block {
	margin-left: 180px;
}


</style>