<template>
    <div class="layui-form-item layui-form-text">
        <label v-if="(label && label != '')" :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" :title="label">{{ label }}</label>
        <div class="layui-input-block" :style="{top: (label && label != '') ? '-6px' : '0px'}">
            <textarea
                v-focus="focus"
                @input="oninput" 
                :placeholder="placeholder"
                :value="value"
                :disabled="disabled"
                :lay-verify="layVerify"
                class="layui-textarea"
                ref="textarea"></textarea>
        </div>
    </div>
</template>

<script>
import bus from '@/assets/js/event.js'
export default {
    data () {
        return {
           val: this.value, 
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        },
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        layVerify: {
            type: String,
            default: ''
        },
        focus: {
            type: Boolean,
            default: false
        },
        verifyName: {
            type: String,
            default: ''
        }
    },
    watch: {
        value: function() {
            this.val = this.value;
            if (this.layVerify) {
                if (this.val) {
                    this.$refs.textarea.className = 'layui-textarea';
                } else {
                    this.$refs.textarea.className = 'layui-textarea layui-form-danger';
                }
            }
        }
    },
    mounted() {
        if (this.layVerify) {
            bus.$on('startVerify', (verifyName) => {
                console.log(this.$refs.textarea)
                if(verifyName == this.verifyName && this.$refs.textarea && this.$refs.textarea.className){
                    if (this.val) {
                        this.$refs.textarea.className = 'layui-textarea';
                    } else {
                        this.$refs.textarea.className = 'layui-textarea layui-form-danger';
                        bus.$emit('verifyNotPass', verifyName);
                    }
                }
            });
        }
    },
    methods: {
        oninput: function(e){
            var value = event.target.value;
            this.val = value;
            if (this.layVerify) {
                if (value) {
                    this.$refs.textarea.className = 'layui-textarea';
                } else {
                    this.$refs.textarea.className = 'layui-textarea layui-form-danger';
                }
            }
            this.$emit('input', value)
        },
    }
}
</script>

<style scoped>
.layui-textarea.layui-form-danger {
    border: 1px solid #FF5722!important;
}
</style>


