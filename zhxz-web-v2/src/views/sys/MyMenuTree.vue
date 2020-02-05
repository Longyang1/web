<template>
    <div>
        <div style="margin-bottom: 44px;">
            <tree
                v-if="zTreeNodes"
                :height="height"
                :nodes="zTreeNodes"
                :parent="parent"
                :triggerNodeId="triggerNodeId"
                :layerid="layerid"
                :checkEnable="true"
                :customSetting="customSetting"
                ref="tree"></tree>
        </div>
        <div v-if="zTreeNodes"  class="layui-footer">
            <button @click="save" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-save"></i> 保存</button>
            <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
        </div> 
    </div>
</template>

<script>
import { getMyMenuTreeInitData } from '@/api/sys/SysShortcutPrivilege'
import { saveMyShortcutPrivilege } from '@/api/sys/SysShortcutPrivilege'
import Tree from '@/components/Tree'
import BaseModal from '@/views/base/BaseModal'

export default {
    extends: BaseModal,
    components: {
        Tree  
    },
    data () {
        return {
            parent: this.tparent,
            zTreeNodes: null,
            customSetting: {
                check: {
                    enable: true,
                    nocheckInherit: false,
                    chkboxType: {"Y": "s", "N": "s"}
                },
            }
        }
    },
    props: ["params", "nodes", "height", "level", "parentId", "tparent", "triggerNodeId", "layerid"],
    mounted () {
        this.parent = this.tparent || this.$parent;
        var param = this.params || {};
        var level = this.level;
        var parentId = this.parentId;
        Object.assign(param, {
            parentId
        });
        getMyMenuTreeInitData().then(results => {
            var zTreeNodes = results[0].data || [];
            var myShortcutPrivileges = (results[1].data || {}).sysShortcutPrivileges || [];
            if (myShortcutPrivileges.length > 0) {
                zTreeNodes.forEach(node => {
                    if (myShortcutPrivileges.indexOf(node.id, 'privilegeId') != -1) {
                        node.checked = true;
                    }
                });
            }
            this.zTreeNodes = zTreeNodes;
        });
    },
    methods: {
        getTree: function() {
            return this.$refs.tree;
        },
        triggerNodeClick: function (id) {
            var tree = this.getTree();
            tree.triggerNodeClick(id);
        },
        save: function() {
            var checkedNodes = this.getTree().zTree.getCheckedNodes();
            var menuIds = [];
            if (checkedNodes) {
                checkedNodes.forEach(node => {
                    menuIds.push(node.id);
                });
            }
            saveMyShortcutPrivilege(JSON.stringify(menuIds)).then(res => {
                alert(res.msg);
                this.parent.saveAfter();
                this.close();
            });
        },
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
</style>