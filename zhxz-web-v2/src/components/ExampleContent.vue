<template>
    <div class="layui-card" style="margin: 20px;box-shadow: none;">
        <div class="layui-card-body">
            <pre><copy :value="text"></copy> {{ text }}</pre>
        </div>
    </div>
</template>

<script>
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
    },
    methods: {
        
    }
}
</script>

<style scoped>
.layui-card-body {
    padding-right: 0;
    padding-left: 0;
}
</style>