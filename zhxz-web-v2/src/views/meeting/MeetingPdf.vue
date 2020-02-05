<template>
    <!-- <vueshowpdf @closepdf="closepdf" v-model="isshowpdf" :pdfurl="pdfurls" @pdferr="pdferr" :maxscale='4' :minscale='0.6' :scale='1.1' ></vueshowpdf> -->
    <div>
        <iframe src="../../../static/js/pdfjs/web/viewer.html?file=/static/test.pdf" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>

<script>

//import vueshowpdf from 'vueshowpdf'
 
export default {
    data(){
        return{
            pdfurls:'http://192.168.205.36:8082/static/test.pdf',
            isshowpdf:false
        }
       
    },
    mounted () {
        this.isshowpdf = true;
    },
    methods:{
        closepdf(){
            this.isshowpdf = false
        },
        pdferr(errurl) {
            console.log(errurl);
        }
    },
 
 }

</script>