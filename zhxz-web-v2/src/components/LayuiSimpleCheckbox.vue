<template>
    <layui-checkbox
        :name="name"
        :label="label"
        :disabled="disabled"
        :val="curVal"
        laySkin="primary"
        v-model="modelValue"
        :checkedVals="checkedVals"
        @clickCheckboxAfter="clickCheckboxAfter"
        ref="checkbox"></layui-checkbox>
</template>
<script>
export default {
    data () {
        return {
            curVal: this.val,
            modelValue: null,
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        val: {
            type: [String, Number],
            default: ''
        },
        value: {
            type: [String, Number],
            default: ''
        },
        defaultValue: {
            type: [String, Number],
            default: ''
        },
        checkedVals: {
            type: Array,
            default: function() {
                return null;
            }
        }
    },
    watch: {
        value: function() {
            this.modelValue = this.value;
        }
    },
    mounted () {
        if (this.val == this.value) {
            this.checked = true;
        }
        this.modelValue = this.value;
    },
    methods: {
        clickCheckboxAfter: function(data) {

            if(this.disabled){
                return;
            }

            if (data.checked) {
                this.$emit("input", data.val);
            } else {
                this.$emit("input", this.defaultValue);
            }

            this.$emit('clickCheckboxAfter', data);
            if (this.$parent.updateCheckedList) {
                this.$parent.updateCheckedList(data.val, data.checked);
            }
        },
        checkboxClick: function() {
            this.$refs.checkbox.checkboxClick();
        }
    }
}
</script>
<style scoped>

</style>