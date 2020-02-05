<template>
    <div class="tab-background float-e-margins">
        <div v-if="!layerid" class="tab-header">
			<p>{{ title }}</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center" :style="{'margin-top': layerid ? '20px' : ''}">
                            <button ref="importPersonnelBtn" class="hidden" id="importPersonnelBtn"></button>
                            <button ref="importHxWorkBtn" class="hidden" id="importHxWorkBtn"></button>
                            <pagination
                                :url="'./personnel/personnels'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :btnCenter="false"
                                :autoSearch="true"
                                :notShowBtn="!!layerid"
                                ref="pagination">
                                <template v-if="!layerid" slot="searchBtnBefore">
                                    <span class="title title-text">姓名：</span>
                                    <input type="text" v-model="otherParam.name" placeholder="请输入姓名">
                                </template>
                                <template v-if="!layerid" slot="opera">
                                    <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;新增</button>
                                    <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="importPersonnel" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-cloud-upload" aria-hidden="true"></i>&nbsp;&nbsp;导入</button>
                                    <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="importPersonnel('list')" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-cloud-upload" aria-hidden="true"></i>&nbsp;&nbsp;批量导入</button>
                                    <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="exportPersonnel(false, 1)" class="layui-btn layui-btn-icon layui-btn-primary"><i class="iconfont icon-download" aria-hidden="true"></i>&nbsp;&nbsp;导出员工基本信息统计表</button>
                                    <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="exportPersonnel(true, 1)" class="layui-btn layui-btn-icon layui-btn-primary"><i class="iconfont icon-download" aria-hidden="true"></i>&nbsp;&nbsp;导出部门全体员工信息汇总表</button>
                                    <!-- <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="adjustmentLevel()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-level-up" aria-hidden="true"></i>&nbsp;&nbsp;行员级别调整</button> -->
                                    <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="adjustmentJob()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-briefcase" aria-hidden="true"></i>&nbsp;&nbsp;岗位调整</button>
                                    <!-- <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="importAssessment()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-briefcase" aria-hidden="true"></i>&nbsp;&nbsp;考核导入</button> -->
                                    <!-- <button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" @click="importHxWork()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-briefcase" aria-hidden="true"></i>&nbsp;&nbsp;行内档案履历导入</button> -->
                                    <file-download-modal-button v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" text="模板下载" :data="templateFileData"></file-download-modal-button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th v-if="!layerid" v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" width="5%" style="text-align:center;">
                                                    <layui-simple-checkbox 
                                                        @clickCheckboxAfter="checkAll"
                                                        :defautValue="2"
                                                        v-model="checkType"
                                                        :val="1"/>
                                                </th>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">姓名<field-sort @orderBefore="orderBefore" field="Name"></field-sort></th>
                                                <!-- <th style="text-align:center;width: 130px;">所属中心<field-sort @orderBefore="orderBefore" orderFieldName="customOrderField" field="Center"></field-sort></th> -->
                                                <th style="text-align:center;width: 130px;">所属部门<field-sort @orderBefore="orderBefore" orderFieldName="customOrderField" field="Office"></field-sort></th>
                                                <th style="text-align:center;width: 130px;">岗位<field-sort @orderBefore="orderBefore" orderFieldName="customOrderField" field="Job"></field-sort></th>
												<!-- <th style="text-align:center;">级别<field-sort @orderBefore="orderBefore" field="CurrentLevelDict"></field-sort></th> -->
                                                <th style="text-align:center;">性别<field-sort @orderBefore="orderBefore" field="GenderDict"></field-sort></th>
												<th style="text-align:center;">年龄<field-sort @orderBefore="orderBefore" field="Birthday"></field-sort></th>
												<th style="text-align:center;width: 90px;">入职年限<field-sort @orderBefore="orderBefore" field="EntryHxTime"></field-sort></th>
												<th style="text-align:center;width: 160px;">毕业院校<field-sort @orderBefore="orderBefore" field="GraduatedSchool"></field-sort></th>
                                                <th style="text-align:center;width: 138px;">最高学历</th>
                                                <th v-if="!layerid" style="text-align:center;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id + '_' + index">
                                                    <td v-if="!layerid" v-authorize="'ROLE_PERSONNEL.ADMIN.USER.ROLE'" style="text-align:center;">
                                                        <layui-simple-checkbox
                                                            :checkedVals="checkedKeys"
                                                            @clickCheckboxAfter="check"
                                                            :val="item.id"/>
                                                    </td>
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;" :title="item.name"><span class="l-cursor" @click="edit(item, true)" style="color: rgb(30, 159, 255);">{{ item.name }}</span></td>
													<!-- <td style="text-align:center;">{{ officeCenterMap[item.officeId] ? officeCenterMap[item.officeId]['centerName'] : partCenterMap[item.partTimeCenter] }}</td> -->
                                                    <td style="text-align:center;">{{ officeNameMap[item.officeId] ? officeNameMap[item.officeId].orgInitials : '' }}</td>
                                                    <td style="text-align:center;">{{ jobNameMap[item.job] }}</td>
                                                    <!-- <td style="text-align:center;"><span title="点击查看历次行员级别变动历史记录" class="l-cursor" @click="showHiLevel(item, true)" style="color: rgb(30, 159, 255);">{{ item.currentLevelDict }}</span></!-->
                                                    <td style="text-align:center;"><span :class="'gender_' + item.genderDict">{{ genderMap[item.genderDict] }}</span></td>
													<td style="text-align:center;color: #1e44d3;">{{ item.age }}</td>
													<td style="text-align:center;color: #1e44d3;">{{ item.entryHxYear }}</td>
                                                    <td style="text-align:center;" :title="item.graduatedSchool">{{ item.graduatedSchool }}</td>
                                                    <td style="text-align:center;">{{ educationMap[item.highestEducationDict] }}</td>
                                                    <td v-if="!layerid" style="text-align:center;">
                                                        <a v-if="item.userUid == curUser.username" @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a v-if="item.userUid != curUser.username" @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-calendar" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</a>
                                                        <!-- <a @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a> -->
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </template>
                            </pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict';
