<template>
    <div>
        <div class="row">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" style="height:100px">
                <office-tree :level="2" :filterNodeNames="['华夏银行', '总行', '合作厂商']" ref="officeTree"></office-tree>
            </div>
            <div class="layui-col-sm9 layui-col-md9 layui-col-lg9 user-main" :style="{'min-height': '800px', 'overflow-y': 'auto', padding: '10px'}">
                <pagination
                    v-if="loadCategoryAfter"
                    :url="'./personnel/personnelAddressBooks'"
                    :titles="titles"
                    :paramNames="paramNames"
                    :dicts="dicts"
                    :otherParam="otherParam"
                    @handleSearchResult="handleSearchResult"
                    :showResetBtn="true"
                    :autoSearch="true"
                    ref="pagination">
                    <template slot="searchBtnBefore">
                        <input type="text" v-model="otherParam.name" placeholder="请输入姓名">
                        <input type="text" v-model="otherParam.telephoneNumber" placeholder="请输入座机号">
                        <input type="text" v-model="otherParam.mobilePhone" placeholder="请输入手机号">
                    </template>
                    <template slot="opera">
                        <button v-if="canAdd(selectedCid)" @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;新增</button>
                    </template>
                    <template slot="main">
                        <table class="footable table table-stripped">
                            <thead>
                                <tr>
                                    <th width="5%" style="text-align:center;">序号</th>
                                    <th style="text-align:center;">所在分行</th>
                                    <th style="text-align:center;">部室</th>
                                    <th style="text-align:center;">OA账号</th>
                                    <th style="text-align:center;">姓名</th>
                                    <th style="text-align:center;">办公电话</th>
                                    <th style="text-align:center;">手机</th>
                                    <th v-if="showFaxTd" style="text-align:center;">传真</th>
                                </tr>
                            </thead>
                            <tbody id="meetingTbody" class="footable_table">
                                <template v-for="(item, index) in page.list">
                                    <tr 
                                        :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                        style="display: table-row;"
                                        :key="item.id + '_' + index">
                                        <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
                                        <td style="text-align:center;">{{ officeNameMap[item.officeId] ? officeNameMap[item.officeId].orgDescription.split('/')[1] : '' }}</td>
                                        <td style="text-align:center;">{{ officeNameMap[item.officeId] | pv('orgName') }}</td>
                                        <td style="text-align:center;">{{ item.userUid }}</td>
                                        <td style="text-align:center;" v-highlight="{keyword: otherParam.name, value: item.name}"></td>
                                        <td style="text-align:center;"><template v-if="item.areaCode">{{ item.areaCode }}-</template><span v-highlight="{keyword: otherParam.telephoneNumber, value: item.telephoneNumber}"></span></td>
                                        <td style="text-align:center;" v-highlight="{keyword: otherParam.mobilePhone, value: item.mobilePhone}"></td>
                                        <td v-if="showFaxTd" style="text-align:center;">{{ item.fax }}</td>
                                    </tr>
                                </template>
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </template>
                </pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict';
import { del } from '@/api/personnel/personnelAddressBook'
import { getPersonnelBookCategorys } from '@/api/personnel/personnelBookCategory'
import Base from "@/views/base/Base"
import PersonnelAddressBookForm from "@/views/personnel/PersonnelAddressBookForm"
import PersonnelBookCategoryForm from "@/views/personnel/PersonnelBookCategoryForm"
import OfficeTree from '@/components/OfficeTree'
let _ = require('lodash')

