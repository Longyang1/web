<template>
<div class="form-comp-tree">
        <tree
            v-if="zTreeNodes"
            :height="height"
            :nodes="zTreeNodes"
            :parent="parent"
            :checkEnable="checkEnable"></tree>
</div>
</template>

<script>
import {getTreeData} from '@/api/sys/formComponent'
import Tree from '@/components/Tree'

export default {
    components: {
        Tree  
    },
    data () {
        return {
            parent: null,
            zTreeNodes: null
        }
    },
    props: ["params", "nodes", "height","checkEnable"],
    mounted () {
        this.parent = this.$parent;
        getTreeData(this.params).then(result => {
            if(result.data){
                result.data.treeNode.forEach(element => {
                    if(element.checkStatus&&element.checkStatus=='y'){
                        element['checked']=true;
                    }
                
                });
                this.zTreeNodes = result.data.treeNode;
            }
           
        });
    },
    methods: {
       
    }
}
</script>

<style scoped>

</style>


