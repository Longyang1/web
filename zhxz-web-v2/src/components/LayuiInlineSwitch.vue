<template>
    <div class="layui-inline">
        <label v-if="(label && label != '')" :class="{'layui-form-label': true}">{{ label }}</label>
        <div class="layui-input-inline">
            <input type="checkbox" name="close" lay-skin="switch" lay-text="ON|OFF">
            <div @click="switchStatus" :class="{'layui-unselect layui-form-switch': true, 'layui-form-onswitch': open == 'y'}" lay-skin="_switch" :style="{cursor: readonly ? 'text' : 'pointer'}">
                <em>{{ open == 'y' ? 'ON' : 'OFF'}}</em><i></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            open: 'n',
        }
    },
    props: {
        label: {
            type: String,
            default: 'label'
        },
        value: {
            type: String,
            default: 'n'
        },
        readonly: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        value() {
            this.open = this.value;
        }
    },
    mounted () {
        this.open = this.value;
    },
    methods: {
        switchStatus: function () {
            if (this.readonly) {
                return;
            }
            this.open = this.open == 'y' ? 'n' : 'y';
            this.$emit('input', this.open);
        }
    }
}
</script>

<style scoped>
    .layui-form-switch {
        height: 24px;
    }
</style>


