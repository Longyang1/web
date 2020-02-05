<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="用户组信息">
	                	<template slot="main">
		                	<layui-item>
		                        <layui-inline-input
		                            label="自定义组名称"
		                            placeholder="请输入自定义组名称"
                                    lay-verify="required"
		                            v-model="sysCustomGroup.groupName"></layui-inline-input>
		                    </layui-item>
						</template>
					</layui-fieldset>
                    <layui-fieldset label="人员添加">
                        <slot><i @click="addUsers" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></slot>
                        <template slot="main">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>人员</th>
                                        <th>排序</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(item, index) in userIds" 
                                        :key="item"
                                        v-dragging="{ item: item, list: userIds, group: 'userIds' }">
                                        <td>
                                            {{ userMap[item] }}
                                        </td>
                                        <td>{{ index + 1 }}</td>
                                        <td>
                                            <a @click="del(index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </layui-fieldset>
                    <layui-inline :style="{width:'100%'}">
                        <div style="text-align:center">
                            <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysCustomGroup"><i class="fa fa-save"></i> 保存</button>
                            <button class="layui-btn layui-btn-lg layui-btn-red"  @click="close"><i class="fa fa-times"></i> 关闭</button>
                        </div>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/sys/sysCustomGroup'
import Base from "@/views/base/Base"
import UserSelectList from '@/components/UserSelectList'

export default {
    name: 'SysCustomGroupForm',
	extends: Base,
    data () {
        return {
        	menuId: 'SysCustomGroupForm',
            sysCustomGroup: {
                id: this.$route.params.id,
				groupName: '',
				userIdInfo: '',
            },
            userIds: [],
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
        addUsers: function() {
            this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						isMultiUser: true
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
            });
        },
        del: function(index) {
            confirm('确定删除该行吗？', () => {
                this.userIds.splice(index, 1);
            });
        },
        getSelectUsers: function(users) {
            users.forEach(element => {
                if (this.userIds.indexOf(element.userId) == -1) {
                    this.userIds.push(element.userId);
                    this.userMap[element.userId] = element.userName;
                }
            });
            this.$layer.closeAll();
        },
    	save: function(){  
            this.sysCustomGroup.userIdInfo = this.userIds.join(',');
            saveOrUpdate(JSON.stringify(this.sysCustomGroup)).then(result => {
                alert(result.msg);
                this.backListView(this.sysCustomGroup.id == null);
            });
    	},
        initData: function(){
            if(this.sysCustomGroup.id){
                get(this.sysCustomGroup.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.sysCustomGroup =  data.sysCustomGroup || this.sysCustomGroup;
                        this.userMap = data.userMap || {};
                        this.userIds = this.sysCustomGroup.userIdInfo ? this.sysCustomGroup.userIdInfo.split(',') : [];
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

				form.on('submit(saveSysCustomGroup)', function(data){
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