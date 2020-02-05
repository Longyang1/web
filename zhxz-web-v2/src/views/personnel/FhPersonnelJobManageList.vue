<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>岗位列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                :url="'./personnel/personnelJobManages'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :autoSearch="true"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">部室名称：</span>
                                    <input @click="officeClick" type="text" readonly="readonly" v-model="officeNameMap[otherParam.officeId]" placeholder="点击选择部室">
                                    <span class="title title-text">岗位名称：</span>
                                    <input type="text" v-model="otherParam.jobName" placeholder="请输入岗位名称">
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建岗位</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">岗位名称</th>
												<th style="text-align:center;">部门<field-sort field="OfficeName"/></th>
												<th style="text-align:center;">岗位代码</th>
												<!-- <th style="text-align:center;">状态</th> -->
												<th style="text-align:center;">在编人数</th>
                                                <!-- <th style="text-align:center;">空编人数</th>
                                                <th style="text-align:center;">轮岗期限（年）</th> -->
                                                <th style="text-align:center;">更新时间</th>
                                                <th style="text-align:center;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;">{{ item.jobName }}</td>
													<td style="text-align:center;">{{ item.officeName }}</td>
													<td style="text-align:center;">{{ item.jobCode }}</td>
													<td style="text-align:center;"><span v-if="jobPreparationUseInfo[item.jobCode]" @click="openPersonnelsModal(item.jobName, item.jobCode)" :style="{color: getColor(item), 'font-weight': 'bold'}">{{ jobPreparationUseInfo[item.jobCode] >= 0 ?  jobPreparationUseInfo[item.jobCode] : 0 }}</span></td>
                                                    <!-- <td style="text-align:center;"><span @click="openPersonnelsModal(item.jobName, item.jobCode)" :style="{color: getColor(item), 'font-weight': 'bold'}">{{ getKb(item) }}</span></td>
													<td style="text-align:center;">{{ item.rotationPeriod }}</td> -->
                                                    <td style="text-align:center;">{{ item.updateDate | moment }}</td>
                                                    <td style="text-align:center;">
                                                        <a @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                        <tfoot>
                                        </tfoot>
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
import { del } from '@/api/personnel/personnelJobManage'
import Base from "@/views/base/Base"
import FhPersonnelList from '@/views/personnel/FhPersonnelList'
import OfficeTree from '@/components/OfficeTree'

export default {
	name: 'FhPersonnelJobManageList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                officeId: '',
                forceRotation: '',
                pageSize: 50,
                jobManageType: this.jobManageType,
            },
            refresh: true,
            page: {

            },
            officeNameMap: {},
            centerMap: {},
            jobPreparationUseInfo: {},
        }
    },
    props: {
        jobManageType: {
            type: String,
            default: 'fh'
        }
    },
    computed: {
    	//
        //linkageTypeMap: function() {
        //    return this.dicts[0].array2Obj('value', 'label');
        //}
        //
    },
    mounted () {
        this.initData();
    },
    methods: {
        getKb: function(item) {
            var use = this.jobPreparationUseInfo[item.jobCode];
            if (use) {
                return item.jobPreparation - use;
            }
            return item.jobPreparation;
        },
        openPersonnelsModal: function(jobName, jobCode) {
            if (!jobCode) {
                return;
            }
            this.$layer.iframe({
                content: {
                    content: FhPersonnelList, //传递的组件对象
                    parent: this.$parent,//当前的vue对象
                    data: {
                        jobCode
                    }
                },
                area:[((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8 + "px"), ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: jobName + " 在岗行员明细"
			});
        },
        getColor: function(job) {
            if (!job.jobPreparation) {
                return '#75c467';// '#ff5722';
            }
            return (!this.jobPreparationUseInfo[job.jobCode] || this.jobPreparationUseInfo[job.jobCode] <= Number(job.jobPreparation)) ? '#75c467' : '#ff5722'
        },
        clickNodeAfter: function(node){
            this.otherParam.officeId = node.id;
            this.officeName = node.name;
            this.officeNameMap[node.id] = node.name;
            this.$layer.closeAll();
        },
    	officeClick: function(){
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: [
                       
                    ]
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title:"部室选择"
			});
    	},
        initData: function() {
            
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.personnelJobManages || [];
            this.officeNameMap = Object.assign(this.officeNameMap, data.officeNameMap || {});
            this.centerMap = Object.assign({}, data.centerMap || {});
            this.jobPreparationUseInfo = data.jobPreparationUseInfo || {};
        },
        create: function() {
         	this.$parent.closeTabByName('PersonnelJobManageForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelJobManage",
                "name": "PersonnelJobManageForm",
                "parentId": "4",
                "text": "岗位创建",
                "children": [

                ]
            }, 3, {
                jobManageType: 'fh'
            });
        },
        edit: function(personnelJobManage) {
         	this.$parent.closeTabByName('PersonnelJobManageForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelJobManage",
                "name": "PersonnelJobManageForm",
                "parentId": "4",
                "text": "岗位信息更新",
                "children": [
                    
                ]
            }, 3, {
                id: personnelJobManage.id,
                jobManageType: personnelJobManage.jobManageType,
            });
        },
        del: function(personnelJobManage) {
            confirm('确定删除该记录吗？', () => {
                del(personnelJobManage.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
.title-text {
    width: 88px;
}
.tab-background /deep/ .layui-form-select input {
    height: 26px;
    border-color: #ced2d7;
}
</style>