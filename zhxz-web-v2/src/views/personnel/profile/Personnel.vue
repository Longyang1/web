<template>
    <div>
        <div class="personnel-info">
            <div class="title-box">
                <h5 style="display: inline-block">个人信息</h5>
                <h5 v-if="personnel.userType <= 2" style="float: right;padding-right: 20px;">员工ID: {{ personnel.employeeId }}</h5>
                <h5 v-if="personnel.userType > 2" style="float: right;padding-right: 20px;">人员编号: {{ personnel.employeeId }}</h5>
            </div>
            <div class="main-info">
                <div class="head-box" :style="{height: personnel.photo ? 'auto' : '110px'}">
                    <img v-if="personnel.photo" ref="photoImg" @load="load" alt="" :src="'/api/file/pub/' + personnel.photo" class="img-responsive" style="display: inline-block; vertical-align: middle;"/>
                    <img v-if="canEdit" id="headImgUpload" title="上传一寸简历照片" src="/img/personnel/p_upload.png" :style="'top: ' + headUploadTop + 'px;position: absolute;left: 0px;width: 100%;cursor: pointer;'">
                </div>
                <div class="info">
                    <div v-if="personnel.leaveTime" style="position: absolute;left: 400px;">
                        <img src="/img/personnel/lizhi.png" alt="" srcset="">
                    </div>
                    <h1>{{ personnel.name }}<img v-if="personnel.genderDict" :src="'/img/personnel/' + (personnel.genderDict == 'F' ? 'female' : 'man') + '.png'" style="padding-left: 20px;"/><span v-if="personnel.genderDict" :style="{'padding-left': '6px', 'font-size': '18px', 'color': (personnel.genderDict == 'F' ? '#e12424' : '#4791ec')}">{{ personnel.genderDict == 'F' ? '女' : '男' }}</span></h1>
                    <h4 v-if="personnel.userType <= 2" style="height: 31px">{{ userOffice.orgDescription ? userOffice.orgDescription.substring(5, userOffice.orgDescription.length - 1).replaceAll('/', ' / ') : '' }}</h4>
                    <h4 v-if="personnel.userType > 2" style="height: 31px">****公司</h4>
                    <h4 style="font-size: 14px;padding-bottom: 14px;height: 33px">
                        <span style="padding-right: 30px;">
                            <img src="/img/personnel/phone.png" style="margin-bottom: 2px;"/>
                            {{ personnel.mobilePhone }}
                        </span>
                        <span style="padding-right: 30px;">
                            <img src="/img/personnel/email.png" style="margin-bottom: 2px;"/>
                            {{ personnel.email }}
                        </span>
                        <img v-if="personnel.leaveTime" height="14" src="/img/leave.png" style="margin-bottom: 2px;"/>
                        <span style="color: #ea624c">{{ personnel.leaveTime | moment('YYYY-MM-DD') }}</span>
                    </h4>
                    <div v-if="!editHoppyFlag" class="hobby">
                        <ul>
                            <li 
                                v-for="(hobby, index) in hobbys" 
                                :class="'hobby_' + (parseInt(index % 6) + 1)"
                                :key="'hobby' + index">{{ hobby }}</li>
                        </ul>
                        <i v-if="canEdit" @click="editHoppy" class="fa fa-pencil" aria-hidden="true" style="color: red;cursor: pointer" title="编辑爱好、特长"></i> 
                    </div>
                    <input v-if="editHoppyFlag" @keyup.enter="saveHobby" v-model="hobby" type="text" class="hobby_input" placeholder="爱跳舞、钢琴一级"><span  v-if="editHoppyFlag" class="clickEdit"><i @click="cancelEditHobby" class="fa fa-ban"  aria-hidden="true" style="color: red;cursor: pointer" title="取消操作"></i> 编辑特长之间用"逗号"隔开，回车保存</span>
                </div>
            </div>
        </div>
        <div class="info-detail">
            <div style="margin-bottom: 20px;border-bottom: 1px solid #05afef;">
                <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                    <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                    <p style="padding-right: 10px">基本信息</p>
                    <i class="triangle"></i>
                </div>
                <span v-if="canEdit" @click="edit" class="iconfont icon-xiugai"> 编辑</span>
            </div>
            <div v-if="personnel.userType <= 2">
                <table class="layui-table info-table">
                    <thead>
                        <tr>
                            <th style="width: 35px;background: #c7eefd;vertical-align: middle;" rowspan="11">个人基本信息</th>
                            <th class="title"><span>姓名</span></th>
                            <th class="text"><span>{{ personnel.name }}</span></th>
                            <th class="title"><span>OA账号</span></th>
                            <th class="text"><span>{{ personnel.userUid }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>出生日期</span></th>
                            <th class="text"><span>{{ personnel.birthday | moment('YYYY-MM-DD') }}</span></th>
                            <th class="title"><span>年龄</span></th>
                            <th class="text"><span class="text_age">{{ personnel.age }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>民族</span></th>
                            <th class="text"><span>{{ nationMap[personnel.nationDict] }}</span></th>
                            <th class="title"><span>身份证号码</span></th>
                            <th class="text"><span>{{ personnel.idCardNumber }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>婚姻状况</span></th>
                            <th class="text">{{ wedlockMap[personnel.maritalStatus] }}</th>
                            <th class="title"><span>座机</span></th>
                            <th class="text"><span>{{ personnel.areaCode }}<template v-if="personnel.areaCode">-</template>{{ personnel.telephoneNumber }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>籍贯</span></th>
                            <th class="text"><span>{{ areaMap[personnel.birthplaceProvince] }}{{ areaMap[personnel.birthplaceCity]}}</span></th>
                            <th class="title"><span>户口所在地</span></th>
                            <th class="text"><span>{{ areaMap[personnel.accountLocationProvince] }}{{ areaMap[personnel.accountLocationCity]}}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>政治面貌</span></th>
                            <th class="text"><span>{{ politicalMap[personnel.politicalDict] }}</span></th>
                            <th class="title"><span>入党(团)时间</span></th>
                            <th class="text"><span>{{ personnel.joinPartyTime | moment('YYYY-MM-DD') }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>紧急情况联系人</span></th>
                            <th class="text"><span>{{ personnel.emergencyContactUser }}</span></th>
                            <th class="title"><span>联系方式</span></th>
                            <th class="text"><span>{{ personnel.emergencyContactWay }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>现住址</span></th>
                            <th  class="text" colspan="3"><span>{{ areaMap[personnel.homeAddressProvince] }}{{ areaMap[personnel.homeAddressCity]}}{{ areaMap[personnel.homeAddressArea]}}{{ personnel.homeAddress }}</span></th>
                        </tr>
                    </thead>
                </table>

                <table class="layui-table info-table edu-table">
                    <thead>
                        <tr>
                            <th style="width: 35px;background: #fcdcca;vertical-align: middle;" rowspan="11">教育</th>
                            <th class="title"><span>最高学历</span></th>
                            <th class="text"><span>{{ highestEducationMap[personnel.highestEducationDict] }}</span></th>
                            <th class="title"><span>最高学位</span></th>
                            <th class="text"><span>{{ highestDegreeMap[personnel.highestDegreeDict] }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>外语水平</span></th>
                            <th class="text"><span>{{ languageLevelMap[personnel.foreignLanguageLevelDict] }}</span></th>
                            <th class="title"><span>专业技术职称</span></th>
                            <th class="text"><span>{{ personnel.professionalTechnicalTitle }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>毕业院校</span></th>
                            <th class="text"><span>{{ personnel.graduatedSchool }}</span></th>
                            <th class="title"><span>毕业时间</span></th>
                            <th class="text"><span>{{ personnel.graduationTime | moment('YYYY-MM-DD') }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>所学专业</span></th>
                            <th class="text">{{ personnel.major }}</th>
                            <th class="title"><span></span></th>
                            <th class="text"><span></span></th>
                        </tr>
                    </thead>
                </table>

                <table class="layui-table info-table work-table">
                    <thead>
                        <tr v-if="false">
                            <th style="width: 35px;background: #b8d7fb;vertical-align: middle;" rowspan="11">工作岗位信息</th>
                            <th class="title"><span>原单位</span></th>
                            <th class="text" colspan="3"><span>{{ personnel.originalUnit }}</span></th>
                        </tr>
                        <tr>
                            <th style="width: 35px;background: #b8d7fb;vertical-align: middle;" rowspan="11">工作岗位信息</th>
                            <th class="title"><span>参加工作时间</span></th>
                            <th class="text"><span>{{ personnel.participationWorkTime | moment('YYYY-MM-DD') }}</span></th>
                            <th class="title"><span>工作年限</span></th>
                            <th class="text"><span class="text_year">{{ personnel.workingYear }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>入行时间</span></th>
                            <th class="text"><span>{{ personnel.entryHxTime | moment('YYYY-MM-DD') }}</span></th>
                            <th class="title"><span>入行年限</span></th>
                            <th class="text"><span class="text_year">{{ personnel.entryHxYear }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>{{ personnel.userType != 2 ? '所在中心' : '所属部门' }}</span></th>
                            <th class="text">
                                <template v-if="personnel.userType == 1">
                                    {{ officeCenterMap[personnel.officeId] ? officeCenterMap[personnel.officeId].centerName : partTimeCenterrMap[personnel.partTimeCenter] }}
                                </template>
                                <template v-if="personnel.userType == 2">
                                    {{ officeNameMap[personnel.departmentId] | pv('orgName') }}
                                </template>
                            </th>
                            <th class="title"><span>引进方式</span></th>
                            <th class="text"><span>{{ entryTypeMap[personnel.entryTypeDict] }}</span></th>
                           
                        </tr>
                        <tr>
                            <th :rowspan="!rotationDateMap[personnel.id] ? 2 : 1" class="title"><span>现岗位</span></th>
                            <th :rowspan="!rotationDateMap[personnel.id] ? 2 : 1" class="text">
                                <span v-if="personnel.userType == 1">{{ jobMap[personnel.job] }}</span>
                                <span v-if="personnel.userType == 2">
                                    <template v-for="(item, index) in personnelJobInfos">
                                        {{ item.jobName }}<template v-if="index < (personnelJobInfos.length - 1)">、</template>
                                    </template>
                                </span>
                            </th>
                            <th class="title"><span>现岗位开始时间</span></th>
                            <th class="text"><span>{{ personnel.jobStartTime  | moment('YYYY-MM-DD') }}</span></th>
                        </tr>
                        <tr>
                            <th v-if="rotationDateMap[personnel.id]" class="title"><span>轮岗日期</span></th>
                            <th v-if="rotationDateMap[personnel.id]" class="text"><span class="text_year">{{ rotationDateMap[personnel.id] | moment('YYYY-MM-DD') }}<span v-if="monthMap[personnel.id] <= 3" style="color: #ff5722">（{{ monthMap[personnel.id] }}）</span></span></th>
                            <th class="title"><span>现任岗位时长</span></th>
                            <th class="text"><span class="text_year">{{ personnel.jobYear }}</span></th>
                        </tr>
                        <tr v-if="curUser.department.id == curUser.office.id && personnel.partTimeCenter">
                            <th class="title"><span>兼职中心</span></th>
                            <th class="text">{{ partTimeCenterrMap[personnel.partTimeCenter] }}</th>
                            <th class="title"><span>兼职岗位</span></th>
                            <th class="text"><span>{{ jobMap[personnel.partTimeJob] }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>现行员级别</span></th>
                            <th class="text" :level="personnel.currentLevel">
                                <span title="点击查看历次行员级别变动历史记录" class="l-cursor" @click="showHiLevel(personnel, true)" style="color: rgb(30, 159, 255);">{{ personnel.currentLevelDict }}</span>
                            </th>
                            <th class="title"><span>现级别开始时间</span></th>
                            <th class="text"><span>{{ personnel.levelStartTime | moment('YYYY-MM-DD') }}</span></th>
                        </tr>
                        <tr>
                            <th class="title"><span>是否有亲属在本行工作</span></th>
                            <th class="text">{{ yesNoMap[personnel.relativesWorkInFlag] }}</th>
                            <th class="title"><span>是否受过处分</span></th>
                            <th class="text"><span>{{ yesNoMap[personnel.punished] }}</span></th>
                        </tr>
                        <tr v-if="personnel.userType == 2">
                            <th class="title"><span>是否有有效的上岗证书</span></th>
                            <th class="text">{{ yesNoMap[personnel.hasJobCertificate] }}</th>
                            <th class="title"><span>研发领域/方向</span></th>
                            <th class="text"><span>{{ personnel.rdFieldDirection }}</span></th>
                        </tr>
                        <tr v-if="personnel.userType == 2">
                            <th class="title"><span>技术专长</span></th>
                            <th v-if="false" class="text" colspan="3">{{ personnel.technicalExpertise }}</th>
                            <th class="text" colspan="3">
                                <template v-for="(items, key) of teMap">
                                    <span :key="'category' + key" class="te-category"><i :class="getTeIconClass(key)"></i> {{ technicalExpertiseCategoryMap[key] }}：</span>
                                    <template v-for="(item, index) in items">
                                        {{ technicalExpertiseMap[item] }}<template v-if="index != (items.length - 1)">、</template>
                                    </template>
                                    <br :key="'br' + key">
                                </template>
                            </th>
                        </tr>
                        <!-- <tr v-if="personnel.userType == 2">
                            <th class="title"><span>过往研发项目经验</span></th>
                            <th class="text" colspan="3">{{ personnel.projectExperience }}</th>
                        </tr> -->
                        <tr>
                            <th class="title"><span>备注</span></th>
                            <th class="text" colspan="3">{{ personnel.remark }}</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div style="padding-left: 8px;" class="all_table">

                <div v-if="personnel.userType == 9" class="table_1" style="padding-left: 0;">
                    <table class="layui-table">
                        <colgroup>
                            <col width="200">
                            <col width="200">
                            <col width="200">
                            <col width="200">
                        </colgroup>
                        <tr>
                            <td><span class="title">姓名：</span><span class="text">{{ personnel.name }}</span></td>
                            <td><span class="title">性别：</span><span class="text">{{ personnel.genderDict == 'F' ? '女' : '男' }}</span></td>
                            <td><span class="title">出生日期：</span><span class="text">{{ personnel.birthday | moment('YYYY-MM-DD') }}</span></td>
                            <td><span class="title">民族：</span><span class="text">{{ nationMap[personnel.nationDict] }}</span></td>
                        </tr>
                        <tr>
                            <td><span class="title">证件类型：</span><span class="text">{{ personnel.idCardNumber }}</span></td>
                            <td><span class="title">证件号码：</span><span class="text">{{ personnel.accountLocation }}</span></td>
                            <td><span class="title">所属公司：</span></td>
                            <td><span class="title">劳动合同到期时间：</span><span class="text">{{ personnel.contractExpirationTime | moment('YYYY-MM-DD') }}</span></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import * as personnelApi from '@/api/personnel/personnel'
import PersonnelForm from './PersonnelForm'
import { getDicts } from '@/api/dict'
import { getPersonnelJobManages } from '@/api/personnel/personnelJobManage'
import Base from "@/views/base/Base"
import { getToken } from '@/utils/auth'
import HiLevelList from "@/views/personnel/HiLevelList"
import * as personnelJobInfoApi from '@/api/personnel/personnelJobInfo'

export default {
    name: 'Personnel',
    mixins: [personnelProfileMixin],
    extends: Base,
    data () {
        return {
            genderDicts: [],
			politicalDicts: [],
			nationDicts: [],
			highestEducationDicts: [],
			highestDegreeDicts: [],
            entryTypeDicts: [],
            wedlocks: [],
            languageLevels: [],
            personnel: {
                userUid: ''
            },
            personnelJobManages: [],
            userOffice: {},
            centerConfig: {},
            partTimeCenter: {},
            partTimeJob: {},
            hobbys: [],
            editHoppyFlag: false,
            hobby: '',
            yesNoMap: {
                y: '是',
                n: '否'
            },
            partTimeCenterrMap: {},
            jobMap: {},
            headUploadTop: 0,
            areaMap: {},
            officeCenterMap: {},
            rotationDateMap: {},
            monthMap: {},
            personnelJobInfos: [],
            officeNameMap: {},
            technicalExpertiseCategorys: [],
            technicalExpertises: [],
            teMap: {},
        }
    },
    watch: {
        'personnel.userUid': function () {
            if (this.personnel.userType != 1) {
                return;
            }
            if (this.personnel.userUid) {
                getPersonnelJobManages({
                    userUid: this.personnel.userUid
                }).then(res => {
                    var data = res.data;
                    if (data) {
                        this.personnelJobManages = Object.assign([], data.personnelJobManages || []);
                        // this.userOffice = Object.assign({},  data.office || {});
                        this.centerConfig = Object.assign({}, data.centerConfig || {});
                    }
                });                       
            } else {
                this.personnelJobManages = Object.assign([], []);
                // this.userOffice = Object.assign({}, {});
                this.centerConfig = Object.assign({}, {});
            }
        },
        'personnel.hobby': function() {
            this.hobbys = Object.assign([], this.personnel.hobby.split('，'))
        },
    },
    computed: {
        highestEducationMap: function(){
    		return this.highestEducationDicts.array2Obj('value', 'label');
        },
        highestDegreeMap: function(){
    		return this.highestDegreeDicts.array2Obj('value', 'label');
        },
        entryTypeMap: function() {
            return this.entryTypeDicts.array2Obj('value', 'label');
        },
        nationMap: function() {
            return this.nationDicts.array2Obj('value', 'label');
        },
        politicalMap: function() {
            return this.politicalDicts.array2Obj('value', 'label');
        },
        wedlockMap: function() {
            return this.wedlocks.array2Obj('value', 'label');  
        },
        personnelJobManageMap: function() {
            return this.personnelJobManages.array2Obj('jobCode', 'jobName');  
        },
        languageLevelMap: function() {
            return this.languageLevels.array2Obj('value', 'label');  
        },
        technicalExpertiseCategoryMap: function() {
            return this.technicalExpertiseCategorys.array2Obj('value', 'label');
        },
        technicalExpertiseMap: function() {
            return this.technicalExpertises.array2Obj('value', 'label');  
        },
	},
    mounted () {
        this.initData();

        if (this.canEdit) {
            this.$nextTick(() => {
                this.layuiInit();
            });
        }
    },
    methods: {
        getTeIconClass(category) {
            let iconName = "icon-qitajishufuwu";
            if (category == 1) {
                iconName = 'icon-caozuoxitong';
            } else if (category == 2) {
                iconName = 'icon-kaifayuyan';
            } else if (category == 3) {
                iconName = 'icon-rwc_icon_db1';
            } else if (category == 4) {
                iconName = 'icon-zhongjianjian';
            }
            return 'iconfont ' + iconName;
        },
        showHiLevel: function(item) {
            this.$layer.iframe({
                content: {
                    content: HiLevelList, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: item.id
                    }
                },
                area:['730px', 'auto'],
                title: (item.name + " 历次行员级别变动历史记录")
			});
        },
        cancelEditHobby: function() {
            confirm('确定取消操作吗？', () => {
                this.editHoppyFlag = false;
            });
        },
        saveHobby: function() {
            var hobby = this.hobby;
            if (hobby.endsWith(",")) {
                hobby = hobby.substring(0, hobby.length -1);
            }
            personnelApi.saveHobby(this.personnel.id, hobby).then(res => {
                this.$set(this.personnel, 'hobby', hobby);
                this.editHoppyFlag = false;
                alert(res.msg);
            });
        },
        editHoppy: function() {
            this.hobby = this.personnel.hobby;
            this.editHoppyFlag = true;
        },
        load: function() {
            var photoImg = this.$refs.photoImg;
            if (photoImg) {
                var h = photoImg.offsetHeight;
                var ch = h - 110;
                this.headUploadTop = ch > 0 ? ch / 2 : 0;
            }
        },
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelTotalCount();
                personnelApi.get(this.personnelId).then(res => {
                    var data = res.data;
                    this.personnel = Object.assign({}, data.personnel || {});
                    this.partTimeCenterrMap = Object.assign({}, data.partTimeCenterrMap || {});
                    this.jobMap = Object.assign({}, data.jobMap || {});
                    Object.assign(this.areaMap, data.areaMap || {});
                    var officeNameMap = data.officeNameMap || {};
                    this.officeNameMap = officeNameMap;
                    this.userOffice = officeNameMap[this.personnel.officeId] || {};
                    this.officeCenterMap = data.officeCenterMap || {};
                    this.rotationDateMap = data.rotationDateMap || {};
                    this.monthMap = data.monthMap || {};
                    var technicalExpertiseMap = data.technicalExpertiseMap || {};
                    var technicalExpertises = technicalExpertiseMap[this.personnel.id] || [];
                    this.teMap = {};
                    technicalExpertises.forEach(item => {
                        var technicalExpertiseDicts = this.teMap[item.categoryDict] || [];
                        technicalExpertiseDicts.push(item.technicalExpertiseDict);
                        this.teMap[item.categoryDict] = technicalExpertiseDicts;
                    });
                });

                personnelJobInfoApi.getPersonnelJobInfos({
                    personnelId: this.personnelId
                }).then(res => {
                    var data = res.data || {};
                    this.personnelJobInfos = data.personnelJobInfos || [];
                });
            }

            getDicts('GENDER_DICT,RELIGION_DICT,NATION_DICT,PERSONNEL_EDUCATION_DICT,PERSONNEL_DEGREE_DICT,PERSONNEL_ENTRY_TYPE_DICT,WEDLOCK_DICT,FOREIGN_LANGUAGE_LEVEL_DICT,TECHNICAL_EXPERTISE_CATEGORY,TECHNICAL_EXPERTISE_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.genderDicts = result.data[0] || [];
                    this.politicalDicts = result.data[1] || [];
                    this.nationDicts = result.data[2] || [];
                    this.highestEducationDicts = result.data[3] || [];
                    this.highestDegreeDicts = result.data[4] || [];
                    this.entryTypeDicts = result.data[5] || [];
                    this.wedlocks = result.data[6] || [];
                    this.languageLevels = result.data[7] || [];
                    this.technicalExpertiseCategorys = result.data[8] || [];
                    this.technicalExpertises = result.data[9] || [];
                }
            });
        },
        edit: function () {
            this.$layer.iframe({
                content: {
                    content: PersonnelForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId
                    }
                },
                area:['890px', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: "个人基本信息修改"
			});
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['upload'], function(){
        		var upload = layui.upload;

				//普通图片上传
				var uploadInst = upload.render({
					elem: '#headImgUpload',
					url: './api/file/upload/img?module=personnel',
					headers: {
                        Authorization: ('Bearer ' + getToken())
                    },
					before: function(obj){
						// obj.preview(function(index, file, result){
					    //    $('#meetingImg').attr('src', result); //图片链接（base64）
					    // });
					},
					done: function(res){
						//如果上传失败
						if (res.status != 200) {
					        return msg(res.msg);
					    }
					    //上传成功
                        layer.msg('上传成功')
                        _this.$set(_this.personnel, 'photo', res.data);
                        personnelApi.updatePhoto(_this.personnel.id, res.data);
					},
					error: function(){
						
				    }
				});
            });
        }

    }
}
</script>

<style scoped>
.box {
    border: 1px solid #e4e7f0;
}
.main-info {
    display: flex;
    border-bottom: 1px solid #e4e7f0;
    margin-top: 10px;
    background: #fafafa;
    min-height: 183px;
}
.jbxi {
   padding: 15px;
   padding-top: 0;
}
.main-info > div {
    display: inline-block;
    /* height: 180px; */
}
.img-responsive {
    display: inline-block;
    height: auto;
    max-width: 100%;
}
.title-box {
    height: 50px;
    background: #FAFAFA;
    border-bottom: 1px solid #e4e7f0;
} 
.title-box h5 {
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    /* border-bottom: 1px solid #e4e7f0; */
    color: #000000;
}
.head-box {
    text-align: center;
    height: 110px;
    width: 110px;
    border-radius: 65px;margin: auto;
    margin-left: 42px;
    line-height: 110px;
    border: 1px solid #e1e7ec;
    vertical-align: middle;
    background: #f1f4f7;
    position: relative;
    cursor: pointer;
}
.head-box #headImgUpload {
    display: none;
    cursor: pointer;
}
.head-box:hover #headImgUpload {
    display: block;
}
.info {
    height: 100%;
    position: relative;
    width: 100%;
    margin-left: 26px;
    flex: 1;
    padding-top: 30px;
}
.info > h1 {
    padding-bottom: 16px;
    height: 56px;
}
.info > h4 {
    padding-bottom: 12px;
    font-size: 14px;
    color: #333333;
}
.info-detail {
    margin-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
}
.info-detail > div > p {
    padding-left: 5px; 
    /* border-left: 2px solid #05afef; */
    font-size: 16px;
    color: #333333;
    display: inline-block;
    background:#05afef;
    color: #fff;
}
.info-detail > div > div > p {
    padding-left: 5px; 
    /* border-left: 2px solid #05afef; */
    font-size: 16px;
    color: #333333;
    display: inline-block;
    background:#05afef;
    color: #fff;
    padding-left: 6px;
}
.info-detail > div > span {
    float: right;
    /* line-height: 25px; */
    cursor:pointer;
    color: #05afef;
    font-size: 14px;
}
.info-detail > div > div {
    padding-bottom: 20px;
}
.info-detail > div > div > .title {
    padding-right: 16px
}
.info-detail > div > div > .text {
    padding-right: 50px
}
p {
    line-height: normal;
}
/* table样式 */
.personnel-info {
    /* font-style:  */
}
.table_1,.table_2,.table_3 {
    position: relative;
    /* padding-left: 33px; */
    padding-bottom: 0px !important
}
.table_1 .person_msg_left {
    width: 33px;
    height: 137px;
    background-color: #e6f1f8;
    padding: 20px 11px;
}
.table_2 .person_education_left {
    width: 33px;
    height: 69px;
    background-color: #e5f9f6;
    padding: 17px 11px;
}
.table_3 .person_position_left {
    width: 33px;
    height: 103px;
    background-color: #faf6e9;
    padding: 2px 11px;
}
.person_msg_left,.person_education_left,.person_position_left {
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid #e6e6e6;
    border-right: none;
    color: #333;
}
/* 爱好 */
.hobby .hobby_1 {
    background-color: #d3c4e8;
}
.hobby .hobby_2 {
    background-color: #ceebd0;
}
.hobby .hobby_3 {
    background-color: #ced5eb;
}
.hobby .hobby_4 {
    background-color: #e8e0c4;
}
.hobby .hobby_5 {
    background-color: #f4d8d8;
}
.hobby .hobby_6 {
    background-color: #e8d4c4;
}
.hobby ul li {
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    float: left;
    border-radius: 2px;
    margin-right: 10px;
    margin-bottom: 15px;
    color:#503939;
}
.hobby_input {
    width: 450px;
    height: 24px;
    border: 1px solid #cbd2d9;
    padding-left: 5px;
    margin-bottom: 15px;
}
.clickEdit {
    font-size: 12px;
    color: #999999;
    padding-left: 10px;
}
.text_age,.text_year {
    color: #1e44d3
}
/* 覆盖layui样式 */
.layui-table td, .layui-table th {
    padding: 7px 10px;
    line-height: 19px;
}
table > tr > td {
    width: 25%;
}

.info-table th {
    border: 1px solid #c5dbf4;
    background: #ffffff;
}
.layui-table td, .layui-table th {
    position: static;
}
th.title, th.text {
    font-size: 14px;
    color: #333333;
    vertical-align: middle;
}
th.title {
    padding-right: 20px;
    text-align: right;
    width: 196px;
    background: #e5f5fb;
    width: 20%;
}
th.text {
    padding-left: 20px;
    width: 30%;
    word-break: break-all;
}
.edu-table th {
    border: 1px solid #f7d5c2;
}
.edu-table th.title {
    background: #fceadf;
}
.work-table th {
    border-color: #c5dbf4;
}
.work-table th.title {
    background: #dfedfc;
}
.te-category {
    color: #5fb878;
}
</style>

