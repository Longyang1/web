<template>
    <div class="view-product" v-cloak id="xmlxsq">
        <div class="tab-header">
			<p>项目立项申请</p>
		</div>
		<div class="ibox-content" style="width:83%" id="asdasd">



    <layui-form>
        <div class="row wrapper wrapper-content">
            <div class="col-sm-12">
            <div class="profile">
            <div class="profile_right" style="top:100px;">
            <div class="profile_right_cnt">
            <div class="profile_right_cnt_first"></div>
            <!-- <p :class="521>scrVal&&scrVal>=0?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-1')">一、项目基本信息</a></p>
            <p :class="881>scrVal&&scrVal>=521?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-2')">二、项目预算</a></p>
            <p :class="1130>scrVal&&scrVal>=881?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-3')">三、项目业务可行性</a></p>
            <p :class="1491>scrVal&&scrVal>=1130?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-4')">四、项目业务先进性</a></p>
            <p :class="1772>scrVal&&scrVal>=1491?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-5')">五、项目业务需求范围</a></p>
            <p :class="2517>scrVal&&scrVal>=1772?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-6')">六、项目投入工作量及设备采购清单</a></p>
            <p :class="2962>scrVal&&scrVal>=2517?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-7')">七、项目后评价指标</a></p>
            <p :class="scrVal>=2962?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-8')">八、落实金融科技发展规划目标</a></p>
            <p :class="false?'floatnav_a_cur':''"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-9')">九、附件</a></p> -->
            <p :class="521>scrVal&&scrVal>=0?'floatnav_a_cur':''" id="anchor-1p"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#anchor-1')">一、项目基本信息</a></p>
            <p v-for="(item,index) in titleLabel" :key="index" v-if="item!=''" :id="titleId[index]+'p'"><a class="a-anchors" rel="external nofollow" @click="goAnchor('#'+titleId[index])">{{item}}</a></p>
            <div class="profile_right_cnt_last"></div>
            </div>
            <div class="layui-input-inline">
                <button class="layui-btn layui-btn-lg layui-btn-red" @click="close"><img class="custom-img" src="/static/images/btn/close.png"/>关闭</button>
            </div>
            </div>
            </div>
            </div>
        </div>
			<layui-fieldset :label="'一、项目基本信息'" id="anchor-1">
				<template slot="main">
					<layui-item>
						<layui-inline-input name="projectInfo.projectName"
							label="项目名称"
                            v-model="projectPlanInfo.projectName"
                            :readonly="true"
							:cssStyle="{width: '690px', display: 'inline-block'}">
						</layui-inline-input>
					</layui-item>
					<layui-item>
						<layui-inline-input :readonly="true" :cssStyle="{'width':'100%'}"
                            v-model="projectPlanInfo.projectYear"
							label="项目年度"></layui-inline-input>
                        <layui-inline-input :readonly="true" :cssStyle="{'width':'230px'}"
							label="项目编号"
							placeholder="待生成"></layui-inline-input>
						<layui-inline-input :readonly="true" :cssStyle="{'margin-right':'0px'}"
                            v-model="projectPlanInfo.budgetFundAdjust"
							label="概算（万元）" ></layui-inline-input>
					</layui-item>
					<layui-item>
                        <layui-inline-input :readonly="true" :cssStyle="{'margin-right': '0px'}"
                            v-model="projectTypeMap[projectPlanInfo.projectTypeDict]"
							label="项目类型" ></layui-inline-input>
						<layui-inline-input :readonly="true" :cssStyle="{'width':'230px'}"
                                v-model="projectInvestmentMap[projectPlanInfo.projectInvestmentDict]"
								label="项目投向">
						</layui-inline-input>
                        <layui-inline-input :readonly="true" :cssStyle="{'margin-right': '0px'}"
                                v-model="projectActualizeMap[projectPlanInfo.projectActualizeDict]"
								label="项目实施方式">
                        </layui-inline-input>
					</layui-item>
                    <layui-item>
						<layui-inline-input :readonly="true" :cssStyle="{'margin-right': '0px'}"
								label="需求来源"
                                v-model="projectRequirementSrcMap[projectPlanInfo.projectRequirementSrcDict]">
						</layui-inline-input>
						<layui-inline-input :readonly="true" :cssStyle="{'width':'230px'}"
                                v-model="majorProjectMap[projectPlanInfo.majorProjectDict]"
								label="所属重点工程">
							</layui-inline-input>
                        <layui-inline-input :readonly="true" :cssStyle="{'margin-right': '0px'}"
                                v-model="projectPriorityMap[projectPlanInfo.projectPriorityDict]"
								label="项目优先级">
							</layui-inline-input>
					</layui-item>
					<layui-item>
                        <layui-inline-select v-if="!isHaveSubType" layVerify=required
                                             :width="148.4"
                                            v-model="projectInfo.projectSubtypeDict"
								                label="业务类别"
                                :items="projectSubtypeDicts">
							</layui-inline-select>
                        <layui-inline-input v-if="isHaveSubType" layVerify=required
                                :readonly="true"
                                :cssStyle="{}"
                                v-model="projectSubtypeDictMap[projectInfo.projectSubtypeDict]"
								label="业务类别">
							</layui-inline-input>

						<layui-inline-input layVerify=required :cssStyle="{'width':'230px'}"
							label="项目工期"
                            v-model="projectInfo.projectDuration"
							placeholder="请输入（月）"></layui-inline-input>
						<layui-inline-date :cssStyle="{'width':'149.4px'}" 
                            layVerify=required
							label="投产实施时间"
							placeholder="点击选择日期"
                            name="pcd"
							v-model="projectInfo.projectCommissioningDate"/>

					</layui-item>
					<layui-item>
						<layui-inline-radio v-model="projectInfo.evaluateFlag" :cssStyle="{}"
							layVerify=required
							label="是否后评价"
							:items="voteFlags"></layui-inline-radio>
						<layui-inline-input  :cssStyle="{'width':'230px'}"
                            layVerify=required
                            v-model="projectInfo.crInfo"
							label="关联CR"
							placeholder="请输入"></layui-inline-input>
						<layui-inline-input :cssStyle="{}" layVerify=required
                            v-model="projectInfo.projectEstablishBasis"
							label="立项依据"
							placeholder="请输入"></layui-inline-input>
					</layui-item>

				</template>
			</layui-fieldset>

            <div v-if="projectInfo.projectSubtypeDict">
                <layui-fieldset :label="titleLabel[0]" :id="titleId[0]" v-if="titleFlag[0]">
                    <template slot="main">
                        <layui-item>
                            <layui-inline-input name="projectInfo.projectBudgetFund"
                                :cssStyle="{'margin-right': '0'}"
                                label="立项申请预算"
                                v-model="projectInfo.projectBudgetFund"
                                placeholder=""/><span>万元</span>
                            &nbsp;&nbsp;&nbsp;
                            <layui-inline-input name="projectInfo.selfProjectBudgetFund"
                            :cssStyle="{'margin-right': '0'}"
                                label="使用本项目预算"
                                v-model="projectInfo.selfProjectBudgetFund"
                                placeholder=""/>
                            <span>万元</span>&nbsp;&nbsp;&nbsp;
                            <layui-inline-input name="projectInfo.otherProjectBudgetFund"
                            :cssStyle="{'margin-right': '0'}"
                                label="使用其他项目预算"
                                v-model="projectInfo.otherProjectBudgetFund"
                                placeholder=""></layui-inline-input>
                                <template>万元</template>
                        </layui-item>
                        <table class="layui-table" lay-size="sm">
                            <thead>
                                <tr>
                                <th width="15%" rowspan="3" style="text-align: center;border-bottom-color:rgb(242, 242, 242)"></th>
                                <th style="text-align: center" v-for="item in oneoneCheckBoxs" :key="item.id">{{item.dataName}}(万元)</th>
                                </tr>
                                </thead>
                                <tbody class="footable_table">
                                    <tr style="display: table-row;">
                                    <td rowspan="3" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none">预算明细</td>
                                    <td style="padding:5px 5px;text-align:center" v-for="item in oneoneCheckBoxs" :key="item.id">
                                        <input v-if="item.dataCode=='budget_hardware'" type="text" style="border:2px solid #e6e6e6;" v-model="projectInfo.budgetHardware"/>
                                        <input v-if="item.dataCode=='budget_soft_develop'" type="text" style="border:2px solid #e6e6e6;" v-model="projectInfo.budgetSoftDevelop"/>
                                        <input v-if="item.dataCode=='budget_soft_purchase'" type="text" style="border:2px solid #e6e6e6;" v-model="projectInfo.budgetSoftPurchase"/>
                                        <input v-if="item.dataCode=='budget_consult'" type="text" style="border:2px solid #e6e6e6;" v-model="projectInfo.budgetConsult"/>
                                        <input v-if="item.dataCode=='budget_other'" type="text" style="border:2px solid #e6e6e6;" v-model="projectInfo.budgetOther"/>
                                        万元
                                    </td>
                                    </tr>
                                    <tr style="display: table-row;">
                                        <td colspan="5" style="text-align:right">总计:{{gai_suan_zong_shu}}万元</td>
                                    </tr>
                                    <tr style="display: table-row;">
                                        <td colspan="5" style="text-align:right">
                                            <layui-inline-input name="projectInfo.totalSystemFunds"
                                                label="自建设以来总投入"
                                                v-model="projectInfo.totalSystemFunds"
                                                placeholder=""></layui-inline-input>
                                                <template>万元</template>

                                        </td>
                                    </tr>
                                </tbody>
                        </table>
                    <div class="layui-form-item">
                        <div class="layui-inline dept-div">
                            <table>
                                <tr>
                                <td rowspan="2" class="dept-label" width="15%">
                                    成本分摊<i class="fa fa-plus-circle text-warning" @click="officeClick()"></i>
                                </td>
                                <td>
                                    <div class="col-sm-12 dept-list">
                                    <div class="file-box" v-for="(item,index) in officeInfos" :key="item.orgId">
                                        <div class="file">
                                        <div class="file-name">{{item.orgName}}
                                            <span @click="delOffInfo(index)">[<i class="fa fa-close"></i>]</span>
                                        </div>
                                        <div class="icon_scope">
                                            <input type="text" lay-verify="title" autocomplete="off" class="layui-input" v-model="item.percentNumber" style="display:inline;width:70%">%
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <td class="dept-total">合计：<span>{{chengBenTotalPercent}}</span>%</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    </template>
                </layui-fieldset>
                <layui-fieldset :label="titleLabel[1]" :id="titleId[1]" v-if="titleFlag[1]">
                    <template slot="main">
                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td :rowspan="oneTableTitleRowspan+2" width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">项目业务可行性</td>
                                    <td v-if="!oneCheckBoxs.length||oneCheckBoxs.length==0"></td>
                                    <td v-for="count in 4" :key="count" v-if="oneCheckBoxs.length>=1&&count<=oneCheckBoxs.length"><label><input type="checkbox" style="display:inline" :value="oneCheckBoxs[count-1].value" v-model="projectInfo.businessFeasibilityOptions"/>{{oneCheckBoxs[count-1].label}}</label></td>
                                </tr>
                                <tr v-for="(item,index) in oneTableTitleRowspan" :key="item" v-if="oneCheckBoxs.length>=1&&index>0">
                                    <td v-for="count in 4" :key="count" v-if="(item-1)*4+(count-1)<oneCheckBoxs.length"><label><input type="checkbox" style="display:inline" v-model="projectInfo.businessFeasibilityOptions" :value="oneCheckBoxs[(item-1)*4+(count-1)].value"/>{{oneCheckBoxs[(item-1)*4+(count-1)].label}}</label></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td width="15%" valign="middle" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">需要说明的事项</td>
                                    <td><textarea placeholder="" style="margin: 0px;width: 100%;height: 86px;resize:none" cols="130" v-model="projectInfo.businessFeasibilityStatement"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </layui-fieldset>
                <layui-fieldset :label="titleLabel[2]"  :id="titleId[2]" v-if="titleFlag[2]">
                    <template slot="main">
                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td :rowspan="twoTableTitleRowspan+2" width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">项目业务先进性</td>
                                    <td v-if="!twoCheckBoxs.length||twoCheckBoxs.length==0"></td>
                                    <td v-for="count in 4" :key="count" v-if="twoCheckBoxs.length>=1&&count<=twoCheckBoxs.length"><label><input type="checkbox" style="display:inline" :value="twoCheckBoxs[count-1].value" v-model="projectInfo.advancedOptions"/>{{twoCheckBoxs[count-1].label}}</label></td>
                                </tr>
                                <tr v-for="(item,index) in twoTableTitleRowspan" :key="item" v-if="twoCheckBoxs.length>=1&&index>0">
                                    <td v-for="count in 4" :key="count" v-if="(item-1)*4+(count-1)<twoCheckBoxs.length"><label><input type="checkbox" style="display:inline" v-model="projectInfo.advancedOptions" :value="twoCheckBoxs[(item-1)*4+(count-1)].value"/>{{twoCheckBoxs[(item-1)*4+(count-1)].label}}</label></td>
                                </tr>
                            </tbody>
                        </table>

                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">同业是否开展同类业务</td>
                                    <td style="text-align: left">
                                        <layui-inline-radio label=""
                                                            :cssStyle="{}"
                                            name="projectInfo.similarBusinessFunction"
                                            v-model="projectInfo.similarBusinessFunction"
                                            :items="voteFlags"></layui-inline-radio>
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td width="15%" valign="middle"  style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">同业开展情况</td>
                                    <td><textarea placeholder="" style="margin: 0px;width: 100%;height: 86px;resize:none" cols="130" v-model="projectInfo.similarBusinessStatement"/></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td :rowspan="threeTableTitleRowspan+2" width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">先进性主要体现在</td>
                                    <td v-if="!threeCheckBoxs.length||threeCheckBoxs.length==0"></td>
                                    <td v-for="count in 4" :key="count" v-if="threeCheckBoxs.length>=1&&count<=threeCheckBoxs.length"><label><input type="checkbox" style="display:inline" :value="threeCheckBoxs[count-1].value" v-model="projectInfo.advancedExpressedOptions"/>{{threeCheckBoxs[count-1].label}}</label></td>
                                </tr>
                                <tr v-for="(item,index) in threeTableTitleRowspan" :key="item" v-if="threeCheckBoxs.length>=1&&index>0">
                                    <td v-for="count in 4" :key="count" v-if="(item-1)*4+(count-1)<threeCheckBoxs.length"><label><input type="checkbox" style="display:inline" v-model="projectInfo.advancedExpressedOptions" :value="threeCheckBoxs[(item-1)*4+(count-1)].value"/>{{threeCheckBoxs[(item-1)*4+(count-1)].label}}</label></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td width="15%" valign="middle"  style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">需要说明的事项</td>
                                    <td><textarea placeholder="" style="margin: 0px;width: 100%;height: 86px;resize:none" cols="130" v-model="projectInfo.advancedExpressedStatement"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </layui-fieldset>
                <layui-fieldset :label="titleLabel[3]"  :id="titleId[3]" v-if="titleFlag[3]">
                    <template slot="main">
                        <table class="layui-table" lay-size="sm" >
                        <tbody>
                            <tr>
                                <td :rowspan="fourTableTitleRowspan+2" width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">业务渠道</td>
                                <td v-if="!fourCheckBoxs.length||fourCheckBoxs.length==0"></td>
                                <td v-for="count in 4" :key="count" v-if="fourCheckBoxs.length>=1&&count<=fourCheckBoxs.length"><label><input type="checkbox" style="display:inline" :value="fourCheckBoxs[count-1].value" v-model="projectInfo.requirementsChannelOptions"/>{{fourCheckBoxs[count-1].label}}</label></td>
                            </tr>
                            <tr v-for="(item,index) in fourTableTitleRowspan" :key="item" v-if="fourCheckBoxs.length>=1&&index>0">
                                <td v-for="count in 4" :key="count" v-if="(item-1)*4+(count-1)<fourCheckBoxs.length"><label><input type="checkbox" style="display:inline" v-model="projectInfo.requirementsChannelOptions" :value="fourCheckBoxs[(item-1)*4+(count-1)].value"/>{{fourCheckBoxs[(item-1)*4+(count-1)].label}}</label></td>
                            </tr>
                        </tbody>
                        </table>

                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">报表需求</td>
                                    <td style="text-align: left">
                                        <layui-inline-radio label=""
                                                            :cssStyle="{}"
                                            v-model="projectInfo.requirementsReport"
                                            :items="voteFlags"></layui-inline-radio>
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <table class="layui-table" lay-size="sm" >
                        <tbody>
                            <tr>
                                <td :rowspan="fiveTableTitleRowspan+2" width="15%" style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">预期用户</td>
                                <td v-if="!fiveCheckBoxs.length||fiveCheckBoxs.length==0"></td>
                                <td v-for="count in 4" :key="count" v-if="fiveCheckBoxs.length>=1&&count<=fiveCheckBoxs.length"><label><input type="checkbox" style="display:inline" :value="fiveCheckBoxs[count-1].value" v-model="projectInfo.requirementsExpectUserOptions"/>{{fiveCheckBoxs[count-1].label}}</label></td>
                            </tr>
                            <tr v-for="(item,index) in fiveTableTitleRowspan" :key="item" v-if="fiveCheckBoxs.length>=1&&index>0">
                                <td v-for="count in 4" :key="count" v-if="(item-1)*4+(count-1)<fiveCheckBoxs.length"><label><input type="checkbox" style="display:inline" v-model="projectInfo.requirementsExpectUserOptions" :value="fiveCheckBoxs[(item-1)*4+(count-1)].value"/>{{fiveCheckBoxs[(item-1)*4+(count-1)].label}}</label></td>
                            </tr>
                        </tbody>
                        </table>

                        <table class="layui-table" lay-size="sm" >
                            <tbody>
                                <tr>
                                    <td width="15%" valign="middle"  style="text-align: center;background-color:rgb(242, 242, 242);border-top:none;">主要业务功能</td>
                                    <td><textarea placeholder="" style="margin: 0px;width: 100%;height: 86px;resize:none" cols="130" v-model="projectInfo.requirementsBusinessFunction"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </layui-fieldset>
                <layui-fieldset :label="titleLabel[4]"  :id="titleId[4]" v-if="titleFlag[4]">
                    <template slot="main">
                        <p>使用本项目预算部分<i @click="addRow('benyusuan')" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></p>
                        <table class="layui-table" lay-size="sm" >
                                    <thead>
                                        <tr>
                                            <th style="text-align:center" v-for="item in ggl_sybxmysbf_checkBox" :key="item.id">{{item.dataName}}</th>
                                            <th style="text-align:center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in ggl_sybxmysbf_subItems"
                                            :key="'ss_' + index"
                                            v-dragging="{ item: item, list: ggl_sybxmysbf_subItems, group: 'ggl_sybxmysbf_subItems' }">
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('system_name_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.systemName"></layui-inline-input>
                                            </td>
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('workload_budget_source_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadBudgetSource"></layui-inline-input>
                                            </td>
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('workload_internal_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadInternal"></layui-inline-input>
                                            </td>
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('workload_external_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadExternal"></layui-inline-input>
                                            </td>
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('person_month_price_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.personMonthPrice"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="ggl_sybxmysbfNodeCode.indexOf('break_rule_reason_dict_b')!=-1">
                                                <layui-inline-select
                                                    :width="100"
                                                    v-model="item.breakRuleReasonDict"
                                                    :items="ggl_sybxmysbf_waibaoxuanxiang"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('break_rule_reason_remark_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.breakRuleReasonRemark"></layui-inline-input>
                                            </td>
                                            <td v-if="ggl_sybxmysbfNodeCode.indexOf('workload_budget_fund_b')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadBudgetFund"></layui-inline-input>
                                            </td>
                                            <td>
                                                <a @click="delRow(index, 'benyusuan')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                        <p>使用其他项目预算部分<i @click="addRow('qitayusuan')" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></p>
                        <table class="layui-table" lay-size="sm" >
                                    <thead>
                                        <tr>
                                            <th style="text-align:center" v-for="item in gzl_syqtxmysbf_checkbox" :key="item.id">{{item.dataName}}</th>
                                            <th style="text-align:center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in gzl_syqtxmysbf_subItems"
                                            :key="'ss_' + index"
                                            v-dragging="{ item: item, list: gzl_syqtxmysbf_subItems, group: 'gzl_syqtxmysbf_subItems' }">
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('system_name_o')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.systemName"></layui-inline-input>
                                            </td>
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('workload_budget_source_o')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadBudgetSource"></layui-inline-input>
                                            </td>
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('workload_internal_o')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadInternal"></layui-inline-input>
                                            </td>
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('workload_external_o')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadExternal"></layui-inline-input>
                                            </td>
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('person_month_price_o')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.personMonthPrice"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="gzl_syqtxmysbfNodeCode.indexOf('break_rule_reason_dict_o')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.breakRuleReasonDict"
                                                    :items="ggl_sybxmysbf_waibaoxuanxiang"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('break_rule_reason_remark_o')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.breakRuleReasonRemark"></layui-inline-input>
                                            </td>
                                            <td v-if="gzl_syqtxmysbfNodeCode.indexOf('workload_budget_fund_o')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.workloadBudgetFund"></layui-inline-input>
                                            </td>
                                            <td>
                                                <a @click="delRow(index, 'qitayusuan')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                        <p>设备采购清单(新增设备)<i @click="addRow('cgqd_xz')" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></p>
                        <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                    <thead>
                                        <tr>
                                            <th style="text-align:center" v-for="item in sbcgqd_xzsb_checkbox" :key="item.id">{{item.dataName}}</th>
                                            <th style="text-align:center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in sbcgqd_xzsb_subItems"
                                            :key="'ss_' + index"
                                            v-dragging="{ item: item, list: sbcgqd_xzsb_subItems, group: 'sbcgqd_xzsb_subItems' }">
                                            <td style="overflow: visible;" v-if="sbcgqd_xzsb_NodeCode.indexOf('device_name_a')!=-1">
                                                <layui-inline-select  :width="100"
                                                    v-model="item.deviceName"
                                                    :items="sbcgqd_xzsb.device_names"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td v-if="sbcgqd_xzsb_NodeCode.indexOf('device_count_a')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.deviceCount"></layui-inline-input>
                                            </td>
                                            <td v-if="sbcgqd_xzsb_NodeCode.indexOf('device_price_a')!=-1">
                                                <layui-inline-input :cssStyle="{width: '100px'}"
                                                    v-model="item.devicePrice"></layui-inline-input>
                                            </td>
                                            <td v-if="sbcgqd_xzsb_NodeCode.indexOf('device_fund_a')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.deviceFund"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_xzsb_NodeCode.indexOf('device_environment_a')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceEnvironmentDict"
                                                    :items="sbcgqd_xzsb.device_environments"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_xzsb_NodeCode.indexOf('device_environment_dict_a')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceSystemDict"
                                                    :items="sbcgqd_xzsb.device_systems"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_xzsb_NodeCode.indexOf('device_purpose_a')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.devicePurposeDict"
                                                    :items="sbcgqd_xzsb.device_purposes"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_xzsb_NodeCode.indexOf('purchase_type_a')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.purchaseTypeDict"
                                                    :items="sbcgqd_xzsb.purchase_type"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td>
                                                <a @click="delRow(index, 'cgqd_xz')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                        <p>设备采购清单(扩容设备)<i @click="addRow('cgqd_kr')" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></p>
                        <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                    <thead>
                                        <tr>
                                            <th style="text-align:center" v-for="item in sbcgqd_krsb_checkbox" :key="item.id">{{item.dataName}}</th>
                                            <th style="text-align:center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in sbcgqd_krsb_subItems"
                                            :key="'ss_' + index"
                                            v-dragging="{ item: item, list: sbcgqd_krsb_subItems, group: 'sbcgqd_krsb_subItems' }">
                                            <td style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('device_name_e')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceName"
                                                    :items="sbcgqd_krsb.device_names"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td v-if="sbcgqd_krsb_NodeCode.indexOf('device_count_e')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.deviceCount"></layui-inline-input>
                                            </td>
                                            <td v-if="sbcgqd_krsb_NodeCode.indexOf('device_price_e')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.devicePrice"></layui-inline-input>
                                            </td>
                                            <td v-if="sbcgqd_krsb_NodeCode.indexOf('device_fund_e')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.deviceFund"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('device_environment_e')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceEnvironmentDict"
                                                    :items="sbcgqd_krsb.device_environments"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('device_system_a')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceSystemDict"
                                                    :items="sbcgqd_krsb.device_systems"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td  style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('old_device_init_price_e')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.oldDeviceInitPrice"></layui-inline-input>
                                            </td>
                                            <td  style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('enlarge_device_use_year_e')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.enlargeDeviceUseYear"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('device_purpose_e')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.devicePurposeDict"
                                                    :items="sbcgqd_krsb.device_purposes"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_krsb_NodeCode.indexOf('purchase_type_e')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.purchaseTypeDict"
                                                    :items="sbcgqd_krsb.purchase_type"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td>
                                                <a @click="delRow(index, 'cgqd_kr')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                        <p>设备采购清单(更换设备)<i @click="addRow('cgqd_gh')" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></p>
                        <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                    <thead>
                                        <tr>
                                            <th style="text-align:center" v-for="item in sbcgqd_ghsb_checkbox" :key="item.id">{{item.dataName}}</th>
                                            <th style="text-align:center">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in sbcgqd_ghsb_subItems"
                                            :key="'ss_' + index"
                                            v-dragging="{ item: item, list: sbcgqd_ghsb_subItems, group: 'sbcgqd_ghsb_subItems' }">
                                            <td style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('device_name_c')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceName"
                                                    :items="sbcgqd_ghsb.device_names"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td v-if="sbcgqd_ghsb_NodeCode.indexOf('device_count_c')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.deviceCount"></layui-inline-input>
                                            </td>
                                            <td v-if="sbcgqd_ghsb_NodeCode.indexOf('device_price_c')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.devicePrice"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('device_environment_c')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceEnvironmentDict"
                                                    :items="sbcgqd_ghsb.device_environments"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('device_system_c')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.deviceSystemDict"
                                                    :items="sbcgqd_ghsb.device_systems"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td  style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('new_device_use_year_c')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.newDeviceUseYear"></layui-inline-input>
                                            </td>
                                            <td  style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('old_device_use_year_c')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.oldDeviceUseYear"></layui-inline-input>
                                            </td>
                                            <td  style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('old_device_price_c')!=-1">
                                                <layui-inline-input  :cssStyle="{width: '100px'}"
                                                    v-model="item.oldDevicePrice"></layui-inline-input>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('old_device_deal_type_c')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.oldDeviceDealTypeDict"
                                                    :items="sbcgqd_ghsb.old_device_deal_types"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('device_purpose_c')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.devicePurposeDict"
                                                    :items="sbcgqd_ghsb.device_purposes"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td style="overflow: visible;" v-if="sbcgqd_ghsb_NodeCode.indexOf('purchase_type_c')!=-1">
                                                <layui-inline-select :width="100"
                                                    v-model="item.purchaseTypeDict"
                                                    :items="sbcgqd_ghsb.purchase_type"
                                                    label=""></layui-inline-select>
                                            </td>
                                            <td>
                                                <a @click="delRow(index, 'cgqd_gh')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                    </template>
                </layui-fieldset>
                <layui-fieldset :label="titleLabel[5]"  :id="titleId[5]" v-if="titleFlag[5]">
                    <template slot="main">
                        <table class="layui-table" lay-size="sm" >
                            <thead>
                                <tr>
                                    <th style="text-align:center">类别</th>
                                    <th style="text-align:center">指标名称</th>
                                    <th style="text-align:center">指标目标</th>
                                    <th style="text-align:center">指标数据来源</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in xm_hpj.trData" :key="item.i">
                                    <td :rowspan="item.rowLength" v-if="item.flag" valign="middle">{{item.name1}}</td>
                                    <td v-if="item.flag">{{item.name2}}</td>
                                    <td v-if="!item.flag">{{item.name}}</td>
                                    <td><textarea autoHeight="true" v-model="xm_hpj.submitDatas[index].establishIndicatorTarget" style="width: 100%;resize:none"/></td>
                                    <td><textarea v-model="xm_hpj.submitDatas[index].establishIndicatorResource" style="width: 100%;resize:none"/></td>
                                </tr>
                                <tr v-if="xm_hpj.have_gxh">
                                    <td rowspan="99">个性化&nbsp;&nbsp;<i @click="addRow('hpx_gxh')" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>&nbsp;<i @click="delRow(xm_hpj.gxh_submitDatas.length>1?xm_hpj.gxh_submitDatas.length-1:100,'hpx_gxh')" class="fa fa-minus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></td>
                                    <td><textarea autoHeight="true" v-model="xm_hpj.gxh_submitDatas[0].establishCustomIndicatorName" style="width: 100%;resize:none"/></td>
                                    <td><textarea autoHeight="true" v-model="xm_hpj.gxh_submitDatas[0].establishIndicatorTarget" style="width: 100%;resize:none"/></td>
                                    <td><textarea autoHeight="true" v-model="xm_hpj.gxh_submitDatas[0].establishIndicatorResource" style="width: 100%;resize:none"/></td>
                                </tr>
                                <tr v-for="(item,index) in xm_hpj.gxh_submitDatas" :key="index+'_hpj_gxh'" v-if="index>0">
                                    <td><textarea autoHeight="true" v-model="item.establishCustomIndicatorName" style="width: 100%;resize:none"/></td>
                                    <td><textarea autoHeight="true" v-model="item.establishIndicatorTarget" style="width: 100%;resize:none"/></td>
                                    <td><textarea autoHeight="true" v-model="item.establishIndicatorResource" style="width: 100%;resize:none"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </layui-fieldset>
                <layui-fieldset :label="titleLabel[6]" :id="titleId[6]" v-if="titleFlag[6]">
                    <template slot="main" v-if="xm_jrkjfzghmb.submitDatas.length>0&&xm_jrkjfzghmb.tableDatas.length>0">
                        <table class="layui-table" lay-size="sm" v-for="(item,index) in xm_jrkjfzghmb.tableDatas" :key="item.id" >
                            <thead>
                                <tr>
                                    <th style="text-align:center" width="25%">{{index+1}}.{{item.dataName}}(选项)</th><th v-for="item_n in xm_jrkjfzghmb.compArr" :key="item_n" style="text-align:center" >达到{{item_n}}年末规划</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item_sj,index2) in item.tdata" :key="'JRKJF_'+index2">
                                    <td>{{item_sj}}</td>
                                    <td v-for="count in xm_jrkjfzghmb.compArr" :key="count+'2asfsgah'" style="padding:0;text-align:left">
                                        <layui-inline-radio label="" v-if="count=='2020'"
                                            v-model="xm_jrkjfzghmb.submitDatas[xm_jrkjfzghmb_table_length[index]+index2].planValue2020"
                                            :items="voteFlags"></layui-inline-radio>
                                        <layui-inline-radio label="" v-if="count=='2022'"
                                            v-model="xm_jrkjfzghmb.submitDatas[xm_jrkjfzghmb_table_length[index]+index2].planValue2022"
                                            :items="voteFlags"></layui-inline-radio> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>其他</td>
                                    <td><input v-model="xm_jrkjfzghmb.qita_subdata[index].planValue2020"/></td>
                                    <td><input v-model="xm_jrkjfzghmb.qita_subdata[index].planValue2022"/></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </layui-fieldset>
                <file-upload :label="titleLabel[7]" :id="titleId[7]" v-if="titleFlag[7]"
                    :attachmentBusinessId="projectInfo.id"
                    attachmentBusinessType="project_info"
                    module="projectAllForm"
                    type="2"
                    ref="fileUpload"/>
            </div>
            </layui-form>

		</div>
    </div>

</template>
<script>
import UserSelectList from "../../components/UserSelectList";
import OfficeTree from "@/components/OfficeTree";
import {getUsers} from "@/api/user";
import { getDicts } from '@/api/dict'
import { changeSubType } from '@/api/sys/formTemplateComponent'
import Base from "@/views/base/Base"
import ProjectInfoBackToUpdate from '@/views/project/projectExecuteInfoManager/ProjectInfoBackToUpdate'
import ProjectPostApproval from '@/views/project/projectSpace/ProjectPostApproval'
import ProjectApproval from '@/views/project/projectSpace/ProjectApproval'

export default {
    extends: Base,
    //name:"FormTemplateInfoFormPreview",
    data () {
        return {
            flag:null,
            userMap:[],
            updateFlag:true,
            projectPlanInfo: {
                projectYear: this.$route.params.templateYear,
            },
            projectTypeDicts:[],
            projectInvestmentDicts:[],
            projectActualizeDicts:[],
            projectRequirementSrcDicts:[],
            majorProjectDicts:[],
            projectPriorityDicts:[],
            projectSubtypeDicts:[],
            projectInfo:{
                projectSubtypeDict:''
            },
            voteFlags: [{
                    label: '是',
                    value: 'y'},
                {
                    label: '否',
                    value: 'n'
                } ],
            isHaveSubType:false,
            scrVal:0,
            oneoneCheckBoxs:[],//项目概算
            oneoneCheckNodeCode:[],
            officeInfos: [],//成本分摊
            officeNameMap: {},
            oneCheckBoxs:[],//项目可行性
            twoCheckBoxs:[],//项目先进性
            threeCheckBoxs:[],//先进性主要体现在
            fourCheckBoxs:[],//业务渠道
            fiveCheckBoxs:[],//预期用户
            ggl_sybxmysbf_checkBox:[],//使用本项目预算部分
            ggl_sybxmysbf_subItems:[],
            ggl_sybxmysbfNodeCode:[],
            ggl_sybxmysbf_waibaoxuanxiang:[],//使用本项目预算部分de外包人员价格偏高原因de选项
            gzl_syqtxmysbf_checkbox:[],//使用其他项目预算部分
            gzl_syqtxmysbf_subItems:[],
            gzl_syqtxmysbfNodeCode:[],
            gzl_syqtxmysbf_waibaoxuanxiang:[],//使用其他项目预算部分de外包人员价格偏高原因de选项

            sbcgqd_xzsb_checkbox:[],//设备采购清单(新增设备)
            sbcgqd_xzsb_NodeCode:[],
            sbcgqd_xzsb:{//设备采购清单(新增设备)de选项
                device_names:[],
                device_environments:[],
                device_systems:[],
                device_purposes:[],
                purchase_type:[]
            },
            sbcgqd_xzsb_subItems:[],

            sbcgqd_krsb_checkbox:[],//设备采购清单(扩容设备)
            sbcgqd_krsb_NodeCode:[],
            sbcgqd_krsb:{//设备采购清单(扩容设备)de选项
                device_names:[],
                device_environments:[],
                device_systems:[],
                device_purposes:[],
                purchase_type:[]
            },
            sbcgqd_krsb_subItems:[],

            sbcgqd_ghsb_checkbox:[],//设备采购清单(更换设备)
            sbcgqd_ghsb_NodeCode:[],
            sbcgqd_ghsb:{//设备采购清单(更换设备)de选项
                device_names:[],
                device_environments:[],
                device_systems:[],
                device_purposes:[],
                old_device_deal_types:[],
                purchase_type:[]
            },
            sbcgqd_ghsb_subItems:[],

            xm_hpj_checkbox:[],//项目后评价
            xm_hpj:{
                trData:[],
                submitDatas:[],
                gxh_submitDatas:[],//个性化
                have_gxh:false
            },

            xm_jrkjfzghmb_checkbox:[],//金融科技发展规划目标
            xm_jrkjfzghmb:{
                tableDatas:[],
                compArr:[],
                submitDatas:[],
                qita_subdata:[]
            },
            projectEsFundItPlans:[],
            projectInfoIframe:{},
            processFlag :"",
            procItemInfo:{},
            currentUserId:'',
            titleLabel:[],
            titleFlag:[],
            titleId:[],
        }
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    watch:{
        'projectInfo.projectSubtypeDict':function(curVal){
            loading();
            this.changeSubTypeM(curVal);
        }
    },
    computed: {
        projectTypeMap: function(){
            return this.projectTypeDicts ? this.projectTypeDicts.array2Obj("value", 'label') : [];
        },
        projectInvestmentMap: function(){
            return this.projectInvestmentDicts ? this.projectInvestmentDicts.array2Obj("value", 'label') : [];
        },
        projectActualizeMap: function(){
            return this.projectActualizeDicts ? this.projectActualizeDicts.array2Obj("value", 'label') : [];
        },
        projectRequirementSrcMap: function(){
            return this.projectRequirementSrcDicts ? this.projectRequirementSrcDicts.array2Obj("value", 'label') : [];
        },
        majorProjectMap: function(){
            return this.majorProjectDicts ? this.majorProjectDicts.array2Obj("value", 'label') : [];
        },
        projectPriorityMap: function(){
            return this.projectPriorityDicts ? this.projectPriorityDicts.array2Obj("value", 'label') : [];
        },
        projectSubtypeDictMap: function(){
            return this.projectSubtypeDicts ? this.projectSubtypeDicts.array2Obj("value", 'label') : [];
        },
        oneTableTitleRowspan: function () {
            return parseInt(this.oneCheckBoxs.length/4)+1;
        },
        gai_suan_zong_shu:function () {
            let sum = 0;
            this.oneoneCheckBoxs.forEach(element => {
                switch (element.dataCode) {
                    case "budget_hardware":sum+=Number(this.projectInfo.budgetHardware);break;
                    case "budget_soft_develop":sum+=Number(this.projectInfo.budgetSoftDevelop);break;
                    case "budget_soft_purchase":sum+=Number(this.projectInfo.budgetSoftPurchase);break;
                    case "budget_consult":sum+=Number(this.projectInfo.budgetConsult);break;
                    case "budget_other":sum+=Number(this.projectInfo.budgetOther);break;
                    default:break;
                }
            });
            return sum;
        },

        twoTableTitleRowspan: function () {
            return parseInt(this.twoCheckBoxs.length/4)+1;
        },
        threeTableTitleRowspan: function () {
            return parseInt(this.threeCheckBoxs.length/4)+1;
        },
        fourTableTitleRowspan: function () {
            return parseInt(this.fourCheckBoxs.length/4)+1;
        },
        fiveTableTitleRowspan: function () {
            return parseInt(this.fiveCheckBoxs.length/4)+1;
        },
        chengBenTotalPercent:function(){
            let total=0;
            this.officeInfos.forEach(element=>{
                total+=Number(element.percentNumber);
            });
            return total;
        },
        xm_hpj_zhijie_rolLength:function() {
            let la = this.xm_hpj_checkbox.filter(element=>element.dataCode=='hpj_zjjjxy');
            return la[0]?la[0].shujus.length:1;
        },
        xm_jrkjfzghmb_table_length:function () {
            let arr = [0];
            var sum =0;
            this.xm_jrkjfzghmb.tableDatas.forEach(element=>{
                sum+=element.tdata.length;
                arr.push(sum);
            });
            return arr;
        },
        titleTopValArr:function () {
            var arr = [];
            this.titleId.forEach(element => {
                if(element!=""){
                    arr.push(this.$el.querySelector("#"+element).offsetTop);
                }
            });
            return arr;
        }

    },
    methods: {
        initData: function(){
            this.isHaveSubType=true;
            this.projectInfo.projectSubtypeDict = this.$route.params.subTypeDict;
            
            document.getElementById('xmlxsq').addEventListener('scroll', this.handleScroll);
            document.onkeydown = function () {
                if (window.event && window.event.keyCode == 13) {
                    window.event.returnValue = false;
                }
            }
            //loading();
            getDicts("PROJECT_TYPE_DICT,PROJECT_INVESTMENT_DICT,PROJECT_ACTUALIZE_DICT,PROJECT_REQUIREMENT_SRC_DICT,MAJOR_PROJECT_DICT,PROJECT_PRIORITY_DICT,PROJECT_SUBTYPE_DICT").then(result => {
                    this.projectTypeDicts=result.data[0]||[];
                    this.projectInvestmentDicts=result.data[1]||[];
                    this.projectActualizeDicts=result.data[2]||[];
                    this.projectRequirementSrcDicts=result.data[3]||[];
                    this.majorProjectDicts=result.data[4]||[];
                    this.projectPriorityDicts=result.data[5]||[];
                    this.projectSubtypeDicts=result.data[6]||[];
                    //this.epibolyPriceHighDicts=result.data[7]||[];//外包人员价格偏高原因

            });

            

        },
        officeClick: function () {
          this.$layer.iframe({
            content: {
              content: OfficeTree, //传递的组件对象
              parent: this, //当前的vue对象
              data: []
            },
            area: [
              "auto",
              (window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight) *
              0.8 +
              "px"
            ],
            title: "部门选择"
          });
        },
        clickNodeAfter: function (node) {

            getMajor(node.id).then(result => {
              var data = result.data;
                this.officeNameMap=data.officeNameMap;
              this.officeInfos.push({
                orgName:this.officeNameMap.orgName,
                projectId:this.projectInfo.id,
                departmentId: data.officeNameMap.orgId,
                percentNumber:0
              });

            });
          this.$layer.closeAll();

        },
        delOffInfo:function (index) {
            this.officeInfos.splice(index,1);
        },
        addRow: function(param) {
           switch (param) {
               case "benyusuan":
                   this.ggl_sybxmysbf_subItems.push({
                       systemName:null,
                       workloadBudgetSource:null,
                       workloadInternal:null,
                       workloadExternal:null,
                       personMonthPrice:null,
                       breakRuleReasonDict:null,
                       breakRuleReasonRemark:null,
                       workloadBudgetFund:null,
                       workloadBudgetFlag:'y',
                       projectId:this.projectInfo.id
                   });
                   break;
               case "qitayusuan":
                   this.gzl_syqtxmysbf_subItems.push({
                        systemName:null,
                        workloadBudgetSource:null,
                        workloadInternal:null,
                        workloadExternal:null,
                        personMonthPrice:null,
                        breakRuleReasonDict:null,
                        breakRuleReasonRemark:null,
                        workloadBudgetFund:null,
                        workloadBudgetFlag:'n',
                        projectId:this.projectInfo.id
                   });
                   break;
               case "cgqd_xz":
                   this.sbcgqd_xzsb_subItems.push({
                        projectId:this.projectInfo.id,
                        deviceApplicationModeDict:1,
                        deviceName:null,
                        deviceCount:null,
                        devicePrice:0,
                        deviceFund:0,
                        deviceEnvironmentDict:null,
                        deviceSystemDict:null,
                        devicePurpose:null,
                        devicePurposeDict:null,
                        purchaseTypeDict:null,
                   });
                   break;
               case "cgqd_kr":
                   this.sbcgqd_krsb_subItems.push({
                        projectId:this.projectInfo.id,
                        deviceApplicationModeDict:2,
                        deviceName:null,
                        deviceCount:null,
                        devicePrice:0,
                        deviceFund:0,
                        deviceEnvironmentDict:null,
                        deviceSystemDict:null,
                        devicePurpose:null,
                        oldDeviceInitPrice:0,
                        enlargeDeviceUseYear:null,
                        devicePurposeDict:null,
                        purchaseTypeDict:null,
                   });break;
               case "cgqd_gh":
                   this.sbcgqd_ghsb_subItems.push({
                        projectId:this.projectInfo.id,
                        deviceApplicationModeDict:3,
                        deviceName:null,
                        deviceCount:null,
                        devicePrice:0,
                        deviceFund:0,
                        deviceEnvironmentDict:null,
                        deviceSystemDict:null,
                        devicePurpose:null,
                        newDeviceUseYear:null,
                        oldDeviceUseYear:null,
                        oldDevicePrice:null,
                        oldDeviceDealTypeDict:null,
                        devicePurposeDict:null,
                        purchaseTypeDict:null,
                   });
                   break;
               case "hpx_gxh":
                   this.xm_hpj.gxh_submitDatas.push({
                        projectId:this.projectInfo.id,
                        postEvaluationIndicatorDict:'9',
                        establishCustomIndicatorName:null,
                        establishIndicatorTarget:null,
                        establishIndicatorResource:null
                   });
                   break;

               default:
                   break;
           }
        },
        delRow: function(index, type) {

            var showTip = false;
            var arr = [];
             switch (type) {
                case "benyusuan":
                    arr=this.ggl_sybxmysbf_subItems;break;
                case "qitayusuan":
                    arr=this.gzl_syqtxmysbf_subItems;break;
                case "cgqd_xz":
                    arr=this.sbcgqd_xzsb_subItems;break;
                case "cgqd_kr":
                    arr=this.sbcgqd_krsb_subItems;break;
                case "cgqd_gh":
                    arr=this.sbcgqd_ghsb_subItems;break;
                case "hpx_gxh":
                    arr=this.xm_hpj.gxh_submitDatas;break;
                default:
                    break;
            }
            var subitem = arr[index];
            for(var key in subitem) {
                if(subitem[key]) {
                    showTip = true
                    break;
                }
            }
            confirm('确定删除该行吗？', () => {
                arr.splice(index, 1);
            }, showTip);
        },
        goAnchor(selector) {
            //console.log(selector);
            var anchor = this.$el.querySelector(selector);
            document.getElementById('xmlxsq').scrollTop=anchor.offsetTop-57;
        },
        handleScroll:function () {
            //this.scrVal = document.getElementById('xmlxsq').scrollTop;
            var viewTop = document.getElementById('xmlxsq').scrollTop;
            this.titleTopValArr.forEach((element,index) => {
                if(viewTop<=521){
                    $("p.floatnav_a_cur").removeClass("floatnav_a_cur");
                    $("#anchor-1p").addClass("floatnav_a_cur");
                    
                }else if(viewTop+157>=element){
                    $("p.floatnav_a_cur").removeClass("floatnav_a_cur");
                    $("#"+this.titleId[index]+"p").addClass("floatnav_a_cur");
                    
                }
            });
            //console.log(this.$el.querySelector("#anchor-7").offsetTop);

            // this.titleId.forEach(element=>{
            //     if(element!=""){
            //         var topVal = this.$el.querySelector("#"+element).offsetTop;
            //         if(viewTop){

            //         }
            //     }
            // });
        },
        
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form', 'upload'], function(){
        		var element = element
                ,form = layui.form
                ,upload = layui.upload;

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

				form.on('submit(saveProjectAllForm)', function(data){
                    _this.save();
					return false;
                });


        	});

        },
       changeSubTypeM:function (curVal) {
           changeSubType(this.projectPlanInfo.projectYear,curVal).then(result=>{
                if(result.data){
                    //计算显示序号
                    if(result.data.arrBy){
                        this.titleLabel = result.data.arrBy[0];
                        this.titleFlag = result.data.arrBy[1];
                        this.titleId=result.data.arrBy[2];
                        this.titleId.forEach(element => {
                            if(element!=""){
                                // console.log("#"+element);
                                
                                // console.log($("#"+element).length);
                                // console.log($("#"+element)[0]);
                                // console.log($("#"+element)[0].offsetTop);
                                // var topVal = this.$el.querySelector("#"+element).offsetTop;
                                // this.titleTopValMap[element+'p']=topVal;
                            }
                        });
                        //console.log(this.$el.querySelector("#anchor-7").offsetTop);
                    }




                    this.oneoneCheckBoxs=result.data.ys_gsmx.checkBoxDatas||[];//概算明细

                    this.oneCheckBoxs = result.data.ywkxx_kxx.checkBoxDatas||[];//项目业务可行性
                    this.twoCheckBoxs = result.data.ywxjx_xjx.checkBoxDatas||[];//项目先进性
                    this.threeCheckBoxs = result.data.ywxjx_xjxtxz.checkBoxDatas||[];//先进性主要体现在
                    this.fourCheckBoxs = result.data.ywxq_ywqd.checkBoxDatas||[];//业务渠道
                    this.fiveCheckBoxs = result.data.ywxq_yqyh.checkBoxDatas||[];//预期用户

                    this.ggl_sybxmysbf_checkBox = result.data.ggl_sybxmysbf.checkBoxDatas;//使用本项目预算部分
                    const bak_GGL_xx= this.ggl_sybxmysbf_checkBox.filter(element=>element.shujus!=undefined);
                    this.ggl_sybxmysbf_waibaoxuanxiang=bak_GGL_xx.length>0?bak_GGL_xx[0].shujus:[];
                    this.ggl_sybxmysbf_checkBox.forEach(element=>{
                        this.ggl_sybxmysbfNodeCode.push(element.dataCode);
                    });

                    this.gzl_syqtxmysbf_checkbox = result.data.gzl_syqtxmysbf.checkBoxDatas;//使用其他项目预算部分
                    const bak_GZL_xx= this.gzl_syqtxmysbf_checkbox.filter(element=>element.shujus!=undefined);
                    this.gzl_syqtxmysbf_waibaoxuanxiang=bak_GZL_xx.length>0?bak_GZL_xx[0].shujus:[];
                    this.gzl_syqtxmysbf_checkbox.forEach(element=>{
                        this.gzl_syqtxmysbfNodeCode.push(element.dataCode);
                    });

                    this.sbcgqd_xzsb_checkbox = result.data.sbcgqd_xzsb.checkBoxDatas;//设备采购清单(新增设备)
                    this.sbcgqd_xzsb_checkbox.forEach(element=>{
                        this.sbcgqd_xzsb_NodeCode.push(element.dataCode);
                    });
                    this.sbcgqd_xzsb_checkbox.forEach(element => {
                        if(element.shujus){
                            switch (element.dataCode) {
                                case 'device_name_a':
                                    this.sbcgqd_xzsb.device_names=element.shujus; break;
                                case 'device_environment_a':
                                    this.sbcgqd_xzsb.device_environments=element.shujus; break;
                                case 'device_environment_dict_a':
                                    this.sbcgqd_xzsb.device_systems=element.shujus; break;
                                case 'device_purpose_a':
                                    this.sbcgqd_xzsb.device_purposes=element.shujus; break;
                                case 'purchase_type_a':
                                    this.sbcgqd_xzsb.purchase_type=element.shujus; break;
                                default:
                                    break;
                            }
                        }
                    });

                    this.sbcgqd_krsb_checkbox = result.data.sbcgqd_krsb.checkBoxDatas;//设备采购清单(扩容设备)
                    this.sbcgqd_krsb_checkbox.forEach(element=>{
                        this.sbcgqd_krsb_NodeCode.push(element.dataCode);
                    });
                    this.sbcgqd_krsb_checkbox.forEach(element => {
                        if(element.shujus){
                            switch (element.dataCode) {
                                case 'device_name_e':
                                    this.sbcgqd_krsb.device_names=element.shujus; break;
                                case 'device_environment_e':
                                    this.sbcgqd_krsb.device_environments=element.shujus; break;
                                case 'device_system_a':
                                    this.sbcgqd_krsb.device_systems=element.shujus; break;
                                case 'device_purpose_e':
                                    this.sbcgqd_krsb.device_purposes=element.shujus; break;
                                case 'purchase_type_e':
                                    this.sbcgqd_krsb.purchase_type=element.shujus; break;
                                default:
                                    break;
                            }
                        }
                    });

                    this.sbcgqd_ghsb_checkbox = result.data.sbcgqd_ghsb.checkBoxDatas;//设备采购清单(更换设备)
                    this.sbcgqd_ghsb_checkbox.forEach(element=>{
                        this.sbcgqd_ghsb_NodeCode.push(element.dataCode);
                    });
                    this.sbcgqd_ghsb_checkbox.forEach(element => {
                        if(element.shujus){
                            switch (element.dataCode) {
                                case 'device_name_c':
                                    this.sbcgqd_ghsb.device_names=element.shujus; break;
                                case 'device_environment_c':
                                    this.sbcgqd_ghsb.device_environments=element.shujus; break;
                                case 'device_system_c':
                                    this.sbcgqd_ghsb.device_systems=element.shujus; break;
                                case 'old_device_deal_type_c':
                                    this.sbcgqd_ghsb.old_device_deal_types=element.shujus; break;
                                case 'device_purpose_c':
                                    this.sbcgqd_ghsb.device_purposes=element.shujus; break;
                                case 'purchase_type_c':
                                    this.sbcgqd_ghsb.purchase_type=element.shujus; break;
                                default:
                                    break;
                            }
                        }
                    });

                    this.xm_hpj_checkbox = result.data.xm_hpj.checkBoxDatas;//项目后评价
                    var xmhpj_flag=false;
                    if(this.xm_hpj.submitDatas&&this.xm_hpj.submitDatas.length==0){
                        xmhpj_flag=true;
                    }
                    this.xm_hpj_checkbox.forEach((element,index) => {
                        if(element.shujus){
                            this.xm_hpj.trData.push({"name1":element.dataName,"name2":element.shujus[0].label,"i":this.xm_hpj.trData.length,"flag":true,"rowLength":element.shujus?element.shujus.length:0,"value":element.shujus[0].value});
                            if(xmhpj_flag){
                                this.xm_hpj.submitDatas.push({projectId:this.projectInfo.id,
                                                            postEvaluationIndicatorDict:element.shujus[0].value,
                                                            establishIndicatorTarget:null,
                                                            establishIndicatorResource:null
                                                        });
                            }
                            
                            element.shujus.forEach((element2,index) => {
                                if(index>0){
                                    this.xm_hpj.trData.push({"name":element2.label,"i":this.xm_hpj.trData.length,"flag":false,"value":element2.value});
                                    if(xmhpj_flag){
                                        this.xm_hpj.submitDatas.push({projectId:this.projectInfo.id,
                                                                    postEvaluationIndicatorDict:element2.value,
                                                                    establishIndicatorTarget:null,
                                                                    establishIndicatorResource:null
                                                                });
                                    }
                                   
                                }
                            });
                        }

                        if(element.dataCode=='hpj_gxh'){
                            this.xm_hpj.have_gxh=true;
                            if(this.xm_hpj.gxh_submitDatas&&this.xm_hpj.gxh_submitDatas.length==0){
                              this.xm_hpj.gxh_submitDatas.push({
                                projectId:this.projectInfo.id,
                                postEvaluationIndicatorDict:'9',
                                establishCustomIndicatorName:null,
                                establishIndicatorTarget:null,
                                establishIndicatorResource:null
                              })
                            }

                        }
                    });

                    this.xm_jrkjfzghmb_checkbox=result.data.xm_jrkjfzghmb.checkBoxDatas;//金融科技发展规划目标
                    let xm_jrkjfzghmb_compParam=result.data.xm_jrkjfzghmb.formComponent.nodeParam;
                    this.xm_jrkjfzghmb.compArr = xm_jrkjfzghmb_compParam.split(",");

                    var jrkjf_flag=false;
                    if(this.xm_jrkjfzghmb.submitDatas&&this.xm_jrkjfzghmb.submitDatas.length==0){
                        jrkjf_flag=true;
                    }

                    this.xm_jrkjfzghmb_checkbox.forEach((element,index)=>{
                        this.$set(this.xm_jrkjfzghmb.tableDatas,index,{'dataName':''});
                        this.$set(this.xm_jrkjfzghmb.tableDatas,index,{'dataCode':''});
                        this.$set(this.xm_jrkjfzghmb.tableDatas[index],'dataName',element.dataName);
                        this.$set(this.xm_jrkjfzghmb.tableDatas[index],'dataCode',element.dataCode);

                        switch (element.dataCode) {
                            case 'gh_cxyl':this.xm_jrkjfzghmb.qita_subdata.push({
                                                projectId:this.projectInfo.id,
                                                fundItPlanTargetDict:'1F',
                                                planValue2020:null,
                                                planValue2022:null
                                            }); break;
                            case 'gh_sjqd':this.xm_jrkjfzghmb.qita_subdata.push({
                                                projectId:this.projectInfo.id,
                                                fundItPlanTargetDict:'2E',
                                                planValue2020:null,
                                                planValue2022:null
                                            }); break;
                            case 'gh_znzx':this.xm_jrkjfzghmb.qita_subdata.push({
                                                projectId:this.projectInfo.id,
                                                fundItPlanTargetDict:'3D',
                                                planValue2020:null,
                                                planValue2022:null
                                            }); break;
                            case 'gh_ylts':this.xm_jrkjfzghmb.qita_subdata.push({
                                                projectId:this.projectInfo.id,
                                                fundItPlanTargetDict:'4C',
                                                planValue2020:null,
                                                planValue2022:null
                                            }); break;
                        }
                        
                        //this.$set(this.xm_jrkjfzghmb.submitDatas,index,new Array());

                        if(element.shujus){
                            this.$set(this.xm_jrkjfzghmb.tableDatas[index],'tdata',new Array());

                            element.shujus.forEach((element2,index2)=>{
                                this.xm_jrkjfzghmb.tableDatas[index]['tdata'].push(element2.label);
                            });
                            if(jrkjf_flag){
                                element.shujus.forEach((element2,index2)=>{
                                    this.xm_jrkjfzghmb.submitDatas.push({
                                        projectId:this.projectInfo.id,
                                        fundItPlanTargetDict:element2.value,
                                        planValue2020:null,
                                        planValue2022:null
                                    });
                                });
                            }

                        }
                    });

                }


                closeLoading();
            });
        }
    },

}
</script>
<style scope>
     @import url("../../../static/css/approve/pro-approval2.css");
  .icon_scope {
    width: 250px !important;
  }
  .layui-table {
      text-align: center;
  }
</style>
