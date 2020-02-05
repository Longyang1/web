<template>
    <content-box>
        <layui-form>
            <layui-fieldset label="联动配置信息">
                <template slot="main">
                    <layui-item>
                        <layui-inline-select
                            label="联动类型"
                            v-model="meetingConfLinkage.typeDict"
                            :items="linkageTypes"></layui-inline-select>
                    </layui-item>
                    <layui-item v-if="selectedLinkDictItem.desc">
                        <layui-inline-input
                            v-if="selectedLinkDictItem.desc.startsWith('org')"
                            label="会议部门" 
                            placeholder="点击选择会议部门"
                            v-model="office.name"
                            func="officeClick"
                            :readonly="true"
                            @officeClick="officeClick"
                            :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                        <layui-inline-select
                            v-if="selectedLinkDictItem.desc.startsWith('dict')"
                            label="会议字典"
                            v-model="meetingConfLinkage.officeId"
                            :items="meetingDicts"></layui-inline-select>
                    </layui-item>
                    <layui-item>
                        <layui-inline-checkbox
                            name="voteOptions"
                            label="字典值集合"
                            valKey="id"
                            :items="dicts"
                            :vals="meetingConfLinkage.dictKey"
                            v-model="meetingConfLinkage.dictKey"></layui-inline-checkbox>
                    </layui-item>
                </template>
            </layui-fieldset>
            <layui-inline class="btn-group-center">
                <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveConfLinkage"><i class="fa fa-save"></i> 保存</button>
                <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
            </layui-inline>
        </layui-form>
    </content-box>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
import { getMeetingConfLinkageInitData, saveOrUpdateConfLinkage } from '@/api/meeting/confLinkage'
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
export default {
    name: 'ConfLinkageAdd',
	extends: Base,
    data () {
        return {
            meetingStatus: [{"label":"全部", value:"", selected: 1}],
            meetingTypes: [{"label":"全部", value:"", selected: 1}],
            linkageTypes: [],
            memberTypeDicts: [],
            meetingConfLinkage: {
                id: this.$route.params.confId || null,
                typeDict: '',
                officeId: this.$route.params.officeId || null,
                dictKey: [],
            },
            office: {name: this.$route.params.officeName || localStorage.getItem('officeName')},
            dicts: [],
            selectedLinkDictItem: [],
            meetingDicts: [],
        }
    },
    computed: {
        meetingTypeMap: function(){
    		return this.meetingTypes.array2Obj('value', 'label');
    	},
	},
	watch: {
		'meetingConfLinkage.typeDict': function() {
			this.linkageTypeSelectChange();
		}
	},
    mounted () {
		this.initData();
		this.layuiInit();
    },
    methods: {
        selectedValue: function(index){
    		var dict = this.dicts[index];
    		if(dict){
    			dict['selected'] = !dict['selected'];
    			Vue.set(this.dicts, index, dict);
    		}
    	},
    	linkageTypeSelectChange: function(func){
    		if(this.meetingConfLinkage.typeDict != ''){
                var type = this.meetingConfLinkage.typeDict;
                
                this.selectedLinkDictItem = this.linkageTypes[this.linkageTypes.indexOf(this.meetingConfLinkage.typeDict, 'value')];
                var isDictType = this.selectedLinkDictItem.desc.startsWith('dict');
                if (isDictType) {
                    type += "," + this.selectedLinkDictItem.desc.split(':')[1];
                }
    			getDicts(type).then(result => {
                    var data = result.data;
                    if (data) {
                        this.dicts = data[0] || [];
                        if (isDictType) {
                            this.meetingDicts = data[1] || [];
                        }
                    }
                    if(typeof func == 'function'){
                        func();
                    }
    			});
    		}
        },
        clickCheckboxAfter: function(data) {
            console.log(data);
            var index = this.dicts.indexOf(data.val, 'value');
            if(index != -1){
                var dict = this.dicts[index];
                dict.selected = data.checked;
                this.$set(this.dicts, index, dict);
            }
        },
    	clickNodeAfter: function(node){
            this.meetingConfLinkage.officeId = node.id;
			this.office.name = node.name;
			this.$layer.closeAll();
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
                title:"会议部门选择"
			});
    	},
    	trueSwitchOffice: function(officeId, officeName){
    		this.meetingConfLinkage.officeId = officeId;
			this.office.name = officeName;
			this.layer.close(this.index);
			this.officeChange();
    	},
    	save: function(flag) {
            this.submitHandler((token) => {
                var meetingConfLinkage = JSON.parse(JSON.stringify(this.meetingConfLinkage));
                meetingConfLinkage.dictKey = meetingConfLinkage.dictKey.join(",");
                
                saveOrUpdateConfLinkage(meetingConfLinkage, token).then(result => {
                    alert(result.msg);
                    this.backListView(this.meetingConfLinkage.id == null, 'ConfLinkageList');
                }).catch((reason) => {
                    console.log('catch:', reason);
                    this.resetToken(reason);
                });
            });
    	},
        initData: function(){
			
            if(this.meetingConfLinkage.id){
                getMeetingConfLinkageInitData(this.meetingConfLinkage.id).then(results => {
                    var confLinkageData = results[0].data;
                    this.meetingConfLinkage = confLinkageData || {dictKey: ''};
                    this.meetingConfLinkage.dictKey = this.meetingConfLinkage.dictKey.split(',');

                    this.linkageTypes = results[1].data ? (results[1].data[0] || []) : [];

                });
            } else {
                getDicts('LINKAGE_TYPE').then(res => {
                    this.linkageTypes = res.data ? (res.data[0] || []) : [];
                });
            }
        	
        },
        mergeJsonObject: function(jsonbject1, jsonbject2){
			var resultJsonObject = {};
			for(var attr in jsonbject1) {
			   resultJsonObject[attr] = jsonbject1[attr];
			}
			for(var attr in jsonbject2) {
			   resultJsonObject[attr] = jsonbject2[attr];
			}
			return resultJsonObject;
        },
        layuiInit: function(){
			var _this = this;
        	layui.use(['element', 'form'], function(){
        		var element = element
        		,form = layui.form;
				//创建一个编辑器
				//var editIndex = layedit.build('LAY_demo_editor');

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

				form.on('submit(saveConfLinkage)', function(data){
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