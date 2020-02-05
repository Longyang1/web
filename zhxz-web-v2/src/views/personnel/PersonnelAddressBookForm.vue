<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
	                <layui-fieldset label="XX信息">
	                	<template slot="main">
							<layui-item>
		                        <layui-inline-input
		                            label="部室" 
		                            placeholder="请输入部室"
		                            v-model="personnelAddressBook.officeId"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="职务" 
		                            placeholder="请输入职务"
		                            v-model="personnelAddressBook.job"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="姓名" 
		                            placeholder="请输入姓名"
		                            v-model="personnelAddressBook.name"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="办公电话" 
		                            placeholder="请输入办公电话"
		                            v-model="personnelAddressBook.telephoneNumber"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="手机" 
		                            placeholder="请输入手机"
		                            v-model="personnelAddressBook.mobilePhone"></layui-inline-input>
		                    </layui-item>
							<layui-item>
		                        <layui-inline-input
		                            label="传真" 
		                            placeholder="请输入传真"
		                            v-model="personnelAddressBook.fax"></layui-inline-input>
		                    </layui-item>
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
import { saveOrUpdate, get } from '@/api/personnel/personnelAddressBook'
import Base from "@/views/base/Base"

export default {
	name: 'PersonnelAddressBookForm',
	extends: Base,
    data () {
        return {
            personnelAddressBook: {
                id: this.$route.params.id,
				categoryId: this.categoryId,
				officeId: '',
				job: '',
				name: '',
				userUid: '',
				telephoneNumber: '',
				mobilePhone: '',
				fax: '',
				bookStatus: '',
            },
        }
    },
    props: {
        categoryId: {
            type: String,
            default: ''
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
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelAddressBook), token).then(result => {
	                alert(result.msg);
	                this.backListView(this.personnelAddressBook.id == null);
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelAddressBook.id){
                get(this.personnelAddressBook.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelAddressBook =  data.personnelAddressBook || this.personnelAddressBook;
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

</style>