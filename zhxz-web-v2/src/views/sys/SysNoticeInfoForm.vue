<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="修改通知公告信息">
	                	<template slot="main">
							<layui-item>
		                        <layui-inline-input
									lay-verify="required"
                            		:cssStyle="{width:'802px'}"
		                            label="标题" 
		                            placeholder="请输入标题"
		                            v-model="sysNoticeInfo.infoTitle"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
									:cssStyle="{width:'802px'}"
		                            label="副标题" 
		                            placeholder="请输入副标题"
		                            v-model="sysNoticeInfo.infoSubtitle"></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-date
									:cssStyle="{width:'320px'}"
									label="发布时间"
									placeholder="点击选择日期"	
									name="startTime"
									v-model="sysNoticeInfo.pubTime"/>
							</layui-item>
							<layui-item>
								 <layui-inline-radio
									label="是否置顶"
									v-model="sysNoticeInfo.topFlag"
									:items="regularFlags"/>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
									:cssStyle="{width:'320px'}"
		                            label="显示顺序" 
		                            placeholder="100"
		                            v-model="sysNoticeInfo.infoDispOrder"></layui-inline-input>
		                    </layui-item>
							<layui-item>
								<layui-inline-ue
									label="内容"
									:cssStyle="{'width':'945px'}"
									:ueConfig="{'height':'600px'}"
									:value="sysNoticeInfo.infoContent"
									ref="descUe"></layui-inline-ue>
							</layui-item>
						</template>
					</layui-fieldset>
					<!--文件上传-->
          			<file-upload
						:attachmentBusinessId="sysNoticeInfo.id"
						attachmentBusinessType="sys_notice_info"
						module="sys"
						ref="fileUpload"/>
					
					<layui-inline :style="{width:'100%'}" class="btn-group-center">
                        <div >
                            <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysNoticeInfo"><i class="fa fa-save"></i> 保存</button>
                            <button class="layui-btn layui-btn-lg layui-btn-red"  @click="close"><i class="fa fa-times"></i> 关闭</button>
                        </div>
                    </layui-inline> 
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { saveOrUpdate, get } from '@/api/sys/sysNoticeInfo'
import Base from "@/views/base/Base"
import {formatDate} from "../../utils/formatUtils";


export default {
	extends: Base,
    data () {
        return {
        	menuId: 'SysNoticeInfoForm',
            sysNoticeInfo: {
                id: this.$route.params.id,
				topFlag: '',
				infoTitle: '',
				infoSubtitle: '',
				infoTag: '',
				infoContent: '',
				infoDispOrder: '',
				viewCount: '',
				pubTime: '',
				updateDate: '',
				updateBy: '',
				createDate: '',
				createBy: '',
				attachmentIds:[],
			},
		 regularFlags: [
			{
				label: "是",
				value: "y"
			},
			{
				label: "否",
				value: "n"
			}
			],
        }
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
    	save: function(){  
			if(!this.sysNoticeInfo.infoDispOrder){
				this.sysNoticeInfo.infoDispOrder = 100;
			}
			this.sysNoticeInfo.attachmentIds = this.$refs.fileUpload.getAttamentIds(),
			this.sysNoticeInfo.infoContent = this.$refs.descUe.getContent();

			this.submitHandler((token) => {
                saveOrUpdate(JSON.stringify(this.sysNoticeInfo),JSON.stringify(this.$refs.fileUpload.getAttamentIds()),token).then(result => {
					alert(result.msg);
					this.backListView(this.sysNoticeInfo.id == null);
				}).catch((error) => {
					this.resetToken(error);
				});
			});
    	},
        initData: function(){
            if(this.sysNoticeInfo.id){
                get(this.sysNoticeInfo.id).then(result => {
                    var data = result.data;
                    if(data) {
						this.sysNoticeInfo =  data.sysNoticeInfo || this.sysNoticeInfo;
						this.sysNoticeInfo.pubTime = formatDate(this.sysNoticeInfo.pubTime, "YYYY-MM-DD") ;
                    }
                });
            }
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
				form.on('submit(saveSysNoticeInfo)', function(data){
					var int = /^[0-9]*$/;
					if(!int.test(_this.sysNoticeInfo.infoDispOrder) && _this.sysNoticeInfo.infoDispOrder!=undefined){
						alert('显示顺序须为数字');
						return;
					}
					if(!_this.sysNoticeInfo.pubTime){
						alert('请选择发布时间');
						return;
					}
					_this.save();
					return false;
				});
        	});
		},
		close:function(){
            this.backListView(this.sysNoticeInfo.id == null);
        }
    }
}
</script>

<style scoped>

.rule-Div{
    height:39px;
    border:solid 1px #e6e6e6;
    width:762px
}
.rule-Div1{
    background:#FBFBFB;
     width:140px ;
    /* text-align:center; */
    height:38px; 
    font-size:12px;
    font-family: Microsoft;
    text-align:center
}
.ruleSpan{
    position:relative;
    top:8px;
}
.rule-Div2{
    position:relative;
    top:-38px;
    left:139px;
    border-left:solid 1px #e6e6e6;
    height:38px;
    font-size:12px;
    width:100%
}


</style>