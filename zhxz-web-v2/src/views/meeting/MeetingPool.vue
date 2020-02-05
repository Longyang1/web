<template>
    <div class="view-product" v-cloak>
		<div class="info-center">
			<div id="usual1" class="usual">
			    <div class="itab" lay-filter="todoTab">
				  	<ul> 
					    <li @click="switchTab(0)"><a href="javascript:;" :class="{'selected': activeTabIndex == 0}">待上会列表</a></li> 
					    <li @click="switchTab(1)"><a href="javascript:;" :class="{'selected': activeTabIndex == 1}">会议信息表</a></li>
				  	</ul>
				  	<span v-if="false" class="itab-total-cont">待上会议题统计：
                        <template v-for="(item, index) in meetingSubjectTypes">
                            {{ item.label }}<em :key="index" class="text-roseo">{{ subjectCountMap[item.value] || 0 }}</em>项{{ (index == meetingSubjectTypes.length - 1) ? '。' : '，' }}
                        </template>
                    </span>
			    </div> 
			    <!-- 待上会议题 -->
			  	<div id="tab1" :class="{'tabson': true, 'hidden': activeTabIndex != 0}">
				    <div class="wrapper wrapper-content animated fadeInRight">
				        <div class="row">
				            <div class="col-sm-6">
				                <div class="ibox">
				                    <div class="ibox-content">
				                        <h3>选择议题</h3>
				                        <p class="small"><i class="fa fa-hand-o-up"></i> 在列表之间拖动选择议题</p>
				                        <ul class="sortable-list connectList agile-list target-1">
				                            <li 
                                                v-for="item in subjects" 
                                                :id="item.id" 
                                                :class="subjectItemClass(item.meetingTypeDict)"
                                                :key="item.id">
				                                {{ meetingSubjectTypeMap[item.meetingSubjectTypeDict] }}——{{ item.subjectName }}
				                                <div class="agile-detail">
				                                	<a href="javascript:void(0);" @click="edit(item)" class="pull-right btn btn-xs btn-white">
				                                		<i class="fa fa-circle-o"></i> 编辑
				                                	</a>
				                                   	牵头部门：{{ officeNameMap[item.officeId] }}
				                                   	<span class="lead_department">上会类型：{{ meetingTypeMap[item.meetingTypeDict] }}</span>
				                                </div>
				                            </li>
				                        </ul>
				                    </div>
				                </div>
				            </div>
				            <div class="col-sm-6">
				                <div class="ibox">
				                    <div class="ibox-content">
				                    	<button type="button" @click="createMeeting" class="btn btn-outline btn-info pull-right addmeeting"><i class="fa fa-paste"></i>&nbsp;&nbsp;创建会议</button> 
				                        <h3>添加议题</h3>
				                        <p class="small"><i class="fa fa-hand-o-up"></i> 在列表之间拖动添加或删除议题</p>
				                        <ul class="sortable-list connectList agile-list target-2">
				                        </ul>
				                    </div>
				                </div>
				            </div>
				        </div>
				    </div>
			    </div> 
			    <!-- 已上会议题 -->
			  	<div id="tab2" :class="{'tabson': true, 'hidden': activeTabIndex != 1}">
				    <div class="wrapper wrapper-content animated fadeInRight">
				        <div class="row">
				            <div class="col-sm-12">
				                <div class="ibox float-e-margins">
				                    <div id="center" class="ibox-content">
                                        <pagination
                                            v-if="refresh"
                                            :url="'./meeting/meetingInfos'"
                                            :titles="titles"
                                            :paramNames="paramNames"
                                            :dicts="dicts"
                                            :otherParam="otherParam"
                                            @handleSearchResult="handleSearchResult"
                                            ref="pagination">
                                            <template slot="searchBtnBefore">
                                                <span class="title title-text">会议名称：</span>
                                                <input type="text" v-model="otherParam.meetingName" placeholder="输入会议关键字">
                                            </template>
                                            <template slot="main">
                                                <table class="footable table table-stripped">
                                                    <thead>
                                                        <tr>
                                                            <th width="5%">序号</th>
                                                            <th width="40%" style="text-align:center;">会议名称</th>
                                                            <th width="15%" style="text-align:center;">会议类型</th>
                                                            <th width="15%" style="text-align:center;">进行状态</th>
                                                            <th width="25%" style="text-align:center;">更新时间</th>
                                                            <th width="20%" style="text-align:center;">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="meetingTbody" class="footable_table">
                                                        <template v-for="(item, index) in page.list">
                                                            <tr 
                                                                :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                                style="display: table-row;"
                                                                :key="item.id">
                                                                <td width="5%" style="text-align:center;">{{ index + 1  }}</td>
                                                                <td width="20%" style="text-align:left;" :title="item.meetingName"><span @click="editMeetingInfo(item, true)" class="l-cursor" style="color: rgb(30, 159, 255);">{{ item.meetingName }}</span></td>
                                                                <td style="text-align:center;">{{ meetingTypeMap[item.meetingTypeDict] }}</td>
                                                                <td style="text-align:center;" width="15%">{{ meetingStatusMap[item.meetingStatusDict] }}</td>
                                                                <td style="text-align:center;" width="25%">{{ item.updateDate | moment }}</td>
                                                                <td v-if="!item.meetingStatusDict" style="text-align:center;" width="20%">
                                                                    <a @click="del(item.id)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                                </td>
                                                                <td v-if="item.meetingStatusDict === '4'" style="text-align:center;" width="20%">
                                                                    <a @click="editMeetingInfo(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                                    <a @click="publish(item.id, true)" class="fabu_a"  style="margin-right:10px"><i class="fa fa-play" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>发布</a>
                                                                    <a @click="del(item.id)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                                </td>
                                                                <td v-if="item.meetingStatusDict === '1'" style="text-align:center;" width="20%">
                                                                    <a @click="editMeetingInfo(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                                    <a @click="publish(item.id, false)" class="chefabu_a"><i class="fa fa-stop" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>撤销发布</a>
                                                                </td>
                                                                <td v-if="item.meetingStatusDict === '2'" style="text-align:center;" width="20%">
                                                                    <a v-if="item.testFlag == 'y'" @click="recovery(item.id)" class="ckricheng_a" style="color: red;margin-right:10px;"><i class="fa fa-repeat" style="font-size: 10px;margin-right:5px;"></i>复原</a>
                                                                    <a @click="editMeetingInfo(item, false)" class="ckricheng_a"><i class="fa fa-calendar" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看会议</a>
                                                                </td>
                                                                <td v-if="item.meetingStatusDict === '3'" style="text-align:center;" width="20%">
                                                                    <a v-if="item.testFlag == 'y'" @click="recovery(item.id)" class="ckricheng_a" style="color: red;margin-right:10px;"><i class="fa fa-repeat" style="font-size: 10px;margin-right:5px;"></i>复原</a>
                                                                    <a @click="editMeetingInfo(item, false)" class="ckricheng_a"><i class="fa fa-calendar" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看会议</a>
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
			</div> 
		</div> 
	</div> 
