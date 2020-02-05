<template>
    <div class="office-tree">
        <tree
            v-if="zTreeNodes"
            :height="height"
            :nodes="zTreeNodes"
            :parent="parent"
            :triggerNodeId="triggerNodeId"
            :layerid="layerid"
            ref="tree"></tree>
    </div>
</template>

<script>
import { getDirNodes } from '@/api/file/sysFileDirectory'
import Tree from '@/components/Tree'

export default {
    components: {
        Tree  
    },
    data () {
        return {
            parent: this.tparent,
            zTreeNodes: null
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
        getDirNodes(param).then(result => {
            var zTreeNodes = result.data;
            zTreeNodes.forEach(node => node.open = true);
            this.zTreeNodes = zTreeNodes;
            this.$nextTick(() => {
                this.$emit('initTreeDataAfter');
            });
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
        getFilePath(nodeId){
            let ztree = this.getTree().zTree;
            var treeNode = ztree.getNodeByParam("id", nodeId);
            if (treeNode == null) return "";
            var name = treeNode.name;
            var pNode = treeNode.getParentNode();
            if (pNode != null) {
                name = this.getFilePath(pNode.id) + " / " + name;
            }
            return name;
        },
        clickParentNode(nodeId, parentLevel = 1) {
            let ztree = this.getTree().zTree;
            let cid = nodeId;
            let treeNode = ztree.getNodeByParam("id", cid);
            for (let i = 0; i < parentLevel; i++) {
                treeNode = treeNode.getParentNode();
            }
            console.log(treeNode.name);
            this.triggerNodeClick(treeNode.id);
        }
    }
}
</script>

<style scoped>

</style>