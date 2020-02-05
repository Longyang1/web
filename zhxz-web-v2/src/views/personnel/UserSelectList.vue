<template>
    <div id="modal" class="layui-row">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" :style="{'margin-bottom': '20px'}">
            <office-tree :height="height" ref="officeTree"></office-tree>
        </div>
        <div class="layui-col-sm9 layui-col-md9 layui-col-lg9 user-main" :style="{height: height,'overflow-y': 'auto',padding: '10px'}">
            <pagination-simple 
                url="./sys/authUsers"
                :otherParam="otherParam"
                @handleSearchResult='handleSearchResult'
                ref="pagination">
                <template slot="searchBtnBefore">
                    <layui-inline>
                        <input  v-model='otherParam.name' class="layui-input" type="text" placeholder="输入姓名或登录ID">
                    </layui-inline>
                </template>
                <template slot="searchBtnAfter">
                    <div class="layui-inline" style="float: right">
                        <layui-select
                            placeholder="快捷选人-用户组"
                            valKey="userIdInfo"
                            label="groupName"
                            v-model="selectedGroupUserIdInfo"
                            :items="userGroups"></layui-select>
                    </div>
                    <i data-v-12c6af75="" aria-hidden="true" class="fa fa-users" style="color:#00a1f2;float: right;padding-top: 10px;padding-right: 16px;font-size: 18px;"></i>
                    <div class="clear"></div>
                </template>
                <template slot="opera">
                     <layui-inline style="padding-bottom: 5px">
                        <layui-checkbox-group
                            style="display:inline-block"
                            v-model="checkOrgTypes">
                            <layui-simple-checkbox
                                v-if="user.office.id != user.department.id"
                                name="org"
                                :val="user.office.id"
                                v-model="otherParam.orgId"
                                label="我的处室"
                                @clickCheckboxAfter="clickCheckboxAfter"/>
                            <layui-simple-checkbox
                                name="org"
                                :val="user.department.id"
                                v-model="otherParam.orgId"
                                label="我的部门"
                                @clickCheckboxAfter="clickCheckboxAfter"/>
                        </layui-checkbox-group>
                        <layui-simple-checkbox
                            label="只显示领导"
                            val="duty"
                            v-model="otherParam.duty"/>
                    </layui-inline>
                </template>
                <template slot="main">
                    <div class="user-main layui-row layui-col-space1">
                        <div class="layui-col-xs12 user-list">
                            <table class="footable table table-stripped">
                                <thead>
                                    <tr>
                                        <th width="50px">
                                            <layui-simple-checkbox 
                                                v-if="isMultiUser"
                                                @clickCheckboxAfter="checkAll"
                                                :defautValue="2"
                                                v-model="checkAllVal"
                                                :val="1"/>
                                            <span v-if="!isMultiUser">操作</span>
                                        </th>
                                        <th width="60px">序号</th>
                                        <th>姓名</th>
                                        <th>登录ID</th>
                                        <th>电话</th>
                                        <th>归属部门</th>
                                        <th v-if="isMultiUser" style="border-left: 1px solid #e7e7e7;">已选择用户 
                                            <span @click="clear" style="float:right;color:red;cursor:pointer;">
                                                <i class="fa fa-eraser" title="清除" style="color:red;" aria-hidden="true"></i> 清空
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="meetingTbody" class="footable_table" ref="tbody">
                                    <template v-for="(item, index) in page.list">
                                        <tr 
                                            :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                            style="display: table-row;"
                                            @click="clickRow(index)"
                                            :key="item.id + '' + index">
                                            <td>
                                                <layui-simple-checkbox 
                                                    v-if="isMultiUser && refresh"
                                                    @clickCheckboxAfter="addOrRemoveUser"
                                                    :checkedVals="checkedUserIds"
                                                    :val="item.userId + ':' + item.orgId"
                                                    :ref="'userCheckbox' + index">
                                                </layui-simple-checkbox>
                                                <layui-radio
                                                    v-if="!isMultiUser"
                                                    :useAnim="false"
                                                    v-model="selectedUserId"
                                                    :val="item.userId + ':' + item.orgId"
                                                    @radioClickAfter="radioClickAfter"
                                                    :ref="'radio' + index"></layui-radio>
                                            </td>
                                            <td>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</td>
                                            <td v-highlight="{keyword: otherParam.name, value: item.userName}"></td>
                                            <td v-highlight="{keyword: otherParam.name, value: item.userUid}"></td>
                                            <td>{{ item.userPreferredMobile }}</td>
                                            <td>{{ orgMap[item.orgId] | pv('orgName') }}</td>
                                            <td 
                                                v-if="isMultiUser && index == 0" 
                                                :rowspan="page.pageSize" 
                                                @click.stop="clickUserBox"
                                                class="checked-user-box">
                                                <!-- <layui-checkbox-group
                                                    v-model="checkedUserIds"
                                                    :style="{height: (userBoxHeight + 'px')}">
                                                    <layui-checkbox 
                                                        v-for="user in selectedUsers"
                                                        :label="user.userName + '/' + user.userUid"
                                                        :val="user.userId"
                                                        icon="layui-icon-close"
                                                        :key="'l-' + user.userId">
                                                    </layui-checkbox>
                                                </layui-checkbox-group> -->
                                                <div :style="{height: (userBoxHeight + 'px')}">
                                                    <span class="label"  v-for="(user, index) in selectedUsers" :key="'l-' + index + user.userId">
                                                        <font>{{ user.userName + '/' + user.userUid }}</font>
                                                        <i @click="remove(user)" class="xm-iconfont icon-close"></i>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
            </pagination-simple>
            <div v-if="isMultiUser" class="layui-form-item layui-layout-admin">
                <div class="layui-input-block">
                <div class="layui-footer" style="left: 0;text-align:center">
                    <button @click="trueSelect" class="layui-btn" lay-submit="" lay-filter="component-form-demo1">确定</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getUsers } from "@/api/user";
