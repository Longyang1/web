<template>
    <div v-if="attachments.length > 0" :type="type" class="row row-background left-border vote-result">
        <div v-if="type == 1" :type="type" class="col-sm-12 explain-sign">
            <fieldset class="layui-elem-field subject-title">
                <legend>
                    <i class="fa fa-file-text-o text-warning"></i> 议题材料
                </legend>
                <div class="layui-field-box">
                    <div class="col-sm-12">
                        <ul class="sortable-list connectList agile-list">
                            <li class="success-element">
                                <div class="agile-detail">
                                    <table class="subject-child-table">
                                        <tbody>
                                            <tr>
                                                <th width="60%">汇报材料</th>
                                                <th>负责人</th>
                                                <th>汇报部门</th>
                                                <th>汇报时间(分钟)</th>
                                            </tr>
                                            <template>
                                                <tr
                                                     v-for="(atta, index) in attachments"
                                                    :key="atta.id + index"
                                                    :class="{'hidden': false}">
                                                    <td 
                                                        style="text-align: left"
                                                        :class="{'child-padding': false}">
                                                        <a @click="showFile(subject, attachmentReportMemberMap[atta.id], atta)" target="_blank">
                                                        <i :class="fileIconClass(atta)" aria-hidden="true"></i>
                                                        {{ atta.attachmentName.substring(0, atta.attachmentName.lastIndexOf('.')) }}
                                                        </a>
                                                    </td>
                                                    <td>{{ fuserMap[(attachmentReportMemberMap[atta.id] || {}).memberId] }}</td>
                                                    <td>{{ fofficeNameMap[(attachmentReportMemberMap[atta.id] || {}).officeId] }}</td>
                                                    <td>{{ attachmentReportMemberMap[atta.id] | pv('reportTime') }}</td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>								  
            </fieldset>
        </div>
        <ul v-if="type == 2" ref="table" :type="type" class="sortable-list connectList agile-list middle">
            <li class="success-element" style="width: 100%">
                <div class="agile-detail">
                    <table class="subject-child-table">
                        <tbody>
                            <tr>
                                <th>汇报材料</th>
                            </tr>
                            <template>
                                <tr
                                    v-for="(atta, index) in attachments"
                                    :key="atta.id + index"
                                    :class="{'hidden': false}">
                                    <td 
                                        style="text-align: left"
                                        :class="{'child-padding': false}">
                                        <a @click="showFile(subject, attachmentReportMemberMap[atta.id], atta)" target="_blank">
                                        <i :class="fileIconClass(atta)" aria-hidden="true"></i>
                                        {{ atta.attachmentName.substring(0, atta.attachmentName.lastIndexOf('.')) }}
                                        </a>
                                    </td>
                                </tr>
                            </template>
                            <template v-if="attachments.length < 5">
                                <tr
                                    v-for="i in (5 - attachments.length)"
                                    :key="'atta-' + i"
                                    :class="{'hidden': false}">
                                    <td 
                                        style="text-align: left"
                                        :class="{'child-padding': false}">
                                        <a style="visibility:hidden;">...</a>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </li>
        </ul>
    </div>
   
</template>

<script>
import meetingTabMixin from '@/mixin/meetingTabMixin'
import { mapGetters, mapState, mapMutations, mapActions} from 'vuex'
import { getAttaments } from '@/api/file'
import { getMeetingSubjectReportMembers } from '@/api/meeting/meetingSubject'

