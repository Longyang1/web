<template>
    <div>
        <div
            v-for="(val) in vals" 
            :class="{'layui-unselect layui-form-radio': true, 'layui-form-radioed': val == curVal, 'layui-radio-disbaled layui-disabled': disabled}" 
            @click="radioClick(val)"
            :key="'radio-' + name + '-' + val">
            <i :class="{'layui-anim layui-icon': true, 'layui-anim-scaleSpring': (useAnim == true && val == curVal)}"></i>
            <div>{{ textMap[val] }}</div>
            <slot :val="val"></slot>
        </div>
        <input type="hidden" :value='curVal'>
    </div>
</template>
<script>
export default {
    data () {
        return {
            curVal: this.val,
        }
    },
    props: ['textMap', 'vals', 'name', 'disabled', 'val', 'useAnim'],
    methods: {
        radioClick: function(val){
            if(this.disabled){
                return;
            }
            this.curVal = val;
            this.$emit('input', val);
            this.$emit('checkedAfter', {
                name: this.name,
                val: val
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
</style>


