<template>
    <div class="view-product" v-cloak>
        <div class="tab-header">
			<p>立项材料表单定制</p>
		</div>
        <div style="margin-left:10px;margin-top:10px">
        
        <layui-item>
            <layui-inline-select v-model="formTemplateInfo.templateYear"
                label="项目年度"
                :items="templateYears"
                labelKey="templateYear"
                valKey="templateYear"
                name="formTemplateInfo.templateYear"></layui-inline-select>
            <layui-inline-select v-model="formTemplateInfo.templateBizType"
                label="项目子类型"
                :items="templateBizTypes"
                name="formTemplateInfo.templateBizType"></layui-inline-select>
        </layui-item>
    </div>
<div v-if="formTemplateInfo.templateBizType!=null&&formTemplateInfo.templateBizType!=''" style="margin-left:10px;">
                 
                <hr class="layui-bg-blue">
   
        
        <div style="height:40px">
        <button @click="preview" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-file-text" aria-hidden="true"></i>&nbsp;&nbsp;表单预览</button>
        <button @click="copy" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-copy" aria-hidden="true"></i>&nbsp;&nbsp;表单模版复制</button>
        <button @click="publishOrNo('y')" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-play-circle-o" aria-hidden="true"></i>&nbsp;&nbsp;发布</button>
        <button @click="publishOrNo('n')" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-pause" aria-hidden="true"></i>&nbsp;&nbsp;取消发布</button>
       
       <!-- <i class="fa fa-file-text-o text-warning" style="float:left;font-size:14px;padding-top: 3px;padding-right: 5px;"></i>  -->
                <!-- 当前模版：{{formTemplateInfo.templateYear}}-{{templateBizTypeLabel}} -->
                &nbsp;&nbsp;状态：<span :class="{'colorRed':this.formTemplateInfo.publishStatus=='n',colorGreen:this.formTemplateInfo.publishStatus=='y'}">{{publishStatusLabel}}</span>&nbsp;&nbsp;发布时间：{{formTemplateInfo.publishDate|moment}}&nbsp;&nbsp;最后修改人：{{updateByName}}&nbsp;&nbsp;
                最后修改时间：{{formTemplateInfo.updateDate|moment}}
                
        </div>
        
         <div class="animated fadeInLeft" style="float:left;width:23%;min-height:80%;padding-bottom:5% ">
             <div class="tab-header" style="border:0">
                 <p>{{formTemplateInfo.templateYear}}-{{templateBizTypeLabel}}:&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </div>
            <form-comp-tree :checkEnable="true" :params="'templateYear='+formTemplateInfo.templateYear+'&templateBizType='+formTemplateInfo.templateBizType+'&formConfigTypeDict='+formTemplateInfo.formConfigTypeDict" v-if="isshowTree"></form-comp-tree>
        </div>

        <div class="animated fadeInRight" style="float:right;width:77%">
            <div class="ibox-content" style="border:none">
                <layui-form>
                    <layui-fieldset :label="compFullName" v-if="compType=='input_single'||compType=='input_multiline'">
                    </layui-fieldset>
                    <layui-fieldset :label="compFullName" v-if="compType=='select_single'||compType=='select_multi'">
                        <template slot="main">
                            <table class="layui-table" lay-size="sm" style="width: 750px;">
                                <thead>
                                    <tr>
                                        <th style="text-align: center;width:5%;">
                                            <input  type="checkbox" v-model="checkedAll" @change="checkStatusTwo" style="display:inline"/>
                                        </th>
                                        <th style="text-align: center;">可选数据项</th>
                                    </tr>
                                </thead>
                                 <tbody id="meetingTbody" class="footable_table">
                                    <template v-for="(item, index) in checkboxDatas">
                                        <tr 
                                            :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                            style="display: table-row;"
                                            :key="item.id">
                                            <td>
                                                <input type="checkbox" :value="item.value" :key="item.id" v-model="checkedBoxDatas" style="display:inline" :id="item.id"/>
                                            </td>
                                            <td><label :for="item.id">{{item.label}}</label></td>
                                        </tr>
                                    </template>
                                 </tbody>
                            </table>



                            <!-- 可选数据项:
                            <template v-for="item in checkboxDatas">
                                <input type="checkbox" :value="item.value" :key="item.id" v-model="checkedBoxDatas" style="display:inline"/>{{item.label}}
                            </template> -->
                            <div style="text-align:center">
                                <button @click="save" type="button" class="btn btn-info"><i class="fa fa-paste"></i>&nbsp;&nbsp;保存</button>
                            </div>
                        </template>
                    </layui-fieldset>

                    
                    <layui-fieldset :label="compFullName" v-if="compType=='dynamic_table'||compType=='multi_component'">
                        <template slot="main">
                             <table class="layui-table" lay-size="sm" style="width: 750px;">
                                        <thead>
                                            <tr>
                                                <th style="text-align: center;width:5%;">
                                                    <input  type="checkbox" v-model="checkedAll" @change="checkStatus" style="display:inline"/>
                                                </th>
                                                <th style="text-align: center;width:100px">{{compType=='dynamic_table'?'列名称':'分项名称'}}</th>
                                                <th style="text-align: center;">编码ID</th>
                                                <th style="text-align: center;">可选数据列表</th>
                                            </tr>
                                        </thead>
                                         <tbody id="meetingTbody" class="footable_table">
                                    <template v-for="(item, index) in checkboxDatas">
                                        <tr 
                                            :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                            style="display: table-row;"
                                            :key="item.id">
                                            <td>
                                                <input type="checkbox" style="display:inline" :value="item.id" v-model="oneLevelIds" @change="keepChecked(index,1,item.id)"/>
                                            </td>
                                            <td>{{ item.dataName }}</td>
                                            <td>{{ item.dataCode }}</td>
                                            <td style="">
                                                <template v-for="(item2,index2) in item.shujus"  > 
                                                    <label :key="index2+'k'+item2.value">
                                                     <input type="checkbox" :value="item2.value" style="display:inline" v-model="checkedBoxDatas[1][index]" @change="keepChecked(index,2,item.id)"/>
                                                     {{item2.label}}
                                                     </label>
                                                </template>
                                            </td>
                                        </tr>
                                    </template>
                                    
                                </tbody>
                             </table>
                             <div style="text-align:center">
                                <button @click="save" class="layui-btn layui-btn-lg layui-btn-blue" lay-submit ><img class="custom-img" src="/static/images/btn/save.png"/>保存</button>
                            </div>
                        </template>
                    </layui-fieldset>
                        

                </layui-form>
            </div>
        </div>

    </div>
        
