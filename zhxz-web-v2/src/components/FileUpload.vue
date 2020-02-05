<template>
    <div>
        <layui-fieldset v-show="!customTitle" :id="id" :label="label">
            <i v-show="canUpload && !readonly" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>
            <template slot="main">
                <div class="cont-task-div">
                    <div class="row attachment-list">
                        <div v-if="type == 1" class="col-sm-12">
                            <div
                                v-for="(attaInfo, index) in attachments" 
                                :key="attaInfo.sort"
                                class="file-box"
                                v-dragging="{ item: attaInfo, list: attachments, group: 'attachments' }">
                                <div class="file">
                                    <a href="javascript:;">
                                        <span class="corner"></span>
                                        <div class="icon" @click="preview(attaInfo)">
                                            <i :class="getFileIcon(attaInfo.attachmentName)"></i>
                                        </div>
                                        <div class="file-name" @click="preview(attaInfo)">
                                            <!-- <p>业务需求与流程梳理</p> -->
                                            <p :title="attaInfo.attachmentName">{{ attaInfo.attachmentName }}</p>
                                            <p>上传者：{{ userMap[attaInfo.createBy] }}</p>
                                            <small>上传时间：{{ attaInfo.createDate | moment('YYYY-MM-DD') }}</small>
                                        </div>
                                        <div style="background-color: #f8f8f8;padding-left: 10px;padding-bottom: 6px;padding-right: 10px;">
                                            <button 
                                                :class="{'layui-btn layui-btn-radius file-btn': true, 'layui-btn-disabled': attaInfo.status != 4}"
                                                @click.stop="upload(attaInfo)">重传</button>
                                            <button
                                                v-if="curUser.userId == attaInfo.createBy && !readonly"
                                                :class="{'layui-btn layui-btn-danger layui-btn-radius file-btn': true, 'layui-btn-disabled': (!canDelete || attaInfo.status == 5)}"
                                                @click.stop="del(attaInfo, index)">删除</button>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div v-if="type == 2" class="col-sm-12">
                            <table class="footable table table-stripped" lay-even="" lay-skin="row">
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <slot name="custom-th"></slot>
                                        <th width="140">文件大小</th>
                                        <th width="140">上传者</th>
                                        <th v-if="false">备注</th>
                                        <th v-if="!readonly" width="120">状态</th>
                                        <th v-if="!readonly" width="160">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(attaInfo, index) in attachments" 
                                        :key="attaInfo.sort"
                                        v-dragging="{ item: attaInfo, list: attachments, group: 'attachments' }">
                                        <td 
                                            @click="preview(attaInfo)"
                                            :title="attaInfo.attachmentName"
                                            class="atta-name"><i :class="getFileIcon(attaInfo.attachmentName)"></i> {{ attaInfo.attachmentName }}</td>
                                        <slot name="custom-td" :atta="attaInfo"></slot>
                                        <td>{{ attaInfo.attachmentSize }}</td>
                                        <td>{{ userMap[attaInfo.createBy] }}</td>
                                        <td v-if="false">
                                            <layui-inline-input 
                                                v-if="!readonly"
                                                placeholder="请输入备注"
                                                :required="false"
                                                v-model="attaInfo.attachmentStatement"></layui-inline-input>
                                            <template v-if="readonly">
                                                {{ attaInfo.attachmentStatement }}
                                            </template>
                                        </td>
                                        <td v-if="!readonly" :class="'file-status-' + attaInfo.status">{{ statusMap[attaInfo.status] }}</td>
                                        <td v-if="!readonly">
                                            <a v-if="attaInfo.status == 4" @click="upload(attaInfo)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>重传</a>
                                            <a v-if="!readonly && canDelete && curUser.userId == attaInfo.createBy && attaInfo.status != 5" @click="del(attaInfo, index)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-if="type == 3" class="col-sm-12">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </template>
        </layui-fieldset>
        
        <template v-if="customTitle && type == 4">
            <span :id="id" class="hidden">
                <i v-if="canUpload && !readonly" ref="uploadIcon" class="fa fa-plus text-warning select-pros hidden" style="font-size: 16px; cursor: pointer;"></i>
            </span>
           
            <table class="file-func-table">
                <tr>
                    <td>序号</td>
                    <td style="width: 250px;">文件类型</td>
                    <td>文件名称</td>
                    <td>文件大小</td>
                    <!-- <td>备注</td>
                    <td>操作</td> -->
                </tr>
                <template v-if="refresh">
                    <template v-for="(item, i) in fileFuncTypes">
                        <tr v-for="(atta, index) in fileFuncAttaMap[item.value]" :key="'fft_' + i + '_' + index">
                            <td>{{ i + index + 1 }}</td>
                            <td v-if="index == 0" :rowspan="fileFuncAttaMap[item.value].length" :class="{'mutil-upload': item.desc.supportMultiFile == 'y'}">
                                <span :class="{'file-type': item.desc.required == 'y'}">{{ item.label }}</span><br><span v-if="canUpload && !readonly && item.desc.supportMultiFile == 'y'" @click="addRow(item.value)" class="iconfont icon-tianjia3" style="color: #f3b014;margin-top: 8px;display: inline-block;" title="添加新行"></span>
                            </td>
                            <!-- {{ fileFuncAttaMap[item.value] ? '重新' : ''}}上传 -->
                            <td>
                                <span class="atta-name" @click="preview(atta)">{{ atta.attachmentName }}</span> 
                                <span 
                                    v-if="canUpload && !readonly"
                                    @click="fileUpload(item.value, item.label, atta.sort)" 
                                    class="fa fa-upload" 
                                    style="color: rgb(43, 100, 206);cursor: pointer;" 
                                    :title="atta.attachmentId ? '重传' : '上传'"></span>
                                <i 
                                    v-if="atta.attachmentId && !readonly && item.desc.supportMultiFile != 'y' && canDelete && curUser.userId == atta.createBy && atta.status != 5"
                                    @click="del(atta, null, true)"  
                                    class="fa fa-trash" 
                                    aria-hidden="true" 
                                    style="width: 15px;color:#e15543;cursor: pointer;"></i>
                                <i 
                                    v-if="!readonly && item.desc.supportMultiFile == 'y' && canDelete && curUser.userId == atta.createBy && atta.status != 5 && fileFuncAttaMap[item.value].length > 1"
                                    @click="del(atta)"  
                                    class="fa fa-trash" 
                                    aria-hidden="true" 
                                    style="width: 15px;color:#e15543;cursor: pointer;"></i>
                            </td>
                            <td>{{ atta.attachmentSize }}</td>
                        </tr>
                    </template>
                </template>
            </table>
        </template>

        <template v-if="customTitle && type != 4">

        </template>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getAttaments, delAttament, downloadAttachment, getFileUploadInitData, convertFile } from '@/api/file'
