<template>
    <div class="view-product" v-cloak>
        <button id="importAssessment" class="hidden" ref="importAssessment">隐藏的按钮</button>
        <button id="uploadAssessmentBtn" class="hidden" ref="uploadAssessmentBtn">隐藏的上传按钮</button>
        <div class="animated">
            <div class="ibox-content" style="overflow-x: hidden; min-width: 740px">
                <layui-form>
                    <template>
                        <layui-item>
                            <layui-inline-input
                                label="年度" 
                                placeholder="请输入年度"
                                type="number"
                                lay-verify="required"
                                v-model="year"></layui-inline-input>
                            <layui-inline-input
                                label="考核文件" 
                                placeholder="点击选择考核文件"
                                :readonly="true"
                                lay-verify="required"
                                func="openFileModal"
                                @openFileModal="openFileModal"
                                v-model="excelName"></layui-inline-input>
                        </layui-item>
                    </template>
                    <hr class="layui-bg-blue" style="margin-bottom: 8px;width: 680px;">
                    <div style="margin-bottom: 20px;width: 680px;">
                        <ul class="pwd-rule">
                            <li style="font-weight: bold;">提示：年度一定填写准确，以你界面输入的年度为准，不以文件中年度为准。</li>
                            <li></li>
                        </ul>
                    </div>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="importAssessment"><i class="fa fa-cloud-upload"></i> 导入</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import BaseModal from "@/views/base/BaseModal"
import { formatDate } from '@/utils/formatUtils'
import { getToken } from '@/utils/auth'

export default {
    name: 'AssessmentExcelUpload',
	extends: BaseModal,
    data () {
        return {
            year: (new Date().getFullYear() -1),
            excelName: '',
            lastFindex: null,
        }
    },
    computed: {
       	
	},
	watch: {
        
    },
    mounted () {
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        openFileModal: function() {
            this.$refs.importAssessment.click();
        },
    	save: function(){  
            this.$refs.uploadAssessmentBtn.click();
    		// this.submitHandler((token) => {    	
                	
	        //     saveOrUpdate(JSON.stringify(this.personnelLearningExperience), this.attachmentId,  token).then(result => {
            //         alert(result.msg);
            //         if (this.layerid) {
            //             this.$parent.refreshComp();
            //             this.$layer.close(this.layerid);
            //         } else {
            //             this.backListView(this.personnelLearningExperience.id == null);
            //         }
	        //     }).catch((error) => {
	        //         // 此处你的业务代码
	        //         this.resetToken();
	        //     });
    		// });
    	},
        layuiInit: function(){
             var _this = this;
            var layId = null;
        	layui.use(['element', 'form'], function(){
        		var element = element
                ,form = layui.form
                ,upload = layui.upload;

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

				form.on('submit(importAssessment)', function(data){
					_this.save();
					return false;
                });
                
                 var uploadListIns = upload.render({
                    elem: '#importAssessment',
                    url: '/api/personnel/personnelAnnualAssessments/importAssessment',
                    accept: 'file',
                    multiple: false,
                    auto: false,
                    exts: 'xls|xlsx',
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                    },
                    data: {
                        'year': () => {
                            return  _this.year;
                        }
                    },
                    bindAction: '#uploadAssessmentBtn', //指向一个按钮触发上传
                    choose: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。

                        //将每次选择的文件追加到文件队列
                        var files = obj.pushFile();
                        
                        //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                        obj.preview(function(index, file, result) {
                            if (_this.lastFindex) {
                                delete files[_this.lastFindex];
                            }
                            _this.lastFindex = index;
                            console.log(index); //得到文件索引
                            console.log(file); //得到文件对象
                            _this.excelName = file.name;
                            console.log(result); //得到文件base64编码，比如图片
                            
                            //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                            
                            //这里还可以做一些 append 文件列表 DOM 的操作
                            //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                            //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                        });
                    },
                    before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                         //加载层-风格4
                        layId = layer.msg(_this.year + '年度考核信息导入中', {
                            icon: 16,
                            shade: 0.01,
                            time: 0
                        });
                    },
                    done: function (res, index, upload) {
                        
                        if (res.status == 200) { //上传成功
                            alert("导入成功");
                            _this.$refs.pagination.refresh(1);
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
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
        }
    }
}
</script>

<style scoped>
    .view-product {
        padding-bottom: 0px;
        overflow-x: hidden;
    }
    .ibox-content {
        /* border-width: 0px;
        padding: 20px;
        padding-right: 0; */
        padding: 20px 0px;
        padding-left: 24px;
    }
</style>