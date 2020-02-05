<template>
    <div class="zmark-box">
    <!-- 遮罩层DIV -->
        <div id="overlay" class="overlay"></div>
        <div class="offset-list" id="superviseDiv">
            <div class="list-title">共{{ meetingAssignments.length }}个督办事项！</div>
            <ul class="list-content">
                <template v-for="(meetingAssignment) in meetingAssignments">
                    <li class="layui-row" :key="meetingAssignment.id">
                        <div class="layui-col-xs2 layui-col-md2" >
                            <img :src="meetingAssignment.receiverIdList.length > 1 ? '../../static/images/mul_per_icon.png' : '../../static/images/only_per_icon.png'" alt="multi"/>
                        </div>
                        <div class="layui-col-xs10 layui-col-md10">
                            <div class="even-title">{{ meetingAssignment.assignmentContent }}</div>
                            <div class="event-name">
                                <span class="p-name">{{ meetingAssignment.receiverNameList }}</span>
                                <span class="e-date">完成时限:{{ meetingAssignment.finishTime }}</span>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
</div>
</template>

<script>
import { getMeetingAssignments } from "../../api/meeting/meeting.js";
import { formatDate } from "../../utils/formatUtils.js";

export default {
  data() {
    return {
     	meetingAssignments: [],
    };
  },
  props: ["mId"],
  mounted() {
    getMeetingAssignments(this.mId ? this.mId : this.$route.params.meetingId).then(result => {
        var meetingAssignments = result.data;
        if(meetingAssignments){
            meetingAssignments.forEach(item => {
                item.receiverIdList = item.receiverIdList.split('，');
                //item.receiverNameList = item.receiverNameList.split(',');
                item.finishTime = formatDate(item.finishTime, 'YYYY-MM-DD');
            });
            this.meetingAssignments = meetingAssignments;
        }
    });
  },
  methods: {}
};
</script>

<style scoped>
ul li {
    list-style-type: none;
}
body,html{
    overflow: hidden;
}
/* .zmark-box {
    overflow: hidden;
} */
.zmark-box {
    /* overflow: hidden;
    background-color: rgb(151, 153, 161); */
}
.zmark-box .overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    /* height: 91%;
    filter:alpha(opacity=60);
    background-color: rgba(18,21,42,.5);
    opacity: 0.75;
    -moz-opacity: 0.75;
    z-index: -1;
    overflow: hidden; */
}
.offset-list {
    padding: 15px 38px;
    background-color: #fff;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    /* height: 460px;
    overflow-y: auto; */
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