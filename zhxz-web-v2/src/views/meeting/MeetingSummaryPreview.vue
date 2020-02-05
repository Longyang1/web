<template>
    <div class="zmark-box">
        <div class="offset-list" id="summaryBody">
            <div class="list-title">
            <div style="display:block;text-align:center;margin-top: 20px;width: 100%;">
                <!-- <img src="/img/meeting/red_head.png"  class="red_head"/> -->
            </div>
            <div style="display: block; text-align: center; margin-top: 20px; width: 100%;">
                <h4 style="font-size: 20px;margin-top: 40px;text-align: center;font-family: '仿宋';color: black;">{{meetingInfo.meetingSequence}}</h4>
            </div>
            </div>
            <div class="content-name">
                <h5 style="font-size:30px;color:black;text-align:center;padding-top: 60px;">{{meetingInfo.meetingName}}</h5>
            </div>
            <div class="content-div" style="margin-top: 60px;">
            <label class="item-title">议题:</label>
                <ul class="item-ul1">
                    <template v-for="(meetingSubject,index) in meetingSubjects">
                        <li class="item-li1" :key="meetingSubject.id">
                            {{index+1}}.{{meetingSubject.subjectName}}
                        </li>
                    </template>
                </ul>
            </div>
            <div class="content-list">
                <label class="item-title" style="font-size: 18px;font-family: '微软雅黑';font-weight: 700;">会议记录:</label>
                <div v-html="meetingInfo.meetingSummary" style="font-size:18px;line-height:35px;padding-left: 5%;"></div>
            </div>
            <div class="content-end">
            <div style="clean:both"></div>
            <div class="content-div">
                    <label  class="item-title">出席:</label>
                    <ul class="item-ul2">
                        <template v-for="meetingMember in meetingMembers">
                            <li 
                                v-if="meetingMember.signInStatus == 'y'"
                                class="item-li2"
                                :key="meetingMember.id">
                                {{userMap[meetingMember.userId].name}}
                            </li>
                        </template>
                    </ul>
            </div>
            <div style="clean:both"></div>
            <div class="content-div">
                <label  class="item-title">请假:</label>
                <ul class="item-ul">
                    <ul class="item-ul3">
                        <template v-for="meetingMember in meetingMembers">
                            <li 
                                v-if="meetingMember.signInStatus != 'y'"
                                class="item-li3"
                                :key="meetingMember.id">
                                {{userMap[meetingMember.userId].name}}
                            </li>
                        </template>
                    </ul>
                </ul>
            </div>
                <div style="clean:both"></div>
            <div class="content-div">
                <label  class="item-title">列席:</label>
                <ul class="item-ul">
                    <ul class="item-ul3">
                        <template v-for="meetingMember in meetingMembers">
                            <li 
                                v-if="meetingMember.signInStatus == 'y' && meetingMember.meetingMemberTypeDict == '8'"
                                class="item-li3"
                                :key="meetingMember.id">
                                {{userMap[meetingMember.userId].name}}
                            </li>
                        </template>
                    </ul>
                </ul>
            </div>
            <div style="clean:both"></div>
            <div class="content-div">
                <label class="item-title" >记录:</label>
                <ul class="item-ul4">
                        
                </ul>
            </div>
            </div>
            <div class="all-info">
                <label class="item-title-label">抄    送:<span></span></label>
                <label class="item-title-label">内部发送:<span></span></label>
                <label class="item-title-label">联 系 人:<span></span></label>
                <label class="item-title-label">电话:<span></span></label>
            </div>
            <div class="div-end">
            <!-- <hr style="height:1px;margin: -8px 0;background-color: red;width:100%;">
            <hr style="height:5px;background-color: red;width:100%"> -->
            <div style="display:block;text-align:center;margin-top: 20px;">
                <!-- <img src="/img/meeting/red_bottom.png"  class="red_bottom"/> -->
            </div>
            <span style="padding-bottom:80px;dispaly:block;"></span>
            </div>
        </div>
    </div>
</template>

<script>
import { getMeeting } from "../../api/meeting/meeting.js";

