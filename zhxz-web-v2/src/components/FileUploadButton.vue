<template>
    <button :id="bId" ref="uploadBtn" class="layui-btn layui-btn-icon layui-btn-primary"><i aria-hidden="true" :class="iconClass"></i> {{ text }}</button>
</template>

<script>
import Base from "@/views/base/Base"
import { getToken } from '@/utils/auth'

export default {
    extends: Base,
    data() {
        return {
            bId: ('up_' + new Date().getTime() + Math.floor((Math.random() * 1000) + 1))
        }
    },
    props: {
        text: {
            type: String,
            default: '上传文件按钮'
        },
        module: {
            type: String,
            default: 'template'
        },
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        iconClass: {
            type: String,
            default: 'fa fa-cloud-upload'
        },
        loadingMsg: {
            type: String,
            default: '文件上传中'
        },
        exts: {
            type: String,
            default: 'xls|xlsx'
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.layuiInit();
        });
    },
    methods: {
        layuiInit: function() {
            var _this = this;
            var layId = null;
        	layui.use(['element', 'upload'], function(){
        		var element = layui.element
                ,upload = layui.upload;

                var uploadListIns = upload.render({
                    elem: '#' + _this.bId,
                    url: _this.url,
                    accept: 'file',
                    multiple: false,
                    auto: true,
                    exts: _this.exts,
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                    },
                    // data: {
                    //     'userType':  _this.userType,
                    //     'importPersonnelType': () => {
                    //         return  _this.importPersonnelType;
                    //     }
                    // },
                    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                         //加载层-风格4
                        layId = layer.msg(_this.loadingMsg, {
                            icon: 16,
                            shade: 0.01,
                            time: 0
                        });
                    },
                    done: function (res, index, upload) {
                        
                        if (res.status == 200) { //上传成功
                            alert(res.msg);
                            _this.$emit('importSuccessAfter');
                            // _this.$refs.pagination.refresh(1);
                            return true; //删除文件队列已经上传成功的文件
                        } else {
                            alert(res.msg);
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {
                        layer.close(layId);
                    }
                });
        	});

        },
    }
}
</script>