import { needToConvert } from '@/utils/fileUtils'
import { getDictByTypeValue } from '@/api/dict'
import request from '@/utils/request';
import Base from "@/views/base/Base"

export default {
    extends: Base,
    data () {
        return {
            attachments: [],
            userMap: {},
            statusMap: {
                0: '转换中',
                1: '转换成功',
                2: '转换失败',
                3: '正常',
                4: '上传失败',
                5: '上传中...',
                6: '上传成功'
            },
            fileFuncTypes: [],
            curFileFucnType: "",
            fileFuncAttaMap: {},
            curFileIndex: -1,
        }
    },
    props: {
        id: {
            type: String,
            default: 'f_' + new Date().getTime(),
        },
        attachmentBusinessId: {
            type: String,
            default: null
        },
        attachmentBusinessType: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: '1'
        },
        module: {
            type: String,
            default: 'upload'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        canUpload: {
            type: Boolean,
            default: true
        },
        canDelete: {
            type: Boolean,
            default: true
        },
        label: {
            type: String,
            default: '文件上传'
        },
        notInModal: {
            type: Boolean,
            default: true
        },
        deleteServiceName: {
            type: String,
            default: null
        },
        accept: {
            type: String,
            default: 'file'
        },
        acceptMime: {
            type: String,
            default: '*'
        },
        exts: {
            type: String,
            default: ''
        },
        customTitle: {
            type: Boolean,
            default: false
        },
        fileFuncTypePrefix: {
            type: String,
            default: ''
        },
        needConvert: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        curUser() {
            return this.$store.state.user.user || {};
        },
        // attachmentIds() {
        //     var attachmentIds = [];
        //     this.attachments.forEach(atta => {
        //         if (atta.attachmentId) {
        //             attachmentIds.push(atta.attachmentId);
        //         }
        //     });
        //     return attachmentIds;
        // }
    },
    watch: {
        attachmentBusinessId: function() {
            this.initData();
        },
        attachments: function () {
            this.fileFuncAttaMap = {};
            this.attachments.forEach(ele => {
                var fileFunctionType = ele.fileFunctionTypeDict;
                var attas = this.fileFuncAttaMap[fileFunctionType] || [];
                if (!ele.attachmentId || attas.indexOf(ele.attachmentId, 'attachmentId') == -1) {
                    attas.push(ele);
                    this.fileFuncAttaMap[fileFunctionType] = attas;
                }
                
            });
            // Object.assign({}, this.attachments.array2Obj('fileFunctionTypeDict'));
            this.$emit("getAttachmentSize", this.attachments.length);
            console.log(this.fileFuncAttaMap);
        },
        'canUpload': function() {
            // this.layuiInit();
        }
    },
    mounted () {
        this.initData();
        this.$nextTick(() => {
            this.layuiInit();
        });
        var user = {};
        user[this.curUser.userId] = this.curUser.realName;
        Object.assign(this.userMap, user);
    },
    methods: {
        addRow: function(fileFuncType) {
            var attas = this.attachments;
            attas.push({
                attachmentBusinessId: this.attachmentBusinessId,
                attachmentId: null,
                fileFunctionTypeDict: fileFuncType,
                sort: (attas[attas.length - 1].sort + 1),
                createBy: this.curUser.userId,
            });
            // this.$set(this.fileFuncAttaMap, fileFuncType, attas);
            // this.refresh = false;
            // this.$nextTick(() => {
            //     this.refresh = true;
            // });
        },
        fileUpload: function(fileFuncType, fileFuncName, sort) {

            var attas = this.attachments;
            var index = attas.indexOf(sort, 'sort');
            if (index == -1 || !attas[index].attachmentId) {
                this.curFileFucnType = fileFuncType;
                this.curFileIndex = sort;
                this.$refs.uploadIcon.click();
                return;
            }
            confirm("确定重新上传【" + fileFuncName + "】吗？", () => {
                this.curFileFucnType = fileFuncType;
                this.curFileIndex = sort;
                this.$refs.uploadIcon.click();
            });
        },
        del: function(atta, index, isClearValue) {
            console.log(atta);
            if (!index) {
                index = this.attachments.indexOf(atta.sort, 'sort');
            }
            if (index == -1) {
                alert("删除失败");
                return;
            }
            confirm("确定要删除该文件吗？", () => {
                var atta = this.attachments[index];
                var attachmentId = atta.attachmentId;
                if (attachmentId) {
                    if (!this.deleteServiceName || !atta.attachmentBusinessId) {
                        delAttament(attachmentId).then(result => {
                            if (isClearValue != true) {
                                this.attachments.splice(index, 1);
                            } else {
                                atta = {
                                    attachmentBusinessId: this.attachmentBusinessId,
                                    attachmentId: null,
                                    fileFunctionTypeDict: atta.fileFunctionTypeDict,
                                    sort: atta.sort,
                                    createBy: atta.createBy, 
                                }
                                this.attachments.splice(index, 1, atta);
                            }
                            alert(result.msg);
                        });
                    } else {
                        request.delete(this.deleteServiceName + "/" + this.attachmentBusinessId + "/sysAttachmentInfos/" + attachmentId, {
                            data: {
                                attachmentName: atta.attachmentName
                            }
                        }).then(result => {
                            this.attachments.splice(index, 1);
                            alert(result.msg);
                        }).catch(() => {
    
                        });
                    }
                } else {
                    this.attachments.splice(index, 1);
                    alert("删除成功");
                }
            }, !!atta.attachmentName);
        },
        upload: function(atta) {
            if (atta.status != 4) {
                return;
            }
            atta.obj.upload(atta.sort, atta.file);
        },
        preview: function(atta) {
            if (!atta.attachmentId) {
                alert("未上传成功，无法下载。");
                return;
            }
            var path = atta.attachmentSavePath;
            if (path == "") {
                alert("附件未成功保存，无法下载。");
                return;
            }
            // window.open('/api/file/pub/' + path, '_blank');
            downloadAttachment(atta.attachmentId).then(res => {
                this.download(res);
            }).catch(err => {
                if (err.msg) {
                    alert(err.msg);
                }
                console.log(err);
            });
        },
        getAttamentIds: function() {
            var attachmentIds = [];
            if (this.attachments && this.attachments.length > 0) {
                this.attachments.forEach(atta => {
                    if (atta.attachmentId) {
                        attachmentIds.push(atta.attachmentId);
                    }
                });
            }
            return attachmentIds;
        },
        getAttachmentStatements: function() {
            var attachmentStatements = [];
            this.attachments.forEach(atta => {
                if (atta.attachmentId) {
                    attachmentStatements.push(atta.attachmentStatement);
                }
            });
            return attachmentStatements;
        },
        getFileIcon: function(attachmentName) {
            if (!attachmentName) {
                return 'fa fa-file-o text-danger';
            }
            if (attachmentName.endWith("doc") || attachmentName.endWith("docx")) {
                return 'fa fa-file-word-o text-blue';
            }

            if (attachmentName.endWith("ppt") || attachmentName.endWith("pptx")) {
                return 'fa fa-file-powerpoint-o text-warning';
            }

            if (attachmentName.endWith("xlsx") || attachmentName.endWith("xls")) {
                return 'fa fa-file-excel-o text-green';
            }

            if (attachmentName.endWith("pdf")) {
                return 'fa fa-file-pdf-o text-success';
            }

            if (isImg(attachmentName)) {
                return 'fa fa-file-image-o text-danger';
            }

            return 'fa fa-file-o text-danger';
           
            function isImg() {
                var suffs = ['bmp','jpg','png','tif','gif','pcx','tga','exif','fpx','svg','psd','cdr','pcd','dxf','ufo','eps','ai','raw','WMF','webp'];
                var isImg = false;
                suffs.forEach(suff => {
                    if (attachmentName.endWith(suff)) {
                        isImg = true;
                        return;
                    }
                });
                return isImg;
            }
        },
        initData: function() {
            if (this.attachmentBusinessId && this.attachmentBusinessType && this.fileFuncTypePrefix) {
                getFileUploadInitData(this.attachmentBusinessId, this.attachmentBusinessType, this.fileFuncTypePrefix).then(results => {
                    var data = results[0].data;
                    if (data) {
                        data.remove(this.fileFuncTypePrefix, 'value');
                        this.fileFuncTypes = (data || []);
                    }

                    data = results[1].data;
                    if (data && data.attachmentInfos) {
                        let attachments = [];
                        data.attachmentInfos.forEach((element, index) => {
                            attachments.push({
                                attachmentBusinessId: this.attachmentBusinessId,
                                attachmentId: element.id,
                                attachmentName: element.attachmentName,
                                attachmentSize: element.attachmentSize,
                                attachmentStatement: element.attachmentStatement,
                                attachmentSavePath: element.attachmentSavePath,
                                fileFunctionTypeDict: element.fileFunctionTypeDict,
                                sort: index,
                                status: element.status,
                                createBy: element.createBy,
                                createDate: element.createDate,
                            });
                        });
                       
                        this.attachments = attachments;
                        this.$emit('getAttasAfter', this.attachments);
                        Object.assign(this.userMap, (data.userMap || {}));
                    }

                    this.fileFuncTypes.forEach(ele => {
                        ele.desc = ele.desc ? JSON.parse(ele.desc) : {};
                        var index = this.attachments.indexOf(ele.value, 'fileFunctionTypeDict');
                        if (index == -1) {
                            this.attachments.push({
                                attachmentBusinessId: this.attachmentBusinessId,
                                attachmentId: null,
                                fileFunctionTypeDict: ele.value,
                                sort: (this.attachments.length),
                                createBy: this.curUser.userId,
                            });
                        }
                    });
                });
            } else {
                if (this.attachmentBusinessId && this.attachmentBusinessType) {
                    getAttaments({
                        attachmentBusinessId: this.attachmentBusinessId,
                        attachmentBusinessType: this.attachmentBusinessType
                    }).then(res => {
                        var data = res.data;
                        if (data && data.attachmentInfos) {
                            let attachments = [];
                            data.attachmentInfos.forEach((element, index) => {
                                attachments.push({
                                    attachmentBusinessId: this.attachmentBusinessId,
                                    attachmentId: element.id,
                                    attachmentName: element.attachmentName,
                                    attachmentSize: element.attachmentSize,
                                    attachmentStatement: element.attachmentStatement,
                                    attachmentSavePath: element.attachmentSavePath,
                                    fileFunctionTypeDict: element.fileFunctionTypeDict,
                                    sort: index,
                                    status: element.status,
                                    createBy: element.createBy,
                                    createDate: element.createDate,
                                });
                            });
                            this.attachments = attachments;
                            this.$emit('getAttasAfter', this.attachments);
                            Object.assign(this.userMap, (data.userMap || {}));
                        }
                    });
                }
                
                if (this.fileFuncTypePrefix) {
                    getDictByTypeValue('FILE_FUNCTION_TYPE_DICT', this.fileFuncTypePrefix).then(res => {
                        var data = res.data;
                        if (data) {
                            data.remove(this.fileFuncTypePrefix, 'value');
                            this.fileFuncTypes = (data || []);
                            this.fileFuncTypes.forEach(ele => {
                                ele.desc = ele.desc ? JSON.parse(ele.desc) : {}
                            });
                        }
                    });
                }
            }
            
        },
        layuiInit: function() {

            if (!this.canUpload) {
                return;
            }
            
            var elemId = !this.notInModal ?  ('.vl-notify-content #' + this.id + ' .select-pros') : ("#" + this.id + ' .select-pros');
            var _this = this;
        	layui.use(['element', 'upload'], function(){
        		var element = element
                ,upload = layui.upload;
                var multiple = _this.fileFuncType ? false : true;
                var uploadListIns = upload.render({
                    elem: elemId,
                    url: '/api/file/upload/attachment?module=' + _this.module,
                    accept: _this.accept,
                    acceptMime: _this.acceptMime,
                    exts: _this.exts,
                    multiple: multiple,
                    auto: false,
                    headers: {
                        Authorization: ('Bearer ' + getToken())
                    },
                    data: {
                        fileFunctionTypeDict: () => {
                            return _this.curFileFucnType;
                        },
                        attachmentBusinessId: () => {
                            return _this.attachmentBusinessId;
                        },
                        attachmentBusinessType: () => {
                            return _this.attachmentBusinessType;
                        }
                    },
                    // bindAction: '#testListAction',
                    before: function(obj){
                        var exit = false;
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            var size = file.size;
                            if (size > 100 * 1024 * 1024) {
                                msg("文件大小不能超过100M");
                                exit = true;
                                return;
                            }
                        });
                        if (exit) {
                            return;
                        }
                        // var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        // //读取本地文件
                        // obj.preview(function (index, file, result) {
                        //     console.log("before:" + index);
                        //     if(_this.attachments.indexOf(index, 'sort') == -1){
                        //         _this.attachments.push({
                        //             attachmentName: file.name,
                        //             attachmentSize: 0,
                        //             attachmentSavePath: '',
                        //             fileFunctionTypeDict: _this.curFileFucnType,
                        //             sort: index,// 暂时用于记录文件的ID index
                        //             createDate: new Date().getTime(),
                        //             createBy: _this.curUser.userId,
                        //             obj: obj,
                        //             file: file
                        //         });
                        //     } 
                        // });
                        // return false;
                    },
                    choose: function (obj) {
                        
                        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //读取本地文件
                        obj.preview(function (index, file, result) {
                            console.log("choose:" + index);
                            
                            var fileFuncType = _this.curFileFucnType;
                            var arrIndex = -1;
                            if (!fileFuncType) {
                                arrIndex = _this.attachments.indexOf(index, 'sort');
                            } else {
                                arrIndex = _this.attachments.indexOf(fileFuncType, 'fileFunctionTypeDict');
                            }
                            if(arrIndex == -1) {
                                _this.attachments.push({
                                    attachmentBusinessId: null,
                                    attachmentId: null,
                                    attachmentName: file.name,
                                    attachmentStatement: '',
                                    attachmentSavePath: '',
                                    fileFunctionTypeDict: _this.curFileFucnType,
                                    dirName: '',
                                    sort: index,// 暂时用于记录文件的ID index
                                    status: 5,
                                    createBy: _this.curUser.userId,
                                    createDate: new Date().getTime(),
                                    obj: obj,
                                    file: file
                                });
                                obj.upload(index, file);
                            } else if(fileFuncType) {
                                obj.upload(index, file);
                            }
                        });
                        return false;
                    },
                    done: function (res, index, upload) {
                        
                        if (res.status == 200) { //上传成功
                            alert(res.msg);
                            var fileFuncType = res.data.fileFunctionTypeDict;
                            var arrIndex = -1;
                            var attachments = _this.attachments;
                            
                            if (!fileFuncType) {
                                arrIndex = _this.attachments.indexOf(index, 'sort');
                            } else {
                                // arrIndex = _this.attachments.indexOf(fileFuncType, 'fileFunctionTypeDict');
                                // var ftypeIndex = _this.fileFuncTypes.indexOf(fileFuncType, 'value');
                                // if (_this.fileFuncTypes[ftypeIndex].desc.supportMultiFile == 'y') {
                                //     attachments = _this.fileFuncAttaMap[fileFuncType];
                                //     arrIndex = _this.curFileIndex;
                                // }
                                arrIndex =  _this.attachments.indexOf(_this.curFileIndex, 'sort');;
                            }
                            
                            if (arrIndex != -1) {
                                var attachment =  attachments[arrIndex];
                                attachment.attachmentId = res.data.attachmentId;
                                _this.$emit("uploadAfter", attachment.attachmentId);
                                attachment.attachmentName = res.data.attachmentName;
                                attachment.attachmentSize = res.data.attachmentSize;
                                attachment.attachmentSavePath = res.data.path;
                                attachment.fileFunctionTypeDict = res.data.fileFunctionTypeDict;
                                attachment.status = 6;
                                _this.$set(_this.attachments, arrIndex, attachment);
                                
                            }
                            // 转换
                            if(res.data && _this.needConvert && needToConvert(res.data.path)) {
                                convertFile(res.data.attachmentId).then(result => {
                                    // 转换中 ---
                                    var attachment =  attachments[arrIndex];
                                    attachment.status = 0;
                                    _this.$set(_this.attachments, arrIndex, attachment);
                                });
                            }
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        } else {
                            alert(res.msg);
                        }
                        this.error(index, upload);
                    },
                    error: function (index, upload) {
                        var arrIndex = _this.attachments.indexOf(index, 'sort');
                        if(arrIndex != -1){
                            var attachment =  _this.attachments[arrIndex];
                            attachment.status = 4;
                            _this.$set(_this.attachments, arrIndex, attachment);
                        }
                    }
                });
        	});

        }
    }
}
</script>

