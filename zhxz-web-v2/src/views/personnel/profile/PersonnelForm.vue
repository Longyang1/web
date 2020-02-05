<template>
    <div class="view-product" v-cloak ref="box" style="height: auto;">
        <div class="animated fadeInDown">
            <div :class="{'ibox-content': true, 'personnel-modal': layerid}" style="overflow-x: hidden;padding: 0">
                <layui-form style="margin-bottom: 40px;">
                    <div :style="{padding: '20px', 'background-color': '#F2F2F2', 'overflow-y': 'hidden', 'overflow-x': 'hidden', height: height}">
                        <div class="layui-row layui-col-space15">
                            <div v-if="personnel.userType <= 2" class="layui-col-md12">
                                <div class="layui-card">
                                    <div class="layui-card-header">个人基本信息</div>
                                    <div class="layui-card-body">
                                        <layui-item>
                                            <layui-inline-input
                                                v-if="!layerid"
                                                label="OA账号" 
                                                placeholder="点击选择"
                                                func="selectMember"
                                                @selectMember="selectMember"
                                                v-model="personnel.userUid"
                                                :readonly="true"></layui-inline-input>
                                            <layui-inline-input
                                                label="姓名" 
                                                placeholder="请输入姓名"
                                                v-model="personnel.name"></layui-inline-input>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-select
                                                label="性别"
                                                v-model="personnel.genderDict"
                                                :items="genderDicts"></layui-inline-select>
                                            <layui-inline-date
                                                label="出生日期" 
                                                placeholder="点击选择出生日期"
                                                v-model="personnel.birthday"
                                                :readonly="false"
                                                name="perbirthday"
                                                type="date"></layui-inline-date>
                                            <!-- <layui-inline-input
                                                label="政治面貌" 
                                                placeholder="请输入政治面貌"
                                                v-model="personnel.political"></layui-inline-input> -->
                                            <layui-inline-select
                                                label="政治面貌"
                                                v-model="personnel.politicalDict"
                                                :items="politicalDicts"></layui-inline-select>
                                            <layui-inline-date
                                                label="入党时间" 
                                                placeholder="点击选择入党时间"
                                                v-model="personnel.joinPartyTime" 
                                                :readonly="false"
                                                name="joinPartyTime"
                                                type="date"></layui-inline-date>
                                        </layui-item>
                                        <layui-item>
                                            <!-- <layui-inline-select
                                                label="民族"
                                                v-model="personnel.nationDict"
                                                :items="nationDicts"></layui-inline-select> -->
                                            <layui-inline-select
                                                label="民族"
                                                v-model="personnel.nationDict"
                                                :items="nationDicts"></layui-inline-select>
                                            <!-- <layui-inline-input
                                                label="民族" 
                                                placeholder="请输入民族"
                                                v-model="personnel.nation"></layui-inline-input> -->
                                            <layui-inline-select
                                                label="婚姻状态" 
                                                placeholder="请输入婚姻状态"
                                                v-model="personnel.maritalStatus"
                                                :items="wedlockDicts"></layui-inline-select>
                                            <layui-inline-input
                                                label="身份证号码" 
                                                placeholder="请输入身份证号码"
                                                v-model="personnel.idCardNumber"></layui-inline-input>
                                        </layui-item>
                                        <layui-item>
                                            <!-- <layui-inline-input
                                                label="籍贯" 
                                                placeholder="请输入籍贯"
                                                v-model="personnel.birthplace"></layui-inline-input> -->
                                            <layui-inline-select
                                                label="籍贯"
                                                v-model="personnel.birthplaceProvince"
                                                valKey="code"
                                                labelKey="name"
                                                :items="areas">
                                                <div class="layui-input-inline city" style="margin-left: 15px;">
                                                    <layui-select
                                                        v-if="refresh"
                                                        v-model="personnel.birthplaceCity"
                                                        valKey="code"
                                                        label="name"
                                                        :items="birthplaceCitys"></layui-select>
                                                </div>
                                            </layui-inline-select>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-select
                                                label="户口所在地"
                                                v-model="personnel.accountLocationProvince"
                                                valKey="code"
                                                labelKey="name"
                                                :items="areas">
                                                <div class="layui-input-inline city" style="margin-left: 15px;">
                                                    <layui-select
                                                        v-if="refresh"
                                                        v-model="personnel.accountLocationCity"
                                                        valKey="code"
                                                        label="name"
                                                        :items="accountLocationCitys"></layui-select>
                                                </div>
                                            </layui-inline-select>
                                            
                                            <!-- <layui-inline-input
                                                label="户口所在地" 
                                                placeholder="请输入户口所在地"
                                                v-model="personnel.accountLocation"></layui-inline-input> -->
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-input
                                                label="手机" 
                                                placeholder="请输入手机"
                                                v-model="personnel.mobilePhone"></layui-inline-input>
                                            <layui-inline-input
                                                label="邮箱" 
                                                placeholder="请输入邮箱"
                                                v-model="personnel.email"></layui-inline-input>
                                            <layui-inline-input
                                                label="座机区号" 
                                                placeholder="请输入座机区号"
                                                v-model="personnel.areaCode"></layui-inline-input>
                                            <layui-inline-input
                                                label="座机号" 
                                                placeholder="请输入座机号"
                                                v-model="personnel.telephoneNumber"></layui-inline-input>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-select
                                                label="现住址"
                                                v-model="personnel.homeAddressProvince"
                                                valKey="code"
                                                labelKey="name"
                                                :items="areas">
                                                <div class="layui-input-inline city" style="margin-left: 15px;">
                                                    <layui-select
                                                        v-if="refresh"
                                                        v-model="personnel.homeAddressCity"
                                                        valKey="code"
                                                        label="name"
                                                        :items="homeAddressCitys"></layui-select>
                                                </div>
                                                <div class="layui-input-inline area" style="margin-left: 37px;">
                                                    <layui-select
                                                        v-if="refresh"
                                                        v-model="personnel.homeAddressArea"
                                                        valKey="code"
                                                        label="name"
                                                        :items="homeAddressAreas"></layui-select>
                                                </div>
                                                <div class="layui-input-inline">
                                                    <input 
                                                        v-model="personnel.homeAddress" 
                                                        lay-verify="" 
                                                        placeholder="请输入详细住址" 
                                                        type="text" 
                                                        class="layui-input" 
                                                        :style="{width: (layerid ? '582px' : '368px'), 'margin-top': (layerid ? '15px' : '0px'), 'margin-left': (layerid ? '0px' : '14px'), 'margin-right': '8px'}"> 
                                                </div>
                                            </layui-inline-select>
                                            <!-- <layui-inline-input
                                                style="padding-right: 30px"
                                                label="现住址" 
                                                placeholder="请输入现住址"
                                                v-model="personnel.homeAddress"
                                                :block="true"></layui-inline-input> -->
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-input
                                                label="紧急情况联系人" 
                                                placeholder="请输入紧急情况联系人"
                                                v-model="personnel.emergencyContactUser"></layui-inline-input>
                                            <layui-inline-input
                                                label="紧急联系方式" 
                                                placeholder="请输入紧急联系方式"
                                                v-model="personnel.emergencyContactWay"></layui-inline-input>
                                        </layui-item>
                                    </div>
                                </div>
                            </div>
                            <div v-if="personnel.userType <= 2" class="layui-col-md12">
                                <div class="layui-card">
                                    <div class="layui-card-header">教育与职称信息</div>
                                    <div class="layui-card-body">
                                        <layui-item>
                                            <layui-inline-select
                                                label="最高学历"
                                                v-model="personnel.highestEducationDict"
                                                :items="highestEducationDicts"></layui-inline-select>
                                            <layui-inline-select
                                                label="最高学位"
                                                v-model="personnel.highestDegreeDict"
                                                :items="highestDegreeDicts"></layui-inline-select>
                                            <layui-inline-input
                                                label="学历毕业院校" 
                                                placeholder="请输入学历毕业院校"
                                                v-model="personnel.graduatedSchool"></layui-inline-input>
                                            <layui-inline-date
                                                label="学历毕业时间" 
                                                placeholder="请输入学历毕业时间"
                                                v-model="personnel.graduationTime" 
                                                :readonly="false"
                                                name="graduationTime"
                                                type="date"></layui-inline-date>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-input
                                                label="学历所学专业" 
                                                placeholder="请输入学历所学专业"
                                                v-model="personnel.major"></layui-inline-input>
                                            <layui-inline-select
                                                label="外语水平"
                                                v-model="personnel.foreignLanguageLevelDict"
                                                :items="languageLevels"></layui-inline-select>
                                            <!-- <layui-inline-input
                                                label="外语水平" 
                                                placeholder="请输入外语水平"
                                                v-model="personnel.foreignLanguageLevel"></layui-inline-input> -->
            
                                            <layui-inline-input
                                                label="专业技术职称" 
                                                placeholder="请输入专业技术职称"
                                                v-model="personnel.professionalTechnicalTitle"></layui-inline-input>
                                        </layui-item>
                                    </div>
                                </div>
                            </div>

                            <div v-if="personnel.userType == 2" class="layui-col-md12">
                                <div class="layui-card">
                                    <div class="layui-card-header">技术专长</div>
                                    <div class="layui-card-body">
                                        <layui-item
                                            v-for="(item) in technicalExpertiseCategorys"
                                            :key="item.id"
                                            style="padding-bottom: 10px;">
                                            <layui-inline-mutil-select
                                                :width="582"
                                                :label="item.label"
                                                :items="getTeItems(item.value)"
                                                v-model="checkedTeMap[item.value]"></layui-inline-mutil-select>
                                        </layui-item>
                                    </div>
                                </div>
                            </div>

                            <div v-if="personnel.userType <= 2" class="layui-col-md12">
                                <div class="layui-card">
                                    <div class="layui-card-header">工作及岗位信息</div>
                                    <div class="layui-card-body">
                                        <layui-item>
                                            <layui-inline-input
                                                    label="员工ID" 
                                                    placeholder="请输入员工ID"
                                                    v-model="personnel.employeeId"></layui-inline-input>
                                                <!-- <layui-inline-select
                                                    label="所在中心"
                                                    v-model="personnel.center"
                                                    :items="centers"></layui-inline-select> -->
                                            <layui-inline-input
                                                v-if="personnel.userType == 1 && curUser.department.id != curUser.office.id"
                                                label="所在中心"
                                                :value="(centerConfig.centerName ? centerConfig.centerName : centerMap[personnel.partTimeCenter])"
                                                :readonly="true"></layui-inline-input>
                                            <layui-inline-select
                                                v-if="personnel.userType == 1 && curUser.department.id == curUser.office.id"
                                                label="所在中心"
                                                valKey="centerCode"
                                                labelKey="centerName"
                                                v-model="personnel.partTimeCenter"
                                                :items="centers"
                                                :up="true"></layui-inline-select>
                                            <layui-inline-input
                                                :label="curUser.department.id == curUser.office.id ? '所在部门' : '所在处室'"
                                                :value="officeName"
                                                :readonly="true"></layui-inline-input>
                                            <!-- <select-office-input
                                                v-if="personnel.userType == 2"
                                                label="所属部门"
                                                v-model="personnel.departmentId"
                                                :officeName="departmentName"></select-office-input> -->
                                            <layui-inline-date
                                                v-if="personnel.userType == 2"
                                                label="现岗位开始时间" 
                                                placeholder="点击选择现岗位开始时间"
                                                v-model="personnel.jobStartTime"
                                                :readonly="false"
                                                name="jobStartTime"
                                                type="date"></layui-inline-date>
                                        </layui-item>
                                        <layui-item v-if="personnel.userType == 2" style="padding-bottom: 10px;">
                                            <layui-inline-mutil-select
                                                :width="582"
                                                label="现岗位"
                                                valKey="jobCode"
                                                labelKey="jobName"
                                                :items="jobs"
                                                v-model="checkedJobs"></layui-inline-mutil-select>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-input
                                                v-if="false"
                                                label="原单位" 
                                                placeholder="请输入原单位"
                                                v-model="personnel.originalUnit"></layui-inline-input>
                                            <layui-inline-date
                                                label="参加工作时间" 
                                                placeholder="点击选择参加工作时间"
                                                v-model="personnel.participationWorkTime"  
                                                :readonly="false"
                                                name="participationWorkTime"
                                                type="date"></layui-inline-date>
                                            <!-- <layui-inline-input
                                                label="工作年限" 
                                                placeholder="请输入工作年限"
                                                v-model="personnel.workingYear"></layui-inline-input> -->
                                            <layui-inline-date
                                                label="入行时间" 
                                                placeholder="点击选择入行时间"
                                                v-model="personnel.entryHxTime"
                                                :readonly="false"
                                                name="entryHxTime"
                                                type="date"></layui-inline-date>
                                            <layui-inline-select
                                                label="引进方式"
                                                v-model="personnel.entryTypeDict"
                                                :items="entryTypeDicts"></layui-inline-select>
                                            <!-- <layui-inline-input
                                                label="引进方式" 
                                                placeholder="请输入引进方式"
                                                v-model="personnel.entryType"></layui-inline-input> -->
                                            <!-- <layui-inline-input
                                                label="入行年限" 
                                                placeholder="请输入入行年限"
                                                v-model="personnel.entryHxYear"></layui-inline-input> -->
                                        </layui-item>
                                    
                                        <layui-item>
                                            <!-- <layui-inline-input
                                                label="现岗位" 
                                                placeholder="请输入现岗位"
                                                v-model="personnel.job"></layui-inline-input> -->
                                            <layui-inline-select
                                                v-if="false"
                                                label="现岗位"
                                                valKey="jobCode"
                                                labelKey="jobName"
                                                v-model="personnel.job"
                                                :items="personnelJobManages"
                                                :up="true"></layui-inline-select>
                                            <layui-inline-date
                                                v-if="false"
                                                label="现岗位开始时间" 
                                                placeholder="点击选择现岗位开始时间"
                                                v-model="personnel.jobStartTime"
                                                :readonly="false"
                                                name="jobStartTime"
                                                type="date"></layui-inline-date>
                                            <layui-inline-select
                                                label="现行员级别"
                                                v-model="personnel.currentLevelDict"
                                                :items="levels"
                                                :up="true"></layui-inline-select>
                                            <!-- <layui-inline-input
                                                label="现行员级别" 
                                                placeholder="请输入现行员级别"
                                                v-model="personnel.currentLevel"></layui-inline-input> -->
                                            <layui-inline-date
                                                label="现行员级别开始时间" 
                                                placeholder="点击选择现行员级别开始时间"
                                                v-model="personnel.levelStartTime"
                                                :readonly="false"
                                                name="levelStartTime"
                                                type="date"></layui-inline-date>
                                        </layui-item>
                                        <layui-item v-if="false">
                                            
                                            <layui-inline-select
                                                label="兼职岗位"
                                                valKey="jobCode"
                                                labelKey="jobName"
                                                v-model="personnel.partTimeJob"
                                                :items="partTimeJobs"
                                                :up="true"></layui-inline-select>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-radio
                                                name="relativesWorkInFlag"
                                                label="是否有亲属在本行工作"
                                                v-model="personnel.relativesWorkInFlag"
                                                :items="[{
                                                    label: '是',
                                                    value: 'y'
                                                },{
                                                    label: '否',
                                                    value: 'n'
                                                }]"></layui-inline-radio>
                                            <layui-inline-radio
                                                name="punished"
                                                label="是否受过处分"
                                                v-model="personnel.punished"
                                                :items="[{
                                                    label: '是',
                                                    value: 'y'
                                                },{
                                                    label: '否',
                                                    value: 'n'
                                                }]"></layui-inline-radio>
                                            <layui-inline-radio
                                                v-if="personnel.userType == 2"
                                                name="punished"
                                                label="是否有有效的上岗证书"
                                                v-model="personnel.hasJobCertificate"
                                                :items="[{
                                                    label: '是',
                                                    value: 'y'
                                                },{
                                                    label: '否',
                                                    value: 'n'
                                                }]"></layui-inline-radio>
                                            <!-- <layui-inline-input
                                                label="是否有亲属在本行工作" 
                                                placeholder="请输入是否有亲属在本行工作"
                                                v-model="personnel.relativesWorkInFlag"></layui-inline-input>
                                            <layui-inline-input
                                                label="是否受过处分" 
                                                placeholder="请输入是否受过处分"
                                                v-model="personnel.punished"></layui-inline-input> -->
                                        </layui-item>
                                        <layui-item v-if="personnel.userType == 2">
                                            <layui-inline-input
                                                style="padding-right: 44px"
                                                label="研发领域/方向"
                                                placeholder="请输入研发领域/方向"
                                                v-model="personnel.rdFieldDirection"
                                                :block="true"></layui-inline-input>
                                        </layui-item>
                                        <layui-item v-if="personnel.userType == 2 && false">
                                            <layui-inline-textarea
                                                class="p-textarea"
                                                style="padding-right: 44px"
                                                label="过往研发项目经验"
                                                placeholder="请输入过往研发项目经验"
                                                v-model="personnel.projectExperience"></layui-inline-textarea>
                                        </layui-item>
                                        <layui-item>
                                            <layui-inline-textarea
                                                class="p-textarea"
                                                style="padding-right: 44px"
                                                label="备注"
                                                placeholder="请输入备注"
                                                v-model="personnel.remark"></layui-inline-textarea>
                                        </layui-item>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <layui-inline v-show="false" v-if="personnel.userType" class="btn-group-center">
                            <button ref="savePersonnel" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnel"><i class="fa fa-save"></i> 保存</button>
                            <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                        </layui-inline>
                    </div> 
                </layui-form>
            </div>
        </div>
        <div class="layui-footer" :style="{width: w + 'px'}">
            <button @click="toClick('savePersonnel')" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-save"></i> 保存</button>
            <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
        </div> 
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { getSysAreas } from '@/api/sys/sysArea'
import { saveOrUpdate, get } from '@/api/personnel/personnel'
import { getPersonnelJobManages } from '@/api/personnel/personnelJobManage'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'
import UserSelectList from '@/components/UserSelectList'
import { getPersonnelCenterConfigs } from '@/api/personnel/personnelCenterConfig'

