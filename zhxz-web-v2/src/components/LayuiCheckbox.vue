<template>
    <div 
        v-if="refresh" 
        @click.stop="checkboxClick" 
        :class="{'layui-unselect layui-form-checkbox': true, 'layui-form-checked': checked, 'layui-disabled': disabled}"
        :style="{'margin-bottom': (label != '' ? '6px' : '0px')}"
        :lay-skin="laySkin">
        <span>{{ label }}</span>
        <i :class="!icon ? 'layui-icon layui-icon-ok' : ('layui-icon ' + icon)"></i>
    </div>
</template>
<script>
export default {
    data () {
        return {
            curVal: this.val,
            checked: false,
            refresh: true
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
        icon: {
            type: String,
            default: ''
        },
        sort: {
            type: Boolean,
            default: true
        },
        valKey: {
            type: String,
            default: null
        },
        laySkin: {
            type: String,
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
        val: function() {
            this.curVal = this.val;
            this.updateChecked();
        },
        value: function() {
            if (this.value && this.value != "") {
                this.updateChecked();
            }
        },
        checkedVals: function() {
            if (this.checkedVals) {
                this.checked = this.checkedVals.indexOf(this.curVal) != -1;
            }
        }
    },
    mounted () {
        this.updateChecked();

        if (this.checkedVals) {
            this.checked = this.checkedVals.indexOf(this.curVal) != -1;
        }
    },
    methods: {
        updateChecked: function() {
            this.checked = this.value == this.curVal;
            // if (this.$parent.checkedList) {
            //     this.checked = this.$parent.checkedList.indexOf(this.curVal) != -1;
            // }
            if (this.checkedVals) {
                this.checked = this.checkedVals.indexOf(this.curVal) != -1;
            }
            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
            });
        },
        checkboxClick: function(){
            if(this.disabled){
                return;
            }

            this.checked = !this.checked;
            this.$emit('input', this.curVal);
            this.$emit('clickCheckboxAfter', {
                checked: this.checked,
                val: this.curVal,
                name: this.name,
            });
            if (this.$parent.updateCheckedList) {
                this.$parent.updateCheckedList(this.curVal, this.checked);
            }
        }
    }
}
</script>
<style scoped>
    .layui-form-checkbox[lay-skin=''] i {
        height: 30px;
    }
    .layui-form-checkbox[lay-skin=primary] i {
        width: 18px;
        height: 18px;
        display: inline-block;
    }
</style>