export default {
  data() {
    return {
      meetingInfo: {
        meetingSummary: ""
      },
      meetingSubjects: [],
      meetingMembers: [],
      userMap: {}
    };
  },
  props: ["mId"],
  mounted() {
    getMeeting(this.mId ? this.mId : this.$route.params.meetingId).then(
      response => {
        var data = response.data;
        var meetingInfo = data.meetingInfo;
        // meetingInfo.meetingTime = formatDate(meetingInfo.meetingTime, 'YYYY-MM-DD');
        // meetingInfo.meetingStartTime = formatDate(meetingInfo.meetingStartTime, 'HH:mm:ss');
        // meetingInfo.meetingEndTime = formatDate(meetingInfo.meetingEndTime, 'HH:mm:ss');
        this.meetingInfo = meetingInfo;
        this.meetingSubjects = data.subjects;
        this.meetingMembers = data.meetingMembers;
        this.userMap = data.userMap;
      }
    );
  },
  methods: {}
};
</script>

<style scoped>
.zmark-box {
  /* overflow: hidden; */
  /* background-color: rgb(151, 153, 161); */
  height: 1000px;
  /* overflow-y: auto; */
  color: #000;
  font-size: 18px;
}
.layui-layer-setwin .layui-layer-close2:hover {
  background: url(/img/meeting/close_icon.png) center center no-repeat;
  width: 100%;
  height: 100%;
  margin-left: 0;
  right: 0;
  left: 0;
}
.head-li {
  font-size: 33px;
  color: red;
  margin-top: 20px;
  font-weight: 700;
  text-align: center;
  display: block;
  float: left;
  margin-left: 51px;
}
.head-ul {
  padding-top: 20px;
}
.content-div {
  display: block;
  margin-left: 12%;
  font-size: 18px;
  /* font-weight: 700; */
}
/***********************************************************************/
.content-div .item-title {
  font-weight: 700;
}

.item-ul1 {
  display: block;
  overflow: hidden;
  margin-left: 4%;
  min-height: 50px;
}
.item-ul2 {
  display: block;
  overflow: hidden;
  margin-left: 4%;
  min-height: 50px;
}
.item-ul3 {
  display: block;
  overflow: hidden;
  margin-left: 4%;
  min-height: 50px;
}
.item-ul4 {
  display: block;
  overflow: hidden;
  margin-left: 4%;
  min-height: 50px;
}
.item-li1 {
  /* float:left; */
  padding-bottom: 10px;
  padding-top: 10px;
  padding-right: 20px;
  font-family: "仿宋";
}
.item-li2 {
  float: left;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-right: 20px;
  font-family: "仿宋";
}
.item-li3 {
  float: left;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-right: 20px;
  font-family: "仿宋";
}
.item-li4 {
  float: left;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-right: 20px;
  font-family: "仿宋";
}

.zmark-box .overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 93%;
  filter: alpha(opacity=60);
  background-color: rgba(18, 21, 42, 0.5);
  opacity: 0.75;
  -moz-opacity: 0.75;
  z-index: -1;
  overflow: hidden;
}
/* .layui-layer layui-layer-page{
	z-index: 19891020;
	width: 797px;
	height: 565px;
	top: -72px;
	left: 553px;
} */

/***********************************************************************/
.item-title-label {
  display: block;
  font-size: 20px;
  padding-bottom: 10px;
  font-family: "仿宋";
}
.div-end {
  display: block;
  padding-bottom: 80px;
}
.content-list {
  min-height: 100px;
  margin-top: 75px;
  padding-bottom: 75px;
  padding-right: 10%;
  padding-left: 12%;
  font-family: "仿宋";
}
.content-end {
  min-height: 300px;
}
.red_head {
  width: 100%;
  height: 100%;
}
.red_bottom {
  /* width: 976px; */
  width: 100%;
  height: 100%;
}
.all-info {
  /* height: 150px; */
  padding-top: 80px;
  margin-left: 10%;
  margin-top: 80px;
}
.offset-list {
  padding: 15px 38px;
  background-color: #fff;
  /* margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px; */
  /* height: 470px; */
  overflow-y: auto;
}
.list-title {
  color: #949292;
  font-size: 12px;
  margin-bottom: 10px;
}
.list-content {
  padding: 0;
}
.list-content li {
  padding: 10px;
  border-bottom: 1px solid #eeedef;
}
.list-content li:hover,
.list-content li:focus {
  background-color: #eefafd;
}
.list-content li .even-title {
  margin-bottom: 10px;
}
.list-content li .even-title,
.list-content li .event-name {
  color: #565656;
  font-size: 14px;
}
.list-content li .event-name {
}
.list-content li:hover .even-title,
.list-content li:focus .even-title {
  color: #0ab8ed;
}
.e-date {
  color: #949292;
  font-size: 12px;
  float: right;
  position: relative;
  top: 2px;
}
</style>