import { del, exportPersonInfo, getOfficesByCenterCode } from '@/api/personnel/personnel'
import { getPersonnelCenterConfigs } from '@/api/personnel/personnelCenterConfig'
import { getPersonnelJobManages } from '@/api/personnel/personnelJobManage'
import { getPersonnelCenterOrgs } from '@/api/personnel/personnelCenterOrg'
import Base from "@/views/base/Base"
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/api/file'
import PersonnelLevelAdjustment from "@/views/personnel/PersonnelLevelAdjustment"
import PersonnelJobAdjustment from "@/views/personnel/PersonnelJobAdjustment"
import AssessmentExcelUpload from "@/views/personnel/AssessmentExcelUpload"
import HiLevelList from "@/views/personnel/HiLevelList"

export default {
	name: 'PersonnelList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [[],[]],
            paramNames: [],
            otherParam: {
                name: '',
                userType: this.userType,
                employeeId: '',
                // mobilePhone: '',
                // genderDict: '',
                center: '',
                // birthday: null,
                job: this.jobCode,
                officeId: '',
                // userUid: '',
                // currentLevelDict: '',
                pageSize: 50
            },
            refresh: true,
            page: {
                list: [],
            },
            importPersonnelType: '',
            parent: null,
            userCenterMap: {},
            personnelCenterConfigs: [],
            offices: [],
            jobs: [],
            centerConfigOrg: true,
            userOfficeMap: {},
            genderMap: {},
            educationMap: {},
            jobNameMap: {},
            officeNameMap: {},
            officeCenterMap: {},
            partTimeCenters: [],
            templateFileData: [{
                text: '导入模板',
                name: 'personnelImport.xls',
            }, {
                text: '批量导入模板',
                name: 'batchPersonnelImport.xls',
            }, {
                text: '年度考核模板',
                name: 'yearKh.xls',
            }, {
                text: '行内档案履历模板',
                name: 'hxWork.xls',
            }, ]
        }
    },
    props: {
        title: {
            type: String,
            default: '行员信息管理'
        },
        userType: {
            type: String,
            default: '1'
        },
        jobCode: {
            type: String,
            default: ''
        },
        layerid: {
            type: String,
            default: ''
        }
    },
    computed: {
        partCenterMap: function () {
            return this.partTimeCenters.array2Obj('centerCode', 'centerName');
        },
    },
    watch: {
        'otherParam.center': function () {
            this.$set(this.otherParam, 'officeId', null);
            if (!this.otherParam.center) {
                return;
            }
            this.offices = this.centerConfigOrg ? [] : thos.offices;
            getPersonnelCenterOrgs({
                centerCode: this.otherParam.center
            }).then(res => {
                var data = res.data || {};
                var offices = [];
                var officeNameMap = data.officeNameMap || {};
                (data.personnelCenterOrgs || []).forEach(element => {
                    offices.push({
                        id: element.officeId,
                        name: officeNameMap[element.officeId]
                    });
                });
                if (this.centerConfigOrg) {
                    this.offices = Object.assign([], offices);
                }
            });
        },
        'otherParam.officeId': function () {
            this.$set(this.otherParam, 'job', null);
            var officeId = this.otherParam.officeId;
            this.jobs = [];
            if (officeId) {
                getPersonnelJobManages({
                    officeId
                }).then(res => {
                    var data = res.data;
                    this.jobs = data.personnelJobManages || [];
                });
            }
        }
    },
    mounted () {
        this.initData();
        this.$nextTick(() => {
		    this.layuiInit();
		});
    },
    methods: {
        orderBefore: function(order) {
            var orderFieldName = order.orderFieldName;
            order.searchForm[orderFieldName == "orderField" ? "customOrderField" : "orderField"] = '';
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
        resetSearchBefore: function() {
            if(this.centerConfigOrg) {
                this.offices = Object.assign([], []);
            }
        },
        importAssessment: function() {
            this.$layer.iframe({
                content: {
                    content: AssessmentExcelUpload, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        
                    }
                },
                area:['730px', ("260px")],
                title: "年度考核导入"
			});
        },
        importHxWork: function() {
            this.$refs.importHxWorkBtn.click();
        },
        adjustmentJob: function() {
            if (!this.checkedKeys || this.checkedKeys.length <= 0) {
                alert("请先勾选需要调整岗位的行员");
                return false;
            }
            var personnelId = this.checkedKeys[this.checkedKeys.length - 1];
            var index = this.page.list.indexOf(personnelId, 'id');
            if (index != -1) {
                var p = this.page.list[index];
                var userUid = p.userUid;
                if (!userUid) {
                    return;
                }
                var jobCode = p.job;
                var name = p.name;
                this.$layer.iframe({
                    content: {
                        content: PersonnelJobAdjustment, //传递的组件对象
                        parent: this,//当前的vue对象
                        data: {
                            personnelId,
                            userUid,
                            jobCode,
                            name
                        }
                    },
                    area:['522px', '500px'],
                    title: "行员岗位调整"
                });
            }
        },
        adjustmentLevel: function() {
            if (!this.checkedKeys || this.checkedKeys.length <= 0) {
                alert("请先勾选需要调整级别的行员");
                return false;
            }
            var personnelIds = this.checkedKeys;
            this.$layer.iframe({
                content: {
                    content: PersonnelLevelAdjustment, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelIds
                    }
                },
                area:['790px', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: "行员级别调整"
			});
        },
        exportPersonnel: function (exportList, userType) {
            
            var personelId = null;
            if (!exportList) {
                if (!this.checkedKeys || this.checkedKeys.length <= 0) {
                    alert("请先选择需要导出的行员");
                    return false;
                }
                personelId = this.checkedKeys[this.checkedKeys.length - 1];
            }
             //加载层-风格4
            var layId = layer.msg('文件生成中', {
                icon: 16,
                shade: 0.01
            });
            
            exportPersonInfo(personelId, userType, exportList).then(response => {
                layer.close(layId);
                layId = layer.msg('文件导出中', {
                    icon: 16,
                    shade: 0.01
                });

                let blob = new Blob([response.data],{type:"application/vnd.ms-excel"});
                let objectURL =  URL.createObjectURL(blob);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', objectURL);

                a.setAttribute('download', decodeURIComponent(response.fileName));
                a.click();
                URL.revokeObjectURL(objectURL);
                
            });
        },
        downFile: function(){
            exportPersonInfoExcel().then(result => {
                setTimeout(() => {
                    alert('下载成功');
                }, 1000);
                let blob = new Blob([result.data],{type:"application/vnd.ms-excel"});
                let objectURL =  URL.createObjectURL(blob);
                window.location.href = objectURL;   
            });
        },
        importPersonnel: function (type) {
            this.importPersonnelType = type || '';
            this.$refs.importPersonnelBtn.click();
        },
        initData: function() {
            getDicts('GENDER_DICT,PERSONNEL_EDUCATION_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.dicts = data;

                    this.genderMap = this.dicts[0].array2Obj('value', 'label');
                    this.educationMap = this.dicts[1].array2Obj('value', 'label');
                }
            });
            var officeId = this.curUser.office.id;
            var departmentId = this.curUser.department.id;
            var userUid = this.curUser.username;
            getPersonnelCenterConfigs({
                officeId,
                departmentId,
                userUid
            }).then(res => {
                var data = res.data;
                if (data) {
                    this.personnelCenterConfigs = data.personnelCenterConfigs || [];
                } 
                if (this.personnelCenterConfigs.length <= 0) {
                    getPersonnelJobManages({
                        userUid: this.curUser.username
                    }).then(res => {
                        var data = res.data;
                        if (data) {
                            this.jobs = data.personnelJobManages || [];
                            this.personnelCenterConfigs.push(data.centerConfig || {});
                            var office = data.office || {};
                            this.offices.push({
                                id: office.orgId,
                                name: office.orgName
                            });
                            this.centerConfigOrg = false;
                        }
                    });
                }
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.personnels || [];
            this.userCenterMap = data.userCenterMap || {};
            this.userOfficeMap = data.userOfficeMap || {};
            this.jobNameMap = data.jobNameMap || {};
            this.officeNameMap = data.officeNameMap || {};
            this.officeCenterMap = data.officeCenterMap || {};
            this.partTimeCenters = data.partTimeCenters || [];
        },
        create: function() {
         	this.$parent.closeTabByName('PersonnelForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnel",
                "name": "PersonnelForm",
                "parentId": "4",
                "text": "基本信息",
                "children": [

                ]
            }, 3, {
                userType: this.userType
            });
        },
        edit: function(personnel) {
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
                id: personnel.id,
                userType: this.userType,
                canEdit: (personnel.userUid == this.curUser.username || this.curUser.username == 'admin')
            });
        },
        del: function(personnel) {
            confirm('确定删除该记录吗？', () => {
                del(personnel.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        },
        layuiInit: function() {
            var _this = this;
            var layId = null;
        	layui.use(['element', 'upload'], function(){
        		var element = layui.element
                ,upload = layui.upload;

                var uploadListIns = upload.render({
                    elem: '#importPersonnelBtn',
                    url: '/api/personnel/personnels/importPersonnelInfo',
                    accept: 'file',
                    multiple: false,
                    auto: true,
                    exts:'xls|xlsx',
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                    },
                    data: {
                        'userType': '1',
                        'importPersonnelType': () => {
                            return  _this.importPersonnelType;
                        }
                    },
                    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                         //加载层-风格4
                        layId = layer.msg('信息导入中', {
                            icon: 16,
                            shade: 0.01,
                            time: 0
                        });
                    },
                    done: function (res, index, upload) {
                        
                        if (res.status == 200) { //上传成功
                            alert("导入成功");
                            _this.$refs.pagination.refresh(1);
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        } else {
                            alert(res.msg);
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {
                        layer.close(layId);
                    }
                });

                var uploadListIns2 = upload.render({
                    elem: '#importHxWorkBtn',
                    url: '/api/personnel/personnels/importHxWork',
                    accept: 'file',
                    multiple: false,
                    auto: true,
                    exts:'xls|xlsx',
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                    },
                    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                         //加载层-风格4
                        layId = layer.msg('信息导入中', {
                            icon: 16,
                            shade: 0.01,
                            time: 0
                        });
                    },
                    done: function (res, index, upload) {
                        
                        if (res.status == 200) { //上传成功
                            alert("导入成功");
                            _this.$refs.pagination.refresh(1);
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        } else {
                            alert(res.msg);
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {
                        layer.close(layId);
                    }
                });

        	});

        },
    }
}
</script>

<style scoped>
.title-text {
    width: 64px;
}
.tab-background /deep/ .layui-form-select input {
    height: 26px;
    border-color: #ced2d7;
}
.tab-background /deep/ .search-condition-row input{
    width: 138px;
}
.birthday /deep/ input {
    height: 26px;
    width: 138px;
    border-color: #ced2d7;
}
.title .title-text {
    margin-right: 0;
}
.gender_M {
    color: #388eff;
}
.gender_F {
    color: #ff7198;
}
.gender_F:hover, .gender_M:hover {
    cursor: default;
}
</style>
