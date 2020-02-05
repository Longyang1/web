<template>
    <div :class="{'layui-inline': (label && label != '')}">
        <label v-if="(label && label != '')" :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" :title="label">{{ label }}</label>
        <div :class="{'layui-input-block': (label && label != ''), 'layui-input-inline': !(label && label != '')}" style="width: 100%">
            <input
                type="text" 
                :id="name"
                :name="name"
                :value="val"
                :readonly="true" 
                :lay-verify="layVerify" 
                autocomplete="off" 
                :class="{'layui-input': true, 'hidden': (!(!readonly || init))}" 
                :placeholder="placeholder"
                :style="cssStyle"
                ref="input">
            <input
                v-if="readonly"
                type="text" 
                :name="name"
                :value="val"
                :readonly="true" 
                :lay-verify="layVerify" 
                autocomplete="off" 
                :class="{'layui-input': true, 'hidden': (!readonly)}" 
                :placeholder="placeholder"
                :style="cssStyle"
                ref="input">
        </div>
        <slot></slot>
    </div>
</template>

<script>
import bus from '@/assets/js/event.js'
export default {
    data () {
        return {
            val: this.value || '',
            init: true
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'date'
        },
        value: {
            type: [String],
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
        range: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        format: {
            type: String,
            default: ''
        },
        verifyName: {
            type: String,
            default: ''
        }
    },
    watch: {
        value: function() {
            this.val = this.value;
            if(this.layVerify &&  this.$refs.input && this.$refs.input.className){
                if (this.val) {
                    this.$refs.input.className = 'layui-input';
                } else {
                    this.$refs.input.className = 'layui-input layui-form-danger';
                }
            }
        },
    },
    mounted () {
        this.$nextTick(() => {
            this.layuiInit();
        });

        if (this.layVerify) {
            bus.$on('startVerify', (verifyName) => {
    
                if(verifyName == this.verifyName &&  this.$refs.input && this.$refs.input.className){
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
        layuiInit: function(){
            var _this = this;
            var id = ($('#' + _this.name).length > 0 ? "#" : '.vl-notify-content #') + _this.name;
        	layui.use(['laydate'], function(){
                var laydate = layui.laydate;

				laydate.render({
                    elem: id,
                    type: _this.type,
                    // format: _this.format,
                    range: _this.range,
                    trigger: 'click',
					done: function(value){
                        if (_this.layVerify && _this.$refs.input && _this.$refs.input.className) {
                            if (value) {
                                _this.$refs.input.className = 'layui-input';
                            } else {
                                _this.$refs.input.className = 'layui-input layui-form-danger';
                            }
                        }
                        _this.$emit('input', value);
					}
                });
                _this.init = false;
            });

        }
    }
}
</script>

<style scoped>
.layui-input.layui-form-danger {
    border: 1px solid #FF5722!important;
}
</style>
