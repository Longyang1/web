<template>
    <div style="text-align: center; margin-top: 40px">
        <canvas id="canvas" ref="canvas" style="border: 1px solid red;" width="360" height="180"></canvas>
        <slot :signaturePad="signaturePad"></slot>
    </div>
</template>

<script>
import SignaturePad from 'signature_pad';
export default {
    data() {
        return {
            signaturePad: null,
        }
    },
    mounted() {
        this.$nextTick();
        this.init();
    },
    methods: {
        init() {
            let canvas = this.$refs.canvas || document.getElementById("canvas");
            this.signaturePad = new SignaturePad(canvas, { backgroundColor: '#fff', penColor: 'rgb(0, 0, 0)' });
        }
    }
}
</script>