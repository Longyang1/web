<template>
    <div class="view-product">
		<div class="info-center">
			<div class=" padding-big-tb manage-head row">
				<h6 class="padding-left manage-head-con">会议督办</h6>
			</div>
		    <div class="wrapper wrapper-content animated fadeInRight">
		        <div class="row">
		            <div class="col-sm-12">
		                <div class="ibox">
		                    <div class="ibox-content">
		                        <div class="row row-padding">
                                    <div class="layui-form layui-form-pane" action="">
                                        <fieldset class="layui-elem-field" style="margin-top: 5px;">
                                            <legend style="margin-bottom: 0;"><i class="fa fa-file-text-o text-warning"></i> 会议信息</legend>
                                            <div class="layui-field-box">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">会议名称</label>
                                                    <div class="layui-input-block">
                                                        <input type="text" disabled="true" autocomplete="off" :value="meetingInfo.meetingName" class="layui-input">
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-inline">
                                                    <label class="layui-form-label">会议编号</label>
                                                    <div class="layui-input-block">
                                                        <input type="text" disabled="true" :value="meetingInfo.meetingNumber" autocomplete="off" class="layui-input">
                                                    </div>
                                                    </div>
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">会议类型</label>
                                                        <div class="layui-input-inline">
                                                            <label class="layui-form-label" style="background: #fff;">{{ meetingType ? meetingType : meetingInfo.meetingType }}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">会议日期</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" id="date" disabled="true" :value="meetingInfo.meetingTime" autocomplete="off" class="layui-input" lay-key="1">
                                                        </div>
                                                    </div>
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">会议时间</label>
                                                        <div class="layui-input-inline" style="width: 100px;">
                                                            <input type="text" disabled="true" autocomplete="off" class="layui-input" :value="meetingInfo.meetingStartTime" lay-key="2">
                                                        </div>
                                                        <div class="layui-form-mid">-</div>
                                                        <div class="layui-input-inline" style="width: 100px;">
                                                            <input type="text" disabled="true" autocomplete="off" class="layui-input" :value="meetingInfo.meetingEndTime" lay-key="3">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </fieldset>
                                        
                                        <fieldset class="layui-elem-field">
                                            <legend><i class="fa fa-tasks text-warning"></i> 任务分派</legend>
                                            <div class="layui-field-box">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">工作事项</label>
                                                    <div class="layui-input-block">
                                                        <input type="text" v-model="meetingAssignment.assignmentContent"  autocomplete="off" class="layui-input">
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">分派人员</label>
                                                        <div class="layui-input-block">
                                                            <template v-for="(item,mIndex) in meetingMembers">
                                                                    <layui-checkbox 
                                                                            :key="item.id" 
                                                                            v-if="refresh"
                                                                            :label="userMap[item.userId]" 
                                                                            :val="meetingMembers[mIndex].userId"
                                                                            :check="meetingAssignment.receiverIdList.indexOf(meetingMembers[mIndex].userId) != -1"
                                                                            @clickCheckboxAfter="clickUserCheckboxAfter">
                                                                    </layui-checkbox>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">完成时间</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" id='finishTime' v-model="meetingAssignment.finishTime" autocomplete="off" class="layui-input">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="layui-form-item" style="text-align: center">
                                                <div class="layui-inline">
                                                    <button v-if="!isEdit" @click="addList" class="layui-btn"> 添加到任务分派列表</button>
                                                    <button v-if="isEdit" @click="addList" class="layui-btn"> 编辑任务</button>
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset class="layui-elem-field">
                                            <legend><i class="fa fa-tasks text-warning"></i> 任务分派列表 </legend>
                                            <div class="layui-field-box">
                                                <div class="col-sm-12">
                                                    <ul class="sortable-list connectList agile-list ui-sortable" id="task-list">
                                                            <template v-for="(item, index) in meetingAssignments">
                                                                <li 
                                                                    class="success-element" 
                                                                    :key="'ass-' + index">
                                                                        [{{ item.finishTime }}]{{ item.assignmentContent }}
                                                                        <div class="agile-detail">
                                                                            <a href="javascript:void(0);" @click="delItem(index);" class="pull-right btn btn-xs btn-white">
                                                                                <i class="fa text-warning fa-trash-o "></i> 任务删除
                                                                            </a>
                                                                            <a href="javascript:void(0);" @click="editItem(index);" class="pull-right btn btn-xs btn-white task-users"><i class="fa fa-pencil-square-o text-warning"></i> 编辑</a>
                                                                                分派人员：<span v-for="(userName, userIndex) in item.receiverNameList" :key="'user-' + userIndex" style="padding-right: 4px;">{{ userName }}<i v-if="userIndex != item.receiverNameList.length - 1">,</i></span>
                                                                        </div>
                                                                </li>
                                                            </template>
                                                    </ul>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div class="layui-form-item">
                                            <div class="layui-inline">
                                                <button @click="save" class="layui-btn" lay-submit="" lay-filter="save"><i class="fa fa-save"></i> 保存</button>
                                            </div>
                                            <div class="layui-inline">
                                                <button @click="preview" class="layui-btn" lay-submit="" lay-filter="preview"><i class="fa fa-search"></i> 预览</button>
                                            </div>
                                            <div class="layui-inline">
                                                <button @click="exportSupervision" class="layui-btn" lay-submit="" lay-filter="save"><i class="fa fa-download"></i> 导出纪要</button>
                                            </div>
                                            <div v-if="false" class="layui-inline">
                                                <button class="layui-btn" lay-submit="" lay-filter="batch-tasks"><i class="fa fa-tasks"></i> 批量分派</button>
                                            </div>
                                        </div>
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
import { getMeetingMembers, getMeeting, saveMeetingAssignments, getDicts, getMeetingAssignments } from "../../api/meeting/meeting.js";
import { formatDate } from "../../utils/formatUtils.js";
import MeetingSupervisionPreview from "@/views/meeting/MeetingSupervisionPreview.vue";
export default {
    components: {  },
    data() {
        return {
            meetingInfo: {
                    
            },
            meetingMembers: [],
            userMap: {},
            meetingAssignment: {
                assignmentContent: null,
                finishTime: null,
                receiverIdList: [],
                receiverNameList: []
            },
            meetingAssignments: [],
            index: -1,
            refresh: true,
            isEdit: false,
        };
	},
	props: ['mId', 'meetingType'],
	mounted () {
		this.initData();
	},
    methods: {
		initData: function(){
			getMeeting(this.mId ? this.mId : this.$route.params.meetingId).then(response => {
				var meetingInfo = response.data.meetingInfo;
				meetingInfo.meetingTime = formatDate(meetingInfo.meetingTime, 'YYYY-MM-DD');
				meetingInfo.meetingStartTime = formatDate(meetingInfo.meetingStartTime, 'HH:mm:ss');
				meetingInfo.meetingEndTime = formatDate(meetingInfo.meetingEndTime, 'HH:mm:ss');
				meetingInfo.meetingType = this.$route.params.meetingType;
				this.meetingInfo = response.data.meetingInfo;
			});  

			getMeetingAssignments(this.mId ? this.mId : this.$route.params.meetingId).then(result => {
				var meetingAssignments = result.data;
				if(meetingAssignments){
					meetingAssignments.forEach(item => {
						item.receiverIdList = item.receiverIdList.split(',');
						item.receiverNameList = item.receiverNameList.split(',');
						item.finishTime = formatDate(item.finishTime, 'YYYY-MM-DD');
					});
					this.meetingAssignments = meetingAssignments;
				}
			});

			getMeetingMembers(this.mId ? this.mId : this.$route.params.meetingId).then(result => {
				this.meetingMembers = result.data.meetingMembers || [];
				this.userMap = result.data.userMap || {};
			});

			var _this = this;
			layui.use(['element', 'laydate'], function(){
                var element = element
				,laydate = layui.laydate

				laydate.render({
					elem: '#finishTime',
					done: function(value){
						_this.meetingAssignment.finishTime = value;
					}
				});
			});
		},
        save: function(){
			if(this.meetingAssignments.length <= 0) {
				alert("您还未分配任务，至少分配一条任务才可进行保存操作");
				return;
			}
			var meetingAssignments = JSON.parse(JSON.stringify(this.meetingAssignments));
			meetingAssignments.forEach(item => {
				item.receiverIdList = item.receiverIdList.join('，'); 
				item.receiverNameList = item.receiverNameList.join('，');
			});
			saveMeetingAssignments(this.meetingInfo.id, meetingAssignments).then(response => {
				alert("保存督办成功");
			});
		},
		preview: function() {
			this.$layer.iframe({
                content: {
                content: MeetingSupervisionPreview, //传递的组件对象
                parent: this,//当前的vue对象
                data:{
                                mId: this.meetingInfo.id,
                            }//props
                },
                area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title:"会议督办"
			});
		},
		exportSupervision: function(){
			location.href = process.env.VUE_APP_API_HOST + "/meeting/exportAssignmentExcel?meetingId=" + this.meetingInfo.id;
		},
		clickUserCheckboxAfter: function(data){
			if(data.checked){
				this.meetingAssignment.receiverIdList.push(data.val);
				this.meetingAssignment.receiverNameList.push(this.userMap[data.val]);
			} else {
				this.meetingAssignment.receiverIdList.remove(data.val);
				this.meetingAssignment.receiverNameList.remove(this.userMap[data.val]);
			}
		},
		addList: function() {
			if(!this.meetingAssignment.assignmentContent || this.meetingAssignment.assignmentContent.trim() == ''){
				msg('工作事项不能为空');
				return;
			}
			// if(this.meetingAssignment.receiverIdList.length <= 0){
			// 	msg('您还未分派人员，请先分配人员再添加');
			// 	return;
			// }
			// if(!this.meetingAssignment.finishTime || this.meetingAssignment.finishTime.trim() == ''){
			// 	msg('完成时间不能为空');
			// 	return;
			// }
			var meetingAssignment = {
				assignmentContent: null,
				finishTime: null,
				receiverIdList: [],
				receiverNameList: []
			};
			if(!this.isEdit){
				this.meetingAssignments.push(JSON.parse(JSON.stringify(this.meetingAssignment)));
			} else {
				this.$set(this.meetingAssignments, this.index, JSON.parse(JSON.stringify(this.meetingAssignment)));
				this.isEdit = false;
			}
			this.$set(this.meetingAssignment, 'assignmentContent', null);
			this.$set(this.meetingAssignment, 'finishTime', null);
			this.$set(this.meetingAssignment, 'receiverIdList', []);
			this.$set(this.meetingAssignment, 'receiverNameList', []);
			this.index = this.meetingAssignments.length - 1;
			this.refresh = false;
			this.$nextTick(() => {
				this.refresh = true;
			});
		},
		editItem: function(index){
			this.index = index;
			var meetingAssignment = JSON.parse(JSON.stringify(this.meetingAssignments[index]));
			this.$set(this.meetingAssignment, 'assignmentContent', meetingAssignment.assignmentContent);
			this.$set(this.meetingAssignment, 'finishTime', meetingAssignment.finishTime);
			this.$set(this.meetingAssignment, 'receiverIdList', meetingAssignment.receiverIdList);
			this.$set(this.meetingAssignment, 'receiverNameList', meetingAssignment.receiverNameList);
			this.isEdit = true;
			this.refresh = false;
			this.$nextTick(() => {
				this.refresh = true;
			});
		}, 
		delItem: function(index){
			confirm("确定删除这条任务吗？", () => {
				this.meetingAssignments.splice(index, 1);
				this.index = this.meetingAssignments.length - 1;
				if(this.isEdit){
					this.$set(this.meetingAssignment, 'assignmentContent', null);
					this.$set(this.meetingAssignment, 'finishTime', null);
					this.$set(this.meetingAssignment, 'receiverIdList', []);
					this.$set(this.meetingAssignment, 'receiverNameList', []);
					this.isEdit = false;
				}
				this.refresh = false;
				this.$nextTick(() => {
					this.refresh = true;
				});
			});
		}
  }
};
</script>

