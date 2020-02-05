<template>
    <div id="modal" class="layui-row">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 user-main" :style="{height: height,'overflow-y': 'auto',padding: '10px'}">
            <pagination-simple 
                :url="'./cms/cmsSites'"
                :otherParam="otherParam"
                @handleSearchResult='handleSearchResult'
                ref="pagination">
                <template slot="searchBtnBefore">
                    <layui-inline>
                        <input  v-model='otherParam.projectName' class="layui-input" style="width: 300px" type="text" placeholder="输入项目名称">
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
                                                v-if="isMultiSelect"
                                                @clickCheckboxAfter="checkAll"
                                                :defautValue="2"
                                                v-model="checkAllVal"
                                                :val="1"/>
                                            <span v-if="!isMultiSelect">操作</span>
                                        </th>
                                        <th width="5%" style="text-align:center;">序号</th>
                                        <th style="text-align:center; width:30%">站点名称</th>
                                        <th v-if="isMultiSelect" style="border-left: 1px solid #e7e7e7;">已选择（{{ selectedItems.length }}）
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
                                            :key="item.id">
                                            <td>
                                                <layui-simple-checkbox 
                                                    v-if="isMultiSelect && refresh"
                                                    @clickCheckboxAfter="addOrRemove"
                                                    :checkedVals="checkedIds"
                                                    :val="item.id"
                                                    :ref="'itemCheckbox' + index">
                                                </layui-simple-checkbox>
                                                <layui-radio
                                                    v-if="!isMultiSelect"
                                                    :useAnim="false"
                                                    v-model="selectedId"
                                                    :val="item.id + ''"
                                                    @radioClickAfter="radioClickAfter"
                                                    :ref="'radio' + index"></layui-radio>
                                            </td>
                                            <td>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</td>
                                            <td>{{ item.name }}</td>
                                            <td 
                                                v-if="isMultiSelect && index == 0" 
                                                :rowspan="page.pageSize" 
                                                @click.stop="clickBox"
                                                class="checked-item-box">
                                                <div :style="{height: (itemBoxHeight + 'px')}">
                                                    <span class="label"  v-for="item in selectedItems" :key="'l-' + item.id">
                                                        <font>{{ item.name }}</font>
                                                        <i @click="remove(item)" class="xm-iconfont icon-close"></i>
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
            <div v-if="isMultiSelect" class="layui-form-item layui-layout-admin">
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
import Page from '@/components/Page'
import BaseModal from '@/views/base/BaseModal'
let _ = require('lodash')
import { getDicts } from "@/api/dict";

export default {
    extends: BaseModal,
    components: {
        Page
    },
    data() {
        return {
            page: {},
            otherParam: {

            },
            selectedItems: [],
            checkedIds: [],
            selectedId: '',
            height: ($('#' + this.layerid).height() - (this.isMultiSelect ? 30 : 0)) + 'px',
            itemBoxHeight: 0,
            refresh: true,
            checkAllVal: 2
        };
    },
    props: {
        isMultiSelect: {
            type: Boolean,
            default: true
        },
        layerid: {
            type: String,
            default: ''
        },
        projectStatus: {
            type: String,
            default: ''
        }
    },
    computed: {
        user: function() {
            return this.$store.state.user.user;
        },
    }, 
    watch: {
        checkedIds: function() {
            var checkAll = true;
            this.page.list.forEach(element => {
                if (this.checkedIds.indexOf(element.id) == -1) {
                    checkAll = false;
                    return;
                }
            });
            this.checkAllVal = (checkAll && this.page.list.length >= 1) ? 1 : 2;
        },
        'page.pageNo': function() {
            this.$nextTick(() => {
                this.itemBoxHeight = 32 * this.page.list.length;
            });
        },
    },
    mounted() {
        $("#" + this.layerid + " .vl-notify-content").css('overflow-y', 'hidden');
    },
    methods: {
        autoSearch: _.debounce(function() {
            this.$refs.pagination.search(1, true);
        }, 500),
        clear: function() {
           confirm("确定清空已选择的吗？", () => {
                this.selectedItems = [];
                this.checkedIds = [];
           }); 
        },
        handleSearchResult: function(data) {
            if (data) {
                var page = data.page || {};
                page.list = data.cmsSites || [];
                this.page = page;
            } else {
                this.page = {};
            }

            var checkAll = true;
            if (this.page.list) {
                this.page.list.forEach(element => {
                    if (this.checkedIds.indexOf(element.id) == -1) {
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
        addOrRemove: function(data){
            var index;
            if (data.checked) {
                var items = this.page.list;
                if(items && (index = items.indexOf(data.val, 'id')) != -1 && this.checkedIds.indexOf(data.val) == -1){
                    var item = items[index];
                    this.selectedItems.push(item);
                    this.checkedIds.push(item.id);
                }
            } else {
                if((index = this.selectedItems.indexOf(data.val, 'id')) != -1) {
                    this.selectedItems.splice(index, 1);
                }
                if((index = this.checkedIds.indexOf(data.val)) != -1) {
                    this.checkedIds.splice(index, 1);
                }
            }
        },
        radioClickAfter: function(data) {

            var items = this.page.list;
            var item = items[items.indexOf(data.val, 'id')];
            this.$set(this.selectedItems, 0, item);
            this.trueSelect();
        },
        trueSelect: function() {
            if(this.isMultiSelect){
                var checkedItems = this.selectedItems.filter(item => {
                    return this.checkedIds.indexOf(item.id) != -1;
                });
                this.$parent.getSelectItems(checkedItems, this.layerid);
            } else {
                this.$parent.getSelectItem(this.selectedItems[0], this.layerid);
            }
        },
        checkAll: function(data) {
            this.page.list.forEach(element => {
                data.val = element.id;
                this.addOrRemove(data);
            });
        },
        clickRow: function(index) {
            
            if(this.isMultiSelect) {
                this.$refs[('itemCheckbox' + index)][0].checkboxClick();
            } else {
                this.$refs['radio' + index][0].radioClick();
            }
        },
        remove: function(item) {
            this.addOrRemove({
                checked: false,
                val: item.id
            });
        },
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
.checked-item-box {
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
    margin-right: 2px;
}
.user-main /deep/ .layui-form-item {
    margin-bottom: 0px;
}
table tbody tr td {
    padding-bottom: 6px;
    padding-top: 6px;
}
.user-main /deep/ .layui-unselect.layui-form-radio {
    margin-right: 0px;
    padding-right: 0px;
}
</style>