<template>
    <div class="layui-inline">
        <label v-if="(label && label != '')" :class="{'layui-form-label': true, 'layui-required': layVerify != ''}">{{ label }}</label>
        <div class="layui-input-block" :style="cssStyle">
            <layui-radio
                v-for="item in items"
                :key="item[valKey]"
                :val="item[valKey]"
                v-model="checkedValue"
                :label="item[labelKey]"
                :name="name"
                :disabled="disabled ? disabled : readonly"
                :useAnim="useAnim"
                @radioClickAfter="radioClickAfter"></layui-radio>
        </div>
        <input type="hidden">
    </div>
</template>

<script>
export default {
    data () {
        return {
            checkedValue: this.value,
        }
    },
    props: {
        items: {
            type: Array,
            default: []
        },
        label: {
            type: String,
            default: 'label'
        },
        valKey: {
            type: String,
            default: 'value'
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        value: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        disabled:{
            type:Boolean,
            default:false
        },
        cssStyle: {
            type: Object,
            default: function() {
                return {
                    'margin-right': '50px'
                }
            }
        },
        layVerify: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        },
        useAnim: {
          type: Boolean,
          default: true,
        },
    },
    watch: {
        value: function() {
            this.checkedValue = this.value;
        },
        checkedValue: function() {
            this.$emit('input', this.checkedValue);
        }
    },
    mounted () {
    },
    methods: {
        radioClickAfter: function(data) {
            if(data.name == this.name){
                this.$emit('input', data.val);
                this.$emit('radioClickAfter', {
                    name: data.name,
                    val: data.val
                });
            }
        }
    }
}
</script>