<style scoped>
div#app {
  background: #fff;
}
/*head*/
.manage-head {
  border-bottom: 1px solid #d9dfe4;
  padding: 15px 0;
  margin: 0 20px;
}
.manage-head-con {
  position: relative;
  height: 18px;
  line-height: 18px;
  color: #363636;
  border-left: 2px solid #0098cd;
  font-size: 16px;
}
.manage-title {
  display: block;
  color: #098cba;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
}
.solid-slider {
  position: absolute;
  border-bottom: 2px solid #098cba;
}
.manage-head a {
  padding: 0 10px;
  margin-top: -5px;
  line-height: 25px;
  border-radius: 3px;
  display: block;
  font-size: 10px;
  color: #565656;
  font-weight: normal;
}
.manage-head i {
  font-size: 18px;
  color: #305894;
}
.manage-head .order-back {
  background-size: 12px;
  background-color: #f7f7f7;
}
.text-green-main {
  color: #25a725 !important;
}
.text-yellow-main {
  color: #ffa115 !important;
}
.itab {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
.view-product {
  overflow-x: hidden;
}
.ibox,
.ibox-content {
  border-width: 0;
}
.ibox-content {
  padding: 0px 20px 20px 20px;
  padding-left: 0px;
}
body .layui-layer-rim .layui-layer-title {
  font-weight: bold;
}
.padding-big-tb {
  padding: 20px 0;
}
.manage-head {
  border-bottom: 1px solid #d9dfe4;
  padding: 15px 0;
  margin: 0 20px;
}
.manage-head-con {
  position: relative;
  height: 18px;
  line-height: 18px;
  color: #363636;
  border-left: 2px solid #0098cd;
  font-size: 16px;
}
.padding-left {
  padding-left: 10px;
}
</style>

