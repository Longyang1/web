<template>
    <div>
        <span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-faqiren"></use></svg> 发起人：{{ userMap[processInstance.startUserId] }}
        </span>
        <span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-liucheng"></use></svg> 流程名称：{{ processInstance.processDefinitionName }}
        </span>
        <span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhuangtai"></use></svg> 流程状态：{{ processInstance.endTime ? '已结束' : '进行中' }}
        </span>
        <span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-banben"></use></svg> 版本：{{ processInstance.processDefinitionVersion }}
        </span>
        <table class="layui-table">
            <colgroup>
                <col width="150">
                <col width="150">
                <col width="200">
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th>序号</th>
                    <th>环节</th>
                    <th>审批人</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>任务历时</th>
                    <th>审批结果</th>
                    <th>意见</th>
                </tr> 
            </thead>
            <tbody>
                <tr 
                    v-for="(task, index) in tasks" 
                    :key="index">
                    <td width="30">{{ index + 1 }}</td>
                    <td>{{ task.name }}</td>
                    <td>{{ userMap[task.assignee] }}</td>
                    <td>{{ task.createTime | moment }}</td>
                    <td>{{ task.endTime | moment }}</td>
                    <td>{{ formatDuring(task.durationInMillis) }}</td>
                    <td>{{ approvalResultMap[task.deleteReason] }}</td>
                    <td>{{ task.comment }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import request from '@/utils/request'
import { getDicts } from '@/api/dict'

export default {
    data() {
        return {
            processInstance: {},
            tasks: [],
            userMap: {},
            approvalResultMap: {}
        }
    },
    props: {
        processKey: {
            type: String,
            default: ""
        },
        businessKey: {
            type: String,
            default: ""
        }
    },
    mounted() {
        new request({
            url: './workflow/approval/history',
            method: 'get',
            params: {
                processKey: this.processKey,
                businessKey: this.businessKey
            }
        }).then(res => {
            let data = res.data || {};
            this.tasks = data.tasks || [];
            this.userMap = data.userMap || {};
            this.processInstance = data.processInstance || {};
        });

        getDicts('APPROVAL_RESULT').then(res => {
            let data = res.data;
            if (data) {
                this.approvalResultMap = (data[0] || []).array2Obj('value', 'label');
            }
        });
    },
    methods: {
        formatSeconds(value) {
            var theTime = parseInt(value);// 需要转换的时间秒 
            var theTime1 = 0;// 分 
            var theTime2 = 0;// 小时 
            var theTime3 = 0;// 天
            if (theTime > 60) { 
                theTime1 = parseInt(theTime / 60); 
                theTime = parseInt(theTime % 60); 
                if (theTime1 > 60) { 
                    theTime2 = parseInt(theTime1 / 60); 
                    theTime1 = parseInt(theTime1 % 60); 
                    if (theTime2 > 24) {
                        //大于24小时
                        theTime3 = parseInt(theTime2 / 24);
                        theTime2 = parseInt(theTime2 % 24);
                    }
                } 
            } 
            var result = '';
            if (theTime > 0) {
                result = "" + parseInt(theTime) + "秒";
            }
            if (theTime1 > 0) { 
                result = "" + parseInt(theTime1) + "分" + result; 
            } 
            if (theTime2 > 0) { 
                result = "" + parseInt(theTime2) + "小时" + result; 
            } 
            if (theTime3 > 0) { 
                result = "" + parseInt(theTime3) + "天" + result; 
            }
            return result; 
        },
        formatDuring(mss) {
            if (!mss) {
                return "";
            }
            var days = parseInt(mss / (1000 * 60 * 60 * 24));
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (mss % (1000 * 60)) / 1000;
            let result = "";
            if (days) {
                result += days + " 天 ";
            }

            if (hours) {
                result += hours + " 小时 ";
            }

            if (minutes) {
                result += minutes + " 分钟 ";
            }

            if (seconds) {
                result += seconds + " 秒 ";
            }
            return  result;
        }
    }
}
</script>

<style scoped>
table th, table td {
    text-align: center
}
span {
    padding-right: 20px;
}
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>