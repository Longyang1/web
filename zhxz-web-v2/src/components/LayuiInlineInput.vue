<template>
    <div :class="{'layui-inline': (!block && label && label != ''), 'layui-block': block}">
        <label v-if="(label && label != '')" :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" :title="label">{{ label }}</label>
        <div :class="{'layui-input-block': (label && label != ''), 'layui-input-inline': !(label && label != '')}">
            <input
                v-if="func" 
                :type="type" 
                @click="inputClick"
                :name="name"
                v-model="val"
                :readonly="readonly" 
                @input="oninput" 
                :lay-verify="layVerify" 
                autocomplete="off" 
                class="layui-input" 
                :placeholder="placeholder"
                :title="type == 'password' ? '' : val"
                :style="block ? {} : cssStyle"
                ref="input">
            <input
                v-else 
                :type="type" 
                v-model="val"
                :name="name"
                :readonly="readonly" 
                @input="oninput" 
                :lay-verify="layVerify" 
                autocomplete="off" 
                class="layui-input"
                :placeholder="placeholder"
                :title="type == 'password' ? '' : val"
                :style="block ? {} : cssStyle"
                ref="input">
                <slot></slot>
        </div>
    </div>
</template>

<script>
import bus from '@/assets/js/event.js'

export default {
    data () {
        return {
            val: this.value || '',
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        func: {
            type: String,
            default: null
        },
        value: {
            type: [String, Number],
            default: ''
        },
        cssStyle: {
            type: Object,
            default: function() {
                return {
                    'width': '190px',
                    'margin-right': '8px'
                }
            }
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        layVerify: {
            type: String,
            default: ''
        },
        block: {
            type: Boolean,
            default: false
        },
        disabledFunc: {
            type: Boolean,
            default: false
        },
        max: {
            type: Number,
            default: -1
        },
        verifyName: {
            type: String,
            default: ''
        }
    },
    watch: {
        value: function() {
            this.val = this.value;
        },
        val: function() {
            if (!this.layVerify) {
                return;
            }
            if (this.val) {
                this.$refs.input.className = 'layui-input';
            } else {
                this.$refs.input.className = 'layui-input layui-form-danger';
            }
        }
    },
    mounted () {
        if (this.layVerify) {
            bus.$on('startVerify', (verifyName) => {
    
                if(this.layVerify && verifyName == this.verifyName &&  this.$refs.input && this.$refs.input.className){
                    if (this.val) {
                        this.$refs.input.className = 'layui-input';
                    } else {
                        this.$refs.input.className = 'layui-input layui-form-danger';
                        bus.$emit('verifyNotPass', verifyName);
                    }
                }
            });
        }
    },
    methods: {
        oninput: function(event) {
            var value = event.target.value;
            if (this.max >= 0 && value && value.trim().length > this.max) {
                this.val = this.value;
                alert("您最多输入" + this.max + "个字符!!!");
                return;
            }
            this.$emit('input', value)
        },
        inputClick: function() {
            if(this.func && !this.disabledFunc){
                this.$emit(this.func);
            }
        }
    }
}
</script>

<style scoped>
.layui-form-danger+.mutil-select-title, .layui-form-danger {
    border: 1px solid #FF5722!important;
}
</style>



