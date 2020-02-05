<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content" style="overflow-x: hidden">
                <layui-form>
                    <template>
                        <!-- <layui-item>
                            <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelCertification.cerOrder"></layui-inline-input>
                        </layui-item> -->
                        <layui-item>
                            <layui-inline-input
                                label="名称" 
                                placeholder="请输入名称"
                                v-model="personnelCertification.name"
                                style="padding-right: 20px;"
                                :block="true"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="颁发单位" 
                                placeholder="请输入颁发单位"
                                v-model="personnelCertification.issuingUnit"
                                style="padding-right: 20px;"
                                :block="true"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="级别" 
                                placeholder="请输入级别"
                                v-model="personnelCertification.level"></layui-inline-input>
                            <layui-inline-input
                                label="专业或方向" 
                                placeholder="请输入专业或方向"
                                v-model="personnelCertification.majorDirection"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-date
                                label="获得时间" 
                                placeholder="点击选择获得时间"
                                v-model="personnelCertification.getTime"
                                :readonly="false"
                                name="cgetTime"
                                type="date"></layui-inline-date>
                            <file-upload-input
                                :attachmentBusinessId="personnelCertification.id"
                                attachmentBusinessType="personnel_certification"
                                module="personnel"
                                name="xgwjfile"
                                label="相关文件"
                                v-model="attachmentId"></file-upload-input>
                        </layui-item>
                    </template>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelCertification"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelCertification'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelCertificationForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            personnelCertification: {
                id: this.personnelCertificationId,
                personnelId: this.personnelId,
				cerOrder: this.order,
				name: '',
				issuingUnit: '',
				level: '',
				majorDirection: '',
				getTime: '',
            },
            attachmentId: ''
        }
    },
    props: {
        personnelCertificationId: {
            type: String,
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
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelCertification), this.attachmentId, token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelCertification.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelCertification.id){
                get(this.personnelCertification.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelCertification =  Object.assign({}, data.personnelCertification || this.personnelCertification);
                        this.personnelCertification.getTime = formatDate(this.personnelCertification.getTime, 'YYYY-MM-DD');
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

				form.on('submit(savePersonnelCertification)', function(data){
					_this.save();
					return false;
				});
        	});
        }
    }
}
</script>

<style scoped>
.view-product {
    padding-bottom: 0px;
}
.ibox-content {
    border-top-width: 1px;
}
</style>