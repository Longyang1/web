<template>
    <layui-inline-linkage-select
        :items="items"
        :label="label"
        :width="width"
        :layVerify="layVerify"
        v-model="val"></layui-inline-linkage-select>
</template>

<script>
import { getDicts } from '@/api/dict'
export default {
    data () {
        return {
            items: [],
            val: this.value,
        }
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Number],
            default: null
        },
        label: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 300
        },
        layVerify: {
            type: String,
            default: ''
        },
    },
    watch: {
        val() {
            this.$emit('input', this.val);
        },
        value() {
            this.val = this.value;
        }
    },
    mounted () {
        this.val = this.value;
        getDicts(this.type).then(res => {
            this.items = res.data[0] || [];
        });
    },
    methods: {
        
    }
}
</script>