export default {
    mixins: [meetingTabMixin],
    data () {
        return {
            curDirName: '',
            minDirIndexs: [],
            attachments: [],
            fuserMap: {},
            fofficeNameMap: {},
            attachmentReportMemberMap: {},
            tableHeight: 0,
        }
    },
    props: {
        type: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        subject: function() {
            return this.inSelectSubjects[this.subjectSelectedIndex];
        },
    },
    watch: {
        subjectSelectedIndex() {
            this.tableHeight = 0;
            this.updateMinDirIndex();
            getAttaments({
                attachmentBusinessId: this.subject.id,
                attachmentBusinessType: "meeting_subject",
            }).then(res => {
                let data = res.data || {};
                this.attachments = data.attachmentInfos || [];
                this.$nextTick(() => {
                    this.tableHeight = this.$refs.table ? this.$refs.table.offsetHeight : 0;
                    if (this.$parent.notifyTableHeight) {
                        console.log(2)
                        this.$parent.notifyTableHeight(this.tableHeight);
                    }
                })
            });

            getMeetingSubjectReportMembers(this.subject.id).then(res => {
                let data = res.data || {};
                let reportMembers = data.reportMembers;
                this.attachmentReportMemberMap = reportMembers.array2Obj('attachmentId');
                this.fuserMap = data.userMap || {};
                this.fofficeNameMap = data.officeNameMap || {};
            });
        }
    },
    mounted() {
        this.updateMinDirIndex();

        getAttaments({
            attachmentBusinessId: this.subject.id,
            attachmentBusinessType: "meeting_subject",
        }).then(res => {
            let data = res.data || {};
            this.attachments = data.attachmentInfos || [];
            this.$nextTick(() => {
                this.tableHeight = this.$refs.table ? this.$refs.table.offsetHeight : 0;
                if (this.$parent.notifyTableHeight) {
                    console.log(1)
                    this.$parent.notifyTableHeight(this.tableHeight);
                }
            })
        });

        getMeetingSubjectReportMembers(this.subject.id).then(res => {
            let data = res.data || {};
            let reportMembers = data.reportMembers;
            this.attachmentReportMemberMap = reportMembers.array2Obj('attachmentId');
            this.fuserMap = data.userMap || {};
            this.fofficeNameMap = data.officeNameMap || {};
        });
    },
    methods: {
        fileIconClass: function(atta) {
            
        	var _class = 'fa file-icon ';
        	var suff = atta.attachmentSavePath.split('.')[1];
        	if("doc" == suff || "docx" == suff){
        		_class += 'fa-file-word-o file-icon-doc';
        	} else if("xlsx" == suff || suff == "xls"){
        		_class += 'fa-file-excel-o file-icon-excel';
        	} else if("pdf" == suff){
        		_class += 'fa-file-pdf-o file-icon-pdf';
        	} else if("ppt" == suff || "pptx" == suff){
        		_class += 'fa-file-powerpoint-o file-icon-ppt';
        	} else {
        		_class += 'fa-file-o';
        	}
        	return _class;
        },
        openOrCloseDir: function(dirName) {
            this.curDirName  = this.curDirName == dirName ? null : dirName;
        },
        updateMinDirIndex: function() {
           
        },
         showFile: function(subject, reportMember, atta){

            if (!atta) {
                return;
            }
            var attaUrl = "";
            //this.isshowpdf = true;
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isMobile = u.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var suff = atta.attachmentSavePath.substring(atta.attachmentSavePath.lastIndexOf(".") + 1 , atta.attachmentSavePath.length);
            if((suff == 'doc' || suff == "docx" || suff == 'xls' || suff == "xlsx" || suff == "ppt" || suff == "pptx" || suff == "pdf") && (!isMobile || isAndroid)){//!isMobile && 
                var show = 2;
                this.$store.commit("meeting/UPDATE_SHOW", {
                    show,
                    subject,
                    reportMember,
                    atta
                });
            } else {
        		if(isiOS && (suff == 'doc' || suff == "docx")){
        			//location.href =  process.env.API_HOST + "/pub/upload/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".pdf";
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".pdf";                 
        		} else if (suff == 'xls' || suff == "xlsx") {
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath.substring(0, atta.attachmentSavePath.lastIndexOf(".")) + ".html";                 
                } else {
                    attaUrl = "/api/file/pub/" + atta.attachmentSavePath;
                }
                window.open(attaUrl)
                return attaUrl;
            }
        },
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .vote-result {
        margin-top: 20px;
        padding-bottom: 0;
    }
    .agile-list {
        text-align: left;
    }
    legend {
        width: 100%;
    }
    legend > div {
        display: block;
        padding-right: 40px;
        float: right;
    }
    .subject-vote-result-table tr td {
        width: auto;
    }
    .agile-detail {
        margin-top: 5px;
        font-size: 14px;
    }
    .file-icon {
        margin-right: 4px;
    }
    .file-icon-doc {
        color: #2564A9;
    }
    .file-icon-excel {
        color: #549F3B;
    }
    .file-icon-pdf {
        color: #EE7B24;
    }
    .file-icon-ppt {
        color: #E65618;
    }
    .middle {
        padding-right: 20px;
    }
</style>