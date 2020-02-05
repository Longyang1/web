<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content">
                <layui-form>
					<layui-item>
						<layui-inline-input
							label="父目录" 
							placeholder="请选择父目录"
							func="openDirTreeModal"
							:readonly="true"
							@openDirTreeModal="openDirTreeModal"
							:value="pName"></layui-inline-input>
						<layui-inline-input
							label="目录名称" 
							placeholder="请输入目录名称"
							v-model="sysFileDirectory.name"></layui-inline-input>
					</layui-item>
					<!-- <layui-item>
						<layui-inline-input
							label="目录代码" 
							placeholder="请输入目录代码"
							v-model="sysFileDirectory.code"></layui-inline-input>
						<layui-inline-input
							label="目录层级" 
							placeholder="请输入目录层级"
							v-model="sysFileDirectory.level"></layui-inline-input>
					</layui-item> -->
					<layui-item style="width: 678px">
						<layui-inline-textarea
							label="备注" 
							placeholder="请输入备注"
							v-model="sysFileDirectory.remark"></layui-inline-textarea>
					</layui-item>
					<layui-item>
						<layui-inline-input
							label="排序号" 
							placeholder="请输入排序号"
							type="number"
							v-model="sysFileDirectory.fdSort"></layui-inline-input>
					</layui-item>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysFileDirectory"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/file/sysFileDirectory'
import BaseModal from "@/views/base/BaseModal"
import FileTree from '@/views/file/FileTree'

export default {
	name: 'SysFileDirectoryForm',
	extends: BaseModal,
    data () {
        return {
            sysFileDirectory: {
                id: this.$route.params.id || this.dirId,
				parentId: (!this.$route.params.id && !this.dirId) ? this.parentId : '',
				name: '',
				code: '',
				level: '',
				remark: '',
				type: '2',
				fdSort: 100
			},
			pName: '',
        }
	},
	props: {
		layerid: {
			type: String,
			default: null
		},
		dirId: {
			type: String,
			default: ''
		},
		parentId: {
			type: String,
			default: ''
		},
		parentDirName: {
			type: String,
			default: ''
		}
	},
    computed: {
		
	},
	watch: {
		parentId() {
			if (!this.parentId) {
				this.pName = '';
			}
		}
        
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
		clickNodeAfter: function(node, tree, layid) {
			this.parentName = node.name;
			this.sysFileDirectory.parentId = node.id;
			this.$layer.close(layid);
		},
		openDirTreeModal: function() {
			if (this.sysFileDirectory.id) {
				return;
			}
			this.$layer.iframe({
				content: {
					content: FileTree, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
						
					}
				},
				area: ['auto', 'auto'],
				title: "目录树"
            });
		},
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.sysFileDirectory), null, token).then(result => {
					alert(result.msg);
					if (this.layerid) {
						this.$parent.reloadFileTree(this.layerid);
					} else {
						this.backListView(this.sysFileDirectory.id == null);
					}
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if (this.sysFileDirectory.id) {
                get(this.sysFileDirectory.id).then(result => {
                    let data = result.data || {};
                    if(data) {
                        this.sysFileDirectory =  data.sysFileDirectory || this.sysFileDirectory;
						get(this.sysFileDirectory.parentId).then(res => {
							data = res.data || {};
							let parent =  data.sysFileDirectory;
							if (parent) {
								this.pName = parent.name;
							} else {
								this.pName = "";
							}
						});
                    }
				});
				
            } else {
				this.pName = !this.parentId ? "" : this.parentDirName;
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

				form.on('submit(saveSysFileDirectory)', function(data){
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