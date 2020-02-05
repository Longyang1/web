<template>
    <div class="view-product" v-cloak> 
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-fieldset label="规则基本信息"></layui-fieldset>
                <layui-form >
                	<layui-item >
                        <layui-inline-input 
                            :style="{width:'500px'}"
                            :cssStyle="{width:'100%'}"
                            label="规则名称" 
                            placeholder="请输入规则名称"
                            lay-verify="required"
                            v-model="sysSerialNumber.ruleName">
                        </layui-inline-input>
                        <layui-inline-input
                           :style="{width:'500px'}"
                            :cssStyle="{width:'100%'}"
                            readonly="readonly"
                            label="规则标识值" 
                            placeholder="自动生成"
                            lay-verify="required"
                            v-model="sysSerialNumber.ruleKey">
                        </layui-inline-input>
                    </layui-item>
					<layui-item>
                        <layui-inline-select   
                            :style="{width:'500px'}"                        
                            label="代码类别" 
                            lay-verify="required"
                            placeholder="请输入代码类别"
                            :items="dictTypes"
                            valKey="dictTypeCode"
                            labelKey="dictTypeName"
                            v-model="sysSerialNumber.dictType">
                        </layui-inline-select>
                        <layui-inline-select                   
                            label="代码数据项"  
                            lay-verify="required"
                            :items="dictValues"
                            labelKey="label"
                            valKey="value"
                            v-model="sysSerialNumber.dictValue">
                           
                        </layui-inline-select>
                    </layui-item>
					<layui-item>
                        <layui-inline-input
                            :style="{width:'500px'}"
                            
                            label="编号模板" 
                            placeholder="请输入编号模板"
                            lay-verify="required"
                            v-model="sysSerialNumber.serialNumberTemplate">
                        </layui-inline-input>
                        <layui-inline-select                      
                            label="重置周期" 
                            placeholder="请输入重置周期"
                            :items="dicts"
                            labelKey="label"
                            valKey="value"
                            lay-verify="required"
                            v-model="sysSerialNumber.resetCycleDict">
                        </layui-inline-select>
                    </layui-item>					
					<layui-item>
                        <div  class="rule-Div" >
                            <div class="rule-Div1" ><span class="ruleSpan">编号规则</span><span style="position:relative;left:20px;color:red;top:10px">*</span></div>
                            <div  class="rule-Div2" >
                                <span  class="ruleSpan2" >
                                    从<input type="text" lay-verify="required"   size="8%" v-model="sysSerialNumber.serialNumberStart"/>开始，长度为
                                    <input type="text"  lay-verify="required"  size="8%" v-model="sysSerialNumber.serialNumberLength"/>位，步长为
                                    <input type="text" lay-verify="required" class="layui-form-danger layui-required" size="8%" v-model="sysSerialNumber.serialNumberStep"/>长度不足时用
                                    <input type="text" lay-verify="required" class="layui-form-danger layui-required" size="8%"  v-model="sysSerialNumber.serialNumberFill"/>填充
                                </span>
                            </div>  
                        </div>
                    </layui-item>
                    <layui-item v-if = "this.sysSerialNumber.id">
                        <layui-inline-input
                            readonly
                            :style="{width:'40%'}"
                            :cssStyle="{width:'100%'}"
                            label="当前最新值" 
                            placeholder="当前最新值"
                            v-model="sysSerialNumber.currentNo">
                         </layui-inline-input>
                         <layui-inline-input
                            readonly
                             :style="{width:'40%'}"
                            :cssStyle="{width:'100%'}"
                            label="设置最新编号为" 
                            placeholder="设置最新编号为"
                            v-model="sysSerialNumber.currentSerialNumber">
                         </layui-inline-input>
                    </layui-item>
                    <layui-item>
                        <div class="div-Instr">
                            <div class="div-Instr1"><span class="instr-Span1">编号说明:</span></div>
                            <div class="div-Instr2">
                                <span  class="instr-Span2">
                                {yyyy}:表示年份<br>   {MM} : 表示月份，如果月份小于10，则加零补齐，如1月份表示为01。<br> 
                                {mm}  : 表示月份，月份不补齐，如1月份表示为1。<br> 
                                {DD}  : 表示日，如果小于10号，则加零补齐，如1号表示为01。<br> 
                                {dd}  : 表示日，日期不补齐，如1号表示为1。<br> 
                                {NO}   : 表示流水号，前面补零。<br>
                                {no}    : 表示流水号，后面补零。
                                </span>
                            </div>
                        </div>
                    </layui-item>
					<layui-item>
                        <div class="div-Mark">
                            <div class="div-Mark1"><span class="mark-Span1">备注:</span></div>
                            <div class="div-Mark2">
                                <layui-inline-textarea
                                    :style="{width:'875px'}"
                                    v-model="sysSerialNumber.remarks"></layui-inline-textarea>
                            </div>
                        </div>  
                    </layui-item>
                    <layui-inline :style="{width:'100%'}" class="btn-group-center">
                            <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysSerialNumber" ><i class="fa fa-save"></i> 保存</button>
                            <button class="layui-btn  layui-btn-lg layui-btn-red"  @click="close"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>     
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts, getDictTypes } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/sysSerialNumber'
import Base from '@/views/base/Base'
export default {
    extends: Base,
    name:'SysSerialNumberForm',
    data () {
        return {
            datas: [],
            resetCycleDicts: [],
            dicts:[],
            dictTypes:[],
            dictValues:[],
            sysSerialNumber: {
                id: this.$route.params.id,
				ruleName: '',
				ruleKey: '',
				dictType: '',
				dictValue: '',
				serialNumberTemplate: '',
				resetCycle: '',
				resetCycleDict: '',
				serialNumberStart: '',
				serialNumberLength: '',
				serialNumberStep: '',
				serialNumberFill: '',
				currentNo: '',
				currentSerialNumber: '',
				remarks: '',
            },
        }
    },
    computed: {
        //创建map结构,存储resetCycle的类型为value和类型代码值为key
        resetCycleDicttMap:function() {
            return this.dicts ? this.dicts.array2Obj('value', 'label') : {};
        },
	},
	watch: {
        //监听代码类别下拉框类的sysSerialNumber.dictTypeDict如果数据发生变化则触发
		'sysSerialNumber.dictType': function() {
            var dictTypeCode=this.sysSerialNumber.dictType
            //调用方法发送请求查询类型
            getDicts(dictTypeCode).then(result => {
                this.dictValues = result.data[0] || [];
            });
        },
        //拼接"ruleKey"
        'sysSerialNumber.dictValue': function() {
            this.$set(this.sysSerialNumber,"ruleKey",this.sysSerialNumber.dictType+"|"+this.sysSerialNumber.dictValue);
        },
        // sysSerialNumber.resetCycleDict的值发生改变时，
        // 则获取resetCycleDicttMap内的值，赋值给sysSerialNumber.resetCycle
        'sysSerialNumber.resetCycleDict':function(){
            this.sysSerialNumber.resetCycle = this.resetCycleDicttMap[this.sysSerialNumber.resetCycleDict];
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
            this.submitHandler((token) => {
                //调用sysSerialNumber.js的方法发送求情
                saveOrUpdate(JSON.stringify(this.sysSerialNumber), token).then(result => {
                    //返回的msg为‘ok'则"保存成功!"否则"保存失败"，
                    alert(result.msg);
                    //保存后，返回列表页，别切关闭当前表单页
                    this.backListView(this.sysSerialNumber.id==null);
                }).catch((error) => {
                    this.resetToken();
                });
            })
    	},
        initData: function(){
            //初始化查询代码值
            getDicts('RESET_CYCLE_DICT').then(result => {
                var data = result.data;
                if(data){
                    this.dicts = data[0] || [];
                }
            });
            //查询所有的代码类型
            getDictTypes().then(result => {
                var data = result.data;
                if(data){
                    this.dictTypes = data.sysDictTypes || [];
                }
            });
            //如果初始化时携带有id则进行查询
            if(this.sysSerialNumber.id){
                get(this.sysSerialNumber.id).then(result => {
                    this.datas.push(result.data);
                    var data = result.data;
                    if(data) {
                        this.sysSerialNumber =  data || this.sysSerialNumber;
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
				form.on('submit(saveSysSerialNumber)', function(data){		
                    var int = /^[0-9]*$/;
                    if(!int.test(_this.sysSerialNumber.serialNumberStart) || !int.test(_this.sysSerialNumber.serialNumberLength) || !int.test(_this.sysSerialNumber.serialNumberStep) || !int.test(_this.sysSerialNumber.serialNumberFill)){
                        alert('编号规则须为数字')
                        return;
                    }
                    _this.save();
                    return false;                       
				});
        	});
        },
        close:function(){
            this.backListView(this.sysSerialNumber.id == null);
        }
    }
}
</script>

<style scoped>

.rule-Div{
    height:39px;
    border:solid 1px #e6e6e6;
    width:1013px
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
    left:138px;
    border-left:solid 1px #e6e6e6;
    height:38px;
    font-size:12px;
    width:100%
}
.ruleSpan2{
    position:relative;
    left:10px;
    top:5px
}

.div-Instr{
    height:200px;
    width:80%
}
.div-Instr1{
    position:relative;
    border:solid 1px #e6e6e6;
     width:140px ;
    height:200px;
    font-size:12px;
    background:#FBFBFB;
    text-align:center
}
.div-Instr2{
    position:relative;
    border:solid 1px #e6e6e6;
    left:139px;
    top:-200px;
    width:874px;
    height:200px;
    font-size:12px
}
.instr-Span1{
    position:relative;
    top:84px;
}
.instr-Span2{
    position:relative;
    top:30px;
    left:20px
}
.div-Mark{
    height:120px;
    width:80%
}
.div-Mark1{
    position:relative;
    border:solid 1px #e6e6e6;
    width:140px ;
    height:100px;
    font-size:12px;
    background:#FBFBFB;
    text-align:center
}
.div-Mark2{
    position:relative;
    border:solid 1px #e6e6e6;
    left:138px;
    top:-95px;
    width:863px;
    height:0px;
    font-size:12px
}
.mark-Span1{
    position:relative;
    top:40px;
}
.text-Area{
    position:relative;
    height:109px;
    width:100%  
}
/* 标签选择器 */
input{
    border: solid 1px;height:26px;
}
</style>