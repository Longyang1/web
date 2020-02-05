<template>

                            
    <div class="view-product" v-cloak>
		 <div class="animated fadeInLeft" style="float:left;width:23%;min-height:80%">
             
             <div class="tab-header" style="border:0">
                 <p style="height:36px">配置类型:&nbsp;&nbsp;&nbsp;&nbsp;<layui-inline-select
                    label=""
                    v-model="formComponent.formConfigTypeDict"
                    :items="componentConfigTypeDicts"></layui-inline-select></p>
                 
            </div>
             <form-comp-tree v-if="refresh" :params="'formConfigTypeDict='+formComponent.formConfigTypeDict"></form-comp-tree>
             <!-- ref="fcTree" -->
        </div>
        <div class="animated fadeInRight" style="float:right;width:77%">
            
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="节点基本信息">
	                	<template slot="main">
                            
							<layui-item>
                                <layui-inline-radio :items="formConfigNodeTypeDicts"
                                    label="节点类型"
                                    :disabled="nodeTypeDisabled"
                                    name="formComponent.formConfigNodeTypeDict"
                                    v-model="formComponent.formConfigNodeTypeDict"></layui-inline-radio>
		                    </layui-item>							
							<layui-item>
		                        <layui-inline-input
									:style="{width:'82%'}"
									:cssStyle="{width:'100%'}"
		                            label="节点名称" 
		                            placeholder="请输入节点名称"
                                    lay-verify="required"
		                            v-model="formComponent.nodeName"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
									:style="{width:'40%'}"
									:cssStyle="{width:'100%'}"
		                            label="节点编码" 
                                    lay-verify="required"
		                            placeholder="请输入节点编码"
		                            v-model="formComponent.nodeCode"></layui-inline-input>
                                
								<layui-inline-input
									:style="{width:'40%'}"
									:cssStyle="{width:'100%'}"
		                            label="显示顺序" 
                                    lay-verify="required"
		                            placeholder="请输入节点显示顺序"
		                            v-model="formComponent.nodeOrder"></layui-inline-input>
                               
		                    </layui-item>
							<layui-item>
										<layui-inline-input
                                            :style="{width:'40%'}"
											label="节点图标" 
                                            :cssStyle="{width:'100%'}"
											placeholder="请输入节点图标"
											v-model="formComponent.nodeIcon"></layui-inline-input>
                                     <layui-inline-radio :items="isAvailable"
                                        label="节点状态"
                                        name="formComponent.availableStatus"
                                        v-model="formComponent.availableStatus"></layui-inline-radio>
		                    </layui-item>	
							<layui-item>
		                        <layui-inline-input
									:style="{width:'82%'}"
									:cssStyle="{width:'100%'}"
		                            label="描述" 
		                            placeholder="请输入节点描述"
		                            v-model="formComponent.nodeDesc"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-textarea
									:style="{width:'82%'}"
									:cssStyle="{width:'100%'}"
		                            label="节点参数" 
		                            placeholder="请输入节点参数"
		                            v-model="formComponent.nodeParam"></layui-inline-textarea>
		                    </layui-item>
						</template>
					</layui-fieldset>
                    
              
			<!-- 表单组建信息 -->
	                 <layui-fieldset label="表单组件信息" v-if="formComponent.formConfigNodeTypeDict=='component'">
	                	<template slot="main">
							<layui-item>
		                        <layui-inline-select
		                            label="表单组件类别"
		                            v-model="formComponent.formComponentCatalogDict"
		                            :items="formComponentCatalogDicts"
                                    name="formComponent.formComponentCatalogDict"></layui-inline-select>
							    <layui-inline-input
								 	:style="{width:'40%'}"
									:cssStyle="{width:'100%'}"
		                            label="显示文本" 
		                            placeholder="请输入显示文本"
		                            v-model="formComponent.componentDisplayText"></layui-inline-input>
		                    </layui-item>
							<layui-item>
                                    <layui-inline-input
                                    :style="{width:'30%'}"
                                    :cssStyle="{width:'100%'}"
                                        label="关联前端组件" 
                                        placeholder="请输入关联前端"
                                        v-model="formComponent.frontComponent"></layui-inline-input>
                                    <layui-inline-radio :items="componentSaveTypeDicts"
                                        :style="{width:'41%'}"
                                        label="数据存储"
                                        name="formComponent.componentSaveTypeDict"
                                        v-model="formComponent.componentSaveTypeDict"></layui-inline-radio>  
                                         
									<layui-inline-input name="formComponent.componentDataSaveTable"
                                        label="表名"
                                        :cssStyle="{width:'100%'}"
                                        :style="{width:'20%'}"
                                        placeholder="请输入表名"
                                        v-model="formComponent.componentDataSaveTable"
                                        ></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
                 
               


			<!-- 单行，多行输入 -->
	               <layui-fieldset label="单行多行输入" v-if="formComponent.formConfigNodeTypeDict=='component'&&formComponent.formComponentCatalogDict=='input_single'||formComponent.formComponentCatalogDict=='input_multiline'">
	                	<template slot="main">
							<layui-item>
		                        <layui-inline-select name="formComponent.componentDataTypeDict"
		                            label="数据类型" 
		                            placeholder="请输入数据类型"
		                            v-model="formComponent.componentDataTypeDict"
                                    :items="componentDataTypeDicts"></layui-inline-select>
                                
								<layui-inline-input
									:style="{width:'40%'}"
									:cssStyle="{width:'100%'}"
		                            label="缺省值" 
		                            placeholder="请输入缺省值"
		                            v-model="formComponent.componentDefaultValue"></layui-inline-input>
		                    </layui-item>
							<layui-item>
                                <layui-inline-select :items="componentValidityDicts"
                                    label="校验(有效性)" 
                                    placeholder="请输入有效性"
                                    v-model="formComponent.componentValidityDict"
                                    name="formComponent.componentValidityDict"></layui-inline-select>
                                <layui-inline-input
									:style="{width:'30%'}"
									:cssStyle="{width:'100%'}"
		                            label="校验(正则)" 
		                            placeholder="请输入表达式"
		                            v-model="formComponent.regularExpression"></layui-inline-input>
                                 <layui-inline-input
									:style="{width:'30%'}"
									:cssStyle="{width:'100%'}"
		                            label="校验(提示语)" 
		                            placeholder="请输入提示语"
		                            v-model="formComponent.componentTips"></layui-inline-input>
		                    </layui-item>
							<layui-item>
                                 <layui-inline-input
									:style="{width:'23%'}"
									:cssStyle="{width:'100%'}"
		                            label="样式(长)" 
		                            placeholder="请输入长度"
		                            v-model="formComponent.componentLength"></layui-inline-input>
                                <layui-inline-input
									:style="{width:'23%'}"
									:cssStyle="{width:'100%'}"
		                            label="样式(宽)" 
		                            placeholder="请输入宽度"
		                            v-model="formComponent.componentWidth"></layui-inline-input>
                                <layui-inline-input
									:style="{width:'23%'}"
									:cssStyle="{width:'100%'}"
		                            label="样式(高)" 
		                            placeholder="请输入高度"
		                            v-model="formComponent.componentHeight"></layui-inline-input>
                                <layui-inline-input
									:style="{width:'24%'}"
									:cssStyle="{width:'100%'}"
		                            label="样式(class)" 
		                            placeholder="请输入class"
		                            v-model="formComponent.componentClass"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
									:style="{width:'82%'}"
									:cssStyle="{width:'100%'}"
		                            label="事件绑定" 
		                            placeholder="请输入事件"
		                            v-model="formComponent.componentEvent"></layui-inline-input>
		                    </layui-item>
						
					
							<layui-item>
		                        <layui-inline-select
		                            label="数据列表来源"
		                            v-model="formComponent.componentDictSrc"
                                    name="formComponent.componentDictSrc"
                                    labelKey="dictTypeName"
                                    valKey="dictTypeCode"
		                            :items="componentDictSrcs"></layui-inline-select>
								<layui-inline-input
									:style="{width:'40%'}"
									:cssStyle="{width:'100%'}"
		                            label="参数"
		                            v-model="formComponent.componentDictParam"
                                    name="formComponent.componentDictParam"
		                            ></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                    </layui-item>
							<layui-item>
		                       <layui-inline-select :items="componentValidityDicts"
                                    label="校验(有效性)" 
                                    placeholder="请输入有效性"
                                    v-model="formComponent.componentValidityDict"
                                    name="formComponent.componentValidityDict"></layui-inline-select>
                                <layui-inline-input
									:style="{width:'30%'}"
									:cssStyle="{width:'100%'}"
		                            label="校验(正则)" 
		                            placeholder="请输入表达式"
		                            v-model="formComponent.regularExpression"></layui-inline-input>
                                 <layui-inline-input
									:style="{width:'30%'}"
									:cssStyle="{width:'100%'}"
		                            label="校验(提示语)" 
		                            placeholder="请输入提示语"
		                            v-model="formComponent.componentTips"></layui-inline-input>
		                    </layui-item>		                   
		                </template>
					</layui-fieldset>
                    
                <!-- 单选多选 -->
                    <layui-fieldset label="单选多选" v-if="formComponent.formConfigNodeTypeDict=='component'&&formComponent.formComponentCatalogDict=='select_single'||formComponent.formComponentCatalogDict=='select_multi'">
	                	<template slot="main">
							<layui-item>
		                        <layui-inline-select
		                            label="数据列表来源"
		                            v-model="formComponent.componentDictSrc"
                                    name="formComponent.componentDictSrc"
                                    labelKey="dictTypeName"
                                    valKey="dictTypeCode"
		                            :items="componentDictSrcs"></layui-inline-select>
								<layui-inline-input
									:style="{width:'40%'}"
									:cssStyle="{width:'100%'}"
		                            label="参数"
		                            v-model="formComponent.componentDictParam"
                                    name="formComponent.componentDictParam"
		                            ></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                    </layui-item>
							<layui-item>
		                       <layui-inline-select :items="componentValidityDicts"
                                    label="校验(有效性)" 
                                    placeholder="请输入有效性"
                                    v-model="formComponent.componentValidityDict"
                                    name="formComponent.componentValidityDict"></layui-inline-select>
                                <layui-inline-input
									:style="{width:'30%'}"
									:cssStyle="{width:'100%'}"
		                            label="校验(正则)" 
		                            placeholder="请输入表达式"
		                            v-model="formComponent.regularExpression"></layui-inline-input>
                                 <layui-inline-input
									:style="{width:'30%'}"
									:cssStyle="{width:'100%'}"
		                            label="校验(提示语)" 
		                            placeholder="请输入提示语"
		                            v-model="formComponent.componentTips"></layui-inline-input>
		                    </layui-item>		                   
		                </template>
					</layui-fieldset>


             
	                <layui-fieldset label="复合组件" v-if="formComponent.formConfigNodeTypeDict=='component'&&formComponent.formComponentCatalogDict=='multi_component'">
                        <i @click="addRow" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>
	                	<template slot="main">
							<table class="footable table table-stripped" lay-even="" lay-skin="row">
                                 <thead>
                                    <tr>
                                        <th>分项名称</th>
                                        <th>编码ID</th>
                                        <th>数据列表来源</th>
                                        <th>参数</th>
                                        <th style="text-align: center">排序号</th>
                                        <th style="text-align: center">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(item, index) in subjectSubitems" 
                                        :key="'ss_' + index"
                                        v-dragging="{ item: item, list: subjectSubitems, group: 'subjectSubitems' }">
                                        <td>
                                            <layui-inline-input 
                                                v-model="subjectSubitems[index].dataName"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input 
                                                v-model="subjectSubitems[index].dataCode"></layui-inline-input>
                                        </td>
                                        <td style="overflow: visible;">
                                            <layui-inline-select
                                                v-model="subjectSubitems[index].dataDictSrc"
                                                :items="componentDictSrcs"
                                                labelKey="dictTypeName"
                                                valKey="dictTypeCode"
                                                label=""></layui-inline-select>
                                           
                                        </td>
                                         <td>
                                            <layui-inline-input 
                                                v-model="subjectSubitems[index].dataParam"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                v-model="subjectSubitems[index].dataDisplayOrder"></layui-inline-input>
                                        </td>
                                        <td>
                                            <a @click="del(index, 'subitem')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
							</table>
						</template>
					</layui-fieldset>
                   
               
	                <layui-fieldset label="动态表格" v-if="formComponent.formConfigNodeTypeDict=='component'&&formComponent.formComponentCatalogDict=='dynamic_table'">
	                	<i @click="addRow" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>
	                	<template slot="main">
							<table class="footable table table-stripped" lay-even="" lay-skin="row">
                                 <thead>
                                    <tr>
                                        <th style="text-align: center">列名称</th>
                                        <th style="text-align: center">编码ID</th>
                                        <th style="text-align: center">数据列表来源</th>
                                        <th style="text-align: center">参数</th>
                                        <th style="text-align: center">排序号</th>
                                        <th style="text-align: center">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(item, index) in subjectSubitems" 
                                        :key="'ss_' + index"
                                        v-dragging="{ item: item, list: subjectSubitems, group: 'subjectSubitems' }">
                                        <td>
                                            <layui-inline-input 
                                                v-model="subjectSubitems[index].dataName"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input 
                                                v-model="subjectSubitems[index].dataCode"></layui-inline-input>
                                        </td>
                                        <td style="overflow: visible;">
                                            <layui-inline-select
                                                v-model="subjectSubitems[index].dataDictSrc"
                                                :items="componentDictSrcs"
                                                labelKey="dictTypeName"
                                                valKey="dictTypeCode"
                                                label=""></layui-inline-select>
                                        </td>
                                         <td>
                                            <layui-inline-input 
                                                v-model="subjectSubitems[index].dataParam"></layui-inline-input>
                                        </td>
                                        <td>
                                            <layui-inline-input
                                                v-model="subjectSubitems[index].dataDisplayOrder"></layui-inline-input>
                                        </td>
                                        <td style="text-align: center">
                                            <a @click="del(index, 'subitem')" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
							</table>
						</template>
					</layui-fieldset>
                    <layui-inline style="display:block" class="btn-group-center">
                        <!-- <button class="layui-btn" lay-submit lay-filter="saveFormComponent" style="margin-left:200px"><i class="fa fa-save"></i> 保存</button> -->
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveFormComponent"><i class="fa fa-save"></i> 保存</button>
                        <button class="layui-btn" lay-submit lay-filter="addChildComponent"><i class="iconfont  icon-zengjiaxiaji"></i> 增加下级</button>
                        <button class="layui-btn layui-btn-lg layui-btn-orange" lay-submit lay-filter="deleteComponent"><i class="fa fa-trash"></i> 删除</button>
                        <button :class="{'layui-btn':true,'layui-btn-lg':true,'layui-btn-warm':true,'btn-import-none':isNone,'btn-import-normal':isNormal}"  id="actUpload"><i class="fa fa-paste"></i> 导入</button>
						<button class="layui-btn  layui-btn-lg layui-btn-red"  @click="close"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>

        </div>
	</div>
