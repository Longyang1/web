<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="消息信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="消息标题" 
		                            placeholder="请输入消息标题"
		                            v-model="sysMsg.title"
									:block=true></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-select
		                            label="消息类型"
		                            v-model="sysMsg.msgTypeDict"
		                            :items="msgTypeDicts"></layui-inline-select>
								<select-user-input
									label="接收人" 
									placeholder="点击选择"
									:userName="userMap[receiver]"
									v-model="receiver"/>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
		                            label="消息内容" 
		                            placeholder="请输入消息内容"
		                            v-model="sysMsg.content"></layui-inline-textarea>
		                    </layui-item>
						</template>
					</layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysMsg"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/msg/sysMsg'
import Base from "@/views/base/Base"

export default {
	name: 'SysMsgForm',
	extends: Base,
    data () {
        return {
			msgTypeDicts: [],
            sysMsg: {
                id: this.$route.params.id,
				title: '',
				content: '',
				msgType: '',
				msgTypeDict: '',
				params: '',
			},
			receiver: null,
			userMap: {}
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
	            saveOrUpdate(JSON.stringify(this.sysMsg), this.receiver, token).then(result => {
	                alert(result.msg);
	                this.backListView(this.sysMsg.id == null, "Msg");
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.sysMsg.id){
                get(this.sysMsg.id).then(result => {
                    var data = result.data;
                    if (data) {
						this.sysMsg =  data.sysMsg || this.sysMsg;
						this.userMap = data.userMap || {};
						var msgRecordMap = data.msgRecordMap || {};
						this.receiver = (msgRecordMap[this.sysMsg.id] || [{}])[0].receiver;
                    }
                });
            }
            
        	getDicts('MSG_TYPE_DICT,').then(result => {
                var data = result.data;
                if(data){
                    this.msgTypeDicts = result.data[0] || [];
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

				form.on('submit(saveSysMsg)', function(data){
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