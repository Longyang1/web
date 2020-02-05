<template>
    <div class="view-product" v-cloak style="min-width: 722px;min-height: 330px;">
        <div class="animated">
            <div class="ibox-content" :style="{'border-width': (step == 2 && personnelFamily.relationshipDict != 3) ? '1px' : '0px'}">
                <layui-form v-if="step == 1">
                    <template>
                        <layui-item style="text-align: center;">
                            <layui-inline-select
                                label="关系"
                                v-model="personnelFamily.relationshipDict"
                                required="required"
                                :items="relationshipDicts"></layui-inline-select>
                        </layui-item>
                       
                    </template>
                </layui-form>
                <layui-form v-if="show && step == 2">
                    <template>
                        <layui-item>
                            <layui-inline-input
                                label="姓名" 
                                placeholder="请输入姓名"
                                v-model="personnelFamily.name"></layui-inline-input>
                            <layui-inline-input
                                label="关系" 
                                placeholder="请输入关系"
                                :readonly="true"
                                :value="relationshipMap[personnelFamily.relationshipDict]"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-date
                                label="出生年月"
                                placeholder="点击选择日期"
                                name="birthday"
                                :readonly="false"
                                type='date'
                                v-model="personnelFamily.birthday"/>
                            <!-- <layui-inline-input
                                label="政治面貌" 
                                placeholder="请输入政治面貌"
                                v-model="personnelFamily.political"></layui-inline-input> -->
                            <layui-inline-select
                                label="政治面貌"
                                v-model="personnelFamily.politicalDict"
                                :items="politicalDicts"></layui-inline-select>
                        </layui-item>
                        <layui-item v-if="personnelFamily.relationshipDict == 3">
                            <layui-inline-select
                                label="户口所在地"
                                v-model="personnelFamily.accountLocationProvince"
                                valKey="code"
                                labelKey="name"
                                :items="areas">
                                <div class="layui-input-inline city" style="margin-left: 15px;width: 139px;">
                                    <layui-select
                                        v-if="refresh"
                                        v-model="personnelFamily.accountLocationCity"
                                        valKey="code"
                                        label="name"
                                        :items="accountLocationCitys"></layui-select>
                                </div>
                            </layui-inline-select>
                        </layui-item>
                        <layui-item v-if="personnelFamily.relationshipDict == 3">
                            <layui-inline-select
                                label="最高学历"
                                v-model="personnelFamily.highestEducationDict"
                                :items="highestEducationDicts"></layui-inline-select>
                            <layui-inline-select
                                label="最高学位"
                                v-model="personnelFamily.highestDegreeDict"
                                :items="highestDegreeDicts"></layui-inline-select>
                         </layui-item>
                        <layui-item>
                            <layui-inline-input
                                style="padding-right: 26px"
                                label="工作单位" 
                                placeholder="请输入工作单位"
                                v-model="personnelFamily.workUnit"
                                :block="true"></layui-inline-input>
                        </layui-item>
                        <layui-item v-if="personnelFamily.relationshipDict == 3">
                            <layui-inline-select
                                label="工作单位所在城市"
                                v-model="personnelFamily.workUnitProvince"
                                valKey="code"
                                labelKey="name"
                                :items="areas">
                                <div class="layui-input-inline city" style="margin-left: 15px;width: 139px;">
                                    <layui-select
                                        v-if="refresh"
                                        v-model="personnelFamily.workUnitCity"
                                        valKey="code"
                                        label="name"
                                        :items="workUnitCitys"></layui-select>
                                </div>
                            </layui-inline-select>
                        </layui-item>
                        <layui-item>
                            <layui-inline-select
                                label="行业"
                                v-model="personnelFamily.unitCategoryDict"
                                :items="unitCategorys"></layui-inline-select>
                            <layui-inline-input
                                label="职务" 
                                placeholder="请输入职务"
                                v-model="personnelFamily.job"></layui-inline-input>
                        </layui-item>
                        <layui-item>
                            <layui-inline-input
                                v-if="personnelFamily.relationshipDict == 3"
                                label="最高技术职称" 
                                placeholder="请输入最高技术职称"
                                v-model="personnelFamily.highestTechnicalTitle"></layui-inline-input>
                            <layui-inline-input
                                label="序号" 
                                placeholder="请输入序号"
                                v-model="personnelFamily.familyOrder"
                                type="number"></layui-inline-input>
                        </layui-item>
                    </template>
                    <layui-inline class="btn-group-center">
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="savePersonnelFamily"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
        <layui-inline  v-if="step == 1" class="btn-group-center step_1">
            <button @click.stop="nextStep" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-arrow-right"></i> 下一步</button>
            <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
        </layui-inline>
	</div>
</template>

<script>
import { getDicts } from '@/api/dict'
import { saveOrUpdate, get } from '@/api/personnel/personnelFamily'
import BaseModal from "@/views/base/BaseModal"
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import { formatDate } from '@/utils/formatUtils'
import { getSysAreas } from '@/api/sys/sysArea'

