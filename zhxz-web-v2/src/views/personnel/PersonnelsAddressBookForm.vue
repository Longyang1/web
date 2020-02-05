<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                 <layui-form>
                    <layui-fieldset label="通讯录添加">
                        <slot><i @click="addRow" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></slot>
                        <template slot="main">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>姓名</th>
                                        <th>职务</th>
                                        <th>办公电话</th>
                                        <th>手机</th>
                                        <th>传真</th>
                                        <th>排序</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(item, index) in books" 
                                        :key="index"
                                        v-dragging="{ item: item, list: books, group: 'books' }">
                                        <td>
                                            <layui-inline-input 
                                                v-model="books[index].name"/>
                                        </td>
                                        <td><layui-inline-input v-model="books[index].job"/></td>
                                        <td><layui-inline-input v-model="books[index].telephoneNumber"/></td>
                                        <td><layui-inline-input v-model="books[index].mobilePhone"/></td>
                                        <td><layui-inline-input v-model="books[index].fax"/></td>
                                        <td>{{ index + 1 }}</td>
                                        <td>
                                            <a @click="del(index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </layui-fieldset>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelAddressBook"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get, getPersonnelAddressBooks, batchSaveOrUpdate } from '@/api/personnel/personnelAddressBook'
import Base from "@/views/base/Base"
import UserSelectList from "@/components/UserSelectList"

export default {
	name: 'PersonnelsAddressBookForm',
	extends: Base,
    data () {
        return {
            personnelAddressBook: {
                id: this.$route.params.id,
				categoryId: this.$route.params.categoryId,
				officeId: '',
				job: '',
				name: '',
				userUid: '',
				telephoneNumber: '',
				mobilePhone: '',
				fax: '',
				bookStatus: '',
            },
            books: [],
            categoryId: this.$route.params.categoryId,
            userOfficeMap: {}
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
        del: function(index) {
            var book = this.books[index];
            confirm('确定删除该行吗？', () => {
                this.books.splice(index, 1);
            });
        },
        addRow: function() {
            this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						
					}//props
				},
				area:['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title:"人员选择"
			});
        },
        getSelectUsers: function(users, selectUserOfficeMap, layid){
            users.forEach(element => {
                if (this.books.indexOf(element.userUid, 'userUid') == -1) {
                    this.books.push({
                        categoryId: this.categoryId,
                        officeId: selectUserOfficeMap[element.userId].orgId,
                        job: '',
                        name: element.userName,
                        userUid: element.userUid,
                        telephoneNumber: '',
                        mobilePhone: '',
                        fax: '',
                    });
                }
                Object.assign(this.userOfficeMap, selectUserOfficeMap);
            });
            this.$layer.close(layid);
        },
    	save: function(){  
    		this.submitHandler((token) => {    		
	            batchSaveOrUpdate(JSON.stringify(this.books), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.personnelAddressBook.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function() {
            var categoryId = this.categoryId;
            if(categoryId) {
                getPersonnelAddressBooks({
                    categoryId
                }).then(result => {
                    var data = result.data;
                    if(data) {
                        this.books =  data.personnelAddressBooks || [];
                    }
                });
            }
            
        	getDicts('').then(result => {
                var data = result.data;
                if(data){
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

				form.on('submit(savePersonnelAddressBook)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
    .table > thead > tr > th, td {
        text-align: center;
    }
    table .layui-input, table /deep/ .layui-input, .layui-select, .layui-textarea {
        height: 30px;
    }
</style>