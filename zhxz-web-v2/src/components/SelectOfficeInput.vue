<template>
    <div :class="{'simple-box': type == 'simple'}">
        <layui-inline-input
            v-if="type != 'simple'"
            :label="label" 
            :placeholder="placeholder"
            func="officeClick"
            @officeClick="officeClick"
            v-model="name"
            :readonly="true"></layui-inline-input>
        <input v-if="type == 'simple'" @click="officeClick" type="text" readonly=true v-model="name" :placeholder="placeholder">
    </div>
</template>

<script>
import OfficeTree from '@/components/OfficeTree'
export default {
    data() {
        return {
            name: this.officeName || '',
        }
    },
    props: {
        title: {
            type: String,
            default: '部门/处室选择'
        },
        type: {
            type: String,
            default: 'layui'
        },
        label: {
            type: String,
            default: '部门选择'
        },
        func: {
            type: String,
            default: 'clickNodeAfter'
        },
        value: {
            type: [String, Number],
            default: ''
        },
        officeName: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '点击选择'
        },
        params: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    watch: {
        officeName() {
            this.name = this.officeName;
        },
        value() {
            if (!this.value) {
                this.name = "";
            }
        }
    },
    mounted() {

    },
    methods: {
        clickNodeAfter: function(node, zTree, layerid){
            this.name = node.name;
            this.$emit('input', node.id);
            this.$emit(this.func, node);
            this.$layer.close(layerid);
        },
    	officeClick: function(){
            this.$layer.iframe({
                content: {
                    content: OfficeTree, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: this.params
                },
                area:['314px', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: this.title
			});
    	},
    }
}
</script>

<style scoped>
div {
    display: inline-block;
}
div.simple-box {
    display: inline;
}
input {
    color: #595e56;
    font-size: 12px;
    border: 1px solid #ced2d7;
    /* margin-right: 0.1rem; */
    margin-right: 10px;
    padding: 0 10px;
    height: 26px;
    line-height: 28px;
}
</style>