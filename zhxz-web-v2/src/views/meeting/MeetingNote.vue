<template>
    <div class="meeting-note-container"  ref="meetingNoteContainer">
        <ue v-if="show && ueditor.value != null" :value="ueditor.value" :config="ueditor.config" ref="ue"></ue>
        <div class="layui-form-item layui-layout-admin">
            <div class="layui-input-block">
              <div class="layui-footer" style="left: 0;text-align:center">
                <button @click="saveNote" class="layui-btn" lay-submit="" lay-filter="component-form-demo1">保存</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getMeetingNote, saveNote } from "../../api/meeting/meeting.js";

export default {
    components: {
        
    },
    data () {
        return {
            ueditor: {
                value: "123456",
                config: {
                    initialFrameHeight: 300,
                    scaleEnabled:true,
                }
            },
            meetingInfo: {
				meetingSummary: ''
            },
            meetingId: null,
            show: false,
        }
    },
    props: ["mId", 'height'],
    mounted () {
        this.meetingId = (this.mId ? this.mId : this.$route.params.meetingId);
        getMeetingNote(this.meetingId).then(response => {
            this.$set(this.ueditor, 'value', response.data ? response.data : "");
        }); 
        setTimeout(() => {
            this.ueditor.config.initialFrameHeight = (this.height - 100 - 90);
            this.show = true;
        }, 500);
    },
    methods: {
        saveNote: function(){
            var note = this.$refs.ue.getUEContent();
            if(note == ""){
                alert("请先输入笔记,再进行保存操作");
            } else {
                saveNote(this.meetingId, note).then(response => {
                    alert("保存笔记成功");
                });
            }
        }
    }
}
</script>

