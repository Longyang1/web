<template>
    <span
        title="点击查看示例"
        @click="showExampleModal"
        style="cursor: pointer">
        <svg 
            class="icon" 
            aria-hidden="true" 
            style="margin-left: 0px;margin-right: 2px;">
            <use xlink:href="#icon-_shiliX"></use>
        </svg>
    </span>
</template>

<script>
import ExampleContent from "@/components/ExampleContent"
export default {
    data () {
        return {
            
        }
    },
    props: {
        text: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: '示例'
        },
    },
    methods: {
        showExampleModal: function() {
            this.$layer.iframe({
                content: {
                    content: ExampleContent, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        text: this.text,
                        title: this.title,
                    }
                },
                area:['730px', 'auto'],
                title: this.title
			});
        }
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