export default {
    name: 'PersonnelFamilyForm',
    mixins: [personnelProfileMixin],
	extends: BaseModal,
    data () {
        return {
            politicalDicts: [],
            unitCategorys: [],
            highestEducationDicts: [],
			highestDegreeDicts: [],
            personnelFamily: {
                id: this.personnelFamilyId,
				personnelId: this.personnelId,
				familyOrder: this.order,
				name: '',
                relationship: '',
                relationshipDict: '',
				birthday: '',
				political: '',
				politicalDict: '',
                workUnit: '',
                job: '',
                unitCategoryDict: '',
                accountLocation: '',
                accountLocationProvince: '',
                accountLocationCity: '',
                workUnitProvince: '',
                workUnitCity: '',
                highestEducationDict: '',
                highestDegreeDict: '',
                highestTechnicalTitle: '',
            },
            areas: [],
            accountLocationCitys: [],
            workUnitCitys: [],
            refresh: true,
            relationshipDicts: [],
            step: -1,
            show: false,
        }
    },
    props: {
        personnelFamilyId: {
            type: String,
            default: null
        }
    },
    computed: {
       	relationshipMap: function() {
            return this.relationshipDicts.array2Obj('value', 'label');
        }
	},
	watch: {
        'personnelFamily.accountLocationProvince': function() {
            this.$set(this.personnelFamily, 'accountLocationCity', '');
            this.setCitys('accountLocationProvince');
        },
        'personnelFamily.workUnitProvince': function() {
            this.$set(this.personnelFamily, 'workUnitCity', '');
            this.setCitys('workUnitProvince');
        },
    },
    mounted () {
        if (this.personnelFamilyId) {
            this.step = 2;
        } else {
            this.step = 1;
            this.show = true;
        }
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        nextStep: function() {
            this.step++; 
        },
        setCitys: function(propertyName, pId, suff, func) {
            suff = suff || 'Citys';
            var index = -1;
            if (!pId) {
                index = this.areas.indexOf(this.personnelFamily[propertyName], 'code');
                propertyName = propertyName.replace('Province', '');
                propertyName = propertyName.replace('City', '');
                if (index == -1) {
                    this[propertyName + suff] = [];
                    return;
                }
            } else {
                propertyName = propertyName.replace('Province', '');
                propertyName = propertyName.replace('City', '');
            }
            
            var parentId = pId || this.areas[index].id;
            getSysAreas({
                parentId
            }).then(res => {
                Object.assign(this[propertyName + suff], res.data.sysAreas || []);
                this.refresh = false;
                this.$nextTick(() => {
                    this.refresh = true;
                });
                if (func) {
                    func();
                }
            });
        },
    	save: function(){  
    		this.submitHandler((token) => {    		
	            saveOrUpdate(JSON.stringify(this.personnelFamily), token).then(result => {
                    alert(result.msg);
                    if (this.layerid) {
                        this.$parent.refreshComp();
                        this.$layer.close(this.layerid);
                    } else {
                        this.backListView(this.personnelFamily.id == null);
                    }
	            }).catch((error) => {
	                // 此处你的业务代码
	                this.resetToken();
	            });
    		});
    	},
        initData: function(){
            if(this.personnelFamily.id){
                get(this.personnelFamily.id).then(result => {
                    var data = result.data;
                    if (data) {
                        var personnelFamily = data.personnelFamily || {};
                        this.personnelFamily = Object.assign(this.personnelFamily, personnelFamily);
                        this.personnelFamily.birthday = formatDate(this.personnelFamily.birthday, "YYYY-MM-DD");
                        var accountLocationCity = personnelFamily.accountLocationCity;
                        var workUnitCity = personnelFamily.workUnitCity;
                        getSysAreas({
                            parentId: 1
                        }).then(res => {
                            this.areas = res.data.sysAreas || [];
                            if(this.personnelFamily.accountLocationProvince) {
                                this.$set(this.personnelFamily, 'accountLocationCity', accountLocationCity);
                                var index = this.areas.indexOf(this.personnelFamily.accountLocationProvince, 'code');
                                if (index != -1) {
                                    this.setCitys('accountLocationProvince', this.areas[index].id);
                                }
                            }

                             if(this.personnelFamily.workUnitProvince) {
                                this.$set(this.personnelFamily, 'workUnitCity', workUnitCity);
                                var index = this.areas.indexOf(this.personnelFamily.workUnitProvince, 'code');
                                if (index != -1) {
                                    this.setCitys('workUnitProvince', this.areas[index].id);
                                }
                            }
                        });
                    }
                    this.show = true;
                }).catch(err => {
                    this.show = true;
                });
            } else {
                getSysAreas({
                    parentId: 1
                }).then(res => {
                    this.areas = res.data.sysAreas || [];
                });
            }
            
            
        	getDicts('RELIGION_DICT,UNIT_CATEGORY_DICT,PERSONNEL_EDUCATION_DICT,PERSONNEL_DEGREE_DICT,RELATIONSHIP_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.politicalDicts = result.data[0] || [];
                    this.unitCategorys = result.data[1] || [];
                    this.highestEducationDicts = result.data[2] || [];
                    this.highestDegreeDicts = result.data[3] || [];
                    this.relationshipDicts = data[4] || [];
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

				form.on('submit(savePersonnelFamily)', function(data){
					_this.save();
					return false;
                });
                
                form.on('nextStep', () => {
                    _this.nextStep();
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
    .btn-group-center.step_1 {
        margin-top: 220px;
        margin-bottom: 20px;
    }
</style>