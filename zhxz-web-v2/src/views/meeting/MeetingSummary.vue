<template>
    <div class="view-product" style="height: 100%">
		<div class="info-center">
			<div class=" padding-big-tb manage-head row">
				<h6 class="padding-left manage-head-con">会议纪要</h6>
			</div>
		    <div class="wrapper wrapper-content animated fadeInRight">
		        <div class="row">
		            <div class="col-sm-12">
		                <div class="ibox">
		                    <div class="ibox-content">
		                        <div class="row row-padding">
                                    <form class="layui-form layui-form-pane" action="">
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
                                        
                                        <fieldset class="layui-elem-field" v-if="false">
                                            <legend><i class="fa fa-tasks text-warning"></i> 任务分派 <i class="fa fa-plus text-warning task-add" style="font-size: 16px;cursor: pointer;"></i></legend>
                                        <div class="layui-field-box">
                                                <div class="col-sm-12">
                                                                        <ul class="sortable-list connectList agile-list ui-sortable" id="task-list">
                                                                                <li class="success-element">
                                                                                        第一条任务内容......
                                                                                        <div class="agile-detail">
                                                                                            <a href="javascript:void(0);" onclick="userEdit(this);" class="pull-right btn btn-xs btn-white task-users"><i class="fa fa-user text-warning"></i> 人员编辑</a>
                                                                                            <a href="javascript:void(0);" onclick="taskAssign(this);" class="pull-right btn btn-xs btn-white">
                                                                                                <i class="fa text-warning fa-check-circle"></i> 任务分派
                                                                                            </a>
                                                                                                分派人员：<span>宋明利</span>
                                                                                        </div>
                                                                                </li>
                                                                        </ul>
                                                        </div>
                                            </div>
                                        </fieldset>
                                        <fieldset class="layui-elem-field">
                                            <legend><i class="fa fa-edit text-warning"></i> 会议纪要</legend>
                                                <div class="layui-form-item" style="width: auto;margin: 10px;margin-top: 20px">
                                                    <ue v-if="ueditor.value != null" :value="ueditor.value" :config="ueditor.config" ref="ue"></ue>
                                                </div>
                                        </fieldset>										  
                                    </form>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <button @click="save" class="layui-btn" lay-submit="" lay-filter="save"><i class="fa fa-save"></i> 保存</button>
                                        </div>
                                        <div class="layui-inline">
                                            <button @click="preview" class="layui-btn" lay-submit="" lay-filter="preview"><i class="fa fa-search"></i> 预览</button>
                                        </div>
                                        <div class="layui-inline">
                                            <button @click="exportSummary" class="layui-btn" lay-submit="" lay-filter="save"><i class="fa fa-download"></i> 导出纪要</button>
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
</template>

<script>
import { getMeeting, saveSummary, getDicts } from "../../api/meeting/meeting.js";
import { formatDate } from "../../utils/formatUtils.js";
import MeetingSummaryPreview from "@/views/meeting/MeetingSummaryPreview.vue";
export default {
  components: { MeetingSummaryPreview },
  data() {
    return {
      ueditor: {
        value: null,
        config: {
            initialFrameHeight: 300,
						scaleEnabled:true,
						'fontfamily':[
							{ label: '', name: 'songti', val: '宋体,SimSun' },
							{ label: '', name: 'SimSun', val: '仿宋,SimSun' },
							{ label:'',name:'FangSong_GB2312',val:'仿宋_GB2312 ,FangSong_GB2312'},
							{ label:'',name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
							{ label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
							{ label:'',name:'heiti',val:'黑体, SimHei'},
							{ label:'',name:'lishu',val:'隶书, SimLi'},
							{ label:'',name:'andaleMono',val:'andale mono'},
							{ label:'',name:'arial',val:'arial, helvetica,sans-serif'},
							{ label:'',name:'arialBlack',val:'arial black,avant garde'},
							{ label:'',name:'comicSansMs',val:'comic sans ms'},
							{ label:'',name:'impact',val:'impact,chicago'},
							{ label:'',name:'timesNewRoman',val:'times new roman'}
						]
        }
      },
      meetingInfo: {
				meetingSummary: ''
			},
    };
  },
  props: ['mId', 'meetingType'],
  mounted () {
		getMeeting(this.mId ? this.mId : this.$route.params.meetingId).then(response => {
      var meetingInfo = response.data.meetingInfo;
      meetingInfo.meetingTime = formatDate(meetingInfo.meetingTime, 'YYYY-MM-DD');
      meetingInfo.meetingStartTime = formatDate(meetingInfo.meetingStartTime, 'HH:mm:ss');
			meetingInfo.meetingEndTime = formatDate(meetingInfo.meetingEndTime, 'HH:mm:ss');
			meetingInfo.meetingType = this.$route.params.meetingType;
			this.meetingInfo = response.data.meetingInfo;
      this.$set(this.ueditor, 'value', this.meetingInfo.meetingSummary ? this.meetingInfo.meetingSummary : "");
    });  
  },
  methods: {
    returnContent() {
      this.dat.content = this.$refs.ue.getUEContent();
		},
		save: function(){
				saveSummary(this.meetingInfo.id, this.$refs.ue.getUEContent()).then(response => {
					alert("保存纪要成功");
				});
		},
		preview: function() {
			this.$layer.iframe({
        content: {
          content: MeetingSummaryPreview, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
						mId: this.meetingInfo.id,
					}//props
        },
        area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
        title:"会议纪要"
			});
		},
		exportSummary: function(){
			location.href = process.env.VUE_APP_API_HOST + "/summary/freemarker?meetingId=" + this.meetingInfo.id;
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

