import { getDicts } from '@/api/dict';
import { del, readMsg, readAllMsg } from '@/api/msg/sysMsg'
import bus from '@/assets/js/event.js'

export default {
    data () {
        return {

        }
    },
    mounted () {
        
    },
    methods: {
        markedRead: function() {
            if (this.checkedKeys.length == 0) {
                msg('请先勾选至少一条消息，才可进行此操作。');
                return;
            }
            readMsg(this.checkedKeys.join(",")).then(res => {
                alert(res.msg);
                bus.$emit('readMsgAfter', {
                    curObj: this
                });
                this.checkedKeys = [];
            });
        },
        markedAllRead: function(msgType) {
            readAllMsg(msgType).then(res => {
                alert(res.msg);
                bus.$emit('readMsgAfter', {
                    curObj: this,
                    msgType: msgType,
                });
            });
        },
        switchModal: function() {
            this.$emit('switch-modal');
        },
        readMsg: function(msg) {
            if (!msg || !msg.id || !this.msgRecordMap[msg.id]) {
                return;
            }
            if (this.msgRecordMap[msg.id][0].readStatus != 'y') {
                readMsg(msg.id).then(res => {
                    bus.$emit('readMsgAfter', {
                        curObj: this,
                        msgType: msg.msgTypeDict,
                    });
                });
            }

            if (msg.url) {
                this.toView(msg.url, {
                    id: msg.businessid
                });
            } else {
                var content = "wwww";
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: true
                    ,area: ['auto', 'auto']
                    ,shade: 0.8
                    ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                    ,resize: false
                    // ,btn: ['关闭']
                    ,btnAlign: 'c'
                    ,moveType: 1 //拖拽模式，0或者1
                    ,content: content
                    ,yes: function(layero){
                        readPersonnelMsgAfter(msg.id);
                        layer.closeAll();
                    },
                    cancel: function(){ 
                        
                    }
                });
            }

        },
    }
}