<template>
    <button @click="downloadFile()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-cloud-download" aria-hidden="true"></i> {{ text }}</button>
</template>

<script>
import Base from "@/views/base/Base"
import { delAttament, downloadFile } from '@/api/file'

export default {
    extends: Base,
    data() {
        return {

        }
    },
    props: {
        text: {
            type: String,
            default: ''
        },
        module: {
            type: String,
            default: 'template'
        },
        name: {
            type: String,
            default: ''
        }
    },
    methods: {
        downloadFile: function() {
            if (!this.name) {
                alert("暂时无法下载");
            }
            var path = this.module + '/' + this.name;
            var fileName = this.text;
            downloadFile({
                path,
                fileName
            }).then(res => {
                this.download(res);
            }).catch(err => {
                if (err.msg) {
                    alert(err.msg);
                }
                console.log(err);
            });
        }
    }
}
</script>