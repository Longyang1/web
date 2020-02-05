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
import { getCateforyNodes } from '@/api/cms/cmsCategory'
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
        getCateforyNodes(param).then(result => {
            this.zTreeNodes = result.data;
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
        }
    }
}
</script>

<style scoped>

</style>