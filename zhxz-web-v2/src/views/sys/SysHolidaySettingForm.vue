<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-fieldset label="新增节假日信息">
                </layui-fieldset>
                <layui-form>
                	<layui-item>
                        <layui-inline-input
                            lay-verify="required"
                           
                            :cssStyle="{width:'354px'}"
                            label="节假日名称" 
                            placeholder="请输入节假日名称"
                            v-model="sysHolidaySetting.holidayName">
                        </layui-inline-input>
                    </layui-item>
					<layui-item>
                        <layui-inline-select
                            lay-verify="required"
                            label="节假日类型" 
                            placeholder="请输入节假日类型"
                            :items="holidayTypeDicts"
                            valKey="value"
                            labelKey="label"
                            v-model="sysHolidaySetting.holidayTypeDict">
                        </layui-inline-select>
                        <layui-inline-select
                            lay-verify="required"
                            label="节假工作类型" 
                            placeholder="请输入节假日工作类型"
                            :items="holidayWorkTypeDicts"
                            valKey="value"
                            labelKey="label"
                            v-model="sysHolidaySetting.holidayWorkTypeDict">
                        </layui-inline-select>
                    </layui-item>
					<layui-item>
                        <layui-inline-date
							label="开始时间"
							placeholder="点击选择日期"	
                            name="startTime"
							v-model="sysHolidaySetting.startTime"/>
                        <layui-inline-date
							label="结束时间"
							placeholder="点击选择日期"
                            name="endTime"
							v-model="sysHolidaySetting.endTime"/> 
                    </layui-item>
                    <layui-item>
                        <div class="div-Mark">
                            <div class="div-Mark1"><span class="mark-Span1">备注:</span></div>
                            <div class="div-Mark2">
                                <layui-inline-textarea
                                    v-model="sysHolidaySetting.remarks"></layui-inline-textarea>
                            </div>
                        </div>  
                    </layui-item>                 					
                    <layui-inline :style="{width:'682px'}" >
                        <div style="text-align:center">
                            <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysHolidaySetting" ><i class="fa fa-save"></i> 保存</button>
                            <button class="layui-btn  layui-btn-lg layui-btn-red"  @click="close"><i class="fa fa-times"></i> 关闭</button>
                        </div>
                    </layui-inline>
                   
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/sysHolidaySetting'
import Base from '@/views/base/Base'
import {formatDate} from "../../utils/formatUtils";

export default {
    extends: Base,
    name:'SysHolidaySettingForm',
    data () {
        return {
            dicts:[],
			holidayTypeDicts: [],
			holidayWorkTypeDicts: [],
            sysHolidaySetting: {
                id: this.$route.params.id,
				holidayName: '',
				holidayType: '',
				holidayTypeDict: '',
				holidayWorkType: '',
				holidayWorkTypeDict: '',
				startTime: '',
				endTime: '',
				remarks: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
            },
            
        }
    },
    computed: {
       //创建map结构，存储holidayType为value，holidayTypeDict为key
        holidayTypeDictMap:function() {
            return this.dicts[0] ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        holidayWorkTypeDictMap:function() {
            return this.dicts[1] ? this.dicts[1].array2Obj('value', 'label') : {};
        }
	},
	watch: {
        //如果holidayTypeDict发生改变,则将holidayTypeDictMap中对应的value赋值给sysHolidaySetting.holidayType
		'sysHolidaySetting.holidayTypeDict':function(){
            this.sysHolidaySetting.holidayType = this.holidayTypeDictMap[this.sysHolidaySetting.holidayTypeDict];
        },
         //如果holidayWorkTypeDict发生改变,则将holidayWorkTypeDictMap中
         //对应的value赋值给sysHolidaySetting.holidayWorkTypeDict
		'sysHolidaySetting.holidayWorkTypeDict':function(){
            this.sysHolidaySetting.holidayWorkType = this.holidayWorkTypeDictMap[this.sysHolidaySetting.holidayWorkTypeDict];
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
                saveOrUpdate(JSON.stringify(this.sysHolidaySetting),token).then(result => {
                    //返回的msg为‘ok'则"保存成功!"否则"保存失败"，
                    if(result.msg=='ok'){
                        alert("保存成功！");
                    }else{
                        alert("保存失败");
                    }
                    this.backListView(this.sysHolidaySetting.id==null);
                }).catch((error) => {
                    this.resetToken(error);
                })
            });       
    	},
        initData: function(){
            //如果初始化页面有id则为修改，先进行查询
            if(this.sysHolidaySetting.id){
                get(this.sysHolidaySetting.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.sysHolidaySetting =  data || this.sysHolidaySetting;
                        this.sysHolidaySetting.startTime = formatDate(this.sysHolidaySetting.startTime, "YYYY-MM-DD") ;
                        this.sysHolidaySetting.endTime = formatDate(this.sysHolidaySetting.endTime, "YYYY-MM-DD") ;
                    }
                });
            };
            //获取节假日类型代码值，和节假日工作类型代码值
        	getDicts('HOLIDAY_TYPE_DICT,HOLIDAY_WORK_TYPE_DICT,').then(result => {
                var data = result.data;
                if(data){
                    this.dicts = data;
                    this.holidayTypeDicts = result.data[0] || [];
                    this.holidayWorkTypeDicts = result.data[1] || [];
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
				form.on('submit(saveSysHolidaySetting)', function(data){
                    console.log(_this.sysHolidaySetting.startTime)
                    //参数均不可为空  
                    if(_this.sysHolidaySetting.startTime &&_this.sysHolidaySetting.endTime ){       
                            _this.save();
                            return false;                     
                    }else  if(!_this.sysHolidaySetting.holidayName){
                        alert("请输入节假日名称！")
                    }else if(!_this.sysHolidaySetting.endTime || !sysHolidaySetting.holidayName){
                        alert("请输入开始或结束时间！")
                    }      
				});
        	});
        },
        close:function(){
            this.backListView(this.sysHolidaySetting.id == null);
        },
    },
}
</script>

<style scoped>
.div-Mark{
    height:120px;
    width:60%
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
    width:542px;
    height:0px;
    font-size:12px
}
.mark-Span1{
    position:relative;
    top:40px;
}

</style>