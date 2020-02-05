<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="议题信息">
                        <template slot="main">
                            <layui-item>
                                <layui-inline-input
                                    label="议题名称" 
                                    placeholder="请输入标题"
                                    lay-verify="required"
                                    v-model="meetingSubject.subjectName"
                                    :readonly="globalReadonly"
                                    :block="true"></layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <select-office-input
									title="业务牵头部门选择"
                                    label="业务牵头部门" 
                                    placeholder="点击选择业务牵头部门"
                                    v-model="meetingSubject.officeId"
									:officeName="officeName"
                                    :readonly="globalReadonly"></select-office-input>
                                <layui-inline-select
                                    label="上会类型"
                                    v-model="meetingSubject.meetingTypeDict"
                                    :readonly="globalReadonly"
                                    :items="meetingTypes"></layui-inline-select>
                            </layui-item>
                            <layui-item>
                                <layui-inline-radio
                                    name="voteFlag"
                                    label="是否投票"
                                    v-model="meetingSubject.subjectVoteFlag"
                                    :readonly="globalReadonly"
                                    :items="voteFlags"></layui-inline-radio>
                                <layui-inline-select
                                    label="议题类型"
                                    v-model="meetingSubject.meetingSubjectTypeDict"
                                    :items="subjectTypes"></layui-inline-select>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <add-reduce-input
                                    name="votingRound"
                                    label="投票轮次"
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.votingRound"></add-reduce-input>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <layui-inline-checkbox
                                    name="voteOptions"
                                    label="投票选项"
                                    :items="voteOptions"
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.voteOptions"></layui-inline-checkbox>
                            </layui-item>
                            <layui-item v-if="meetingSubject.subjectVoteFlag == 'y'">
                                <layui-inline-checkbox
                                    name="ratingItems"
                                    label="评分选项"
                                    :items="ratingItems"
                                    :readonly="globalReadonly"
                                    v-model="meetingSubject.ratingItem"></layui-inline-checkbox>
                            </layui-item>
                            <layui-inline-ue
                                v-if="false"
                                label="备注"
                                v-model="meetingSubject.remark"
                                :readonly="globalReadonly"
                                ref="remarkUe"></layui-inline-ue>
                            <layui-inline-textarea
                                label="备注"
                                v-model="meetingSubject.remark"
                                :readonly="globalReadonly"></layui-inline-textarea>
                        </template>
                    </layui-fieldset>
					<layui-fieldset label="议题事项">
						<template slot="top-right">
							<span style="padding-right: 8px" @click="clearSubjectItems"><i :class="{'fa fa-times-circle': true, 'text-warning': true,}"></i> 清空</span>
						</template>
                        <template slot="main">
							<template v-for="(item, index) in subjectItems">
								<layui-inline-textarea
									v-if="item.component == 'layui-inline-textarea'"
									:label="item.title"
									v-model="subjectItems[index].text"
									:readonly="globalReadonly"
									v-dragging="{item: item, list: subjectItems, group: 'subjectItems'}"
									:key="index"></layui-inline-textarea>
								<layui-item
									v-if="!item.id &&item.component == 'number-table'"
									ref="tbox" 
									v-dragging="{item: item, list: subjectItems, group: 'subjectItems'}" 
									:key="index">
									<layui-inline style="display: block;margin-right: 0">
										<label class="layui-form-label" :style="{height: tHeight + 'px', 'line-height': (tHeight - 20) + 'px'}">{{ item.title }}</label>
										<div v-if="childItemsMap[item.code]" class="layui-input-block">
											<template v-for="n in ((childItemsMap[item.code]).length % 5 + 1)">
												<table class="layui-table" lay-size="sm" style="margin: 0" :key="n + item.code">
													<thead>
														<tr>
															<th v-for="cIndex in 5" style="text-align: center;" :key="cIndex + 'th'">{{ getChildItemTitle(item.code, n, cIndex) }}<br/>(万元)</th>
														</tr> 
													</thead>

													<tbody>
														<tr>
															<td 
																v-for="cIndex in 5"
																:key="cIndex + 'td'">
																<input v-if="getChildItem(item.code, n, cIndex)" v-model="getChildItem(item.code, n, cIndex).number" type="number" class="layui-input">
															</td>
														</tr>
														<tr>
															<td class="budget-total" style="text-align: right;" colspan="5">总计：{{ totalInfo[item.code] }}  万元</td>
														</tr>
													</tbody>
												</table>
											</template>
										</div>
									</layui-inline>
								</layui-item>
							</template>
                        </template>
					</layui-fieldset>
					<file-upload
						v-if="initSuccess"
						label="议题材料"
						:attachmentBusinessId="meetingSubject.id"
						attachmentBusinessType="meeting_subject"
						:canUpload="!meetingSubject.id || curUser.userId == meetingSubject.createBy"
						module="meeting"
						type="2"
						@getAttasAfter="getAttasAfter"
						:canDelete="!meetingSubject.id || curUser.userId == meetingSubject.createBy"
						:needConvert="true"
						ref="fileUpload">
						<template slot="custom-th">
							<th style="text-align: center;width: 160px">汇报人</th>
							<th style="text-align: center;width: 160px">汇报部门</th>
							<th style="text-align: center;width: 160px">汇报时间（分钟）</th>
						</template>
						<template slot="custom-td" slot-scope="scope">
							<td>
								<select-user-input
									v-model="scope.atta.memberId"
									:userName="scope.atta.memberName"></select-user-input>
							</td>
							<td>
								<select-office-input
									label=""
									v-model="scope.atta.officeId"
									:officeName="scope.atta.officeName"></select-office-input>
							</td>
							<td>
								<layui-inline-input
									type="number"
									v-model="scope.atta.reportTime"></layui-inline-input>
							</td>
						</template>
					</file-upload>
					<layui-inline class="btn-group-center hidden">
                        <button ref="saveBtn" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveMeetingSubject"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
		<div class="layui-form-item layui-layout-admin">
			<div class="layui-input-block">
				<div class="layui-footer" style="text-align:center;left: 0;">
					<button class="layui-btn layui-btn-lg layui-btn-blue" @click="toClick('saveBtn')"><i class="fa fa-save"></i> 保存</button>
					<button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, getMeetingSubjectInitData } from '@/api/meeting/meetingSubject'