export default {
	name: 'FhPersonnelAddressBookList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                categoryId: '-1',
                name: '',
                officeId: '',
                pageSize: 20,
                userType: '2'
            },
            refresh: true,
            page: {

            },
            showFaxTd: false,
            jobManages: [],
            userOfficeMap: {},
            categorys: [],
            selectedCid: '',
            loadCategoryAfter: false,
            officeNameMap: {},
            showOfficeInput: false,
            officeNameMap: {},
        }
    },
    computed: {
        jobManageMap: function() {
           return this.jobManages.array2Obj('jobCode', 'jobName');
        }
        
    },
    watch: {

    },
    mounted () {
        this.initData();
    },
    methods: {
        filterNodes(nodes) {
            return nodes.filter(node => {
                return (node.name.endWith('分行'));
            });
        },
        clickNodeAfter: function(node){
            this.$set(this.otherParam, 'officeId', node.id);
            this.officeNameMap[node.id] = node.name;
            // this.$layer.closeAll();
        },
        officeClick: function() {
            
            var index = this.categorys.indexOf(this.selectedCid, 'id');
            var orgId = null;
            if (index != -1) {
                var category = this.categorys[index];
                orgId = category.officeId;
            }
           
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        orgId 
                    }
                },
                area:['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: "部门/处室选择"
			});
    	},
        canAdd: function(categoryId) {
            var index = this.categorys.indexOf(categoryId, 'id');
            if (index == -1) {
                return false;
            }
            var category = this.categorys[index];
            if (category.dataSource == 1) {
                return false;
            }
            var userId = category.userId;
            if (userId) {
                var userIdArr = userId.split(',');
                return userIdArr.indexOf(this.curUser.userId) != -1;
            }
            return false;
        },
        editCategory: function(category) {
            this.$layer.iframe({
                content: {
                    content: PersonnelBookCategoryForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        id: category.id
                    }
                },
                area:['730px', 'auto'],
                title: "通讯录类别编辑"
			});
        },
        switchCategory: function(category) {
            var cid = category.id;
            if (this.selectedCid == cid) {
                return;
            }
            this.showOfficeInput = category.dataSource == 1;
            this.selectedCid = cid;
            this.$set(this.otherParam, 'categoryId', this.selectedCid);
            this.$set(this.otherParam, 'name', '');
            this.$set(this.otherParam, 'officeId', '');
            if (this.$refs.pagination) {
                this.$refs.pagination.search(1, true);
            }
        },
        addBookCategory: function() {
            var categoryOrder = this.categorys.length + 1;
            this.$layer.iframe({
                content: {
                    content: PersonnelBookCategoryForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        categoryOrder
                    }
                },
                area:['730px', 'auto'],
                title: "通讯录类别添加"
			});
        },
        initData: function() {
            getPersonnelBookCategorys().then(res => {
                var data = res.data;
                if (data) {
                    this.categorys = data.personnelBookCategorys || [];
                    if (this.categorys) {
                        this.switchCategory(this.categorys[0]);
                    }
                }
                this.loadCategoryAfter = true;
            }).catch(error => {
                this.loadCategoryAfter = true;
            });
            getDicts('').then(result => {
            	//
                //var linkageTypes = result.data[0];
                //linkageTypes.unshift({
                //    label: "全部",
                //    selected: 1,
                //    value: ""
                //});
                //this.dicts.push(linkageTypes);
                //
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.personnelAddressBooks || [];
            this.showFaxTd = this.page['list'] && this.page['list'].filter(item => {
                return item.fax;
            }).length > 0;
            this.jobManages = data.jobManages || [];
            this.userOfficeMap = Object.assign({}, data.userOfficeMap || {});
            this.officeNameMap = data.officeNameMap || {};
        },
        create: function() {
         	this.$parent.closeTabByName('PersonnelsAddressBookForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelsAddressBookForm",
                "name": "PersonnelsAddressBookForm",
                "parentId": "4",
                "text": "通讯录创建",
                "children": [

                ]
            }, 3, {
                categoryId: this.selectedCid,
            });
        },
        edit: function(personnelAddressBook) {
         	this.$parent.closeTabByName('PersonnelAddressBookForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "personnelAddressBook",
                "name": "PersonnelAddressBookForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                id: personnelAddressBook.id,
            });
        },
        del: function(personnelAddressBook) {
            confirm('确定删除该记录吗？', () => {
                del(personnelAddressBook.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
.row {
    /* border: 1px solid #e4e7f0; */
    margin: 20px;
    margin-top: 32px;
    margin-right: 0;
}
.row ul li {
    padding-top: 10px;
    font-size: 12px;
    cursor: pointer;
    padding-left: 20px;
    padding-bottom: 10px;
}
.row ul li.active {
    color: #2b64ce;
    /* border-left: 3px solid #2b64ce; */
    background-image: linear-gradient(to right, #2b64ce 3px, #f5f5f5 3px);
}
.row ul li:last-child {
    padding-bottom: 10px;
}
.header {
    height: 48px;
    background: #fafafa;
    border-bottom: 1px solid #e4e7f0;
}
.header h5 {
    margin-top: 0px;
    font-size: 16px;
    line-height: 48px;
    padding-left: 20px;
}
.header h5 i {
    float: right;
    padding-right: 20px;
    cursor: pointer;
}
.content {
    padding: 26px 20px;
    background: #fff;
}
.c-edit {
    float: right;
    padding-right: 20px;
    color: red;
    display: none;
}
.row ul li:hover .c-edit {
    display: inline-block;
}
</style>