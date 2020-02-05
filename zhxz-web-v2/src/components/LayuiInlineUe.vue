<template>
    <div class="layui-form-item layui-form-text" :style="cssStyle">
        <label :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" style="margin-bottom: 0;">{{ label }}</label>
        <div class="layui-input-block">
            <ue :config="ueConfig" v-model="content" :readonly="readonly" ref="ue"></ue>
        </div>
        <input type="hidden" name="">
    </div>
</template>

<script>
export default {
    data () {
        return {
            content: this.value || '',
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        ueConfig: {
            type: Object,
            default: function() {
                return {
                    initialFrameHeight: 200,
                }
            }
        },
        value: {
            type: String,
            default: ''
        },
        cssStyle: {
            type: Object,
            default: function() {
                return {
                    width: '100%'
                };
            } 
        },
        layVerify: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value() {
            this.content = this.value || '';
        },
        content() {
            this.$emit('input', this.content);
        }
    },
    methods: {
        getContent: function() {
            return this.$refs.ue.getUEContent();
        },
        getUe: function () {
            return this.$refs.ue;
        }
    }
}
</script>

