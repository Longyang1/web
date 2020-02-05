<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>议题列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                :url="'./meeting/meetingSubjects'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">议题名称：</span>
                                    <input type="text" v-model="otherParam.subjectName" placeholder="输入议题关键字">
                                </template>
                                <template slot="opera">
                                    <button @click="create" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;创建议题</button>
                                    <file-download-button text="模板下载" name='MeetingSubjectTemplate.xlsx'></file-download-button>
                                    <file-upload-button
                                        text="批量导入"
                                        loadingMsg="导入中"
                                        @importSuccessAfter="importSuccessAfter"
                                        url="/api/meeting/meetingSubjects/importSubject"></file-upload-button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th class="center" width="80px">序号</th>
                                                <th class="center" width="25%">议题名称</th>
                                                <th class="center" width="10%">议题类型</th>
                                                <th class="center" style="width: 100px">会议类型</th>
                                                <th v-if="enableVote" style="width: 50px" class="center">投票</th>
                                                <th class="center" width="10%">议题状态</th>
                                                <th class="center" style="width: 138px;">更新时间</th>
                                                <th class="center" width="230px">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="refresh" id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}"
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
                                                    <td style="text-align:center;" :title="item.subjectName"><span @click="edit(item, true)" class="l-cursor" style="color: rgb(30, 159, 255);">{{ item.subjectName }}</span></td>
                                                    <td style="text-align:center;">{{ subjectTypeMap[item.meetingSubjectTypeDict] }}</td>
                                                    <td style="text-align:center;">{{ meetingTypeMap[item.meetingTypeDict] }}</td>
                                                    <td v-if="enableVote" style="text-align:center;"><i v-if="item.subjectVoteFlag == 'y'" class="fa fa-check-circle" :style="{color: (item.subjectVoteFlag == 'y' ? 'green' : '#fff')}" aria-hidden="true"></i></td>
                                                    <td style="text-align:center;">{{ subjectStatusMap[item.meetingSubjectStatusDict] }}</td>
                                                    <td style="text-align:center;">{{ item.updateDate | moment('YYYY-MM-DD HH:mm') }}</td>
                                                    <td style="text-align:center;">
                                                        <a v-if="item.meetingSubjectStatusDict == 0" @click="publish(item.id, index)" style="margin-right:10px"><i class="fa fa-play" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>发布</a>
                                                        <a v-if="item.meetingSubjectStatusDict == 1" @click="cancelPublish(item.id, index)" style="margin-right:10px"><i class="fa fa-stop" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>取消发布</a>
                                                        <a v-if="item.meetingSubjectStatusDict <= 2" @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a v-if="item.meetingSubjectStatusDict > 2" @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-calendar" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</a>
                                                        <a v-if="item.meetingSubjectStatusDict < 2" @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                        <tfoot>
                                        </tfoot>
                                    </table>
                                </template>
                            </pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict';
import { delMeetingSubject, updateSubject } from '@/api/meeting/meetingSubject'
import OfficeTree from '@/components/OfficeTree'
import SubjectTypeModel from '@/views/meeting/SubjectTypeModel'
import Base from "@/views/base/Base"

export default {
    name: 'MeetingSubjectList',
	extends: Base,
    data () {
        return {
            titles: ['议题类型', '人员类型', '会议类型'],
            dicts: [],
            paramNames: ['meetingSubjectTypeDict', 'meetingSubjectStatusDict', 'meetingTypeDict'],
            otherParam: {
                'subjectName': null
            },
            refresh: true,
            page: {

            },
            name: "MeetingSubjectList",
            enableVote: process.env.VUE_APP_MEETING_SUBJECT_ENABLE_VOTE != '1',
        }
    },
    computed: {
        subjectTypeMap: function() {
            return this.dicts.length > 0 ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        subjectStatusMap: function() {
            return this.dicts.length > 1 ? this.dicts[1].array2Obj('value', 'label') : {};
        },
        meetingTypeMap: function() {
            return this.dicts.length > 2 ? this.dicts[2].array2Obj('value', 'label') : {};
        },
    },
    mounted () {
        this.initData();
    },
    methods: {
        importSuccessAfter() {
            this.$refs.pagination.refresh();
        },
        initData: function() {
            getDicts('MEETING_SUBJECT_TYPE_DICT,MEETING_SUBJECT_STATUS_DICT,MEETING_TYPE_DICT').then(result => {
                if(result.data){
                    result.data.forEach(element => {
                         element.unshift({
                            label: "全部",
                            selected: 1,
                            value: ""
                        });
                        this.dicts.push(element);
                    });
                }
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            // this.page['list'] = data.subjects || [];
        },
        create: function() {
            this.$parent.closeTabByName("MeetingSubjectForm");
            this.$nextTick(() => {
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "MeetingSubjectForm",
                    "name": "MeetingSubjectForm",
                    "newWindow": 0,
                    "opened": 1,
                    "parentId": "4",
                    "text": "议题创建",
                    "children": [
    
                    ]
                }, 3);
            });
        },
        edit: function(subject) {
            this.$parent.closeTabByName("MeetingSubjectForm");
            this.$nextTick(() => {
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "MeetingSubjectForm",
                    "name": "MeetingSubjectForm",
                    "newWindow": 0,
                    "opened": 1,
                    "parentId": "4",
                    "text": "议题修改",
                    "children": [
    
                    ]
                }, 3, {
                    id: subject.id,
                    projectId: subject.projectId,
                });
            });
        },
        del: function(subject) {
            confirm('确定删除该议题吗？', () => {
                delMeetingSubject(subject.id).then(result => {
                    alert(result.msg);
                    this.$refs.pagination.refresh();
                });
            });
        },
        publish: function(subjectId, index) {
            this.submitHandler((token) => {
                updateSubject(subjectId, "meetingSubjectStatusDict", 1, token).then(result => {
                    alert("成功发布");
                    var subject = this.page.list[index];
                    subject.meetingSubjectStatusDict = 1;
                    this.refresh = false;
                    this.$nextTick(() => {
                        this.refresh = true;
                    });
                    this.resetToken(result);
                }).catch((error) => {
                    this.resetToken(error);
                });
            });
        },
        cancelPublish: function(subjectId, index) {
            this.submitHandler((token) => {
                updateSubject(subjectId, "meetingSubjectStatusDict", 0, token).then(result => {
                    alert("成功取消发布");
                    var subject = this.page.list[index];
                    subject.meetingSubjectStatusDict = 0;
                    this.refresh = false;
                    this.$nextTick(() => {
                        this.refresh = true;
                    });
                    this.resetToken(result);
                }).catch((error) => {
                    this.resetToken(error);
                });
            });
        }
    }
}
</script>

<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }
    .ibox-content /deep/ .search-box {
        padding-left: 0;
        margin-left: 0;
    }
    .center {
        text-align: center;
    }
    .title-text {
        width: 61px;
    }
</style>
