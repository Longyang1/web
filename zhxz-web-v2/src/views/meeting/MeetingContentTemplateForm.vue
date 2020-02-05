<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="会议内容模板信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="模板名称" 
		                            placeholder="请输入模板名称"
									:block=true
									:required="true"
		                            v-model="meetingContentTemplate.name"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="会议类型"
		                            v-model="meetingContentTemplate.meetingTypeDict"
									:required="true"
		                            :items="meetingTypeDicts"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="模板内容类型"
		                            v-model="meetingContentTemplate.contentTypeDict"
									:required="true"
		                            :items="contentTypeDicts"></layui-inline-select>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="会议变量"
		                            v-model="meetingVar"
									valKey="label"
		                            :items="meetingInstructionsVariables">
                                    <button @click="insertVar" class="layui-btn layui-btn-lg layui-btn-blue"><i class="iconfont icon-Inserttopic"></i> 插入变量</button>
									<!-- <button @click="insertVar" class="layui-btn">插入变量</button> -->
								</layui-inline-select>
		                    </layui-item>
							<layui-item>
								<layui-inline-ue
									label="模板内容"
									:ueConfig="{
										initialFrameHeight: 300
									}"
									:value="meetingContentTemplate.content"
									ref="contentUe"></layui-inline-ue>
		                    </layui-item>
						</template>
					</layui-fieldset>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveMeetingContentTemplate"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/meeting/meetingContentTemplate'
import Base from "@/views/base/Base"

export default {
    name: 'MeetingContentTemplateForm',
	extends: Base,
    data () {
        return {
			meetingTypeDicts: [],
			contentTypeDicts: [],
			meetingInstructionsVariables: [],
            meetingContentTemplate: {
                id: this.$route.params.id,
				name: '',
				meetingTypeDict: '',
				contentTypeDict: '',
				content: '',
			},
			meetingVar: ''
        }
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
		insertVar: function () {
    		var ue = this.$refs.contentUe.getUe().editor;
    		//ue.focus();  
			ue.execCommand('inserthtml', this.meetingVar); 
		},
    	save: function() {
            this.submitHandler((token) => {
                this.meetingContentTemplate.content = this.$refs.contentUe.getContent();
                saveOrUpdate(JSON.stringify(this.meetingContentTemplate), token).then(result => {
                    alert(result.msg);
                    this.backListView(this.meetingContentTemplate.id == null);
                }).catch((reason) => {
                    console.log('catch:', reason);
                    this.resetToken(reason);
                });
            });
    	},
        initData: function(){
		
            if(this.meetingContentTemplate.id){
                get(this.meetingContentTemplate.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.meetingContentTemplate =  data.meetingContentTemplate || this.meetingContentTemplate;
                    }
                });
            }
            
        	getDicts('MEETING_TYPE_DICT,CONTENT_TYPE_DICT,MEETING_INSTRUCTIONS_VARIABLE').then(result => {
                var data = result.data;
                if(data){
                    this.meetingTypeDicts = result.data[0] || [];
					this.contentTypeDicts = result.data[1] || [];
					this.meetingInstructionsVariables = data[2] || [];
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

				form.on('submit(saveMeetingContentTemplate)', function(data){
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