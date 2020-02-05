<template>
    <span
        v-if="value"
        title="点击复制"
        style="cursor: pointer"
        v-clipboard:copy="value" 
        v-clipboard:success="onCopy" 
        v-clipboard:error="onError">
        <svg 
            class="icon" 
            aria-hidden="true" 
            style="margin-left: 0px;margin-right: 2px;">
            <use xlink:href="#icon-copy"></use>
        </svg>
    </span>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        },
    },
    methods: {
        onCopy: () => {
            alert("复制成功");
        },
        onError: () => {
            msg("复制失败");
        },
    }
}
</script>

<style scoped>
svg.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>


