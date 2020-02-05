<template>
    <signature ref="signature">
        <template>
            <div class="layui-footer">
                <button @click="clear()" class="layui-btn layui-btn-lg layui-btn-blue"><i class="fa fa-repeat"></i> 重签</button>
                <button @click="save()" class="layui-btn layui-btn-lg layui-btn-blue" style="margin-left: 20px;"><i class="fa fa-save"></i> 提交</button>
                <button @click="close()" class="layui-btn layui-btn-lg layui-btn-red" style="margin-left: 20px;"><i class="fa fa-times"></i> 关闭</button>
            </div>
        </template>
    </signature>
</template>

<script>
import BaseModal from '../../base/BaseModal'
export default {
    extends: BaseModal,
    data() {
        return {

        }
    },
    props: {
        layerid: {
            type: String,
            default: ''
        }
    },
    mounted() {

    },
    methods: {
        clear() {
            this.$refs.signature.signaturePad.clear()
        },
        save() {
            let signaturePad = this.$refs.signature.signaturePad;
            if (signaturePad.isEmpty()) {
                msg("您还未签名，请先签名后再提交。");
                return;
            }
            let dataURL = signaturePad.toDataURL(); // save image as PNG
            console.log(dataURL);
            this.$parent.voteResultSubmit(dataURL);
        }
    }
}
</script>

<style lang="less" scoped>
.layui-footer {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    background-color: #eee;
}
</style>