</template>

<script>
import { getDicts,getDictTypes } from '@/api/dict'
import { saveOrUpdate, get,checkNodeCode,del } from '@/api/sys/formComponent'
import Base from "@/views/base/Base"
import { getToken } from '@/utils/auth'
import FormCompTree from '@/components/FormCompTree'

export default {
    name:"FormComponentForm",
    extends: Base,
    data () {
        return {
            menuId: 'FormComponentForm',
            nodeTypeDisabled:false,
            componentConfigTypeDicts:[],         
            formComponentCatalogDicts:[],
            formConfigNodeTypeDicts:[],
            componentSaveTypeDicts:[],
            componentDataTypeDicts: [],
            componentValidityDicts: [],
            componentDictSrcs:[],
            formComponent: {
                id: this.$route.params.id,
				formConfigType: '',
				formConfigTypeDict: 'PROJECT_APPROVAL',
				formConfigNodeType: '',
				formConfigNodeTypeDict: 'directory',
				nodeName: '',
				nodeCode: '',
				nodeOrder: '',
				nodeIcon: '',
				availableStatus: 'y',
				nodeParentId: '',
				nodeLayerCode: '',
				nodeLevel: '',
				nodeFullName: '',
				nodeDesc: '',
				nodeParam: '',
				formComponentCatalog: '',
				formComponentCatalogDict: '',
				componentDisplayText: '',
				frontComponent: '',
				componentSaveType: '',
				componentSaveTypeDict: '',
				componentDataSaveTable: '',
				componentDataType: '',
				componentDataTypeDict: '',
				componentDefaultValue: '',
				componentValidity: '',
				componentValidityDict: '',
				regularExpression: '',
				componentTips: '',
				componentLength: '',
				componentWidth: '',
				componentHeight: '',
				componentClass: '',
				componentEvent: '',
				componentDictSrc: '',
				componentDictParam: '',
				dataListValidity: '',
				dataListValidityDict: '',
				componentDataSelectCount: '',
				componentRemark: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
			},
			
            subjectSubitems: [],
            isAvailable: [
                {
                    label: '可用',
                    value: 'y'
                },
                {
                    label: '停用',
                    value: 'n'
                }
            ],
            uploadFiles:[],
            allData:[],
            isNone:true,
            isNormal:false
        }
        
    },
    computed: {
       	
	},
	watch: {
        'formComponent.id':function(curVal){
           if(curVal==null||curVal==""){
               this.nodeTypeDisabled=false;
           }else{
               this.nodeTypeDisabled=true;
           }
        },
         'formComponent.formComponentCatalogDict':function(curVal){
             if(curVal!='multi_component'&&curVal!='dynamic_table'){
                this.subjectSubitems=[];
             }
            
         },
         'formComponent.formConfigTypeDict':function (curVal) {
            this.refreshed();
            this.subjectSubitems=[];
            this.isNone=true;
            this.isNormal=false;
            this.formComponent= {
                id: null,
				formConfigType: '',
				formConfigTypeDict: curVal,
				formConfigNodeType: '',
				formConfigNodeTypeDict: 'directory',
				nodeName: '',
				nodeCode: '',
				nodeOrder: '',
				nodeIcon: '',
				availableStatus: 'y',
				nodeParentId: '',
				nodeLayerCode: '',
				nodeLevel: '',
				nodeFullName: '',
				nodeDesc: '',
				nodeParam: '',
				formComponentCatalog: '',
				formComponentCatalogDict: '',
				componentDisplayText: '',
				frontComponent: '',
				componentSaveType: '',
				componentSaveTypeDict: '',
				componentDataSaveTable: '',
				componentDataType: '',
				componentDataTypeDict: '',
				componentDefaultValue: '',
				componentValidity: '',
				componentValidityDict: '',
				regularExpression: '',
				componentTips: '',
				componentLength: '',
				componentWidth: '',
				componentHeight: '',
				componentClass: '',
				componentEvent: '',
				componentDictSrc: '',
				componentDictParam: '',
				dataListValidity: '',
				dataListValidityDict: '',
				componentDataSelectCount: '',
				componentRemark: '',
				createBy: '',
				createDate: '',
				updateBy: '',
				updateDate: '',
			};
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
                saveOrUpdate(JSON.stringify(this.formComponent),JSON.stringify(this.subjectSubitems),token).then(result => {
                    alert(result.msg);
                    // this.$parent.closeTabByName(this.$route.name);
                    //this.$parent.refreshTabByName(this.$route.name,this.formComponent.id == null);
                    this.refreshed();
                    closeLoading();
                    this.resetToken();
                }).catch(function(reason) {
                    console.log('catch:', reason);
                    this.resetToken(reason);
                });
            });



        },
        addChildComponent:function(){
            if(this.formComponent.id==undefined){
                //||(this.formComponent.id!=undefined&&this.formComponent.formConfigNodeTypeDict==='component')
                alert("请选择一个目录或组件去添加下级");
                return false;
            }else{
                let formConfigTypeDict = this.formComponent.formConfigTypeDict;
                this.formComponent={
                    id: null,
                    formConfigType: '',
                    //formConfigTypeDict: 'PROJECT_APPROVAL',
                    formConfigNodeType: '',
                    formConfigNodeTypeDict: 'directory',
                    nodeName: '',
                    nodeCode: '',
                    nodeOrder: '',
                    nodeIcon: '',
                    availableStatus: 'y',
                    nodeParentId: this.formComponent.id,
                    nodeLayerCode: '',
                    nodeLevel: '',
                    nodeFullName: '',
                    nodeDesc: '',
                    nodeParam: '',
                    formComponentCatalog: '',
                    formComponentCatalogDict: '',
                    componentDisplayText: '',
                    frontComponent: '',
                    componentSaveType: '',
                    componentSaveTypeDict: '',
                    componentDataSaveTable: '',
                    componentDataType: '',
                    componentDataTypeDict: '',
                    componentDefaultValue: '',
                    componentValidity: '',
                    componentValidityDict: '',
                    regularExpression: '',
                    componentTips: '',
                    componentLength: '',
                    componentWidth: '',
                    componentHeight: '',
                    componentClass: '',
                    componentEvent: '',
                    componentDictSrc: '',
                    componentDictParam: '',
                    dataListValidity: '',
                    dataListValidityDict: '',
                    componentDataSelectCount: '',
                    componentRemark: '',
                    createBy: '',
                    createDate: '',
                    updateBy: '',
                    updateDate: '',
                };
                this.formComponent.formConfigTypeDict=formConfigTypeDict;
            }
        },
        deleteComponent:function(){
            if(this.formComponent.id!=undefined&&this.formComponent.id!=null){
                confirm("确认删除该节点吗?",()=>{
                    del(this.formComponent.id).then(result=>{
                        if(result.status==500){
                            alert(result.msg);
                            return ;
                        }else{
                            alert("删除成功");
                            this.refreshed();

                        };
                    });
                });

                
            }else{
                alert("请选择一个节点");
            }
        },
        initData: function(){
            if(this.formComponent.id){
                
                get(this.formComponent.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.formComponent =  data.formComponent || this.formComponent;
                    }
                });
            }
        	getDicts('COMPONENT_CONFIG_TYPE_DICT,FORM_CONFIG_NODE_TYPE_DICT,FORM_COMPONENT_CATALOG_DICT,COMPONENT_SAVE_TYPE_DICT,COMPONENT_DATA_TYPE_DICT,COMPONENT_VALIDITY_DICT').then(result => {
                this.componentConfigTypeDicts = result.data[0] || [];
                this.formConfigNodeTypeDicts = result.data[1] || [];
                this.formComponentCatalogDicts = result.data[2] || [];
                this.componentSaveTypeDicts = result.data[3] || [];
                this.componentDataTypeDicts = result.data[4] || [];
                this.componentValidityDicts = result.data[5] || [];
            });
            getDictTypes().then(result=>{
                this.componentDictSrcs=result.data.sysDictTypes;
            });
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form', 'upload'], function(){
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
				form.on('submit(saveFormComponent)', function(data){

                    if(_this.formComponent.nodeCode==undefined||_this.formComponent.nodeCode==""
                        ||_this.formComponent.nodeName==undefined||_this.formComponent.nodeName==""){
                        alert("节点名称或节点编码不可为空");
                        return false;
                    }

                    checkNodeCode(_this.formComponent.nodeCode,_this.formComponent.id).then(result=>{
                        if(!result.data){
                            alert("节点编码不可重复");
                            return false;
                        }else{
                            loading();
                            _this.save();
                            return false;
                        }
                    }); 
                  
				});
				form.on('submit(addChildComponent)', function(data){
                    _this.addChildComponent();
                    return false;
				});
				form.on('submit(deleteComponent)', function(data){
                    _this.deleteComponent();
                    return false;
                });
                
                var uploadListIns = upload.render({
                    elem: '#actUpload',
                    url: '/api/sys/formComponents/importExcel',
                    accept: 'file',
                    multiple: false,
                    auto: true,
                    exts:'xls|xlsx',
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        auth: getToken()
                    },
                    before: function(obj){
                        layer.load(0);
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                         obj.preview(function (index, file, result) {
                            if(_this.uploadFiles.indexOf(index, 'sort') == -1){
                                _this.uploadFiles.push({
                                    fileName: file.name,
                                    memberId: null,
                                    officeId: null,
                                    reportTime: '',
                                    sort: index,// 暂时用于记录文件的ID index
                                    dirName: '',
                                    remark: null,
                                    status: 5,
                                    obj: obj,
                                    file: file
                                });
                            }
                        });
                        return false;
                    },
                    choose: function (obj) {
                         var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            if(_this.uploadFiles.indexOf(index, 'sort') == -1){
                                _this.uploadFiles.push({
                                    fileName: file.name,
                                    memberId: null,
                                    officeId: null,
                                    reportTime: 0,
                                    sort: index,// 暂时用于记录文件的ID index
                                    dirName: '',
                                    remark: null,
                                    status: 5,
                                    obj: obj,
                                    file: file
                                });
                                obj.upload(index, file);
                            }
                        });
                        return false;
                    },
                    done: function (res, index, upload) {
                         layer.closeAll("loading");
                         if (res.status == 200) { //上传成功
                            _this.refreshed();
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {
                       
                    }
                });
        	});
        },
		addRow: function() {
            this.subjectSubitems.push({
                dataName: null,
                dataCode: null,
                dataDictSrc: null,
                dataParam: null,
                dataDisplayOrder:null
            });
        },
		close:function(){
			this.backListView(this.formComponent.id == null);
		},
        del: function(index, type) {
            var showTip = false;
            var arr = [];
            if(type == 'subitem') {
                arr = this.subjectSubitems;
                var subitem = arr[index];
                for(var key in subitem) {
                    if(subitem[key]) {
                        showTip = true
                        break;
                    }
                }
            } /* else {
                arr = this.meetingConfMemberDetails;
                var confMemberDetail = this.meetingConfMemberDetails[index];
                showTip = (confMemberDetail.memberId || confMemberDetail.professionalFieldDict)
            } */
            
            confirm('确定删除该行吗？', () => {
                arr.splice(index, 1);
            }, showTip);
        },
        clickNodeAfter:function(treeNode){
            if(treeNode.pid==0){
                this.isNormal=true;
                this.isNone=false;
            }else{
                this.isNormal=false;
                this.isNone=true;
            }
            get(treeNode.id).then(result=>{
                this.subjectSubitems=[];
                this.nodeTypeDisabled=true;
                this.formComponent=result.data.formComponent;
                if(this.formComponent.nodeIcon){
                    this.formComponent.nodeIcon = this.formComponent.nodeIcon.replace("../../../static/js/zTree/css/zTreeStyle/img/diy/","");
                }
                if(result.data.formComponentExtends!=null&&result.data.formComponentExtends.length>0){
                     result.data.formComponentExtends.forEach(element => {
                        this.subjectSubitems.push({
                            dataName: element.dataName,
                            dataCode: element.dataCode,
                            dataDictSrc: element.dataDictSrc,
                            dataParam: element.dataParam,
                            dataDisplayOrder: element.dataDisplayOrder
                        });
                    }); 
                }
            }); 
            
        }
    }
}
</script>

<style scoped>
    .btn-import-none{
        display: none;
    }
    .btn-import-normal{
        display: inline-block;
    }
    .layui-btn{
        margin-left: 0;
    }
</style>
