<template>
     <div class="tab-background float-e-margins">
        <div class="view-product">
            <div class="info-center" style="">
                <div class="tab-header" style="height:50px;border:solid 1px #e6e6e6;right:15px">
                    <span><p>消息看板</p></span>
                    <span class="pull-right" style="position:relative;top:-20px;font-size:14px;right:25px">
                        <i class="fa fa-list-ul" style=" ">&nbsp;<a href="javascript:void(0)" @click="switchModal()">切换为列表模式</a></i>
                    </span>
                </div>
                <div class="row wrapper wrapper-content animated fadeInRight" style="width:96%;padding-top: 20px">
                    <!-- message-board -->
                    <div class="col-sm-12 message-board">
                        <div
                            v-for="(item, index) in msgTypes"
                            :key="index"
                            class="col-sm-3 custom-padding">
                            <div class="ibox float-e-margins">
                                <div class="mytitle">
                                    <h5>{{ item.label }}（{{ msgMap[item.value] ? msgMap[item.value].length : 0 }}）</h5>
                                    <div class="ibox-tools">
                                        <label v-if="msgMap[item.value] && msgMap[item.value].length > 0" @click="markedAllRead(item.value)" class="label label-primary">全部已读</label>
                                        <label v-else class="label label-primary" @click="alertEmptyMsg(item.label)">全部已读</label>
                                    </div>
                                </div>
                                <div class="ibox-content" style="height: 670px;overflow: auto;padding-top: 14px;">
                                    <template v-if="msgMap[item.value]">
                                        <ul v-for="(msg) in msgMap[item.value]" :key="msg.id">
                                            <li>
                                                <table>
                                                    <tr>
                                                        <td rowspan="2" class="td-icon">
                                                            <i :class="{fa: true, 'fa-circle': true, 'text-blue': index % 2 == 0, 'text-orange': index % 2 == 0}"></i>
                                                        </td>
                                                        <td @click="readMsg(msg, true)"><span href="javascrip:void(0)" style="color: #1E9FFF;cursor: pointer" :title="msg.title">{{ msg.title }}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="agile-detail">
                                                                <span class="span-user"><img src="/img/message/user.png"/>{{ userMap[msg.createBy] }}</span>
                                                            </div>
                                                            <div class="agile-detail">
                                                                <span class="span-user"><img src="/img/message/time.png"/>{{ msg.createDate | moment }}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </li>
                                        </ul>
                                    </template>
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
import { getDicts } from '@/api/dict';
import { del, readMsg, readAllMsg, getSysMsgs } from '@/api/msg/sysMsg'
import Base from "@/views/base/Base"
import msgMixin from '@/mixin/msgMixin'
import bus from '@/assets/js/event.js'

export default {
	name: 'SysMsgBoard',
    extends: Base,
    mixins: [msgMixin],
    data() {
        return {
            msgTypes: [],
            msgMap: {},
            userMap: {},
            msgRecordMap: {},
        }
    },
    mounted() {
        this.initData();

        bus.$on('readMsgAfter', (data) => {
            this.readMsgAfter(data.msgType);
        });
    },
    methods: {
        alertEmptyMsg: function(msgType) {
            alert('暂无' + msgType + '未读消息');
        },
        initData: function() {
            getDicts('MSG_TYPE_DICT,').then(result => {
                var msgTypes = result.data[0] || [];
                this.msgTypes = [];
                msgTypes.forEach(item => {
                    this.msgTypes.push(item);
                    this.getMsgData(item.value);
                });
            })
        },
        getMsgData: function(msgType) {
            getSysMsgs({
                msgTypeDict: msgType,
                readStatus: 'n'
            }).then(res => {
                var data = res.data || {};
                this.$set(this.msgMap, msgType, (data.sysMsgs || []));
                Object.assign(this.userMap, data.userMap || {});
                Object.assign(this.msgRecordMap, data.msgRecordMap || {});
            });
        },
        readMsgAfter: function(msgType) {
            if (!msgType) {
                this.msgTypes.forEach(item => {
                    this.getMsgData(item.value);
                });
            } else {
                this.getMsgData(msgType);
            }
        }
    },
    activated() {
        // 
    }
}
</script>

<style src="@/assets/css/messageBoardSec.css" scoped>

</style>