import { getMeetingSubjectItemConfigs } from '@/api/meeting/meetingSubjectItemConfig'
import Base from "@/views/base/Base"
let Big = require('big.js')

export default {
	name: 'MeetingSubjectForm',
	extends: Base,
    data () {
        return {
			voteFlags: [
                {
                    label: '是',
                    value: 'y'
                },
                {
                    label: '否',
                    value: 'n'
                }
			],
			meetingTypes: [],
			subjectTypes: [],
            voteOptions: [],
			ratingItems: [],
            meetingSubject: {
                id: this.$route.params.id,
				subjectName: '',
				meetingSubjectType: '',
				meetingSubjectTypeDict: '',
				meetingSubjectStatus: '',
				meetingSubjectStatusDict: '',
				meetingType: '',
				meetingTypeDict: '',
				officeId: '',
				officeName: '',
				subjectVoteFlag: '',
				votingRound: 1,
				voteOptions: [],
                ratingItem: [],
				reportUserId: '',
				reportOfficeId: '',
				reportTime: '',
				remark: '',
				createBy: '',
			},
			subjectItems: [],
			childItemsMap: {},
			attachmentReportMemberMap: {},
			userMap: {},
			officeNameMap: {},
			officeName: '',
			initSuccess: false,
			tHeight: 132,
			totalInfo: {},
        }
    },
    computed: {
       	
	},
	watch: {
        childItemsMap: {
			handler(oldVal, newVal) {
				for (let code in this.childItemsMap) {
					let childItems = this.childItemsMap[code];
					let total = new Big(0);
					childItems.forEach(item => {
						if (item.number) {
							total = total.plus(item.number);
						}
					})
					
					this.$set(this.totalInfo, code, total);
				}
			},
			deep: true
		}
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
		clearSubjectItems() {
			confirm("确定清空议题事项吗？", () => {
				this.subjectItems = [];
			});
		},
		getChildItemTitle(code, pageNo, index) {
			let item = this.getChildItem(code, pageNo, index);
			if (!item) {
				return "";
			}
			return item.title;
		},
		getChildItem(code, pageNo, index) {
			let i = 5 * (pageNo - 1) + index - 1;
			let childItems = this.childItemsMap[code];
			if (childItems.length <= i) {
				return null;
			}
			return childItems[i];
		},
		getAttasAfter(attas) {
			attas.forEach(item => {
				let reportMember = this.attachmentReportMemberMap[item.attachmentId] || {};
				item.memberId = reportMember.memberId;
				item.memberName = this.userMap[reportMember.memberId];
				item.officeId =	reportMember.officeId;
				item.officeName = this.officeNameMap[reportMember.officeId];
				item.reportTime = reportMember.reportTime;
			});	
		},
    	save: function(){  
    		this.submitHandler((token) => {
				let subject = JSON.parse(JSON.stringify(this.meetingSubject));
                subject.voteOptions = subject.voteOptions.length <= 0 ? '' : subject.voteOptions.join(',');
				subject.ratingItem = subject.ratingItem.length <= 0 ? '' : subject.ratingItem.join(",");
				let attachments = this.$refs.fileUpload.attachments;
				let reportMembers = [];
				attachments.forEach(item => {
					reportMembers.push({
						attachmentId: item.attachmentId,
						memberId: item.memberId,
						officeId: item.officeId,
						reportTime: item.reportTime
					});
				});
				let attamentIds = this.$refs.fileUpload.getAttamentIds();
				let subjectItems = [];
				this.subjectItems.forEach(item => {
					if (!this.childItemsMap[item.code]) {
						subjectItems.push(item);
					} else {
						let childItems = this.childItemsMap[item.code];
						subjectItems = subjectItems.concat(childItems);
					}
				})
	            saveOrUpdate(JSON.stringify(subject), JSON.stringify(subjectItems), JSON.stringify(reportMembers), JSON.stringify(attamentIds), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.meetingSubject.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.meetingSubject.id){
                getMeetingSubjectInitData(this.meetingSubject.id).then(results => {
					let subjectResult = results[0];
                    let data = subjectResult.data;
                    if (data) {
						var meetingSubject = data.subject || {};
                        meetingSubject.ratingItem = meetingSubject.ratingItem ? meetingSubject.ratingItem.split(",") : [];
                        meetingSubject.voteOptions = meetingSubject.voteOptions ? meetingSubject.voteOptions.split(",") : [];
                        meetingSubject.votingRound = meetingSubject.votingRound || null;
                        this.meetingSubject = meetingSubject;

						this.officeNameMap = data.officeNameMap || {};
						this.officeName = this.officeNameMap[meetingSubject.officeId] || '';
                    }

					let subjectItemData = results[1].data || {};
					this.subjectItems = subjectItemData.subjectItems || [];
					this.childItemsMap = subjectItemData.childItemsMap || {};

					let subjectReportMemberResult = results[2];
					let subjectReportMemberData = subjectReportMemberResult.data || {};
					let reportMembers = subjectReportMemberData.reportMembers || {};
					this.attachmentReportMemberMap = reportMembers.array2Obj('attachmentId');
					Object.assign(this.userMap, subjectReportMemberData.userMap);
					Object.assign(this.officeName, subjectReportMemberData.officeNameMap);

					this.initSuccess = true;

					this.$nextTick(() => {
						if (!this.$refs.tbox) {
							return;
						}
						this.tHeight = this.$refs.tbox.offsetHeight;
					})

					this.globalReadonly = this.meetingSubject.meetingSubjectStatusDict > 2;
				});
            } else {
				this.initSuccess = true;
				this.globalReadonly = false;

				getMeetingSubjectItemConfigs().then(res => {
					let data = res.data || {};
					let meetingSubjectItemConfigs = data.meetingSubjectItemConfigs || [];
					var dictMap = data.dictMap || {};
					let childItemsMap = {};
					meetingSubjectItemConfigs.forEach((item, index) => {
						this.subjectItems.push({
							title: item.name,
							code: item.code,
							text: '',
							number: null,
							component: item.component,
							type: item.type,
						});
						if (item.dictType) {
							let dicts = dictMap[item.dictType] || [];
							let childItems = [];
							dicts.forEach(dict => {
								childItems.push({
									title: dict.label,
									code: item.code,
									text: '',
									number: null,
									component: item.component,
									type: item.type,
									dictType: item.dictType,
									dictValue: dict.value
								});
							});
							childItemsMap[item.code] = childItems;
						}
					});
					this.childItemsMap = childItemsMap;
				});
			}
            
        	getDicts('MEETING_TYPE_DICT,MEETING_SUBJECT_TYPE_DICT,VOTE_OPINION_DICT,PROJECT_FEASIBILITY').then(result => {
                if (result.data) {
                    this.meetingTypes = result.data[0] || [];
                    this.subjectTypes = result.data[1] || [];
                    this.voteOptions = result.data[2] || [];
                    this.ratingItems = result.data[3] || [];
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

				form.on('submit(saveMeetingSubject)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
.view-product /deep/ .layui-input-inline input {
	width: 100%!important;
	text-align: center;
}
</style>