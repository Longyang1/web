<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header" style="height:50px;border:solid 1px #e6e6e6;background:#FBFBFB;">
            <span><p>工作任务看板</p></span>
            <div class="pull-right" style="position:relative;top:-20px;font-size:14px;padding-right: 20px;">

            </div>
        </div>

        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row" ref="sysTodoList" style="display: none">
                <div class="col-sm-12 message-list">
                    <div class="float-e-margins">
                        <div id="center">

                        </div>
                    </div>
                </div>
            </div>

            <!-- message-board -->
            <div class="col-sm-12 message-board" ref="messageBoard" style="margin-top: 20px;">
                <!-- 1.我负责的任务 -->
                <div class="col-sm-3 custom-padding">
                    <div class="ibox float-e-margins">
                        <div class="mytitle">
                            <h5>&nbsp;&nbsp;我参与的任务（{{myAttendWorkList.length}}）</h5>

                        </div>
                        <div 
                            v-if="!myAttendWorkList.length"
                            class="ibox-content"
                            style="height:670px;overflow: auto;">
                            <ul>
                                <li style="height: 650px;position: relative;">
                                    <img src="/img/kongbaicanyurenwu.png" alt=""style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">
                                </li>
                            </ul>
                        </div>
                        <div
                            v-if="myAttendWorkList.length > 0" 
                            class="ibox-content"
                            style="height:670px;overflow: auto;">
                            <ul v-for="(item, index) in myAttendWorkList" :key="item.id">
                                <li>
                                    <i class="fa fa-circle text-blue" v-if="index%2==0"></i>
                                    <i class="fa fa-circle text-orange" v-else></i>
                                    <a href="javascript:void(0)"><span @click="deal(item)" style="color: #1E9FFF">{{ item.workTaskTitle }}</span></a>
                                    <div class="agile-detail">
                                        <template v-if="item.workTaskLevelDict=='1'">
                                            <button type="button" class="btn btn-xs btn-success">一般</button>
                                        </template>
                                        <template v-if="item.workTaskLevelDict=='2'">
                                            <button type="button" class="btn btn-xs btn-orange">重要</button>
                                        </template>
                                        <template v-if="item.workTaskLevelDict=='3'">
                                            <button type="button" class="btn btn-xs btn-danger">紧急</button>
                                        </template>
                                    </div>
                                    <div class="agile-detail">
                                        <i class="layui-icon layui-icon-username"></i>
                                        <template>
                                            {{ bUserNameMap[item.responsibleUserId] ? bUserNameMap[item.responsibleUserId].userName : '' }}
                                        </template>
                                    </div>
                                    <div class="agile-detail"><i class="fa fa-spinner"></i>
                                        <div style="margin-top: 0px;width: 90px;display:  inline-block;">
                                            <div class="layui-progress">
                                                <div 
                                                    class="layui-progress-bar"
                                                    :style="{background: 'rgb(24, 144, 255)', width: (item.workPercent + '%')}"></div>
                                            </div>
                                        </div>
                                        <span style="display: inline-block;width: 32px;text-align: left;">{{ item.workPercent }}%</span>
                                    </div>
                                    <div class="agile-detail"><i class="fa fa-calendar"></i>
                                        {{item.workTaskStarttime | formatDate}} 至 {{item.workTaskEndtime | formatDate}}
                                    </div>
                                    <div class="agile-detail"><i class="layui-icon layui-icon-log"></i><span
                                        class="end-time-text">{{ dateMinus(item.workTaskEndtime,getTime(),item) }}</span>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 2.我解锁/锁定的任务 -->
                <div class="col-sm-3">
                    <div class="ibox float-e-margins">
                        <div class="mytitle">
                            <h5>&nbsp;&nbsp;待我解锁的任务（{{myUnlockAndLockWorkList.length}}）</h5>
                        </div>
                        <div v-if="!myUnlockAndLockWorkList.length"
                             class="ibox-content" style="height:670px;overflow: auto;">
                            <ul>
                                <li style="height: 650px;position: relative;"><img
                                    src="/img/kongbaidaijiesuo.png" alt=""
                                    style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)"></li>
                            </ul>
                        </div>
                        <div v-if="myUnlockAndLockWorkList.length > 0" class="ibox-content"
                             style="height:670px;overflow: auto;">
                            <template v-for="(item, index) in myUnlockAndLockWorkList">
                                <ul :key="item.id">
                                    <li>
                                        <div style="float: left">
                                            <i class="fa fa-circle text-blue" v-if="index%2==0"></i>
                                            <i class="fa fa-circle text-orange" v-else></i></div>
                                        <a href="javascript:void(0)">
                                            <div @click="deal(item)" style="color: #1E9FFF;width: 290px;float: left">
                                                {{ item.workTaskTitle }}
                                            </div>
                                        </a>
                                        <a href="javascript:void(0)" title="任务解锁">
                                            <i @click="unlock(item)" class="fa fa-unlock" style="color:#28C24D;font-size: 18px;vertical-align: unset;float: right"></i>
                                        </a>
                                        <div class="agile-detail">
                                            <template v-if="item.workTaskLevelDict=='1'">
                                                <button type="button" class="btn btn-xs btn-success">一般</button>
                                            </template>
                                            <template v-if="item.workTaskLevelDict=='2'">
                                                <button type="button" class="btn btn-xs btn-orange">重要</button>
                                            </template>
                                            <template v-if="item.workTaskLevelDict=='3'">
                                                <button type="button" class="btn btn-xs btn-danger">紧急</button>
                                            </template>
                                        </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-username"></i>
                                            <template v-if="bUserNameMap[item.responsibleUserId]!=undefined">
                                                {{bUserNameMap[item.responsibleUserId].userName}}
                                            </template>
                                        </div>
                                        <div class="agile-detail"><i class="fa fa-spinner"></i>
                                            <div style="margin-top: 0px;width: 90px;display:  inline-block;">
                                                <div class="layui-progress">
                                                    <div class="layui-progress-bar"
                                                         :style="{background: 'rgb(24, 144, 255)', width: (item.workPercent + '%')}"></div>
                                                </div>
                                            </div>
                                            <span style="display: inline-block;width: 32px;text-align: left;">{{ item.workPercent }}%</span>
                                        </div>
                                        <div class="agile-detail"><i class="fa fa-calendar"></i>
                                            {{item.workTaskStarttime | formatDate}} 至 {{item.workTaskEndtime |
                                            formatDate}}
                                        </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-log"></i><span
                                            class="end-time-text">{{dateMinus(item.workTaskEndtime,getTime(),item)}}</span>
                                        </div>

                                    </li>
                                </ul>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- 3.我关注的任务 -->
                <div class="col-sm-3">
                    <div class="ibox float-e-margins">
                        <div class="mytitle">
                            <h5>&nbsp;&nbsp;我关注的任务<!--（{{attentionList.length}}）--></h5>
                        </div>
                        <div v-if="!attentionList.length" class="ibox-content"
                             style="height:670px;overflow: auto;">
                            <ul>
                                <li style="height: 650px;position: relative;">
                                    <img src="/img/kongbaiguanzhurenwu.png" alt="" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">
                                </li>
                            </ul>
                        </div>
                        <div v-if="attentionList.length > 0" class="ibox-content" style="height:670px;overflow: auto;">
                            <template v-for="(item, index) in attentionList">
                                <ul :key="item.id">
                                    <li>
                                        <div style="float: left">
                                            <i class="fa fa-circle text-blue" v-if="index%2==0"></i>
                                            <i class="fa fa-circle text-orange" v-else></i>
                                        </div>
                                        <a href="javascript:void(0)">
                                            <div @click="deal(item)" style="color: #1E9FFF;width: 290px;float: left">
                                                {{ item.workTaskTitle }}
                                            </div>
                                        </a>

                                        <a href="javascript:void(0)" title="取消关注">
                                            <i 
                                                @click="attend(item)"
                                                style="font-size: 18px;vertical-align: unset;float: right"
                                                :class="{'fa': true, 'fa-star': (wtWatchingInfos && wtWatchingInfos.indexOf(item.id, 'businessId') != -1), 'fa-star-o': (wtWatchingInfos && wtWatchingInfos.indexOf(item.id, 'businessId') == -1), 'text-warning fa-3x': true}"
                                                ref="flag"></i>
                                                                                                                                            </a>
                                        <div class="agile-detail">
                                            <template v-if="item.workTaskLevelDict=='1'">
                                                <button type="button" class="btn btn-xs btn-success">一般</button>
                                            </template>
                                            <template v-if="item.workTaskLevelDict=='2'">
                                                <button type="button" class="btn btn-xs btn-orange">重要</button>
                                            </template>
                                            <template v-if="item.workTaskLevelDict=='3'">
                                                <button type="button" class="btn btn-xs btn-danger">紧急</button>
                                            </template>
                                        </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-username"></i>
                                            <template>
                                                {{bUserNameMap[item.responsibleUserId]?bUserNameMap[item.responsibleUserId].userName:''}}
                                            </template>
                                        </div>
                                        <div class="agile-detail"><i class="fa fa-spinner"></i>
                                            <div style="margin-top: 0px;width: 90px;display:  inline-block;">
                                                <div class="layui-progress">
                                                    <div
                                                        class="layui-progress-bar"
                                                        :style="{background: 'rgb(24, 144, 255)', width: (item.workPercent + '%')}"></div>
                                                </div>
                                            </div>
                                            <span style="display: inline-block;width: 32px;text-align: left;">{{ item.workPercent }}%</span>
                                        </div>
                                        <div class="agile-detail"><i class="fa fa-calendar"></i>
                                            {{ item.workTaskStarttime | formatDate}} 至 {{item.workTaskEndtime | formatDate }}
                                        </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-log"></i>
                                            <span class="end-time-text">{{dateMinus(item.workTaskEndtime,getTime(),item)}}</span>
                                        </div>

                                    </li>
                                </ul>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- 4.我创建的任务 -->
                <div class="col-sm-3">
                    <div class="ibox float-e-margins">
                        <div class="mytitle">
                            <h5>&nbsp;&nbsp;我创建的任务（{{taskInfosByCreate.length}}）</h5>
                            <!--<div class="ibox-tools">
                                <label class="label label-primary btn-rounded" @click="create">新建</label>
                            </div>-->
                        </div>
                        <div v-if="!taskInfosByCreate.length"
                             class="ibox-content" style="height:670px;overflow: auto;">
                            <ul>
                                <li style="height: 650px;position: relative;"><img
                                    src="/img/kongbaichuangjianrenwu.png" alt=""
                                    style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)"></li>
                            </ul>
                        </div>
                        <div v-if="taskInfosByCreate.length > 0" class="ibox-content"
                             style="height:670px;overflow: auto;">
                            <template v-for="(item, index) in taskInfosByCreate">
                                <ul :key="item.id">
                                    <li>
                                        <i class="fa fa-circle text-blue" v-if="index%2==0"></i>
                                        <i class="fa fa-circle text-orange" v-else></i>
                                        <a href="javascript:void(0)"><span @click="deal(item)" style="color: #1E9FFF">{{ item.workTaskTitle }}</span></a>
                                        <div class="agile-detail" style="margin-top: 9px">
                                            <template v-if="item.workTaskLevelDict=='1'">
                                                <button type="button" class="btn btn-xs btn-success">一般</button>
                                            </template>
                                            <template v-if="item.workTaskLevelDict=='2'">
                                                <button type="button" class="btn btn-xs btn-orange">重要</button>
                                            </template>
                                            <template v-if="item.workTaskLevelDict=='3'">
                                                <button type="button" class="btn btn-xs btn-danger">紧急</button>
                                            </template>
                                        </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-username"></i>
                                            <template>
                                                {{bUserNameMap[item.responsibleUserId]?bUserNameMap[item.responsibleUserId].userName:''}}
                                            </template>
                                        </div>
                                        <div class="agile-detail"><i class="fa fa-spinner"></i>
                                            <div style="margin-top: 0px;width: 90px;display:  inline-block;">
                                                <div class="layui-progress">
                                                    <div 
                                                        class="layui-progress-bar"
                                                        :style="{background: 'rgb(24, 144, 255)', width: (item.workPercent + '%')}"></div>
                                                </div>
                                            </div>
                                            <span style="display: inline-block;width: 32px;text-align: left;">{{ item.workPercent }}%</span>
                                        </div>
                                        <div class="agile-detail"><i class="fa fa-calendar"></i>
                                            {{ item.workTaskStarttime | formatDate}} 至 {{item.workTaskEndtime | formatDate}}
                                        </div>
                                        <div class="agile-detail"><i class="layui-icon layui-icon-log"></i>
                                            <span class="end-time-text">{{dateMinus(item.workTaskEndtime,getTime(),item)}}</span>
                                        </div>

                                    </li>
                                </ul>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from "@/utils/formatUtils";
    import Base from '@/views/base/Base';
    import {getToken} from '@/utils/auth'
    import {saveOrUpdate} from '@/api/sys/sysUserSetting'
    // import WtWorkLock from '@/views/work/WtWorkLock';
    // import WtWorkUnlock from '@/views/work/WtWorkUnlock';
    import {
        deal,
        taskToUnlock,
        taskApproval,
        getProc,
        delAtta,
        activationWork,
        getList
    } from '@/api/work/wtWorkTaskInfo';
    import { del, addAttend, delAttend, get } from '@/api/work/wtDeptWorkTaskInfo';

    export default {
        extends: Base,
        name: 'WtWorkTaskInfoBoard',
        data() {
            return {
                titles: ['任务分类', '任务状态', '重要程度', '年度'],
                dicts: [],
                paramNames: ['taskCategories', 'workTaskStatusDict', 'workTaskLevelDict', 'year'],
                otherParam: {},
                refresh: true,
                page: {},
                myAttendWorkList: [],
                myUnlockAndLockWorkList: [],
                responsibleList: [],
                undertakeList: [],
                attentionList: [],
                workTaskInfoListByCon: [],
                wtWorkTaskInfos: [],
                taskInfosByCreate: [],
                userNameMap: {},
                bUserNameMap: {},
                bUserNameMapAttend: {},
                bUserNameMapRes: {},
                bUserNameMapUnder: {},
                uploadFiles: [],
                currentUserId: '',
                mode: true,
                id: '',
                taskType: '',
                taskStatus: '',
                taskYear: '',
                attendStar: null,
                noAttendStar: null,
                wtWatchingInfos: [],
                isBoard: true
            }
        },
        computed: {
            workStatusMap: function () {
                return this.dicts.length > 1 ? this.dicts[1].array2Obj('value', 'label') : {};
            },
            linkageTypeMap: function () {
                return this.dicts[0].array2Obj('value', 'label');
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
            attend: function (item, event) {
                var id = item.id;
                if (!(this.wtWatchingInfos && this.wtWatchingInfos.indexOf(item.id, 'businessId') != -1)) {
                    addAttend(id).then(result => {
                        alert(result.data);
                        this.$parent.closeTabByName("WtWorkTaskInfoBoard");
                        this.$parent.clickMenu({
                            "checked": false,
                            "icon": "fa-legal",
                            "id": "wtWorkTaskInfo",
                            "name": "WtWorkTaskInfoBoard",
                            "parentId": "4",
                            "text": "工作任务看板",
                            "children": []
                        }, 3, {});
                    });
                } else {
                    confirm('确定取消关注该任务吗？', () => {
                        delAttend(id).then(result => {
                            alert("已取消关注");
                            this.$parent.closeTabByName("WtWorkTaskInfoBoard");
                            this.$parent.clickMenu({
                                "checked": false,
                                "icon": "fa-legal",
                                "id": "wtWorkTaskInfo",
                                "name": "WtWorkTaskInfoBoard",
                                "parentId": "4",
                                "text": "工作任务看板",
                                "children": []
                            }, 3, {});
                        });
                    });

                }
            },
            importExcel: function () {
                this.$refs.importBtn.click();
            },
            dateMinus: function (date1, date2, workInfo) {//date1:开始日期   date2:结束日期
                var formatDate1 = formatDate(date1, "YYYY-MM-DD");
                var date3 = new Date(date2).getTime() - new Date(formatDate1).getTime();   //时间差的毫秒数
                //------------------------------
                //计算出相差天数
                var days = Math.floor(date3 / (24 * 3600 * 1000));

                if (days > 0) {
                    if (workInfo.workPercent == '100') {
                        return "反馈已完成";
                    }
                    if (workInfo.workTaskStatusDict == '5') {
                        return "任务已锁定" + (days) + "天 ";
                    }
                    return "任务超期 " + (days) + "天 ";
                } else if (days == 0) {
                    if (workInfo.workPercent == '100') {
                        return "反馈已完成";
                    }
                    return "任务将在今天结束 ";
                } else {
                    if (workInfo.workPercent == '100') {
                        return "反馈已完成";
                    }
                    if (workInfo.workTaskStatusDict == '5') {
                        return "任务已手动锁定";
                    }
                    return "距离任务结束剩余 " + (days * -1) + "天 ";
                }
            },
            dateMinusForLock: function (date1, date2) {//date1:开始日期   date2:结束日期
                var formatDate1 = formatDate(date1, "YYYY-MM-DD");
                var date3 = new Date(date2).getTime() - new Date(formatDate1).getTime();   //时间差的毫秒数
                //------------------------------
                //计算出相差天数
                var days = Math.floor(date3 / (24 * 3600 * 1000));

                if (days > 0) {
                    return "任务已锁定 " + (days) + "天 " /*+ (hours) + "小时 "*/;
                } else if (days == 0) {
                    return "任务在进行中 " /*+ (days) + "天 "*/ /*+ (hours) + "小时 "*//*+minutes+" 分钟"+seconds+" 秒"*/;
                } else {
                    return "距离任务结束剩余 " + (days * -1) + "天 " /*+ (hours * -1) + "小时 "*//*+minutes+" 分钟"+seconds+" 秒"*/;
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
            save: function () {
                saveOrUpdate(JSON.stringify(this.sysUserSetting)).then(result => {
                    var data = result.data;
                    if (data) {
                        console.log(data);
                    }
                });
            },
            initData: function () {
            },
            create: function () {
                this.$parent.closeTabByName("WtWorkTaskInfoForm");
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "wtWorkTaskInfo",
                    "name": "WtWorkTaskInfoForm",
                    "parentId": "4",
                    "text": "任务创建",
                    "children": []
                }, 3);
            },
            edit: function (wtWorkTaskInfo) {
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
            deal: function (item) {
                var iteml = item;
                if (iteml.workTaskStatusDict == 1) {
                    alert("任务未发布");
                    return true;
                }
                this.$parent.closeTabByName("WtDealWorkTaskInfo");
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "wtWorkTaskInfo",
                    "name": "WtDealWorkTaskInfo",
                    "parentId": "4",
                    "text": "处理任务",
                    "children": []
                }, 3, {

                    item: item.id,
                    wtWorkTask: this.wtWorkTaskInfo,
                    fromBoardPage: true,
                });
            },
            viewToDeal: function (item) {
                var iteml = item;
                this.$parent.closeTabByName("WtDealWorkTaskInfo");
                this.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "wtWorkTaskInfo",
                    "name": "WtDealWorkTaskInfo",
                    "parentId": "4",
                    "text": "处理任务",
                    "children": []
                }, 3, {
                    item: item.id,
                    flag: 'look'
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
                        }
                        , content: function (value) {
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
                let date = new Date(dateTime)
                return formatDate(date, "YYYY-MM-DD")
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
</style>

