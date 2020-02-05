<template>
    
</template>

<script>
import { destroy } from "@/utils/ComponentUtils"
import baseMixin from '@/mixin/baseMixin'
let _ = require('lodash')
import bus from '@/assets/js/event.js'
import ApprovalModal from '@/components/ApprovalModal'

export default {
    mixins: [baseMixin],
    data () {
        return {
            menuId: this.$route.name,
            checkType: 2,
            checkedKeys: [],
            refresh: true,
            globalReadonly: true,
            approver: '',
            initAfterFlag: false,
            submitStatus: 1,
            taskComment: ''
        }
    },
    computed: {
       	curRemoveMenuName: function() {
            return this.$store.state.home.curRemoveMenuName;
        },
        refreshTabId: function() {
            this.refreshTable(this.$store.state.home.refreshTabId);
            return this.$store.state.home.refreshTabId;
        },
        curUser() {
            return this.$store.state.user.user;
        }
	},
	watch: {
        curRemoveMenuName: function() {
            //console.log(1 + this.$route.name);
            //destroy(this);
        },
        refreshTabId: function() {
            console.log(this.$route.name + " - " + this.refreshTabId)
            this.refreshTable();
        },
        'page.pageNo': function() {
            this.checkedKeys = [];
        },
        checkedKeys: function() {
            
            if (!this.page.list || this.checkedKeys.length != this.page.list.length) {
                this.checkType = 2;
            } else {
                this.checkType =  (this.page.list && this.page.list.length >= 1) ? 1 : 2;
            }
        }
    },
    mounted () {
        
    },
    methods: {
        autoSearch: _.debounce(function() {
            this.$refs.pagination.search(1, true);
        }, 500),
        refreshTable: function (refreshTabId) {
            if (this.$route.name != refreshTabId) {
                return;
            }
            if (this.$refs.pagination == null) {
                return;
            }
           
            this.$nextTick(() => {
                if (this.$refs.pagination.$parent.$vnode.tag.endWith("-" + refreshTabId)) {
                    this.$store.commit('home/SET_CUR_REFRESH_TABLE_TAB_ID', null);
                    this.$refs.pagination.refresh();
                }
            });
            
        },
        checkAll: function(data) {
            this.checkedKeys = [];
            if (data.checked && this.page.list) {
                this.page.list.forEach(item => {
                    this.checkedKeys.push(item.id);
                });
            }
        },
        check: function(data) {
            if (data.checked) {
                this.checkedKeys.push(data.val);
            } else {
                this.checkedKeys.remove(data.val);
            }
        },
        download: function (data, fileName) {
            if (!data || !data.data) {
                msg("文件下载失败（文件或已被删除）");
                return
            }
            let url = window.URL.createObjectURL(new Blob([data.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url              
            link.setAttribute('download', fileName || decodeURIComponent(data.fileName))
            document.body.appendChild(link)
            link.click()
        },
        refreshed: function() {
            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
            });
        },
        close: function () {
            var formViewName = this.$route.name;
            var _listViewName = formViewName;
            if (formViewName.endWith('Form')) {
                _listViewName = _listViewName.substring(0, formViewName.length - 4) + "List";
            } else if (formViewName.endWith('Add')) {
                _listViewName = _listViewName.substring(0, formViewName.length - 3) + "List";
            }
            if (_listViewName == "TransactionSubjectList" || _listViewName == "ProjectSubjectList") {
                _listViewName = "MeetingSubjectList";
            }
            this.closeView(this.$parent, formViewName, _listViewName);
        },
        closeView: function(parent, formViewName, _listViewName, viewName) {
            if (!parent) {
                return;
            }

            if (parent.backView) {
                parent.backView(formViewName, viewName || _listViewName);
            } else {
                this.closeView(parent.$parent, formViewName, _listViewName, parent.listView); 
            }
        },
        toView: function(viewName, params, parent) {
            
            if (arguments.length == 2) {
                parent = this.$parent;
            }
            if (!parent) {
                return;
            }
            if (parent.clickMenu) {
                parent.clickMenu({
                    "name": viewName,
                }, 3, params);
                return;
            }
            this.toView(viewName, params, parent.$parent);
        },
        approvalSubmit(status, cenableFlow) {
            // 默认正常（审批通过）状态
            this.submitStatus = status || 4;
            if (cenableFlow != false && this.enableFlow) {
                this.$layer.iframe({
                    content: {
                        content: ApprovalModal, //传递的组件对象
                        parent: this,//当前的vue对象
                        data: {
                            submitFlow: true,
                            taskName: this.$route.params.taskName || this.taskName,
                        }
                    },
                    area: ['500px', '300px'],
                    title: "选择审批人"
                });
            } else {
                this.save();
            }
        },
        trueSelectApproverAfter(approver, layerid) {
            this.approver = approver;
			this.save(layerid);
		},
    }
}
</script>

<style scoped>

</style>

