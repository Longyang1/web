<template>
    <div ref="box" class="layui-fluid" style="background-color: #f2f2f2;padding-top: 20px;padding-bottom: 20px;height: 100%;">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md4" style="width: 284px;">
                <div class="layui-card" :style="{height: h + 'px'}">
                    <div class="layui-card-header">目录</div>
                    <div class="layui-card-body layui-row layui-col-space10">
                        <file-tree 
                            v-if="!treeReload" 
                            :tparent="this" 
                            @initTreeDataAfter="initTreeDataAfter"
                            :triggerNodeId="curDirId"
                            ref="fileTree"></file-tree>
                    </div>
                </div>
            </div>

            <div class="layui-col-md8" :style="{width: rw + 'px'}">
                <div class="layui-card" :style="{height: h + 'px'}">
                    <div class="layui-card-header">
                        <svg class="icon" aria-hidden="true" style="margin-right: 6px;">
                            <use xlink:href="#icon-wenjian"></use>
                        </svg>
                        <span 
                            v-for="(item, index) in paths"
                            :style="{color: index != paths.length - 1 ? '#303133' : '#97a8be', cursor: index != paths.length - 1 ? 'pointer' : 'text'}"
                            :class="{'path-hover': index != paths.length - 1}"
                            @click="clickDir(item, index)"
                            :key="index">
                            {{ item }}<span v-if="index != paths.length - 1" style="color: #303133"> / </span>
                        </span>
                        <div style="float: right">
                            <button v-authorize="'ROLE_ROLE.FILE.ADMIN'" @click="createDir(null)" class="layui-btn layui-btn-icon layui-btn-primary"><i aria-hidden="true" class="fa fa-plus"></i> 创建目录</button>
                            <button v-authorize="'ROLE_ROLE.FILE.ADMIN'" v-if="curDirId" @click="editDir" class="layui-btn layui-btn-icon layui-btn-primary"><i aria-hidden="true" class="fa fa-edit"></i> 修改目录</button>
                            <button v-authorize="'ROLE_ROLE.FILE.ADMIN'" v-if="curDirId" @click="deleteDir" class="layui-btn layui-btn-icon layui-btn-primary"><i aria-hidden="true" class="fa fa-trash"></i> 删除目录</button>
                            <!-- <button class="layui-btn layui-btn-icon layui-btn-primary"><i aria-hidden="true" class="fa fa-plus"></i> 创建用户组</button>
                            <button class="layui-btn layui-btn-icon layui-btn-primary"><i aria-hidden="true" class="fa fa-plus"></i> 创建用户组</button> -->
                        </div>
                    </div>
                    <div class="layui-card-body layui-row layui-col-space10" style="padding: 0">
                        <sys-file-directory-list :dir-path="curDirPath" :dir-id="curDirId" :start-search="startSearch"></sys-file-directory-list>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Base from "@/views/base/Base"
import FileTree from '@/views/file/FileTree'
import SysFileDirectoryForm from '@/views/file/SysFileDirectoryForm'
import SysFileDirectoryList from '@/views/file/SysFileDirectoryList'
import * as sysFileDirectoryApi from '@/api/file/sysFileDirectory'

export default {
    name: 'FileDirectoryManage',
    extends: Base,
    components: {
        FileTree,
        SysFileDirectoryList
    },
    data() {
        return {
            h: 0,
            rw: 0,
            curDirName: '',
            curDirPath: '',
            curDirId: '',
            curParentId: '',
            startSearch: false,
            treeReload: false,
        }
    },
    computed: {
        paths() {
            return this.curDirId ? this.curDirPath.split(' / ') : [];
        }
    },
    mounted() {
        this.h = this.$refs.box.offsetHeight - 50;
        this.rw = this.$refs.box.offsetWidth - 284 - 16 - 8;
    },
    methods: {
        clickDir(dirName, index) {
            console.log(index)
            var parentLevel = this.paths.length - index - 1;
            if (parentLevel == 0) {
                return;
            }
            this.$refs.fileTree.clickParentNode(this.curDirId, parentLevel);
        },
        initTreeDataAfter: function() {
            this.$nextTick(() => {
                var tree = this.$refs.fileTree.getTree();
                if (tree.nodes.length > 0 && !this.curDirId) {
                    tree.triggerNodeClick(tree.nodes[0].id);
                }
                this.startSearch = true;
            });
        },
        clickNodeAfter: function(node, tree, layid) {
            this.curDirPath = this.$refs.fileTree.getFilePath(node.id);
            this.curDirName = node.name;
            this.curDirId = node.id;
            this.curParentId = (node.getParentNode() || {}).id;
		},
        createDir: function(dirId, title) {
            this.$layer.iframe({
				content: {
					content: SysFileDirectoryForm, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                        dirId,
                        parentId: this.curDirId,
                        parentDirName: this.curDirName
					}
				},
				area: ['740px', 'auto'],
				title: title || "目录创建"
            });
        },
        editDir() {
            this.createDir(this.curDirId, '目录修改');
        },
        deleteDir() {
            confirm("确定删除【" + this.curDirName + "】该目录吗？如果确定删除，其子目录和目录下的文件也将会被删除！", () => {
                sysFileDirectoryApi.del(this.curDirId).then(res => {
                    alert(res.msg);
                    this.curDirId = this.curParentId;
                    this.reloadFileTree();
                });
            }); 
        },
        reloadFileTree(layerid) {
            this.treeReload = true;
            this.$nextTick(() => {
                this.treeReload = false;
            });
            if (layerid) {
                this.$layer.close(layerid);
            }
        }
    }
    
}
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.path-hover:hover {
    color: #1890ff!important;
    cursor: pointer;
}
</style>