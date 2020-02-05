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
                                v-model="personnelRewardPunishment.rpOrder"></layui-inline-input>
                        </layui-item> -->
                        <layui-item>
                            <layui-inline-select
                                label="奖惩类型" 
                                placeholder="点击选择获得时间"
                                v-model="personnelRewardPunishment.rpType"
                                :items="rpTypes"></layui-inline-select>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                label="名称" 
                                placeholder="请输入名称"
                                v-model="personnelRewardPunishment.name"></layui-inline-input>
                            <layui-inline-input
                                label="颁发单位" 
                                placeholder="请输入颁发单位"
                                v-model="personnelRewardPunishment.issuingUnit"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-date
                                label="获得时间" 
                                placeholder="点击选择获得时间"
                                v-model="personnelRewardPunishment.getTime"
                                :readonly="false"
                                name="cgetTime"
                                type="date"></layui-inline-date>
                            <file-upload-input
                                :attachmentBusinessId="personnelRewardPunishment.id"
                                attachmentBusinessType="personnel_reward_punishment"
                                module="personnel"
                                name="xgwjfile"
                                label="相关文件"
                                v-model="attachmentId"></file-upload-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-textarea
                                style="padding-right: 20px"
                                label="情况说明" 
                                placeholder="请输入情况说明"
                                v-model="personnelRewardPunishment.statement"></layui-inline-textarea>
                        </layui-item>
                    </template>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelRewardPunishment"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelRewardPunishment'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelRewardPunishmentForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            rpTypes: [],
            personnelRewardPunishment: {
                id: this.personnelRewardPunishmentId,
                personnelId: this.personnelId,
                rpOrder: this.order,
                rpType: '1',
				name: '',
				issuingUnit: '',
				statement: '',
				getTime: '',
            },
            attachmentId: ''
        }
    },
    props:{
        personnelRewardPunishmentId: {
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
	            saveOrUpdate(JSON.stringify(this.personnelRewardPunishment), this.attachmentId, token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelRewardPunishment.id == null);
                    }
	                
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelRewardPunishment.id){
                get(this.personnelRewardPunishment.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.personnelRewardPunishment =  Object.assign({}, data.personnelRewardPunishment || this.personnelRewardPunishment);
                        this.personnelRewardPunishment.getTime = formatDate(this.personnelRewardPunishment.getTime, 'YYYY-MM-DD');
                    }
                });
            }
            
        	getDicts('REWARD_PUNISHMENT_DICT').then(result => {
                var data = result.data;
                if(data){
                    this.rpTypes = data[0] || [];
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

				form.on('submit(savePersonnelRewardPunishment)', function(data){
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
/* .ibox-content {
    border-width: 1px 0px;
} */
</style>