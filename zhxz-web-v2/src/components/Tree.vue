<template>
    <div class="office-tree">
        <ul :id="'tree' + index" class="ztree" :style="{height: height}"></ul>
    </div>
</template>

<script>
import request from '@/utils/request';

export default {
    data () {
        return {
            setting: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey : "id",
                        pIdKey : "pid",
                        rootPId : 0
                    },
                },
                check: {
                    enable: (this.checkEnable == true)
                },
                callback : {
                    onClick: this.nodeClick,
                    onCheck: this.nodeCheck
                        
                }
            },
            zTreeNodes: [],
            index: new Date().getTime(),
            zTree: null
        }
    },
    props: ["url", "params", "nodes", 'parent', 'height', 'checkEnable', 'triggerNodeId', 'layerid', 'customSetting'],
    mounted () {
        Object.assign(this.setting, this.customSetting);
        this.parent = this.parent || this.$parent;
        if(this.nodes instanceof Array){
            this.$nextTick(() => {
                this.zTree = $.fn.zTree.init($("#tree" + this.index), this.setting, this.nodes);

                if (this.triggerNodeId) {
                    var nodeName = null;
                    this.nodes.forEach(element => {
                        if (element.id == this.triggerNodeId) {
                            nodeName = element.name;
                            return;
                        }
                    });
                    if (nodeName) {
                        $("#tree" + this.index + " a[title='" + nodeName + "']").trigger('click');
                    }
                }

            });
        } else {
            request.get(this.url, {params: this.params}).then(result => {
                this.zTreeNodes = result.data;
                this.$nextTick(() => {
                    this.zTree = $.fn.zTree.init($("#tree" + this.index), this.setting, this.zTreeNodes);
                });
            });
        }
    },
    methods: {
        nodeClick: function(event, treeId, treeNode){
            if (this.parent.clickNodeAfter) {
                this.parent.clickNodeAfter(treeNode, $.fn.zTree.getZTreeObj(treeId), this.layerid);
            }
        },
        nodeCheck: function(event, treeId, treeNode) {
            if (this.parent.checkNodeAfter) {
                this.parent.checkNodeAfter(treeNode, $.fn.zTree.getZTreeObj(treeId));
            }
        },
        selectNode: function(id) {
            var treeNode = this.zTree.getNodeByParam("id", id);
            if (treeNode) {
                this.zTree.selectNode(treeNode);
            }
            return treeNode;
        },
        triggerNodeClick: function(id) {
            var treeNode = this.selectNode(id);
            if (treeNode) {
                this.setting.callback.onClick(null, "#tree" + this.index, treeNode);
            } else {
                console.log("树节点不存在");
            }
        },
        filter: function(nodeId, level) {
            var zTree = this.zTree;
            var nodes = zTree.getNodesByParam("isHidden", true);
            zTree.showNodes(nodes);

            if (nodeId) {
                var root = zTree.getNodeByParam("level", "0");
                
                var hiddenNodes = new Array();
                
                this.filterNodes(root, nodeId, hiddenNodes);
                zTree.hideNodes(hiddenNodes);
                zTree.expandAll(true);
            }
        },
        filterNodes: function (node, nodeId, filterResult){
            if (node != null) {
                //自身是否符合搜索条件
                var selfMatch = node.id == nodeId;

                //子节点是否有满足的条件的节点
                var childMatch = false;
                
                var children = node.children;
                if (children != undefined) {
                    for(var index in children){
                        childMatch = this.filterNodes(children[index], nodeId, filterResult) || childMatch;
                    }
                }
                
                //自身不满足搜索条件 且其子节点不包含有满足条件的节点
                if(!selfMatch && !childMatch){
                    filterResult.push(node);
                }
                
                return selfMatch || childMatch;
            }else{
                return true;
            }
        }
    }
}
</script>

<style scoped>
    ul.ztree {
        overflow-y: auto;
        overflow-x: auto;
    }
</style>