</template>

<script>
import { getMeetingPoolInitData, publishMeeting, del } from '@/api/meeting/meeting';
import { recovery } from '@/api/meeting/meetingInfo';
//import Pagination from '@/components/Pagination';
import Base from "@/views/base/Base"

export default {
    name: 'MeetingPool',
	extends: Base,
    data () {
        return {
            titles: ['会议状态', '会议类型'],
            dicts: [],
            paramNames: ['meetingStatusDict', 'meetingTypeDict'],
            otherParam: {        
                'meetingName': '',
                orderField: 'UpdateDate',
                orderAsc: false
            },
            meetingStatus: [{"label":"全部", value:"", selected: 1}],
            meetingTypes: [{"label":"全部", value:"", selected: 1}],
            projectOfficeMap: {},
            meetingSubjectTypes: [],
            meetingSubjectTypeMap: {},
            officeNameMap: {},
            subjects: [],
            page: {
                list: []
            },
            meetingInfoSubjects: {},
            moderatorUserMap: {},
            curKeyword: "",
            curStartTime: "",
            curEndTime: "",
            searchForm: {
                meetingStatusDict:'',
                meetingTypeDict:'',
                meetingName: '',
                pageSize: 20,
                pageNo: 1
            },
            inputPageNo:"",
            dropSubjectIds: [],
            subjectCounts: [0,0,0,0,0,0,0],
            subjectCountMap: {},
            refresh: true,
            targetClass: null,
            activeTabIndex: 0,
        }
    },
    mounted: function () {
    	// $("#usual1 ul").idTabs();
    	
		this.initData();
		this.dragAndDrop();
    },
    computed: {
    	meetingTypeMap: function(){
    		return this.meetingTypes.array2Obj('value', 'label');
        },
        meetingStatusMap: function() {
            return this.meetingStatus.array2Obj('value', 'label');
        },
        activeMenuIds: function(){
            return this.$store.state.home.activeMenuIds;
        }
    },
    watch: {
       
    },
    methods: {
        recovery: function (meetingId) {
            this.submitHandler((token) => {
                confirm("确定将该会议复原到会议前的信息吗？", () => {
                    recovery(meetingId, token).then(res => {
                        alert(res.msg);
                        this.$refs.pagination.refresh();
                    }).catch(error => {
                        this.resetToken(error);
                    });
                });
            });
        },
        switchTab: function (index) {
            this.activeTabIndex = index;
        },
    	createMeeting: function(){
    		if(this.dropSubjectIds.length <= 0){
    			alert("至少拖放选择一个议题，才可创建会议");
    			return;
    		}
    		var meetingTypeDict = "";
    		for(var i = 0; i < this.subjects.length; i++){
    			if(this.subjects[i].id == this.dropSubjectIds[0]){
    				meetingTypeDict = this.subjects[i].meetingTypeDict;
    				break;
    			}
			}
			this.$parent.closeTabByName('CreateMeeting');
			this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "create-meeting",
                "name": "CreateMeeting",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "会议创建",
                "children": [

                ]
            }, 3, { 
				meetingTypeDict: meetingTypeDict,
				subjectIds: this.dropSubjectIds.join(",")
			});
            // this.$router.push({
            //     name: 'CreateMeeting',
            //     params: { 
            //         meetingTypeDict: meetingTypeDict,
            //         subjectIds: this.dropSubjectIds.join(",")
            //     }
            // });
    	},
    	editMeetingInfo: function(meeting, isEdit){
			this.$parent.closeTabByName('CreateMeeting');
			this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "create-meeting",
                "name": "CreateMeeting",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "会议信息修改",
                "children": [

                ]
            }, 3, { 
				meetingTypeDict: meeting.meetingTypeDict,
				meetingId: meeting.id,
				officeId: meeting.officeId
			});
    	},
    	del: function(meetingId){
    		confirm('如果删除该会议吗，其相关的关联信息也将被删除，确定要删除吗?', () => {
                del(meetingId).then(res => {
                    alert(res.msg);
                    this.$refs.pagination.refresh();
                });
            });
    	},
    	publish: function(meetingId, publishFlag){
			publishMeeting(meetingId, publishFlag).then(res => {
				alert(publishFlag ? "发布成功" : "撤销发布成功");
    			this.$refs.pagination.refresh();
			});
    	},
    	updateSubjectVoteFlag: function(item) {
    		var value = (item.subjectVoteFlag == 'y' ? 'n' : 'y');
    		axios.patch('./meetingSubjects/' + item.id, 'property=subjectVoteFlag&value=' + value).then(function(res){
    			var result = res.data;
    			if(result.status == 200){
    				for(var i = 0; i < this.subjects.length; i++){
    					if(this.subjects[i].id == item.id){
    						var subject = this.subjects[i];
    						subject.subjectVoteFlag = value;
    						this.$set(this.subjects, i, subject);
    					}
    				}
    			} else {
    				alert(result.msg);
    			}
    		});
    	},
    	edit: function(subject){
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-file-text-o",
                "id": "meeting-subject-add",
                "name": subject.projectId ? "ProjectSubjectAdd" : "TransactionSubjectAdd",
                "newWindow": 0,
                "opened": 1,
                "parentId": "4",
                "text": "议题信息编辑",
                "children": [

                ]
            }, 3, {
                id: subject.id,
                projectId: subject.projectId,
            });
    	},
    	remove: function(ui){
    		var dropId = $(ui.item).attr("id");
        	this.dropSubjectIds = this.dropSubjectIds.filter(function(item){
        		return item != dropId;
        	});
        	console.log(this.dropSubjectIds);
    	},
    	dragAndDrop: function(){
            var _this = this;
    		this.targetClass = null;
            $(".target-1").sortable({
                connectWith: ".target-2",
                over: function(e, ui) { 
                	_this.remove(ui);
                },
                stop:function(e,ui) {
                	if(!$(ui.item).parent().hasClass("target-1") && _this.targetClass && _this.targetClass.indexOf($(ui.item).attr("class")) == -1) {
                    	alert('只能拖放相同上会类型的议题');
                    	_this.remove(ui);
	                	return false;
                	}
                	return true;
                }
            }).disableSelection();
            
            $(".target-2").sortable({
                connectWith: ".target-1",
                over: function(e, ui) {
                	_this.targetClass = $(".target-2 li").length > 1 ? _this.targetClass : $(ui.item).attr("class");
                	_this.dropSubjectIds.push($(ui.item).attr("id"));
                	console.log(this.dropSubjectIds);
                }
            }).disableSelection();
    	},
    	subjectItemClass: function(meetingTypeDict){
    		var _class = "";
    		switch(meetingTypeDict){
				case "1":_class = "warning-element"; break;
				case "2":_class = "success-element"; break;
				case "3":_class = "info-element"; break;
				case "4":_class = "danger-element"; break;
				case "5":_class = "green-element"; break;
				case "6":_class = "darkgreen-element"; break;
				case "7":_class = "darkblue-element"; break;
				default:_class = "darkblue-element";
			}
    		return _class;
    	},
        initData: function(){
        	getMeetingPoolInitData().then(results => {
                var mt = results[0];
                if(mt.status == 200){
        			//this.meetingTypes.concat(mt.data.data);
        			var data = mt.data;
        			var mts = data[0];
        			mts.unshift(this.meetingTypes[0]);
        			this.meetingTypes = mts;
        			var mtStatus = data[1];
        			mtStatus.unshift(this.meetingStatus[0]);
                    this.meetingStatus = mtStatus;
                    this.meetingSubjectTypes = data[2] || [];
        			this.meetingSubjectTypeMap = this.meetingSubjectTypes.array2Obj('value', 'label');
                }
                var sub = results[1];
        		if(sub.status == 200){
        			var data = sub.data;
        			this.subjects = data.subjects || []; 
        			this.projectOfficeMap = data.projectOfficeMap || {};
        			this.officeNameMap = data.officeNameMap || {};
                }
                // var ms = results[2];
        		// if(ms.status == 200){
        		// 	var data = ms.data;
	        	// 	if(data){
	        	// 		this.page = data.page || {};
	        	// 		this.page['list'] = data.meetingInfos;
	        	// 	}
                // }
                var sc = results[2];
        		if(sc.status == 200){
        			var data = sc.data;
        			this.subjectCountMap = data || this.subjectCountMap;
                }
                this.dicts.push(this.meetingStatus);
                this.dicts.push(this.meetingTypes);
            	// var tabInex = decodeURIComponent((new RegExp('[?|&]tab='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20')) || 0;
            	// $("#usual1 ul li").eq(tabInex).find('a').trigger('click');
            });
        },
        handleSearchResult: function(data) {
            this.page = data.page || {};
        }
    }
}
</script>

<style scoped>
    .itab{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;}
    .view-product{overflow-x:hidden;}
    .laBut{height: 50px;width: 100px;margin-left: 20px;margin-top: 30px;background-color: green;color: white}
    .lead_department{
        float:right;
        margin-right: 120px;
        width:150px;
        text-align:left;
    }
    #center .table{
        width:100%
    }
    .row {
        margin-left: 0;
        margin-right: 0;
    }
    .ibox-content /deep/ .search-box {
        padding-left: 0;
        margin-left: 0;
    }
</style>


