<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header" style="height:50px;border:solid 1px #e6e6e6;background:#FBFBFB;">
            <span><p>个人工作任务列表</p></span>

        </div>
        <button id="actUpload" class="layui-btn layui-btn-icon layui-btn-primary hidden" ref="importBtn">
            <i class="fa fa-paste" aria-hidden="true"></i>&nbsp;&nbsp;批量导入
        </button>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row" ref="sysTodoList">
                <div class="col-sm-12 message-list">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./work/wtWorkTaskInfos'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">任务类型：</span>
                                    <layui-select
                                        style="display: inline-block;width: 154px;margin-right: 10px;"
                                        v-model="otherParam.workTaskTypeDict"
                                        :items="workTaskTypeDicts"
                                        class="d_sel">
                                    </layui-select>
                                   <!-- <span class="title title-text" style="margin-right: 14px;">主办人：</span>
                                    <input type="text" v-model="otherParam.responsibleUserName" placeholder="输入主办人">-->
                                    <span class="title title-text" style="margin-right: 11px;color: #666;">关键字：</span>
                                    <layui-select
                                        style="display: inline-block;width: 154px;margin-right: 10px;"
                                        v-model="otherParam.searchKeyType"
                                        :items="searchKeyTypeDicts"
                                        class="d_sel">
                                    </layui-select>
                                    <input type="text" v-model="otherParam.searchContent" placeholder="输入关键字">
                                </template>
                                <template slot="opera">
                                    <div class="search-condition-row">
                                        <button @click="importExcel" class="layui-btn layui-btn-icon layui-btn-primary">
                                            <i class="fa fa-paste" aria-hidden="true"></i>&nbsp;&nbsp;导入
                                        </button>
                                        <button @click="batchDownload"
                                                class="layui-btn layui-btn-icon layui-btn-primary">
                                            <i class="iconfont icon-download" aria-hidden="true"></i>&nbsp;&nbsp;导出
                                        </button>
                                        <button @click="downFile" type="button"
                                                class="layui-btn layui-btn-icon layui-btn-primary">
                                            <i class="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;下载模板
                                        </button>
                                    </div>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                        <tr style="width: 100%">
                                            <th style="text-align:center;width: 5%">序号</th>
                                            <th style="text-align:center;width: 15%">任务编号
                                                <field-sort field="work_task_no"></field-sort>
                                            </th>
                                            <th style="text-align:center;width:20%">标题</th>
                                            <th style="text-align:center;width:8%">主办人</th>
                                            <th style="text-align:center;width:15%">进度
                                                <field-sort field="work_percent"></field-sort>
                                            </th>
                                        <!--    <th style="text-align:center;width:10%">当前环节</th>-->
                                            <th style="text-align:center;width:10%">截止日期
                                                <field-sort field="work_task_endtime"></field-sort>
                                            </th>
                                            <th style="text-align:center;width:8%">状态</th>
                                            <th style="text-align:center;width:10%">任务类型</th>
                                            <th style="text-align:center;width:15%">操作</th>
                                        </tr>
                                        </thead>

                                        <tbody id="meetingTbody" class="footable_table">
                                        <template v-for="(item, index) in page.list">
                                            <tr :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}"
                                                style="display: table-row;"
                                                :key="item.id">
                                                <td width="5%" style="text-align:center;" v-if="page.pageNo==0">{{index + 1}}
                                                </td>
                                                <td width="5%" style="text-align:center;" v-else>
	                                                {{ (page.pageNo - 1) * page.pageSize + index + 1 }}
                                                </td>
                                                <td style="text-align:center;">
                                                    {{item.workTaskNo}}
                                                </td>
                                                <td style="text-align:left;cursor: pointer" :title="item.workTaskTitle">
                                                    <span v-if="item.workTaskLevelDict=='1'" class="spanGreen">一般</span>
                                                    <span v-if="item.workTaskLevelDict=='2'" class="spanBlue">重要</span>
                                                    <span v-if="item.workTaskLevelDict=='3'" class="spanRed">紧急</span>&nbsp;
                                                    <span @click="toDetails(item)" style="color: #1E9FFF;">{{item.workTaskTitle}}</span>
                                                </td>
                                                <td style="text-align:center;">
	                                                {{userNameMap[item.responsibleUserId] ? userNameMap[item.responsibleUserId].userName:''}}
                                                </td>
                                                <td style="text-align:center;" :title="item.workPercent+'%'">
                                                    <div style="margin-top: 0px;width: 90px;display:  inline-block;">
                                                        <div class="layui-progress">
                                                            <div class="layui-progress-bar"
                                                                 :style="{background: 'rgb(24, 144, 255)', width: (item.workPercent + '%')}">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span style="display: inline-block;width: 32px;text-align: left;">
	                                                    {{ item.workPercent }}%
                                                    </span>
                                                </td>
                                             <!--   <td style="text-align:center;" v-if="item.workTaskStatusDict=='0'">
                                                    {{currentNamesMap[item.currentNodeName]}}
                                                </td>
                                                <td style="text-align:center;" v-else>
                                                    {{item.currentNodeName}}
                                                </td>-->
                                                <td style="text-align:center;" :title="item.workTaskEndtime | formatDate">
                                                    {{item.workTaskEndtime | formatDate}}
                                                </td>
                                                <td style="text-align:center;">
                                                    <template v-if="item.workTaskStatusDict=='5'">
                                                        <i class="fa fa-lock"
                                                           style="font-size: 10px;color: #f71515;margin-right:5px;"></i>
                                                        <span style="color: #f71515;">{{workStatusMap[item.workTaskStatusDict]}}</span>
                                                    </template>
                                                    <template v-else>
                                                        {{workStatusMap[item.workTaskStatusDict]}}
                                                    </template>
                                                </td>
                                                <td style="text-align:center;">{{ item.workTaskType}}</td>
                                                <td style="text-align:center;">
                                                    <template
                                                        v-if="currentUserId==item.createBy && item.workTaskStatusDict=='1' ">
	                                                    <a @click="editWorkTask(item)" style="margin-right:10px">
		                                                    <i class="fa fa-wrench"
		                                                       style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
	                                                    <a @click="del(item)" class="delete_a">
		                                                    <i class="fa fa-cut"
		                                                       style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                                    </template>
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
    import {getDicts} from '@/api/dict';
    import {formatDate} from "@/utils/formatUtils";
    import Base from '@/views/base/Base';
    import {getToken} from '@/utils/auth'
    import {del} from '@/api/work/wtWorkTaskInfo';

    export default {
        extends: Base,
        name: 'WtWorkTaskInfoList',
        data() {
            return {
                titles: ['任务分类', '任务状态', '重要程度', '年度'],
                dicts: [],
                paramNames: ['taskCategories', 'workTaskStatusDict', 'workTaskLevelDict', 'year'],
                otherParam: {
                    searchKeyType: 'title'
                },
                refresh: true,
                page: {},
                wtWorkTaskInfos: [],
                userNameMap: {},
                uploadFiles: [],
                currentUserId: '',
                taskType: '',
                taskStatus: '',
                taskYear: '',
                currentNameDicts: [],
                workTaskTypeDicts: [],
                searchKeyTypeDicts: [
                    {
                        value: 'title',
                        label: '任务标题'
                    }, {
                        value: 'content',
                        label: '任务信息'
                    }, {
                        value: 'documentNumber',
                        label: '会议纪要文号'
                    },

                ],
            }
        },
        watch: {},
        computed: {
            workStatusMap: function () {
                return this.dicts.length > 1 ? this.dicts[1].array2Obj('value', 'label') : {};
            },
            linkageTypeMap: function () {
                return this.dicts[0].array2Obj('value', 'label');
            },
            currentNamesMap: function () {
                if (this.currentNameDicts) {
                    return this.currentNameDicts.array2Obj('value', 'label');
                }
            }
        },
        mounted() {
            this.refresh = false;
            this.initData();
            this.$nextTick(() => {
                this.layuiInit();
            });
        },
        methods: {
            importExcel: function () {
                this.$refs.importBtn.click();
            },
            dateMinus: function (date1, date2) {//date1:开始日期   date2:结束日期
                var date3 = new Date(date2).getTime() - new Date(date1).getTime();   //时间差的毫秒数
                //------------------------------
                var subMinutes = Math.floor(date3 / (60 * 1000)); //获取总共的分钟差
                //计算出相差天数
                var days = Math.floor(date3 / (24 * 3600 * 1000));
                //计算出小时数
                var leave1 = date3 % (24 * 3600 * 1000);  //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                //计算相差分钟数
                var leave2 = leave1 % (3600 * 1000);     //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000));
                //计算相差秒数
                var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);
                if (days > 0) {
                    return "任务超期 " + (days) + "天 " + (hours) + "小时 ";
                } else if (days == 0) {
                    return "距离任务结束剩余 " + (days) + "天 " + (hours) + "小时 "/*+minutes+" 分钟"+seconds+" 秒"*/;
                } else {
                    return "距离任务结束剩余 " + (days * -1) + "天 " + (hours * -1) + "小时 "/*+minutes+" 分钟"+seconds+" 秒"*/;
                }
            },
            getTime: function () {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            downFile: function () {
                window.open('/api/file/pub/template/worktask_import_template.xls', '_blank');
            },
            batchDownload: function () {
            },
            initData: function () {
                var _this = this;
                this.currentUserId = this.curUser.userId;
                getDicts('TASK_CATEGORIES,TASK_STATUS,WORK_TASK_LEVEL_DICT,PROJECT_YEAR,FLOW_PROCESS_ITEM_DICT,WORK_TASK_TYPE_DICT').then(result => {
                    if (result.data) {
                        this.currentNameDicts = result.data[4];
                        this.workTaskTypeDicts = result.data[5];
                        result.data.forEach((element, index) => {
                            element.unshift({
                                label: "全部",
                                selected: 1,
                                value: "all"
                            });
                            if (index == 0 && this.taskType) {
                                var _index = element.indexOf(this.taskType, 'value');
                                if (_index != -1) {
                                    element[0].selected = 0;
                                    element[_index].selected = 1;
                                }
                                this.otherParam['taskCategories'] = this.taskType;
                            }
                            if (index == 1 && this.taskStatus) {
                                var _index = element.indexOf(this.taskStatus, 'value');
                                if (_index != -1) {
                                    element[0].selected = 0;
                                    element[_index].selected = 1;
                                }
                                this.otherParam['workTaskStatusDict'] = this.taskStatus;
                            }
                            if (index == 3 && this.taskYear) {
                                var _index = element.indexOf(this.taskYear, 'value');
                                if (_index != -1) {
                                    element[0].selected = 0;
                                    element[_index].selected = 1;
                                }
                                this.otherParam['year'] = this.taskYear;
                            }
                            this.dicts.push(element);

                        });
                        this.dicts.splice(4);
                        this.refreshed();
                        this.workTaskTypeDicts = this.workTaskTypeDicts.filter(dict => {
                            return dict.value !== 'all' && dict.value.length !== 1;
                        })
                    }
                });
            },
            handleSearchResult: function (data) {
                this.page = data.page || {};
                // this.wtWorkTaskInfos = data.wtWorkTaskInfos || [];
                this.userNameMap = data.userNameMap || {};
                // this.page['list'] = this.wtWorkTaskInfos;
                //看板
            },
            editWorkTask: function (wtWorkTaskInfo) {
                this.$parent.closeTabByName("WtWorkTaskInfoForm");
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "wtWorkTaskInfo",
                    "name": "WtWorkTaskInfoForm",
                    "parentId": "4",
                    "text": "任务信息更新",
                    "children": []
                }, 3, {
                    id: wtWorkTaskInfo.id,
                });
            },
            del: function (wtWorkTaskInfo) {
                confirm('确定删除该记录吗？', () => {
                    del(wtWorkTaskInfo.id).then(result => {
                        alert("删除成功");
                        this.$refs.pagination.refresh();
                    });
                });
            },
            toDetails: function (wtWorkTaskInfo) {
                this.$parent.closeTabByName("WtWorkTaskInfoDetails");
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "wtWorkTaskInfo",
                    "name": "WtWorkTaskInfoDetails",
                    "parentId": "4",
                    "text": "处理任务",
                    "children": []
                }, 3, {
                    id: wtWorkTaskInfo.id,
                });
            },
            layuiInit: function () {
                var _this = this;
                layui.use(['element', 'form', 'upload'], function () {
                    var element = layui.element,
                        form = layui.form,
                        upload = layui.upload;
                    //自定义验证规则
                    form.verify({
                        title: function (value) {
                            if (value.length < 10) {
                                return '标题至少得10个字符哟';
                            }
                        }, content: function (value) {
                            layedit.sync(editIndex);
                        }
                    });
                    /* form.on('submit(saveWtWorkTaskInfo)', function (data) {
                       _this.save();
                       return false;
                     });*/

                    var uploadListIns = upload.render({
                        elem: '#actUpload',
                        url: '/api/work/wtWorkTaskInfoImportDownload/importWorkTaskInfos',
                        accept: 'file',
                        multiple: false,
                        auto: true,
                        exts: 'xls|xlsx',
                        headers: {
                            auth: getToken()
                        },
                        done: function (res, index, upload) {
                            layer.closeAll("loading");
                            if (res.status == 200) { //上传成功
                                _this.allData = res.data;
                                alert("导入成功");
                                _this.$refs.pagination.refresh();
                            } else {
                                _this.error(index, upload);
                            }
                            //this.error(index, upload);
                        },
                        error: function (index, upload) {
                            alert("导入失败，请重新导入")
                        }
                    });
                });
            }
        }, filters: {
            formatDate(dateTime) {
                let date = new Date(dateTime);
                return formatDate(date, "YYYY-MM-DD")
            },
            workNo: function (value) {
                if (value) {
                    return value.substring(5);
                } else {
                    return value;
                }

            }
        }
    }

</script>
<style src="@/assets/css/messageBoardSec.css" scoped></style>
<style scoped>
    .ibox-content ul li .agile-detail {
        padding-left: 20px;
        margin-top: 9px;

    }

    .spanGreen {
        border: 1px solid #42a90e;
        color: #42a90e;
        background-color: #00ff5508;;
        border-radius: 5px;
        margin-left: 10px;
        padding: 0px 6px;
    }

    .spanRed {
        border: 1px solid #f31212;
        color: #f31212;
        background-color: #ff00000a;
        border-radius: 5px;
        margin-left: 10px;
        padding: 0px 6px;
    }

    .spanBlue {
        border: 1px solid #ff7c4d;
        color: #ff7c4d;
        background-color: #ff00000a;
        border-radius: 5px;
        margin-left: 10px;
        padding: 0px 6px;
    }

    .footable > tbody > tr:hover {
        cursor: default;

    }

    .d_sel /deep/ .layui-unselect {
        height: 26px;
    }

    .d_sel /deep/ .layui-anim {
        top: 30px;
    }


</style>

