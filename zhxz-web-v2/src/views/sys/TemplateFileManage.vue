<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>模板文件管理</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <button ref="importTemplateBtn" class="hidden" id="importTemplateBtn"></button>
                            <layui-inline-input style="margin-top: 15px;" placeholder="文件名称" v-model="fileName"></layui-inline-input>
                            <table class="footable table table-stripped" style="margin-top: 15px;">
                                <thead>
                                    <tr>
                                        <th width="5%" style="text-align:center;">序号</th>
                                        <th style="text-align:center;width: 75%">文件名称</th>
                                        <th style="text-align:center;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="meetingTbody" class="footable_table">
                                    <template v-for="(item, index) in items">
                                        <tr 
                                            :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                            style="display: table-row;"
                                            :key="item.value">
                                            <td width="5%" style="text-align:center;">{{ index + 1  }}</td>
                                            <td style="text-align:center;width: 75%"><span @click="downloadTemplate(item)" class="color_0" :title="item.label">{{ item.label }}({{ getFileName(item) }})</span></td>
                                            <td style="text-align:center;width: 20%"><span @click="upload(item)" class="color_0">重新上传</span></td>
                                        </tr>
                                    </template>
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { downloadFile } from '@/api/file'
import { getToken } from '@/utils/auth'
import Base from "@/views/base/Base"

export default {
	name: 'TemplateFileManage',
    extends: Base,
    data () {
        return {
            templateFileDicts: [],
            templateDict: {},
            items: [],
            fileName: '',
        }
    },
    watch: {
        fileName: function() {
            this.items = this.templateFileDicts.filter(item => {
                return item.label && item.label.indexOf(this.fileName) != -1;
            });
        }
    },
    mounted () {
        this.initData();
        this.$nextTick(() => {
		    this.layuiInit();
		});
    },
    methods: {
        getFileName: function(dict) {
            if (!dict.desc) {
                return '';
            }
            var config = JSON.parse(dict.desc);
            return config.name;
        },
        initData: function() {
            getDicts('TEMPLATE_FILE_DICT').then(result => {
                this.templateFileDicts = result.data[0];
                this.items = this.templateFileDicts.filter(item => {
                    return item.label && item.label.indexOf(this.fileName) != -1;
                });
            });
        },
        downloadTemplate: function(dict) {
            if (!dict.desc) {
                msg("文件信息缺失，无法下载预览！");
                return;
            }
            var config = JSON.parse(dict.desc);
            downloadFile({
                path: (config.module + '/' + config.name)
            }).then(res => {
               this.download(res)
            }).catch(err => {
                console.log(err);
                // msg(err.msg);
            });
        },
        upload: function(dict) {
            confirm("确定重新上传【" + dict.label + "】吗？", () => {
                this.templateDict = dict;
                this.$refs.importTemplateBtn.click();
            });
        },
        layuiInit: function() {
            var _this = this;
            var layId = null;
        	layui.use(['element', 'upload'], function(){
        		var element = layui.element
                ,upload = layui.upload;

                var uploadListIns = upload.render({
                    elem: '#importTemplateBtn',
                    url: '/api/file/upload/templateFile',
                    accept: 'file',
                    multiple: false,
                    auto: true,
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                    },
                    data: {
                        'module': () => {
                            var config = JSON.parse(_this.templateDict.desc);
                            return config.module;
                        },
                        'fileName': () => {
                            var config = JSON.parse(_this.templateDict.desc);
                            return config.name;
                        }
                    },
                    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                         //加载层-风格4
                        layId = layer.msg('文件上传中', {
                            icon: 16,
                            shade: 0.01,
                            time: 0
                        });
                    },
                    done: function (res, index, upload) {
                        
                        if (res.status == 200) { //上传成功
                            alert("上传成功");
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

<style scoped>
.footable_table td > span {
    color: rgb(30, 159, 255);
}
.footable_table td > span.color_0 {
    color: rgb(30, 159, 255);
}
.footable_table td > span.color_1 {
    color: #FFB800;;
}
.footable_table td > span.color_2 {
    color: red;
}
.footable_table td > span.color_9 {
    color: rgb(30, 159, 255);
}
.tab-background /deep/ .layui-form-select input {
    height: 26px;
    border-color: #ced2d7;
}
</style>
