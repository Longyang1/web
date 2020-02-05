<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <div style="padding: 20px; background-color: #F2F2F2;">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-header">日志信息</div>
                                <div class="layui-card-body">
                                    <layui-item>
                                        <layui-inline-select
                                            label="表名前缀" 
                                            :items="tableNamePrefixs"
                                            v-model="prefix"></layui-inline-select>
                                        <layui-inline-select
                                            label="表名" 
                                            :items="ftableNames"
                                            v-model="tableName"></layui-inline-select>
                                        <layui-inline-select
                                            label="字段" 
                                            :items="columns"
                                            v-model="column"></layui-inline-select>
                                    </layui-item>
                                    <layui-item>
                                        <layui-inline-input
                                            label="ID值" 
                                            v-model="idValue"
                                            :block="true"></layui-inline-input>
                                    </layui-item>
                                    <layui-item>
                                        <layui-inline-input
                                            label="字段原始值" 
                                            v-model="obj[column]"
                                            :readonly="true"
                                            :block="true"></layui-inline-input>
                                    <layui-item>
                                    </layui-item>
                                        <layui-inline-input
                                            label="字段修改值" 
                                            v-model="columnNewValue"
                                            :block="true"></layui-inline-input>
                                    </layui-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="padding: 20px; background-color: #F2F2F2;">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header">值对象</div>
                                <div class="layui-card-body">
                                    <json-viewer
                                        :value="obj"
                                        :expand-depth='3'></json-viewer>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header">操作</div>
                                <div class="layui-card-body">
                                    <layui-form>
                                        <layui-inline class="btn-group-center">
                                            <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveSysLog"><i class="fa fa-save"></i> 修改</button>
                                            <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                                        </layui-inline>
                                    </layui-form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import * as dmApi from '@/api/sys/dm'
import Base from "@/views/base/Base"
let _ = require('lodash')

export default {
	name: 'DataMaintenance',
	extends: Base,
    data () {
        return {
            tableNames: [],
            ftableNames: [],
            prefix: '-1',
            tableName: '',
            columns: [],
            column: '',
            idValue: '',
            columnOldValue: '',
            columnNewValue: '',
            obj: {},
        }
    },
    computed: {
        tableNamePrefixs: function() {
            var prefixArr = [];
            this.tableNames.forEach(element => {
                var arr = element.value.split("_");
                var prefix = arr[0];
                if (prefixArr.indexOf(prefix, 'value') == -1) {
                    prefixArr.push({
                        label: prefix,
                        value: prefix
                    });
                }
            });
           return prefixArr;
        },
    },
	watch: {
        prefix: function() {
            this.ftableNames = this.tableNames.filter(ele => {
                return ele.value.startsWith(this.prefix);
            });
        },
        tableName: function() {
            this.columns = [];
            this.getCurObj();
            if (!this.tableName) {
                return;
            }
            dmApi.getColumns(this.tableName).then(res => {
                var columns = res.data || [];
                columns.forEach(ele => {
                    this.columns.push({
                        label: ele,
                        value: ele.split(":")[1]
                    });
                });
            });
        },
        idValue: function() {
            this.getCurObj();
        }
    },
    mounted () {
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        getCurObj: _.debounce(function() {
            if (this.tableName) {
                dmApi.getObj(this.tableName, this.idValue).then(res => {
                    this.obj = res.data || {};
                });
            }
        }, 500),
    	save: function() { 
            if (!this.idValue) {
                msg("ID值不能为空");
                return;
            }
    		confirm("确定修改吗？", () => {
                dmApi.updateProperty(this.tableName, this.idValue, this.column, this.columnNewValue).then(result => {
                    alert(result.msg);
                    this.getCurObj();
                })
            });
    	},
        initData: function(){
            dmApi.getTableNames().then(res => {
                var tableNames = res.data || [];
                tableNames.forEach(ele => {
                    this.tableNames.push({
                        label: ele,
                        value: ele
                    });
                });
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

				form.on('submit(saveSysLog)', function(data){
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