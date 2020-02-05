<template>
    <button @click="toFileDownloadView" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-external-link" aria-hidden="true"></i>&nbsp;&nbsp;{{ text }}</button>
</template>

<script>
import FileDownloadModal from '@/components/FileDownloadModal'

export default {
    data() {
        return {

        }
    },
    props: {
        text: {
            type: String,
            default: '文件下载'
        },
        data: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        toFileDownloadView: function() {
            this.$layer.iframe({
                content: {
                    content: FileDownloadModal, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        text: this.text,
                        data: this.data
                    }//props
                },
                area:['600px', 'auto'],
                title: this.text,
            });
        }
    }
}
</script>