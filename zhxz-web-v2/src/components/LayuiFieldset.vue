<template>
    <div>
        <div style="font-size: 14px;min-height: 20px;">
            <div v-if="!showBoder" style="display: inline-block;">
                <i :class="defClass"></i> <span @click="openOrClose" class="fieldset-label">{{ label }}</span> <slot></slot>
            </div>
            <div @click="openOrClose" style="float: right;cursor: pointer;">
                <i :class="{'fa fa-angle-double-down': open, 'fa fa-angle-double-up': !open, 'text-warning': true,}"></i> {{ open ? '收起' : '展开' }}
            </div>
            <div style="float: right;cursor: pointer;">
                <slot name="top-right"></slot>
            </div>
        </div>
        <fieldset :class="{'layui-elem-field': true, 'layui-field-title': (!showBoder || (showBoder && !open))}">
            <legend v-if="showBoder"><i :class="defClass"></i> {{ label }} <slot></slot> </legend>
            <div :class="{'hidden': !open}" :style="{'margin-top': !showBoder ? '20px': '0'}">
                <slot name="main"></slot>
            </div>
        </fieldset>
    </div>
</template>

<script>
export default {
    data () {
        return {
            defClass: this.iconClass || 'fa fa-file-text-o text-warning',
            open: !this.close
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        iconClass: {
            type: String,
            default: null
        },
        showBoder: {
            type: Boolean,
            default: false
        },
        close: {
            type: Boolean,
            default: false
        },
        resetOpen: {
            type: Number,
            default: 0
        }
    },
    watch: {
        resetOpen: function() {
            this.open = true;
        },
        close: function() {
            this.open = !this.close;
        }
    },
    methods: {
        openOrClose: function () {
            this.open = !this.open;
        },
    }
}
</script>

<style scoped>
    .layui-field-title {
        margin: 10px 0 20px;
        border-width: 2px 0 0;
    }
    span.fieldset-label {
        cursor: pointer;
    }
</style>


