<template>
    <div class="tab-background float-e-margins sys-notice"  style="position:relative;top:20px">
        <div  style="width:80%;text-align:center;font-size:14px;position:relative;left:10%">
            <div> <h2 style="word-wrap:break-word">{{sysNoticeInfo.infoTitle}}</h2></div>
            <div style="margin:10px">  发布时间： {{sysNoticeInfo.pubTime}} &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;浏览次数：{{sysNoticeInfo.viewCount}}  
            </div>
        </div>
        <hr style="height:2px;align:center;width:80%;position:relative;left:10%">
        <div style="width:80%;position:relative;left:10%;font-size:16px;" v-html="sysNoticeInfo.infoContent">
        </div>
        <hr style="align:center;width:80%;position:relative;left:10%">
        <div style="width:80%;position:relative;left:10%;font-size:16px;" >
            <file-upload
                label="附件"
                :attachmentBusinessId="sysNoticeInfo.id"
                attachmentBusinessType="sys_notice_info"
                :canUpload="false"
                module="sys"
                :canDelete="false"
                />
        </div>
    </div>
</template>

<script>
import { getSysNoticeInfoAddCount} from '@/api/sys/sysNoticeInfo'
import Base from "@/views/base/Base"
import {formatDate} from "../../utils/formatUtils";
import SysTodoListVue from './SysTodoList.vue';

export default {
    name:'SysNoticeInfoList',
	extends: Base,
    data () {
        return {
        	menuId: 'SysNoticeInfoList',
            sysNoticeInfo: {
                id:'',
				topFlag: '',
				infoTitle: '',
				infoSubtitle: '',
				infoTag: '',
				infoContent: '',
				infoDispOrder: '',
				viewCount: '',
				pubTime: '',
				updateDate: '',
				updateBy: '',
				createDate: '',
				createBy: '',
				attachmentIds:[],
			},
           
        }
    },
    props: {
        sysNoticeId: {
            type: String,
            default: null
        },   
    },
    created:function(){
       this.sysNoticeInfo.id = this.sysNoticeId;
    },
    computed: {
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function() {
            getSysNoticeInfoAddCount(this.sysNoticeInfo.id).then(result => {
                var data = result.data;
                if(data) {
                    this.sysNoticeInfo =  data.sysNoticeInfo || this.sysNoticeInfo;
                    this.sysNoticeInfo.pubTime = formatDate(this.sysNoticeInfo.pubTime, "YYYY-MM-DD") ;
                }
            });
        },
        addViewCount: function(item){
            addViewCount(JSON.stringify(item)).then(result => {
                this.$refs.pagination.refresh();
            });
        },
    }
}
</script>

<style scoped>

</style>