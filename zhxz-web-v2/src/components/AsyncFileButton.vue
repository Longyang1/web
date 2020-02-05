<template>
    <button @click="toAsyncFileView" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-share" aria-hidden="true"></i>&nbsp;&nbsp;{{ text }}</button>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        type: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '导出结果查看'
        }
    },
    methods: {
        toAsyncFileView: function() {
            var type = this.type;
            var view = this.$parent;
            while (true) {
                if (!view) {
                    break;
                }
                if (view.clickMenu) {
                    view.closeTabByName('SysAttachmentDownloadList');
                    view.clickMenu({
                        "checked": false,
                        "icon": "fa-legal",
                        "id": "sysAttachmentDownload",
                        "name": "SysAttachmentDownloadList",
                        "parentId": "4",
                        text: "文件下载管理",
                        "children": [

                        ]
                    }, 3, {
                        type
                    });
                    break;
                }
                view = view.$parent;
            }
        }
    }
}
</script>