<template>
    <div class="tab-background float-e-margins">
        <div class="tab-header">
			<p>文件列表</p>
		</div>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="refresh"
                                :url="'./sys/sysAttachmentDownloads'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :autoSearch="true"
                                width="60"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <span class="title title-text">文件名称：</span>
                                    <input type="text" v-model="otherParam.attachmentName" placeholder="请输入文件名称">
                                    <span  v-if="isAdmin" class="title title-text">任务类型：</span>
                                    <layui-select
                                        v-if="isAdmin"
                                        style="display: inline-block;width: 154px;margin-right: 10px;"
                                        v-model="otherParam.fileDownloadTypeDict"
                                        :items="fileDownloadTypeDicts"></layui-select>
                                    <span class="title title-text">开始时间：</span>
                                    <layui-date
                                        v-model="otherParam.startTime"
                                        name="startTime"
                                        class="date"
                                        style="display:inline-block;padding-left: 6px;"></layui-date>
                                    至
                                    <layui-date
                                        v-model="otherParam.endTime"
                                        name="endTime"
                                        class="date"
                                        style="display:inline-block;padding-left: 8px;"></layui-date>
                                </template>
                                <template slot="opera">
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th v-if="isAdmin" style="text-align:center;">任务类型</th>
												<th style="text-align:center;">任务标题</th>
												<th style="text-align:center;">文件名称</th>
												<th style="text-align:center;width: 100px;">附件大小</th>
												<th v-if="isAdmin" style="text-align:center;width: 100px;">创建人</th>
												<th style="text-align:center;width: 140px">开始时间</th>
												<th style="text-align:center;width: 140px">结束时间</th>
												<th style="text-align:center;width: 100px;">状态</th>
                                                <th style="text-align:center;width: 178px;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td v-if="isAdmin" style="text-align:center;" :title="fileDownloadTypeMap[item.fileDownloadTypeDict]">{{ fileDownloadTypeMap[item.fileDownloadTypeDict] }}</td>
													<td style="text-align:center;" :title="item.taskTitle">{{ item.taskTitle }}</td>
													<td style="text-align:center;" :title="item.attachmentName">{{ item.attachmentName }}</td>
													<td style="text-align:center;">{{ item.attachmentSize }}</td>
													<td v-if="isAdmin" style="text-align:center;">{{ userMap[item.createBy] }}</td>
													<td style="text-align:center;">{{ item.taskStartDate | moment }}</td>
													<td style="text-align:center;">{{ item.taskEndDate | moment }}</td>
													<td style="text-align:center;" :style="getStatusStyle(item.status)">{{ statusMap[item.status] }}</td>
													<!-- <td style="text-align:center;">{{ item.taskExecLog }}</td> -->
                                                    <td style="text-align:center;">
                                                        <a v-if="item.status == 1" @click="downloadFile(item, true)" style="margin-right:10px"><i class="fa fa-download" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>下载</a>
                                                        <a v-if="item.status == 2" @click="log(item, true)" style="margin-right:10px"><i class="fa fa-file-text" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>日志</a>
                                                        <a v-if="item.status > 0" @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
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
import { del } from '@/api/sys/sysAttachmentDownload'
import Base from "@/views/base/Base"
import { delAttament, downloadFile } from '@/api/file'

export default {
	name: 'SysAttachmentDownloadList',
	extends: Base,
    data () {
        return {
            titles: ['状态'],
            dicts: [],
            paramNames: ['status'],
            fileDownloadTypeDicts: [],
            fileStatus: [],
            otherParam: {
                attachmentName: '',
                fileDownloadTypeDict: this.$route.params.type || this.type || '',
                startTime: '',
                endTime: '',
            },
            refresh: true,
            page: {

            },
            userMap: {},
        }
    },
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    computed: {
        statusMap: function() {
           return this.dicts[0] ? this.dicts[0].array2Obj('value', 'label') : {};
        },
        fileDownloadTypeMap: function() {
           return this.fileDownloadTypeDicts ? this.fileDownloadTypeDicts.array2Obj('value', 'label') : {};
        },
        isAdmin: function() {
            return this.curUser.username == "admin";
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        getStatusStyle: function(status) {
            return status ? (status == 2 ? 'color:red' : 'color:green') : '';
        },
        downloadFile: function(atta) {
            var path = atta.attachmentSavePath;
            if (path == "") {
                alert("附件未成功保存，无法下载。");
                return;
            }
            var fileName = atta.attachmentName;
            downloadFile({
                path,
                fileName
            }).then(res => {
                this.download(res);
            }).catch(err => {
                if (err.msg) {
                    alert(err.msg);
                }
                console.log(err);
            });
        },
        log: function(item) {
            var that = this;
            layer.open({
                type: 1
                ,title: '日志'
                ,area: ['790px', 'auto']
                ,shade: 0
                ,maxmin: true
                ,content: ('<pre class="layui-code" lay-title="JavaScript" lay-skin="notepad" style="margin-left: 20px;margin-right: 20px;">' + item.taskExecLog +'</pre>')
                ,btn: ['关闭'] //只是为了演示
                ,yes: function(){
                    layer.closeAll();
                }
                ,zIndex: layer.zIndex //重点1
                ,success: function(layero){
                    layer.setTop(layero); //重点2
                }
            });
        },
        initData: function() {
            getDicts('FILE_DOWNLOAD_TYPE_DICT,FILE_DOWNLOAD_STATUS').then(result => {
            	this.fileDownloadTypeDicts = result.data[0];
                var fileStatus = result.data[1];
                fileStatus.unshift({
                   label: "全部",
                   selected: 1,
                   value: ""
                });
                this.dicts.push(fileStatus);
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysAttachmentDownloads || [];
            this.userMap = data.userMap || {};
        },
        create: function() {
         	this.$parent.closeTabByName('SysAttachmentDownloadForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysAttachmentDownload",
                "name": "SysAttachmentDownloadForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysAttachmentDownload) {
         	this.$parent.closeTabByName('SysAttachmentDownloadForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysAttachmentDownload",
                "name": "SysAttachmentDownloadForm",
                "parentId": "4",
                "text": "XX信息更新",
                "children": [

                ]
            }, 3, {
                id: sysAttachmentDownload.id,
            });
        },
        del: function(sysAttachmentDownload) {
            confirm('确定删除该记录吗？', () => {
                del(sysAttachmentDownload.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
.tab-background /deep/ .layui-form-select input, .tab-background /deep/ input.layui-input {
    height: 26px;
    border-color: #ced2d7;
}
.tab-background .date /deep/ input.layui-input {
    width: 100px!important;
}
</style>