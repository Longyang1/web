<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content">
                <layui-form>
					<layui-item>
						<layui-inline-input
							label="期初总人数" 
							placeholder="请输入期初总人数"
							v-model="statPersonnelInfo.phaseStartTotal"></layui-inline-input>
						<layui-inline-input
							label="期末总人数" 
							placeholder="请输入期末总人数"
							v-model="statPersonnelInfo.phaseEndTotal"></layui-inline-input>
					</layui-item>
					<layui-item>
						<layui-inline-input
							label="期间入职人数" 
							placeholder="请输入期间入职人数"
							v-model="statPersonnelInfo.phaseIn"></layui-inline-input>
						<layui-inline-input
							label="期间离职人数" 
							placeholder="请输入期间离职人数"
							v-model="statPersonnelInfo.phaseOut"></layui-inline-input>
					</layui-item>
					<layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveStatPersonnelInfo"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/stat/statPersonnelInfo'
import BaseModal from "@/views/base/BaseModal"

export default {
	name: 'StatPersonnelInfoForm',
	extends: BaseModal,
    data () {
        return {
            statPersonnelInfo: {
                id: this.$route.params.id || this.statPersonnelInfoId,
				officeId: '',
				officeName: '',
				statYear: '',
				statMonth: '',
				statYearMonth: '',
				statCycle: '',
				statStartDate: '',
				statEndDate: '',
				phaseStartTotal: '',
				phaseEndTotal: '',
				phaseIn: '',
				phaseInPercent: '',
				phaseOut: '',
				phaseOutPercent: '',
            },
        }
	},
	props: {
		statPersonnelInfoId: {
			type: String,
			default: null
		},
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
				var statPersonnelInfo = this.statPersonnelInfo;  		
	            saveOrUpdate(JSON.stringify({
					id: statPersonnelInfo.id,
					phaseStartTotal: statPersonnelInfo.phaseStartTotal,
					phaseEndTotal: statPersonnelInfo.phaseEndTotal,
					phaseIn: statPersonnelInfo.phaseIn,
					phaseOut: statPersonnelInfo.phaseOut,
				}), token).then(result => {
	                alert(result.msg);
	                if (!this.layerid) {
						this.backListView(this.statPersonnelInfo.id == null);
					} else {
						this.$parent.$refs.pagination.refresh();
						this.$layer.close(this.layerid)
					}
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.statPersonnelInfo.id){
                get(this.statPersonnelInfo.id).then(result => {
                    var data = result.data;
                    if(data) {
                        this.statPersonnelInfo =  data.statPersonnelInfo || this.statPersonnelInfo;
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

				form.on('submit(saveStatPersonnelInfo)', function(data){
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