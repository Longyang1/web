<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="XX信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="文件下载任务类型" 
		                            placeholder="请输入文件下载任务类型"
		                            v-model="sysAttachmentDownload.fileDownloadType"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="文件下载任务类型代码"
		                            v-model="sysAttachmentDownload.fileDownloadTypeDict"
		                            :items="fileDownloadTypeDicts"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="任务标题" 
		                            placeholder="请输入任务标题"
		                            v-model="sysAttachmentDownload.taskTitle"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="附件文件名称" 
		                            placeholder="请输入附件文件名称"
		                            v-model="sysAttachmentDownload.attachmentName"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="附件排序号" 
		                            placeholder="请输入附件排序号"
		                            v-model="sysAttachmentDownload.fileOrder"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="文件版本号" 
		                            placeholder="请输入文件版本号"
		                            v-model="sysAttachmentDownload.fileVerion"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="附件大小" 
		                            placeholder="请输入附件大小"
		                            v-model="sysAttachmentDownload.attachmentSize"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="文件类型" 
		                            placeholder="请输入文件类型"
		                            v-model="sysAttachmentDownload.fileType"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="附件存放路径" 
		                            placeholder="请输入附件存放路径"
		                            v-model="sysAttachmentDownload.attachmentSavePath"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="附件说明" 
		                            placeholder="请输入附件说明"
		                            v-model="sysAttachmentDownload.attachmentStatement"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建人员ID" 
		                            placeholder="请输入创建人员ID"
		                            v-model="sysAttachmentDownload.createBy"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="创建时间" 
		                            placeholder="请输入创建时间"
		                            v-model="sysAttachmentDownload.createDate"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="任务开始时间" 
		                            placeholder="请输入任务开始时间"
		                            v-model="sysAttachmentDownload.taskStartDate"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="任务结束时间" 
		                            placeholder="请输入任务结束时间"
		                            v-model="sysAttachmentDownload.taskEndDate"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="文件生成状态0进行中1已完成2异常" 
		                            placeholder="请输入文件生成状态0进行中1已完成2异常"
		                            v-model="sysAttachmentDownload.status"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="任务执行日志" 
		                            placeholder="请输入任务执行日志"
		                            v-model="sysAttachmentDownload.taskExecLog"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="" 
		                            placeholder="请输入"
		                            v-model="sysAttachmentDownload.dirName"></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysAttachmentDownload"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/sysAttachmentDownload'
import Base from "@/views/base/Base"

export default {
	name: 'SysAttachmentDownloadForm',
	extends: Base,
    data () {
        return {
			fileDownloadTypeDicts: [],
            sysAttachmentDownload: {
                id: this.$route.params.id,
				fileDownloadType: '',
				fileDownloadTypeDict: '',
				taskTitle: '',
				attachmentName: '',
				fileOrder: '',
				fileVerion: '',
				attachmentSize: '',
				fileType: '',
				attachmentSavePath: '',
				attachmentStatement: '',
				createBy: '',
				createDate: '',
				taskStartDate: '',
				taskEndDate: '',
				status: '',
				taskExecLog: '',
				dirName: '',
            },
        }
    },
    computed: {
       	
	},
	watch: {
        
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.sysAttachmentDownload), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.sysAttachmentDownload.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.sysAttachmentDownload.id){
                get(this.sysAttachmentDownload.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.sysAttachmentDownload =  data.sysAttachmentDownload || this.sysAttachmentDownload;
                    }
                });
            }
            
        	getDicts('FILE_DOWNLOAD_TYPE_DICT,').then(result => {
                var data = result.data;
                if(data){
                    this.fileDownloadTypeDicts = result.data['序号'] || [];
                }
            });
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form'], function(){
        		var element = element
        		,form = layui.form;

				//自定义验证规则
				form.verify({
					title: function(value){
					    if(value.length < 10){
					    	return '标题至少得10个字符哟';
					    }
					}
					,content: function(value){
					    layedit.sync(editIndex);
					}
				});

				form.on('submit(saveSysAttachmentDownload)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>

</style>