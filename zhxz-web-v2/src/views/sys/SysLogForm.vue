<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <div style="padding: 20px; background-color: #F2F2F2;">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-header">日志信息</div>
                                <div class="layui-card-body">
                                    <layui-item>
                                        <layui-inline-input
                                            label="日志标题" 
                                            placeholder="日志标题"
                                            v-model="sysLog.title"
                                            :readonly="true"
                                            :block="true"></layui-inline-input>
                                    </layui-item>
                                    <layui-item>
                                        <layui-inline-input
                                            label="操作对象" 
                                            placeholder="操作对象"
                                            :readonly="true"
                                            v-model="sysLog.operateObject"></layui-inline-input>
                                        <layui-inline-input
                                            label="日志类型" 
                                            placeholder="日志类型"
                                            :readonly="true"
                                            :value="typeMap[sysLog.type]"></layui-inline-input>
                                        <layui-inline-input
                                            label="日志级别" 
                                            placeholder="日志级别"
                                            :readonly="true"
                                            :value="levelMap[sysLog.level]"></layui-inline-input>
                                        <layui-inline-input
                                            label="执行时间(ms)" 
                                            placeholder="执行时间"
                                            :readonly="true"
                                            v-model="sysLog.execTime"></layui-inline-input>
                                    </layui-item>
                                    <layui-item>
                                        <layui-inline-input
                                            label="用户代理" 
                                            placeholder="用户代理"
                                            :readonly="true"
                                            v-model="sysLog.userAgent"
                                            :block="true"></layui-inline-input>
                                    </layui-item>
                                    <layui-item>
                                        <layui-inline-input
                                            label="请求URI" 
                                            placeholder="请求URI"
                                            v-model="sysLog.requestUri"
                                            :readonly="true"
                                            :block="true"></layui-inline-input>
                                    </layui-item>
                                    <layui-item>
                                        <layui-inline-input
                                            label="操作IP地址" 
                                            placeholder="操作IP地址"
                                            :readonly="true"
                                            v-model="sysLog.remoteAddr"></layui-inline-input> 
                                        <layui-inline-input
                                            label="操作方式" 
                                            placeholder="请输入操作方式"
                                            v-model="sysLog.method"
                                            :readonly="true"></layui-inline-input>
                                    </layui-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="padding: 20px; background-color: #F2F2F2;">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header">操作提交的数据</div>
                                <div class="layui-card-body">
                                    <json-viewer
                                        :value="params"
                                        :expand-depth='3'></json-viewer>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header">执行结果</div>
                                <div class="layui-card-body">
                                    <json-viewer
                                        :value="result"
                                        :expand-depth='3'></json-viewer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div style="padding: 20px; background-color: #F2F2F2;">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-header">异常信息</div>
                                <div class="layui-card-body">
                                    <pre class="layui-code" lay-title="JavaScript" lay-skin="notepad">
                                        {{ sysLog.exception }}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <layui-form>
					<layui-inline class="btn-group-center">
                        <button v-if="false" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysLog"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/sysLog'
import Base from "@/views/base/Base"

export default {
	name: 'SysLogForm',
	extends: Base,
    data () {
        return {
            types: [],
            levels: [],
            sysLog: {
                id: this.$route.params.id,
				operateObject: '',
				title: '',
				type: '',
				level: '',
				remoteAddr: '',
				userAgent: '',
				requestUri: '',
				method: '',
				params: '',
				result: '',
				exception: '',
				execTime: '',
				createBy: '',
				createDate: '',
            },
            result: {},
            params: {}
        }
    },
    computed: {
        typeMap: function() {
           return this.types.array2Obj('value', 'label');
        },
        levelMap: function() {
           return this.levels.array2Obj('value', 'label');
        },
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
	            saveOrUpdate(JSON.stringify(this.sysLog), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.sysLog.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.sysLog.id){
                get(this.sysLog.id).then(res => {
                    var data = res.data;
                    if(data) {
                        this.sysLog =  data.sysLog || this.sysLog;
                        var resJson = this.sysLog.result;
                        this.result = JSON.parse(resJson || "{}");
                        this.params = JSON.parse(this.sysLog.params || "{}");
                    }
                });
            }
            
        	getDicts('OPERATE_TYPE_DICT,OPERATE_LEVEL_DICT').then(result => {
                var data = result.data;
                if(data) {
                    this.types = data[0];
                    this.levels = data[1];
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

				form.on('submit(saveSysLog)', function(data){
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