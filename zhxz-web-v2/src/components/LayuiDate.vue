<template>
    <div>
        <input
            type="text" 
            :id="name"
            :name="name"
            :value="val"
            :readonly="true" 
            :lay-verify="required" 
            autocomplete="off" 
            class="layui-input" 
            :placeholder="placeholder"
            :style="cssStyle">
    </div>
</template>

<script>
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
        required: {
            type: Boolean,
            default: false
        },
        range: {
            type: Boolean,
            default: false
        },
        format: {
            type: String,
            default: null
        }
    },
    watch: {
        value: function() {
            this.val = this.value;
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.layuiInit();
        });
    },
    methods: {
        layuiInit: function(){
            var _this = this;
            
            var id = ($('#' + _this.name).length > 0 ? "#" : '.vl-notify-content #') + _this.name;

        	layui.use(['element', 'laydate'], function(){
        		var element = element
				,laydate = layui.laydate;
                
                if (_this.format) {
                    laydate.render({
                        elem: id,
                        type: _this.type,
                        format: _this.format,
                        range: _this.range,
                        trigger: 'click',
                        done: function(value){
                            _this.$emit('input', value)
                        }
                    });
                } else {
                    laydate.render({
                        elem: id,
                        type: _this.type,
                        range: _this.range,
                        trigger: 'click',
                        done: function(value){
                            _this.$emit('input', value)
                        }
                    });
                }
        	});

        }
    }
}
</script>
