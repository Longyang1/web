<template>
    <div class="b-box">
        <file-download-button 
            v-for="(item, index) in data" 
            :text="item.text" 
            :name="item.name" 
            :key="index"></file-download-button>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        text: {
            type: String,
            default: '文件下载'
        },
        data: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
}
</script>

<style scoped>
    .b-box {
        text-align: center;
        height: 100%;
        padding: 30px 30px;
        padding-bottom: 0px;
    }
    .b-box /deep/ .layui-btn {
        height: 45px;
        line-height: 45px;
        padding: 0 30px;
        margin-bottom: 30px;
    }
</style>