import { getSysCustomGroups } from "@/api/sys/sysCustomGroup";
import Page from '@/components/Page'
import OfficeTree from '@/components/OfficeTree'
import BaseModal from '@/views/base/BaseModal'
let _ = require('lodash')

export default {
    extends: BaseModal,
    components: {
        Page
    },
    data() {
        return {
            page: {},
            searchForm: {
                name: null,
                orgId: null,
                pageNo: 1,
                pageSize: 10
            },
            name: null,
            pid: null,
            officeName: '',
            otherParam: {
                orgId: null,
                name: null,
                duty: null,
                userUsertypeDict: 1           
            },
            userOfficeMap: {},
            selectedUsers: [],
            checkedUserIds: [],
            selectUserOfficeMap: {},
            officeTreeIndex: -1,
            selectedUserId: '',
            height: ($('#' + this.layerid).height() - 80) + 'px',
            userBoxHeight: 0,
            refresh: true,
            checkAllVal: 2,
            userGroups: [],
            selectedGroupUserIdInfo: '',
            checkOrgTypes: [],
            searchType: 1,
            orgMap: {},
        };
    },
    props: {
        isMultiUser: {
            type: Boolean,
            default: true
        },
        layerid: {
            type: String,
            default: ''
        }
    },
    computed: {
        user: function() {
            return this.$store.state.user.user;
        }
    },
    watch: {
        checkedUserIds: function() {
            var checkAll = true;
            this.page.list.forEach(element => {
                if (this.checkedUserIds.indexOf(element.userId + ":" + element.orgId) == -1) {
                    checkAll = false;
                    return;
                }
            });
            this.checkAllVal = (checkAll && this.page.list.length >= 1) ? 1 : 2;
        },
        selectedGroupUserIdInfo() {
            if (this.selectedGroupUserIdInfo == '') {
                return;
            }
            getUsers({
                keys: this.selectedGroupUserIdInfo
            }).then(res => {
                var data = res.data;
                if (data) {
                    var users = data.authUsers || [];
                    let userOfficeMap = data.userOfficeMap || {};
                    users.forEach(user => {
                        if (this.selectedUsers.indexOf(user.userId, 'userId') == -1) {
                            this.selectedUsers.push(user);
                            this.checkedUserIds.push(user.userId + ':' + userOfficeMap[user.userId].orgId);
                        }
                    });
                    Object.assign(this.selectUserOfficeMap, userOfficeMap);
                }
            });
        },
        'page.pageNo': function() {
            this.$nextTick(() => {
                this.userBoxHeight = 32 * this.page.list.length;
            });
        },
        'otherParam.duty': function() {
            this.$refs.pagination.search(1, false, {
                duty: this.otherParam.duty
            }, this.searchType);
        }, 
        'otherParam.name': function() {
            this.autoSearch();
        }
    },
    mounted() {
        getSysCustomGroups().then(res => {
            var data = res.data;
            if (data) {
                this.userGroups = data.sysCustomGroups || [];
            }
        });
        $("#" + this.layerid + " .vl-notify-content").css('overflow-y', 'hidden');
        
    },
    methods: {
        autoSearch: _.debounce(function() {
            this.$refs.pagination.search(1, true, {
                name: this.otherParam.name
            }, this.searchType);
        }, 500),
        clear: function() {
           confirm("确定清空已选择的用户吗？", () => {
                this.selectedUsers = [];
                this.checkedUserIds = [];
           }); 
        },
        showOfficeTree: function() {
            this.officeTreeIndex = this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: [
                       
                    ]
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * (this.isMultiUser ? 0.8 : 1) + "px")],
                title:"组织部门选择"
			});
        },
        clickNodeAfter: function(node, zTree) {
            // this.$set(this.otherParam, 'orgId', node.id);
            this.officeName = node.name;
            this.$refs.pagination.search(1, false, {
                orgId: node.id
            }, 2);
            //this.$layer.close(this.officeTreeIndex);
        },
        handleSearchResult: function(data) {
            if(data){
                this.page = data.page || {};
                this.userOfficeMap = data.userOfficeMap || {};
                this.orgMap = data.orgMap || {};
            } else {
                this.page = {};
                this.userOfficeMap = {};
                this.orgMap = {};
            }

            var checkAll = true;
            if (this.page.list) {
                this.page.list.forEach(element => {
                    if (this.checkedUserIds.indexOf(element.userId + ":" + element.orgId) == -1) {
                        checkAll = false;
                        return;
                    }
                });
            }
            this.checkAllVal =  (checkAll && this.page.list && this.page.list.length >= 1) ? 1 : 2;

            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
            });
        },
        addOrRemoveUser: function(data){
            var index;
            var users = this.page.list;
            var user = this.getUser(data.val);
            if (data.checked) {
                if (user && this.checkedUserIds.indexOf(data.val) == -1) {
                    var userId_ = data.val.split(":")[0];
                    this.checkedUserIds.forEach((ele, index) => {
                        
                        if (ele.startsWith(userId_ + ":")) {
                            this.remove(this.getUser(ele));
                        }
                    });
                    this.selectedUsers.push(user);
                    this.checkedUserIds.push(data.val);
                    this.selectUserOfficeMap[user.userId] = this.orgMap[user.orgId] || {};
                }
                // if(users && (index = users.indexOf(data.val, 'userId')) != -1 && this.checkedUserIds.indexOf(data.val) == -1){
                //     var user = users[index];
                //     this.selectedUsers.push(user);
                //     this.checkedUserIds.push(user.userId);
                //     this.selectUserOfficeMap[user.userId] = this.userOfficeMap[user.userId] || {};
                // }
            } else {

                if((index = this.selectedUsers.indexOf(user.userId, 'userId')) != -1) {
                    this.selectedUsers.splice(index, 1);
                }
                if((index = this.checkedUserIds.indexOf(data.val)) != -1) {
                    this.checkedUserIds.splice(index, 1);
                }
                // if(this.$refs[('lsc_' + data.val)][0].checked){
                //     this.$refs[('lsc_' + data.val)][0].checkboxClick();
                // }
            }
        },
        getUser: function(userIdOrgId) {
            var arr = userIdOrgId.split(':');
            var userId = arr[0];
            var orgId = arr[1];
            var users = this.page.list;
            var user = null;
            users.forEach(ele => {
                if (ele.userId == userId && ele.orgId == orgId) {
                    user = ele;
                    return;
                }
            });
            return user;
        },
        radioClickAfter: function(data) {
            var user = this.getUser(data.val);
            this.$set(this.selectedUsers, 0, user);
            this.selectUserOfficeMap[user.userId] = this.orgMap[user.orgId] || {};
            this.trueSelect();
        },
        trueSelect: function() {
            
            if(this.isMultiUser){
                var checkedUsers = this.selectedUsers.filter(user => {
                    return this.checkedUserIds.indexOf(user.userId + ":" + user.orgId) != -1;
                });
                this.$parent.getSelectUsers(checkedUsers, this.selectUserOfficeMap, this.layerid);
            } else {
                this.$parent.getSelectUser(this.selectedUsers[0], this.selectUserOfficeMap[this.selectedUsers[0].userId], this.layerid);
            }
        },
        checkAll: function(data) {
            this.page.list.forEach(element => {
                data.val = element.userId + ":" + element.orgId;
                this.addOrRemoveUser(data);
            });
        },
        clickUserBox: () => {

        },
        clickRow: function(index) {
            
            if(this.isMultiUser) {
                this.$refs[('userCheckbox' + index)][0].checkboxClick();
            } else {
                this.$refs['radio' + index][0].radioClick();
            }
        },
        searchBefore: function(searchForm, isClickSearchBtn, type) {
            this.searchType = type;
            if (type != 2) {
                if (this.checkOrgTypes.length <= 0) {
                    delete searchForm.orgId;
                }
            } else {
                delete searchForm.name;
            }
            return searchForm;
        },
        remove: function(user) {
            this.addOrRemoveUser({
                checked: false,
                val: (user.userId + ":" + user.orgId)
            });
        },
        clickCheckboxAfter: function(data) {
            var orgId = null;
            if (data.checked) {
                orgId = data.val;
            } else {
                if (this.checkOrgTypes.length > 0) {
                    orgId = this.otherParam.orgId;
                } 
            }
            this.$refs.officeTree.getTree().filter(orgId);
            this.$refs.officeTree.getTree().triggerNodeClick(orgId);
        }
    }
};
</script>

<style scoped>
.user-main /deep/ .layui-card-body {
    padding: 0;
}
.table > thead > tr > th,td {
  text-align: center;
}
.layui-form-label {
  width: auto;
}
.checked-user-box {
    border-left: 1px solid #e7e7e7;
    white-space: normal;
    overflow-y: auto;
    vertical-align: top;
}
.label {
    background-color: #009688;
    color: #FFF;
    font-size: 15px;
    font-weight: normal;
    padding: 5px 5px;
    text-shadow: none;
    display: inline-block;
    margin-bottom: 4px;
}
.user-main /deep/ .layui-form-item {
    margin-bottom: 0px;
}
table tbody tr td {
    padding-bottom: 6px;
    padding-top: 6px;
}
</style>


