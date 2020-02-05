<template>
    <div style="display: inline-block;">
        <layui-inline-input
            :label="label"
            func="fileClick"
            :readonly="true"
            @fileClick="fileClick"
            :placeholder='placeholder'
            :disabledFunc="disabledFunc"
            :name="name"
            v-model="fileName"></layui-inline-input>
        <button ref="uploadBtn" :id="name + '_' + id" class="hidden"></button>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getAttaments, delAttament } from '@/api/file'
import request from '@/utils/request';
export default {
    data () {
        return {
            fileName: '',
            attachmentId: this.value
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        func: {
            type: String,
            default: null
        },
        value: {
            type: [String, Number],
            default: ''
        },
        cssStyle: {
            type: Object,
            default: function() {
                return {
                    'width': '190px',
                    'margin-right': '8px'
                }
            }
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请选择文件'
        },
        layVerify: {
            type: String,
            default: ''
        },
        canUpload: {
            type: Boolean,
            default: true
        },
        disabledFunc: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: 'f_' + new Date().getTime(),
        },
        attachmentBusinessId: {
            type: String,
            default: null
        },
        attachmentBusinessType: {
            type: String,
            default: null
        },
        module: {
            type: String,
            default: 'upload'
        },
        canUpload: {
            type: Boolean,
            default: true
        },
        canDelete: {
            type: Boolean,
            default: true
        },
        notInModal: {
            type: Boolean,
            default: true
        },
        saveFile: {
            type: String,
            default: 'y'
        }
    },
    watch: {
        value() {
            this.attachmentId = this.value;
        }
    },
    mounted () {
        this.initData();
        this.$nextTick(() => {
            this.layuiInit();
        });
    },
    methods: {
        fileClick: function() {
            this.$refs.uploadBtn.click();
        },
        initData: function(){
            if (this.attachmentBusinessId && this.attachmentBusinessType) {
                getAttaments({
                    attachmentBusinessId: this.attachmentBusinessId,
                    attachmentBusinessType: this.attachmentBusinessType
                }).then(res => {
                    var data = res.data;
                    if (data && data.attachmentInfos) {
                        var atta = data.attachmentInfos[0];
                        this.attachmentId = atta.attachmentId;
                        this.fileName = atta.attachmentName;
                    }
                });
            }
        },
        layuiInit: function(){

            if (!this.canUpload) {
                return;
            }
            
            var elemId = !this.notInModal ?  ('.vl-notify-content #' + (this.name + '_' + this.id)) : ("#" + (this.name + '_' + this.id));
            var _this = this;
        	layui.use(['element', 'upload'], function(){
        		var element = element
                ,upload = layui.upload;
                
                var uploadListIns = upload.render({
                    elem: elemId,
                    url: '/api/file/upload/attachment?module=' + _this.module + '&saveFile=' + _this.saveFile,
                    accept: 'file',
                    multiple: false,
                    auto: true,
                    headers: {
                        Authorization: ('Bearer ' + getToken())
                    },
                    done: function (res, index, upload) {
                        if (res.status == 200) { //上传成功
                            _this.fileName = res.data.attachmentName;
                            _this.attachmentId = res.data.attachmentId;
                            _this.$emit('input', _this.attachmentId);
                            alert("上传成功");
                            _this.$emit('uploadSuccessAfter', {
                                fileName: _this.fileName,
                                path: res.data.path
                            });
                            return true; //删除文件队列已经上传成功的文件
                        } else {
                            alert(res.msg);
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {

                    }
                });
        	});

        }
    }
}
</script>

