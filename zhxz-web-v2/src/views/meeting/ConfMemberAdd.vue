<template>
    <div class="view-product" v-cloak>
        <div class="animated fadeInRight">
            <div class="ibox-content">
                <layui-form>
                    <layui-fieldset label="人员配置信息">
                        <template slot="main">
                            <layui-item>
                                <layui-inline-input
                                    label="作用域" 
                                    placeholder="点击选择作用域"
                                    v-model="office.name"
                                    func="officeClick"
                                    :readonly="true"
                                    @officeClick="officeClick"
                                    :cssStyle="{width: '190px', 'margin-right': '8px'}"></layui-inline-input>
                                <layui-inline-select
                                    label="会议类型"
                                    v-model="meetingConfMember.meetingTypeDict"
                                    :items="meetingTypes"></layui-inline-select>
                                <layui-inline-select
                                    label="人员类型"
                                    v-model="meetingConfMember.memberTypeDict"
                                    :items="memberTypes"></layui-inline-select>
                            </layui-item>
                        </template>
                    </layui-fieldset>
                    <layui-fieldset label="人员添加">
                        <slot><i @click="addRow" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i></slot>
                        <template slot="main">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>人员</th>
                                        <th>角色（A/B角）</th>
                                        <th v-if="meetingConfMember.memberTypeDict == 2">专业领域</th>
                                        <th>排序</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(item, index) in meetingConfMemberDetails" 
                                        :key="item.sort"
                                        v-dragging="{ item: item, list: meetingConfMemberDetails, group: 'meetingConfMemberDetail' }">
                                        <td>
                                            <div class="layui-input-inline">
                                                <input @click="selectMember(index)" type="text" :value="userMap[item.memberId] ? userMap[item.memberId].userName : ''" readonly="readonly" lay-verify="required" autocomplete="off" class="layui-input">
                                            </div>
                                        </td>
                                        <td style="overflow: visible;">
                                            <layui-select
                                                :items="roles"
                                                v-model="meetingConfMemberDetails[index].abRoleDict"></layui-select>
                                        </td>
                                        <td v-if="meetingConfMember.memberTypeDict == 2" style="overflow: visible;">
                                            <layui-select
                                                :items="professionalFields"
                                                v-model="meetingConfMemberDetails[index].professionalFieldDict"></layui-select>
                                        </td>
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
                        <button class="layui-btn layui-btn-lg layui-btn-blue" lay-submit lay-filter="saveConfMember"><i class="fa fa-save"></i> 保存</button>
                        <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                    </layui-inline>
                </layui-form>
            </div>
        </div>
	</div>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
import { getDicts } from '@/api/dict'
import { saveOrUpdateConfMember, getConfMember } from '@/api/meeting/confMember'
import UserSelectList from '@/components/UserSelectList'
import Base from "@/views/base/Base"

export default {
    name: 'ConfMemberAdd',
	extends: Base,
    data () {
        return {
            meetingTypes: [],
            memberTypes: [],
            meetingConfMember: {
                id: this.$route.params.id,
                meetingTypeDict: this.$route.params.meetingTypeDict || '',
                memberTypeDict: this.$route.params.memberTypeDict || '',
                officeId: this.$route.params.officeId || null,
            },
            meetingConfMemberDetails: [],
            office: {name: (this.$route.params.officeName || localStorage.getItem('officeName'))},
            roles: [],
            professionalFields: [],
            curSelectUserIndex: -1,
            userMap: {},
        }
    },
    computed: {
       
	},
	watch: {
		
	},
    mounted () {
        if (!this.meetingConfMember.id) {
            this.meetingConfMember.officeId = this.curUser.office.id || -1;
            this.office.name = this.curUser.office.name || "";
        }
        this.initData();
		this.$nextTick(() => {
			this.layuiInit();
		});
    },
    methods: {
        addRow: function() {
            this.$layer.iframe({
				content: {
					content: UserSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data:{
						isMultiUser: true
					}//props
				},
				area: ['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "人员选择"
            });
        },
        del: function(index) {
            var confMemberDetail = this.meetingConfMemberDetails[index];
            confirm('确定删除该行吗？', () => {
                this.meetingConfMemberDetails.splice(index, 1);
            }, (confMemberDetail.memberId || confMemberDetail.professionalFieldDict));
        },
        getSelectUsers: function(users, officeMap, layerid) {
            let newUsers = [];
            users.forEach(user => {
                var index = this.meetingConfMemberDetails.indexOf(user.userId, 'memberId');
                if (index == -1) {
                   this.meetingConfMemberDetails.push({
                        memberId: user.userId,
                        abRoleDict: 1,
                        professionalFieldDict: '',
                        sort: this.meetingConfMemberDetails.length,
                    });
                    this.userMap[user.userId] = user;
                }
            });
            this.$layer.close(layerid);
        },
    	clickNodeAfter: function(node){
            this.meetingConfMember.officeId = node.id;
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
    	save: function(){  
            this.submitHandler((token) => {
                confirm("您还没有配置具体的人员，确定要保存吗？", () => {
                    if(this.meetingConfMember.memberTypeDict != 2){
                        this.meetingConfMemberDetails.forEach(element => {
                            delete element.professionalFieldDict
                        });
                    }
                    
                    saveOrUpdateConfMember(JSON.stringify(this.meetingConfMember), JSON.stringify(this.meetingConfMemberDetails), token).then(result => {
                        alert(result.msg);
                        this.backListView(this.meetingConfMember.id == null, 'ConfMemberList');
                    }).catch((reason) => {
                        console.log('catch:', reason);
                        this.resetToken(reason);
                    });
                }, this.meetingConfMemberDetails.length <= 0)
            });
    	},
        initData: function(){
            if(this.meetingConfMember.id){
                getConfMember(this.meetingConfMember.id).then(res => {
                    var data = res.data;
                    if(data) {
                        this.meetingConfMember =  data.confMember || this.meetingConfMember;
                        this.meetingConfMemberDetails = data.confMemberDetails || [];
                        this.userMap = data.userMap || {};
                        //this.office.name = data.officeName || this.officeName;
                    }
                });
            }
            
        	getDicts('MEETING_TYPE_DICT,MEETING_MEMBER_TYPE_DICT,AB_ROLE_DICT,PROFESSIONAL_FIELD_DICT').then(result => {
                if(result.data){
                    this.meetingTypes = result.data[0] || [];
                    this.memberTypes = result.data[1] || [];
                    this.roles = result.data[2] || [];
                    this.professionalFields = result.data[3] || [];
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

				form.on('submit(saveConfMember)', function(data){
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