</div>

</template>

<script>
import { getDicts } from '@/api/dict'
import { getUsers } from '@/api/user'
import { saveOrUpdate, get ,getYear,getByYearType,getCheckAndAllDatas,checkChangeStatus,publishOrNo} from '@/api/sys/formTemplateInfo'
import Base from "@/views/base/Base"
import CopyTemplateInfo from '@/views/sys/CopyTemplateInfo'

export default {
    name:"FormTemplateInfoForm",
	extends: Base,
    data () {
        return {
            menuId: 'FormTemplateInfoForm',
            formComponentFormId:"",
            templateYears:[],
            formConfigTypeDicts: [],
            templateBizTypes:[],
            compFullName:"",
            compType:"",
            checkboxDatas:[],
            checkedBoxDatas:[],
            oneLevelIds:[],
            templateBizTypeLabel:"",
            checkedAll:false,
            tableLength:0,
            isshowTree:false,
            formTemplateInfo: {
                id: null,
				formConfigType: '',
				formConfigTypeDict: '',
				templateYear: '2019',
				templateBizType: '',
				publishStatus: 'n',
				publishDate: '',
				copyTemplateId: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
            },
            createByName:"",
            updateByName:"",
            formTemplateComponent: {
                id: null,
				templateId: '',
				componentId: '',
				optionComponentValue: '',
				tableComponentValue: '',
				multiComponentValue: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
            },
        }
    },
    computed: {
       	publishStatusLabel:function(){
            if(this.formTemplateInfo.publishStatus=='y'){
                return "已发布";
            }else{
                return "未发布";
            }
        }
	},
    watch: {
        'formTemplateInfo.templateBizType':function(curVal){
            loading();
            this.changeYearType();
        },
        'formTemplateInfo.templateYear':function(curVal){
            loading();
            this.changeYearType();
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

            saveOrUpdate(this.formTemplateComponent.id,
                        this.formTemplateInfo.id,
                        this.formComponentFormId,
                        this.compType,
                        JSON.stringify(this.checkedBoxDatas)).then(result => {
                alert(result.msg);
                //this.backListView(this.formTemplateInfo.id == null);
            })

    	},
        initData: function(){
        	getDicts('COMPONENT_CONFIG_TYPE_DICT,PROJECT_SUBTYPE_DICT').then(result => {
                this.formConfigTypeDicts = result.data[0] || [];
                this.templateBizTypes = result.data[1] || [];
            });
            getYear().then(result=>{
                this.templateYears=result.data;
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

				form.on('submit(saveFormTemplateInfo)', function(data){
					_this.save();
					return false;
				});
        	});
        },
        preview:function(){
            this.$parent.closeTabByName("FormTemplateInfoFormPreview");
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "formTemplateInfoFormPreview",
                "name": "FormTemplateInfoFormPreview",
                "parentId": "4",
                "text": "表单预览",
                "children": []
            }, 3, {
                subTypeDict:this.formTemplateInfo.templateBizType,
                templateYear:this.formTemplateInfo.templateYear
            });
        },
        clickNodeAfter:function(treeNode,treeObj){ 
            this.formComponentFormId=treeNode.id;
            this.compFullName = treeNode.compFullName;
            this.compType=treeNode.compType;
            
            if(treeNode.type==='component'){
                
                getCheckAndAllDatas(treeNode.id,this.formTemplateInfo.id).then(result=>{
                    var data=result.data;
                    this.oneLevelIds=[];
                    this.checkboxDatas=[];
                    if(data){
                        
                        this.checkboxDatas=data.checkBoxData;
                        if( treeNode.compType=='select_single'|| treeNode.compType=='select_multi'){
                            if(data.formTempComp!=null&&data.formTempComp!={}){
                                this.formTemplateComponent.id=data.formTempComp.id;
                                this.checkedBoxDatas=JSON.parse(data.formTempComp.optionComponentValue);
                            }
                        }else if( treeNode.compType=='dynamic_table'|| treeNode.compType=='multi_component'){
                            if(this.checkboxDatas){
                                this.tableLength=this.checkboxDatas.length;
                                this.$set(this.checkedBoxDatas,0,new Array());
                                this.$set(this.checkedBoxDatas,1,new Array());
                                for (let i = 0; i < this.tableLength; i++) {
                                    this.$set(this.checkedBoxDatas[0],i,"");
                                    this.$set(this.checkedBoxDatas[1],i,new Array());
                                }
                            }
                            
                            if(data.formTempComp&&typeof(data.formTempComp)!=undefined&&data.formTempComp!={}){
                                this.formTemplateComponent.id=data.formTempComp.id;
                                this.checkedBoxDatas=JSON.parse(treeNode.compType=='dynamic_table'?data.formTempComp.tableComponentValue||[]:data.formTempComp.multiComponentValue||[]);
                                this.oneLevelIds=this.checkedBoxDatas[0];
                            }
                        }

                    }
                });

            }


        },
        checkStatus:function(){
            if(this.checkedAll==true){
                this.checkboxDatas.forEach((value,index)=>{
                    this.$set(this.checkedBoxDatas[0],index,value.id);
                    this.oneLevelIds.push(value.id);
                });
            }else{
                this.$set(this.checkedBoxDatas,0,new Array());
                this.$set(this.checkedBoxDatas,1,new Array());
                for (let i = 0; i < this.tableLength; i++) {
                    this.$set(this.checkedBoxDatas[0],i,"");
                    this.$set(this.checkedBoxDatas[1],i,new Array());
                }
                this.oneLevelIds=[];
            }
        },
        checkStatusTwo:function(){
            this.checkedBoxDatas=[];
            if(this.checkedAll==true){
                this.checkboxDatas.forEach((value,index)=>{
                    this.checkedBoxDatas.push(value.value);
                });
            }
        },
        checkNodeAfter:function (treeNode,treeObj) {
            checkChangeStatus(this.formTemplateInfo.id,
                        treeNode.id,treeNode.checked?'y':'n');
        },
        keepChecked:function(index,level,id) {
            if(level==2){
                if(this.checkedBoxDatas[1][index].length>0){
                    if(this.checkedBoxDatas[0].indexOf(id)==-1){
                        this.oneLevelIds.push(id);
                        this.$set(this.checkedBoxDatas[0],index,id);
                    }
                }
            }else if(level==1){
                if(this.oneLevelIds.indexOf(id)!=-1){
                    this.$set(this.checkedBoxDatas[0],index,id);
                }else{
                    this.$set(this.checkedBoxDatas[0],index,"");
                    this.checkedBoxDatas[1][index]=new Array();
                }

            }
        },
        publishOrNo:function (param) {
            confirm("确定要"+(param=='n'?"取消":"")+"发布么？", () => {
                this.submitHandler((token) => {
                    publishOrNo(this.formTemplateInfo.id,param,token).then(result=>{
                        if(result.status==200){
                            alert(param=='y'?'发布成功':'取消发步成功');
                            this.formTemplateInfo.publishStatus=param;
                        }
                        this.resetToken();
                    }).catch(function(reason) {
                        console.log('catch:', reason);
                        this.resetToken(reason);
                    });
                });
            });
        },
        copy:function () {
            const _this = this;
            this.$layer.iframe({
				content: {
					content: CopyTemplateInfo, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						formTemplateInfo:_this.formTemplateInfo
					}//props
				},
				area:['950px', '500px'],
				title:"表单模版复制"
            });
        },
        changeYearType:function () {
            
            this.templateBizTypes.forEach(element=>{
                if(element.value==this.formTemplateInfo.templateBizType){
                    this.templateBizTypeLabel = element.label;
                   
                }
            });
            getByYearType(this.formTemplateInfo.templateYear,this.formTemplateInfo.templateBizType).then(result=>{
                if(result.data){
                    this.formTemplateInfo=result.data;
                    getUsers({"userId":this.formTemplateInfo.createBy}).then(result=>{
                        if(result.data.authUsers){
                            this.createByName=result.data.authUsers[0].userName;
                        }
                    });
                    getUsers({"userId":this.formTemplateInfo.updateBy}).then(result=>{
                        if(result.data.authUsers){
                            this.updateByName=result.data.authUsers[0].userName;
                        }
                    });

                    this.isshowTree = false;
                    this.$nextTick(() => {
                        this.isshowTree = true;
                    })
                }

                
                closeLoading();
            });
        }
    }
}
</script>

<style scoped>
.colorRed{
    color: red;
}
.colorGreen{
    color: green;
}
</style>
