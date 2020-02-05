<template>
    <div class="layui-inline">
        <label :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" v-if="(label && label != '')">{{ label }}</label>
        <div class="layui-input-inline" :style="{width: width + 'px'}">
            <layui-select
                :items="items"
                :label="labelKey"
                :valKey="valKey"
                :layVerify="layVerify"
                :readonly="readonly"
                :up="up"
                :verifyName="verifyName"
                v-model="selectedVal"></layui-select>
        </div>
        <slot></slot>
        <input type="hidden" :value="selectedVal">
    </div>
</template>

<script>
export default {
    data () {
        return {
           selectedVal: this.value, 
        }
    },
    props: {
        items: {
            type: Array,
            default: function() {
                return [];
            }
        },
        label: {
            type: String,
            default: 'label'
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        valKey: {
            type: String,
            default: 'value'
        },
        value: {
            type: [String, Number],
            default: ''
        },
        layVerify: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 190
        },
        readonly: {
            type: Boolean,
            default: false
        },
        up: {
            type: Boolean,
            default: false
        },
        verifyName: {
            type: String,
            default: ''
        }
    },
    watch: {
        selectedVal: function() {
            this.$emit('input', this.selectedVal);
        },
        value: function() {
            this.selectedVal = this.value;
        }
    }
}
</script>

<style scoped>

</style>


