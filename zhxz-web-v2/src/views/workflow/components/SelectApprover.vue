<template>
    <div class="view-product" v-cloak>
        <div class="animated">
            <div class="ibox-content">
                <layui-form>
                    <select-user-input
                        label="审批人"
                        v-model="approver"></select-user-input>
                </layui-form>
            </div>
            <div class="layui-footer">
                <button @click="trueSelectApprover()" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-save"></i> 确认提交</button>
                <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
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
	name: 'FileUploadModal',
	extends: BaseModal,
    data () {
        return {
           approver: ''
        }
	},
	props: {
	    layerid: {
			type: String,
			default: null
        },
	},
    mounted () {
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        trueSelectApprover() {
            this.$parent.trueSelectApproverAfter(this.approver, this.layerid);
        },
        layuiInit: function(){
            var _this = this;
        	layui.use(['element', 'form'], function(){
        		var element = element
        		,form = layui.form;
        	});
        }
    }
}
</script>

<style scoped>
.layui-footer {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    background-color: #eee;
}
/* .view-product /deep/ .layui-form-item.layui-form-text, .view-product /deep/ .layui-form-item.layui-form-text {
    padding-right: 0px!important;
} */
</style>