export default {
    name: 'PersonnelForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
			genderDicts: [],
			politicalDicts: [],
			nationDicts: [],
			highestEducationDicts: [],
			highestDegreeDicts: [],
            entryTypeDicts: [],
            idTypes: [],
            centers: [],
            wedlockDicts: [],
            languageLevels: [],
            personnel: {
                id: this.personnelId || this.$route.params.personnelId,
				name: '',
				userUid: '',
				employeeId: '',
				userType: this.$route.params.userType,
				photo: '',
                center: '',
                partTimeCenter: '',
				gender: '',
				genderDict: '',
				birthday: '',
				age: '',
				political: '',
				politicalDict: '',
				joinPartyTime: '',
				nation: '',
				nationDict: '',
				maritalStatus: '',
				birthplace: '',
				birthplaceProvince: '',
				birthplaceCity: '',
				accountLocation: '',
				accountLocationProvince: '',
				accountLocationCity: '',
				idCardNumber: '',
				highestEducation: '',
				highestEducationDict: '',
				highestDegree: '',
				highestDegreeDict: '',
				graduatedSchool: '',
				graduationTime: '',
				major: '',
				foreignLanguageLevel: '',
				professionalTechnicalTitle: '',
				participationWorkTime: '',
				workingYear: '',
				entryHxTime: '',
				entryHxYear: '',
				entryType: '',
				entryTypeDict: '',
				originalUnit: '',
				job: '',
				jobStartTime: '',
                currentLevel: '',
                currentLevelDict: '',
                levelStartTime: '',
                areaCode: '',
				telephoneNumber: '',
				mobilePhone: '',
				email: '',
                homeAddress: '',
                homeAddressProvince: '',
                homeAddressCity: '',
                homeAddressArea: '',
                relativesWorkInFlag: '',
                emergencyContactUser: '',
				emergencyContactWay: '',
            },
            height: '100%',
            personnelJobManages: [],
            officeName: '',
            centerConfig: {},
            userMap: {},
            partTimeJobs: [],
            levels: [],
            areas: [],
            birthplaceCitys: [],
            accountLocationCitys: [],
            homeAddressCitys: [],
            homeAddressAreas: [],
            refresh: true,
            technicalExpertiseCategorys: [],
            technicalExpertises: [],
            checkedTeMap: {},
            w: 0,
            officeNameMap: {},
            departmentName: '',
            jobs: [],
            checkedJobs: [],
        }
    },
    computed: {
       	centerMap: function () {
            return this.centers.array2Obj('centerCode', 'centerName');
        }   
	},
	watch: {
        'personnel.userUid': function () {
            if (this.personnel.userUid) {
                getPersonnelJobManages({
                    userUid: this.personnel.userUid
                }).then(res => {
                    var data = res.data;
                    if (data) {
                        this.personnelJobManages = Object.assign([], data.personnelJobManages || []);
                        this.officeName = data.office ? data.office.orgName : '';
                        this.centerConfig = Object.assign({}, data.centerConfig || {});
                    }
                });                       
            } else {
                this.personnelJobManages = Object.assign([], []);
                this.officeName = '';
                this.centerConfig = Object.assign({}, {});
            }
        },
        'personnel.partTimeCenter': function() {
            if (this.personnel.partTimeCenter) {
                getPersonnelJobManages({
                    centerCode: this.personnel.partTimeCenter,
                    notInOffice: true
                }).then(res => {
                    var data = res.data;
                    this.partTimeJobs = data.personnelJobManages || [];
                });
            }
        },
        'personnel.birthplaceProvince': function() {
            console.log('personnel.birthplaceProvince');
            this.$set(this.personnel, 'birthplaceCity', '');
            this.setCitys('birthplaceProvince');
        },
        'personnel.accountLocationProvince': function() {
            console.log('personnel.accountLocationProvince');
            this.$set(this.personnel, 'accountLocationCity', '');
            this.setCitys('accountLocationProvince');
        },
        'personnel.homeAddressProvince': function() {
            this.$set(this.personnel, 'homeAddressCity', '');
            this.setCitys('homeAddressProvince');
        },
        'personnel.homeAddressCity': function() {
            this.$set(this.personnel, 'homeAddressArea', '');
            var index = this.homeAddressCitys.indexOf(this.personnel.homeAddressCity, 'code');
            if (index != -1) {
                this.setCitys('homeAddressCity', this.homeAddressCitys[index].id, 'Areas');
            }
        },
        officeName: function(old, value) {
            
            if (this.personnel.userType != 2) {
                return;
            }
            if (old != value && value) {
                this.checkedJobs = [];
            }
            if (this.officeName) {
                getPersonnelJobManages({
                    jobManageType: 'fh',
                    officeName: this.officeName == "信息技术部" ? "信息科技部" : (this.officeName == "综合管理部" ? '运营管理部' : this.officeName),
                }).then(res => {
                    var data = res.data;
                    this.jobs = data.personnelJobManages || [];
                });
            } else {
                this.jobs = [];
            }
        }
    },
    mounted () {
        if (this.personnel.id == '') {
            this.personnel.id = null;
        }
        this.initData();
		this.$nextTick(() => {
            // this.height = this.$refs.box.offsetHeight + 'px';
            this.w = this.$refs.box.offsetWidth;
			this.layuiInit();
		});
    },
    methods: {
        getTeItems: function(value) {
            return this.technicalExpertises.filter(te => {
                return te.value.startsWith(value + '_')
            });
        },
        setCitys: function(propertyName, pId, suff, func) {
            suff = suff || 'Citys';
            var index = -1;
            if (!pId) {
                index = this.areas.indexOf(this.personnel[propertyName], 'code');
                propertyName = propertyName.replace('Province', '');
                propertyName = propertyName.replace('City', '');
                if (index == -1) {
                    this[propertyName + suff] = [];
                    return;
                }
            } else {
                propertyName = propertyName.replace('Province', '');
                propertyName = propertyName.replace('City', '');
            }
            
            var parentId = pId || this.areas[index].id;
            getSysAreas({
                parentId
            }).then(res => {
                Object.assign(this[propertyName + suff], res.data.sysAreas || []);
                this.refresh = false;
                this.$nextTick(() => {
                    this.refresh = true;
                });
                if (func) {
                    func();
                }
            });
        },
        selectMember: function(){

			this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						isMultiUser: false
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "人员选择"
            });
        },
        getSelectUser: function(user, office) {
            this.userMap[user.userId] = user.userName;
            // this.$set(this.personnel, 'userId', user.userId);
            this.$set(this.personnel, 'name', user.userName);
            this.$set(this.personnel, 'userUid', user.userUid);
            this.$layer.closeAll();
        },
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnel), JSON.stringify(this.checkedJobs), JSON.stringify(this.checkedTeMap), token).then(result => {
	                alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.$parent.closeTabByName('PersonnelForm');
                        this.$parent.closeTabByName('PersonnelProfile');
                        this.$parent.clickMenu({
                            "checked": false,
                            "icon": "fa-legal",
                            "id": "personnel",
                            "name": "PersonnelProfile",
                            "parentId": "4",
                            "text": "信息档案",
                            "children": [

                            ]
                        }, 3, {
                            id: result.data,
                            userType: this.personnel.userType
                        });
                        // this.backListView(this.personnel.id == null);
                    }  
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnel.id){
                get(this.personnel.id).then(result => {
                    var data = result.data;
                    if(data) {
                        var personnel = data.personnel || this.personnel;
                        this.personnel =  Object.assign({}, personnel);
                        ///
                        var birthplaceCity = personnel.birthplaceCity;
                        var accountLocationCity = personnel.accountLocationCity;
                        var homeAddressCity = personnel.homeAddressCity;
                        var homeAddressArea = personnel.homeAddressArea;

                        this.personnel.birthday = formatDate(this.personnel.birthday, 'YYYY-MM-DD');
                        this.personnel.graduationTime = formatDate(this.personnel.graduationTime, 'YYYY-MM-DD');
                        this.personnel.joinPartyTime = formatDate(this.personnel.joinPartyTime, 'YYYY-MM-DD');
                        this.personnel.participationWorkTime = formatDate(this.personnel.participationWorkTime, 'YYYY-MM-DD');
                        this.personnel.jobStartTime = formatDate(this.personnel.jobStartTime, 'YYYY-MM-DD');
                        this.personnel.levelStartTime = formatDate(this.personnel.levelStartTime, 'YYYY-MM-DD');
                        this.personnel.entryHxTime = formatDate(this.personnel.entryHxTime, 'YYYY-MM-DD');   
                        this.personnel.contractExpirationTime = formatDate(this.personnel.contractExpirationTime, 'YYYY-MM-DD');
                        this.officeNameMap = data.officeNameMap || {};
                        this.departmentName = this.officeNameMap[personnel.departmentId] ? this.officeNameMap[personnel.departmentId].orgName : '';
                        var technicalExpertiseMap = data.technicalExpertiseMap || {};
                        var technicalExpertises = technicalExpertiseMap[personnel.id] || [];
                        technicalExpertises.forEach(item => {
                            var checkedVals = this.checkedTeMap[item.categoryDict] || [];
                            checkedVals.push(item.technicalExpertiseDict);
                            this.checkedTeMap[item.categoryDict] = checkedVals;
                        });
                        var jobInfoMap = data.jobInfoMap || {};
                        var jobInfos = jobInfoMap[personnel.id] || [];
                        jobInfos.forEach(item => {
                            this.checkedJobs.push(item.jobCode);
                        });
                        getSysAreas({
                            parentId: 1
                        }).then(res => {
                            this.areas = res.data.sysAreas || [];
                            if(this.personnel.birthplaceProvince) {
                                this.$set(this.personnel, 'birthplaceCity', birthplaceCity);
                                var index = this.areas.indexOf(this.personnel.birthplaceProvince, 'code');
                                if (index != -1) {
                                    this.setCitys('birthplaceProvince', this.areas[index].id);
                                }
                            }

                            if(this.personnel.accountLocationProvince) {
                                this.$set(this.personnel, 'accountLocationCity', accountLocationCity);
                                var index = this.areas.indexOf(this.personnel.accountLocationProvince, 'code');
                                if (index != -1) {
                                    this.setCitys('accountLocationProvince', this.areas[index].id);
                                }
                            }

                            if(this.personnel.homeAddressProvince) {
                                this.$set(this.personnel, 'homeAddressCity', homeAddressCity);
                                var index = this.areas.indexOf(this.personnel.homeAddressProvince, 'code');
                                if (index != -1) {
                                    this.setCitys('homeAddressProvince', this.areas[index].id, "Citys", () => {
                                        if(this.personnel.homeAddressCity) {
                                            this.$set(this.personnel, 'homeAddressArea', homeAddressArea);
                                            var index = this.homeAddressCitys.indexOf(this.personnel.homeAddressCity, 'code');
                                            if (index != -1) {
                                                this.setCitys('homeAddressCity', this.homeAddressCitys[index].id, 'Areas');
                                            }
                                        }
                                    });
                                }
                            }

                            
                        });
                    }
                });
            } else {
                getSysAreas({
                    parentId: 1
                }).then(res => {
                    this.areas = res.data.sysAreas || [];
                });
            }
            
        	getDicts('GENDER_DICT,RELIGION_DICT,NATION_DICT,PERSONNEL_EDUCATION_DICT,PERSONNEL_DEGREE_DICT,PERSONNEL_ENTRY_TYPE_DICT,USER_ID_CARD_TYPE,WEDLOCK_DICT,FOREIGN_LANGUAGE_LEVEL_DICT,PERSONNEL_LEVEL_DICT,TECHNICAL_EXPERTISE_CATEGORY,TECHNICAL_EXPERTISE_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.genderDicts = result.data[0] || [];
                    this.politicalDicts = result.data[1] || [];
                    this.nationDicts = result.data[2] || [];
                    this.highestEducationDicts = result.data[3] || [];
                    this.highestDegreeDicts = result.data[4] || [];
                    this.entryTypeDicts = result.data[5] || [];
                    this.idTypes = result.data[6] || [];
                    this.wedlockDicts = result.data[7] || [];
                    this.languageLevels = result.data[8] || [];
                    this.levels = result.data[9] || [];
                    this.technicalExpertiseCategorys = result.data[10] || [];
                    this.technicalExpertises = result.data[11] || [];
                }
            });

            if (this.curUser.department.id == this.curUser.office.id) {
                var officeId = this.curUser.department.id;
                getPersonnelCenterConfigs({
                    officeId
                }).then(res => {
                    var data = res.data;
                    if (data) {
                        this.centers = data.personnelCenterConfigs || [];
                    }
                });
            }
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

				form.on('submit(savePersonnel)', function(data){
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
    .personnel-modal /deep/ .layui-inline {
        margin-bottom: 15px;
    }
    .personnel-modal /deep/ .layui-block {
        margin-bottom: 20px;
    }
    .personnel-modal /deep/ .layui-form-item {
        margin-bottom: 0px;
    }
    .view-product .city /deep/ input {
        width: 180px;
    }
    .view-product .area /deep/ input {
        width: 140px;
    }
    .view-product /deep/ .layui-form-pane .layui-form-label {
        width: 180px;
    }
    .view-product /deep/ .layui-form-pane .layui-input-block {
        margin-left: 180px;
    }
    .view-product /deep/ .layui-form-pane .layui-form-label.comp-textarea {
        width: 100%;
    }
    .view-product /deep/ .layui-form-pane .layui-input-block.comp-textarea {
        margin-left: 0px;
    }
    .layui-footer {
        width: 100%;
        text-align: center;
        position: fixed;
        bottom: 0;
        height: 44px;
        line-height: 44px;
        padding: 0 15px;
        background-color: #eee;
    }
    .view-product /deep/ .layui-form-item.layui-form-text, .view-product /deep/ .layui-form-item.layui-form-text {
        /* padding-right: 0px!important; */
    }
</style>