<style scoped>
/* FILE MANAGER */

.file-box {
    float: left;
    width: 220px;
}

.file-manager h5 {
    text-transform: uppercase;
}

.file-manager {
    list-style: none outside none;
    margin: 0;
    padding: 0;
}

.folder-list li a {
    color: #666666;
    display: block;
    padding: 5px 0;
}

.folder-list li {
    border-bottom: 1px solid #e7eaec;
    display: block;
}

.folder-list li i {
    margin-right: 8px;
    color: #3d4d5d;
}

.category-list li a {
    color: #666666;
    display: block;
    padding: 5px 0;
}

.category-list li {
    display: block;
}

.category-list li i {
    margin-right: 8px;
    color: #3d4d5d;
}

.category-list li a .text-navy {
    color: #23b7e5;
}

.category-list li a .text-primary {
    color: #1c84c6;
}

.category-list li a .text-info {
    color: #23c6c8;
}

.category-list li a .text-danger {
    color: #EF5352;
}

.category-list li a .text-warning {
    color: #F8AC59;
}

.file-manager h5.tag-title {
    margin-top: 20px;
}

.tag-list li {
    float: left;
}

.tag-list li a {
    font-size: 10px;
    background-color: #f0f3f4;
    padding: 5px 12px;
    color: inherit;
    border-radius: 2px;
    border: 1px solid #e7eaec;
    margin-right: 5px;
    margin-top: 5px;
    display: block;
}

