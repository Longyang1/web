<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content">
                <layui-form>
                    <layui-fieldset label="基本信息" style="padding-right: 20px;">
	                	<template slot="main">
                            <layui-item v-if="multipleFile != 'y'">
                                <file-upload-input
                                    @uploadSuccessAfter="uploadSuccessAfter"
                                    save-file='n'
                                    module="file"
                                    name="filemfile"
                                    label="文件"></file-upload-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="标题" 
                                    placeholder="请输入标题"
                                    v-model="sysFileDirectory.title"
                                    :readonly="!(!sysFileDirectory.id || curUser.userId == sysFileDirectory.createBy)"
                                    :block='true'></layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-textarea
                                    label="备注" 
                                    v-model="sysFileDirectory.remark"
                                    :disabled="!(!sysFileDirectory.id || curUser.userId == sysFileDirectory.createBy)"
                                    placeholder="请输入备注"></layui-inline-textarea>
                            </layui-item>
	                	</template>
                    </layui-fieldset>
                    <file-upload
                        v-if="multipleFile == 'y'"
                        style="padding-right: 20px;"
                        :attachmentBusinessId="sysFileDirectory.id"
                        attachmentBusinessType="sys_file_directory"
                        module="file"
                        :readonly="!(!sysFileDirectory.id || curUser.userId == sysFileDirectory.createBy)"
                        ref="fileUpload"/>
					<layui-inline v-show="false" class="btn-group-center">
                        <button ref="saveBtn" v-if="!sysFileDirectory.id || curUser.userId == sysFileDirectory.createBy" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysFileDirectory"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
            <div v-if="initAfter" class="layui-footer">
                <button @click="toClick('saveBtn')" v-if="!sysFileDirectory.id || curUser.userId == sysFileDirectory.createBy" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-save"></i> 保存</button>
                <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
            </div> 
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/file/sysFileDirectory'
import BaseModal from "@/views/base/BaseModal"
import FileTree from '@/views/file/FileTree'

export default {
	name: 'FileUploadModal',
	extends: BaseModal,
    data () {
        return {
            sysFileDirectory: {
                id: this.$route.params.id || this.id,
                parentId: this.parentId,
                type: '1',
                title: '',
				name: '',
				code: '',
				level: '',
                remark: '',
                multipleFile: this.multipleFile
			},
            parentName: '',
            initAfter: false,
        }
	},
	props: {
        id: {
            type: String,
			default: ''
        },
	    layerid: {
			type: String,
			default: null
        },
        parentId: {
			type: String,
			default: null
        },
        multipleFile: {
			type: String,
			default: null
        },
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
        save: function() {
            this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.sysFileDirectory), JSON.stringify(this.$refs.fileUpload.getAttamentIds()), token).then(result => {
					alert(result.msg);
					if (this.layerid) {
                        this.$parent.uploadAfter(this.sysFileDirectory.id == null, this.layerid);
					} else {
						this.backListView(this.sysFileDirectory.id == null);
					}
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
        },
        uploadSuccessAfter: function(file) {
            alert(file.path);
        },
        initData: function(){
            if(this.sysFileDirectory.id){
                get(this.sysFileDirectory.id).then(result => {
                    var data = result.data;
                    if (data) {
                        this.sysFileDirectory =  data.sysFileDirectory || this.sysFileDirectory;
                    }
                    this.initAfter = true;
                }).catch(error => {
                    this.initAfter = true;
                });
            } else {
                 this.initAfter = true;
            }
            
        	// getDicts('').then(result => {
            //     var data = result.data;
            //     if(data){
            //     }
            // });
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

				form.on('submit(saveSysFileDirectory)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
.layui-footer {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    background-color: #eee;
}
.view-product /deep/ .layui-form-item.layui-form-text, .view-product /deep/ .layui-form-item.layui-form-text {
    padding-right: 0px!important;
}
</style>