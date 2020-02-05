<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content">
                <layui-form>
                    <layui-item>
                        <layui-inline-input
                            label="所属部室" 
                            placeholder="点击选择所属部室"
                            :value="officeNameMap[personnelBookCategory.officeId]"
                            func="officeClick"
                            :readonly="true"
                            @officeClick="officeClick()"></layui-inline-input>
                        <layui-inline-input
                            label="类别名称" 
                            placeholder="请输入类别名称"
                            v-model="personnelBookCategory.categoryName"></layui-inline-input>
                    </layui-item>
                    <layui-item>
                        <layui-inline-user-tag
                            style="width: 682px"
                            label="负责人"
                            :userOfficeMap="userOfficeMap"
                            v-model="users"></layui-inline-user-tag>
                    </layui-item>
                    <layui-item>
                        <layui-inline-select
                            name="dataSource"
                            label="数据来源"
                            v-model="personnelBookCategory.dataSource"
                            :up="true"
                            :items="dataSources"/>
                        <layui-inline-input
                            label="序号" 
                            placeholder="请输入序号"
                            v-model="personnelBookCategory.categoryOrder"></layui-inline-input>
                    </layui-item>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelBookCategory"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelBookCategory'
import BaseModal from "@/views/base/BaseModal"
import OfficeTree from '@/components/OfficeTree'

export default {
	name: 'PersonnelBookCategoryForm',
	extends: BaseModal,
    data () {
        return {
            categoryTypeDicts: [],
            dataSources: [],
            personnelBookCategory: {
                id: this.$route.params.id || this.id || null,
				categoryName: '',
				categoryType: '',
				categoryTypeDict: '',
				officeId: '',
				userId: '',
				dataSource: '',
				categoryOrder: this.categoryOrder,
				categoryStatus: '',
            },
            userOfficeMap: {},
            users: [],
            officeNameMap: {},
        }
    },
    props: {
        id: {
            type: String,
            default: null
        },
        categoryOrder: {
            type: Number,
            default: null
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
        clickNodeAfter: function(node, zTree, layerid) {
            this.personnelBookCategory.officeId = node.id;
            this.personnelBookCategory.categoryName = node.name;
            this.officeNameMap[node.id] = node.name;
            this.$layer.close(layerid);
        },
    	officeClick: function(){
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: [
                       
                    ]
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title:"所属部室选择"
			});
    	},
    	save: function(){  
    		this.submitHandler((token) => { 
                console.log(this.users.map((item) => {
                    return item.userId;
                }));
                this.personnelBookCategory.userId = this.users.map((item) => {
                    return item.userId;
                }).join(',');   		
	            saveOrUpdate(JSON.stringify(this.personnelBookCategory), token).then(result => {
	                alert(result.msg);
                    // this.backListView(this.personnelBookCategory.id == null);
                    this.$layer.close(this.layerid);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelBookCategory.id){
                get(this.personnelBookCategory.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelBookCategory =  data.personnelBookCategory || this.personnelBookCategory;
                        this.users = data.users || [];
                        this.userOfficeMap = data.userOfficeMap || {};
                        this.officeNameMap = data.officeNameMap || {};
                    }
                });
            }
            
        	getDicts('CATEGORY_TYPE_DICT,DATA_SOURCE').then(result => {
                var data = result.data;
                if(data){
                    this.categoryTypeDicts = result.data[0] || [];
                    this.dataSources = data[1] || [];
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

				form.on('submit(savePersonnelBookCategory)', function(data){
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