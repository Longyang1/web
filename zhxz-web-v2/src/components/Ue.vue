<template>
    <div class="ue">
        <div :id="'editor' + index" type="text/plain"></div>
        <!-- <tinymce id="index" v-model="value"></tinymce> -->
    </div>
</template>
<script>
export default {
    name: "ue",
    data() {
        return {
            editor: null,
            defConfig: {
                initialFrameHeight: 300,
                scaleEnabled:true,
                'fontfamily':[
                    { label: '', name: 'songti', val: '宋体,SimSun' },
                    { label: '', name: 'SimSun', val: '仿宋,SimSun' },
                    { label:'',name:'FangSong_GB2312',val:'仿宋_GB2312 ,FangSong_GB2312'},
                    { label:'',name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
                    { label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
                    { label:'',name:'heiti',val:'黑体, SimHei'},
                    { label:'',name:'lishu',val:'隶书, SimLi'},
                    { label:'',name:'andaleMono',val:'andale mono'},
                    { label:'',name:'arial',val:'arial, helvetica,sans-serif'},
                    { label:'',name:'arialBlack',val:'arial black,avant garde'},
                    { label:'',name:'comicSansMs',val:'comic sans ms'},
                    { label:'',name:'impact',val:'impact,chicago'},
                    { label:'',name:'timesNewRoman',val:'times new roman'}
                ],
            },
            setContentFinished: false,
            index: (new Date().getTime() + Math.floor((Math.random() * 100) + 1)),
            ready: false,
        };
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        config: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // index: {
        //     type: [String, Number],
        //     default: (new Date().getTime() + '')
        // }
        readonly: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value(val, oldval) {
            if (!this.setContentFinished || val == this.getUEContent()) {
                return;
            }
            
            console.log("watch ue value");
            this.initUe(false);
        },
        editor() {
            if (!this.ready) {
                this.ready = true;
                this.editor.ready(() => {
                    // console.log("ue1 " + this.value)
                    this.editor.setContent(this.value || ''); // 确保UE加载完成后，放入内容。
                    this.setContentFinished = true;
                    this.editor.addListener("contentchange", () => {
                        // console.log(this.getUEContent())
                        this.$emit('input', this.getUEContent());
                    })
                });
            }
        }
    },
    mounted() {
        if(this.config) {
            Object.assign(this.defConfig, this.config);
        }
        this.defConfig['readonly'] = this.readonly;
        this.initUe(true);
    },
    methods: {
        initUe: function(isInit) {
            if (!isInit && this.setContentFinished) {
                this.editor.setContent(this.value || ''); // 确保UE加载完成后，放入内容。
                return;
            }
            console.log("初始化---")
            this.editor = UE.getEditor("editor" + this.index, this.defConfig); // 初始化UE
        },
        getUEContent() {
            return this.editor.getContent();
        },
        setContent(content) {
            this.editor.ready(() => {
                this.editor.setContent(content);
            });
        },
        setInitContent: function() {
            this.$nextTick(() => {
            
            });
        }
    },
    destroyed() {
        if (this.editor && this.editor.body) {
            this.editor.destroy();
            console.log("ue des " + this.index);
        }
    }
};
</script>
<style scoped>
  .ue {
    color: #676a6c;
  }
</style>
