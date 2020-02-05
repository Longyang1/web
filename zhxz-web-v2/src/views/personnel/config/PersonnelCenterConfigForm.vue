<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
                    <layui-fieldset label="中心信息">
                        <template slot="main">
                            <layui-item>
                                <layui-inline-input
                                    label="所属部门" 
                                    placeholder="点击选择所属部门"
                                    :value="officeNameMap[personnelCenterConfig.officeId]"
                                    func="officeClick"
                                    :readonly="true"
                                    @officeClick="officeClick()"></layui-inline-input>
                                <layui-inline-input
                                    label="中心名称" 
                                    placeholder="请输入中心名称"
                                    v-model="personnelCenterConfig.centerName"></layui-inline-input>
                            </layui-item>
                            <layui-item>
                                <layui-inline-input
                                    label="中心代码" 
                                    placeholder="请输入中心代码"
                                    v-model="personnelCenterConfig.centerCode"></layui-inline-input>    
                                <layui-inline-input
                                    label="序号" 
                                    placeholder="请输入序号"
                                    type="number"
                                    v-model="personnelCenterConfig.centerOrder"></layui-inline-input>
                            </layui-item>
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="处室添加" :resetOpen="resetOpen">
                        <i @click="addOffice" :class="{'fa fa-plus text-warning select-pros': true}" style="font-size: 16px; cursor: pointer;"></i>
                        <template slot="main">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>处室</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody v-if="refresh">
                                    <tr 
                                        v-for="(item, index) in centerOffices" 
                                        :key="item.coOrder"
                                        v-dragging="{item: item, list: centerOffices, group: 'centerOffices' }">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ officeNameMap[item.officeId] }}</td>
                                        <td>
                                            <a @click="delRow(index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </layui-fieldset>
                    <layui-inline>
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelCenterConfig"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get, getPersonnelCenterOrgs } from '@/api/personnel/personnelCenterConfig'
import Base from "@/views/base/Base"

export default {
	name: 'PersonnelCenterConfigForm',
	extends: Base,
    data () {
        return {
            personnelCenterConfig: {
                id: this.$route.params.id,
				centerName: '',
				centerCode: '',
				officeId: '',
                centerStatus: '',
                centerOrder: ''
            },
            officeNameMap: {},
            centerOffices: [],
            clickOfficeType: '',
            resetOpen: false,
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
        delRow: function(index) {
            if (this.centerOffices[index].officeId) {
                confirm("确定删除该行吗？", () => {
                    this.centerOffices.splice(index, 1);
                });
            } else {
                this.centerOffices.splice(index, 1);
            }
        },
        addOffice: function() {
            this.resetOpen = new Date().getTime();
            this.officeClick(this.personnelCenterConfig.officeId, "部室选择", 2);
        },
        clickNodeAfter: function(node) {
            if (this.clickOfficeType == 1) {
                this.personnelCenterConfig.officeId = node.id;
            } else if (this.clickOfficeType == 2) {
                var index = this.centerOffices.indexOf(node.id, 'officeId');
                if (index != -1) {
                    return;
                }
                this.officeNameMap[node.id] = node.name;
                this.centerOffices.push({
                    officeId: node.id
                });
            }
            this.officeNameMap[node.id] = node.name;
            this.$layer.closeAll();
        },
    	officeClick: function(orgId, title, clickOfficeType) {
            this.clickOfficeType = clickOfficeType || 1;
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        orgId
                    }
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: (title || "部门选择")
			});
    	},
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelCenterConfig), JSON.stringify(this.centerOffices), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.personnelCenterConfig.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelCenterConfig.id){
                get(this.personnelCenterConfig.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelCenterConfig =  data.personnelCenterConfig || this.personnelCenterConfig;
                        this.officeNameMap = Object.assign(this.officeNameMap, data.officeNameMap || {});
                    }
                });

                getPersonnelCenterOrgs(this.personnelCenterConfig.id).then(res => {
                    var data = res.data;
                    if (data) {
                        this.centerOffices = data.personnelCenterOrgs || [];
                        Object.assign(this.officeNameMap, data.officeNameMap || {});
                    }
                });
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

				form.on('submit(savePersonnelCenterConfig)', function(data){
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