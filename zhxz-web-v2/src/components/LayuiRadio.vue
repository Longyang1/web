<template>
    <div 
        :class="{'layui-unselect layui-form-radio': true, 'layui-form-radioed': checked, 'layui-disabled': disabled}"
         @click.stop="radioClick()">
        <i :class="{'layui-anim layui-icon': true, 'layui-anim-scaleSpring': (checked && useAnim)}"></i>
        <div>{{ label }}</div>
        <input type="hidden" :value='curVal'>
    </div>
</template>
<script>
import bus from '@/assets/js/event.js'
export default {
    data () {
        return {
            curVal: this.val,
            checked: this.value == this.val,
        }
    },
    props: {//['label', 'name', 'disabled', 'val', 'check', 'useAnim']
        label: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        val: {
            type: String,
            default: '',
        },
        value: {
            type: String,
            default: ''
        },
        check: {
            type: Boolean,
            default: false,
        },
        useAnim: {
            type: Boolean,
            default: true,
        },
    },
    watch: {
        val: function(){
            this.checked = this.value == this.val;
            if(this.checked){
                this.$emit('input', this.val);
            }
        },
        value: function() {
            this.checked = this.value == this.val;
        }
    },
    mounted () {
        bus.$on('radioClickAfter', (data) => {
            if(data.name == this.name){
                console.log(data.val == this.curVal);
                this.checked = data.val == this.curVal;
            }
        });
    },
    methods: {
        radioClick: function(){
            var val = this.val;
            if(this.disabled){
                return;
            }
            if(this.checked){
                return;
            }
            this.checked = true;
            this.curVal = val;
            this.$emit('input', val);
            // bus.$emit('radioClickAfter', {
            //     name: this.name,
            //     val: this.curVal
            // });
            this.$emit('radioClickAfter', {
                name: this.name,
                val: this.curVal
            });
        }
    }
}
</script>
<style scoped>
    .layui-form-radioed.layui-radio-disbaled>i {
        color: #5FB878!important;
    }
    .layui-form-radioed.layui-disabled,  .layui-form-radioed.layui-disabled:hover {
        color: #666!important;
    }
    .layui-form-radio.layui-disabled {
        cursor: default;
    }
</style>


