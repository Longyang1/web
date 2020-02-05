<template>
    <div class="tab-background float-e-margins">
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-sm-12">
                    <div class="float-e-margins">
                        <div id="center">
                            <pagination
                                v-if="startSearch"
                                :url="'./file/sysFileDirectorys'"
                                :titles="titles"
                                :paramNames="paramNames"
                                :dicts="dicts"
                                :otherParam="otherParam"
                                @handleSearchResult="handleSearchResult"
                                :autoSearch="true"
                                ref="pagination">
                                <template slot="searchBtnBefore">
                                    <!-- <span class="title title-text">所在目录：</span>
                                    <input style="width: 180px" type="text" v-model="this.dirPath" :readonly='true'> -->
                                    <span class="title title-text">标题：</span>
                                    <input style="width: 180px" type="text" v-model="otherParam.title" placeholder="请输入标题">
                                    <span class="title title-text">上传人：</span>
                                    <select-user-input style="width: 95px;display: inline;" type="simple" v-model="otherParam.createBy" placeholder="请选择上传人"></select-user-input>
                                    <span class="title title-text">上传时间：</span>
                                    <layui-date
                                        class="date"
                                        v-model="otherParam.beginDate"
                                        name="sfd-startTime"
                                        format="yyyy/MM/dd"
                                        style="display:inline-block;padding-left: 6px;"></layui-date>
                                    至
                                    <layui-date
                                        class="date"
                                        v-model="otherParam.endDate"
                                        name="sfd-endTime"
                                        format="yyyy/MM/dd"
                                        style="display:inline-block;padding-left: 8px;"></layui-date>
                                </template>
                                <template slot="opera">
                                    <button v-if="dirId" @click="openUploadModal()" class="layui-btn layui-btn-icon layui-btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;上传</button>
                                </template>
                                <template slot="main">
                                    <table class="footable table table-stripped">
                                        <thead>
                                            <tr>
                                                <th width="5%" style="text-align:center;">序号</th>
												<th style="text-align:center;">标题</th>
												<th style="text-align:center;">描述</th>
												<th style="text-align:center;">创建人</th>
                                                <th style="text-align:center;">上传时间</th>
                                                <th style="text-align:center;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="meetingTbody" class="footable_table">
                                            <template v-for="(item, index) in page.list">
                                                <tr 
                                                    :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                                    style="display: table-row;"
                                                    :key="item.id">
                                                    <td width="5%" style="text-align:center;">{{ (page.pageNo - 1) * page.pageSize + index + 1  }}</td>
													<td style="text-align:center;"><span @click="edit(item, true)" class="l-cursor" :style="{color: 'rgb(30, 159, 255)'}">{{ item.title }}</span></td>
													<td style="text-align:center;">{{ item.remark }}</td>
													<td style="text-align:center;">{{ userMap[item.createBy] }}</td>
                                                    <td style="text-align:center;">{{ item.createDate | moment }}</td>
                                                    <td style="text-align:center;">
                                                        <a v-if="curUser.userId == item.createBy" @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>修改</a>
                                                        <a v-if="curUser.userId != item.createBy" @click="edit(item, true)" style="margin-right:10px"><i class="fa fa-wrench" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>查看</a>
                                                        <a v-if="curUser.userId == item.createBy" @click="del(item)" class="delete_a"><i class="fa fa-cut" style="font-size: 10px;color: #23b7e5;margin-right:5px;"></i>删除</a>
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
import { del } from '@/api/file/sysFileDirectory'
import Base from "@/views/base/Base"
import FileUploadModal from '@/views/file/FileUploadModal'

export default {
	name: 'SysFileDirectoryList',
	extends: Base,
    data () {
        return {
            titles: [],
            dicts: [],
            paramNames: [],
            otherParam: {
                title: '',
                parentId: '',
                type: '1',
                createBy: ''
            },
            refresh: true,
            page: {

            },
            dirNameMap: {},
            userMap: {},
        }
    },
    props: {
        dirPath: {
            type: String,
            default: ''
        },
        dirId: {
            type: String,
            default: ''
        },
        startSearch: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        dirId() {
            this.$set(this.otherParam, 'parentId', this.dirId);
            this.dirNameMap[this.dirId] = this.dirName;
        }
    },
    computed: {
    	//
        //linkageTypeMap: function() {
        //    return this.dicts[0].array2Obj('value', 'label');
        //}
        //
    },
    mounted () {
        this.initData();
    },
    methods: {
        resetSearchBefore() {
            this.$parent.curDirId = '';
            this.$parent.initTreeDataAfter();
        },
        uploadAfter: function(isAdd, layerid) {
            if (isAdd) {
                this.$refs.pagination.gotoPage(1);
            } else {
                this.$refs.pagination.refresh();
            }
            this.$layer.close(layerid);
        },
        openUploadModal: function(item) {
            this.$layer.iframe({
				content: {
					content: FileUploadModal, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                        multipleFile: 'y',
                        parentId: this.dirId,
                        id: (item || {}).id
					}
				},
				area: ['600px', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: ((item ? (item.createBy == this.curUser.userId ? "信息修改" : "信息查看") : "文件上传") + "（" + this.dirPath + "）")
            });
        },
        initData: function() {
            getDicts('').then(result => {
            	//
                //var linkageTypes = result.data[0];
                //linkageTypes.unshift({
                //    label: "全部",
                //    selected: 1,
                //    value: ""
                //});
                //this.dicts.push(linkageTypes);
                //
            });
        },
        handleSearchResult: function(data){
            this.page = data.page || {};
            this.page['list'] = data.sysFileDirectorys || [];
            this.userMap = data.userMap || {};
        },
        create: function() {
         	this.$parent.closeTabByName('SysFileDirectoryForm');
            this.$parent.clickMenu({
                "checked": false,
                "icon": "fa-legal",
                "id": "sysFileDirectory",
                "name": "SysFileDirectoryForm",
                "parentId": "4",
                "text": "XX创建",
                "children": [

                ]
            }, 3);
        },
        edit: function(sysFileDirectory) {
         	this.openUploadModal(sysFileDirectory);
        },
        del: function(sysFileDirectory) {
            confirm('确定删除该记录吗？', () => {
                del(sysFileDirectory.id).then(result => {
                    alert("删除成功");
                    this.$refs.pagination.refresh();
                });
            });
        }
    }
}
</script>

<style scoped>
.tab-background /deep/ .search-condition-row > div input {
    width: 95px !important;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ced2d7;
}
.tab-background /deep/ .search-condition-row .date input {
    width: 90px !important;
}
</style>