.file {
    border: 1px solid #e7eaec;
    padding: 0;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 20px;
    margin-right: 20px;
}

.file-manager .hr-line-dashed {
    margin: 15px 0;
}

.file .icon,
.file .image {
    height: 100px;
    overflow: hidden;
}

.file .icon {
    padding: 15px 10px;
    text-align: center;
    width: 100%;
}

.file-control {
    color: inherit;
    font-size: 11px;
    margin-right: 10px;
}

.file-control.active {
    text-decoration: underline;
}

.file .icon i {
    font-size: 70px;
    color: #dadada;
}

.file .file-name {
    padding: 10px;
    background-color: #f8f8f8;
    border-top: 1px solid #e7eaec;
}

.file-name small {
    color: #676a6c;
}

.corner {
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    line-height: 0;
    border: 0.6em solid transparent;
    border-right: 0.6em solid #f1f1f1;
    border-bottom: 0.6em solid #f1f1f1;
    right: 0em;
    bottom: 0em;
}

a.compose-mail {
    padding: 8px 10px;
}

.mail-search {
    max-width: 300px;
}
.cont-task-div .attachment-list{
    /* padding: 10px 5px; */
}
.attachment-list .file-box{
    width:183px;
}
.attachment-list .file-name{
    font-size: 12px;
}
/* COLORS */
.file .icon i.text-success {
    color: #009688;
}
.file .icon i.text-info {
    color: #01aaed;
}
.file .icon i.text-warning {
    color: #f8ac59;
}
.file .icon i.text-danger {
    color: #ed5565;
}
.file .icon i.text-blue{
    color: #1e9fff;
}
.file .icon i.text-yellow{
    color: #ffb800;
}
.file-name p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.col-sm-12 {
    padding-left: 0px;
    padding-right: 0px;
}

.file-status-3, .file-status-6 {
    color: rgb(95, 184, 120);
}
.file-btn {
    height: 24px;
    line-height: 24px;
    padding: 0px 16px;
}
.table > thead > tr > th, td {
    text-align: center;
}
.table > tbody > tr > td {
    padding: 4px;
}
table .layui-input, table /deep/ .layui-input, .layui-select, .layui-textarea {
    height: 30px;
}
.atta-name:hover {
    color: #009688;
    cursor: pointer;
}
.file-func-table {
    width: 100%;
    font-size: 14px;
    color: #333333;
    text-align: center;
} 
.file-func-table  tr td {
    height: 34px;
    border: 1px solid #bee3f1;
}
.file-func-table tr:first-child td {
    background: #e0f4fb;
}
.file-func-table tr:nth-child(odd){background:#f3f3f3;}
.file-func-table span {
    cursor: pointer;
}
td.mutil-upload {
    padding: 8px 4px;
}
span.file-type:after {
    content: '*';
    /* position: absolute; */
    right: 20px;
    top: 10px;
    color: red;
}
.text-green {
    color: green!important;
}
</style>


