<template>
    <div class="user-main" style="height: 100%;overflow-y: auto;padding: 10px">
        <pagination-simple 
            url="./project/projectInfos"
            :otherParam="otherParam"
            @handleSearchResult='handleSearchResult'>
            <template slot="searchBtnBefore">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">项目名称：</label>
                    <div class="layui-input-block">
                        <input type="text" v-model="otherParam.projectName" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">项目编号</label>
                    <div class="layui-input-block">
                        <input type="text" v-model='otherParam.projectNumber' placeholder="输入项目编号" autocomplete="off" class="layui-input">
                    </div>
                </div>
            </template>
            <template slot="main">
                <div class="user-main layui-row layui-col-space1">
                    <div class="layui-col-xs12 user-list">
                        <table class="footable table table-stripped">
                            <thead>
                                <tr>
                                    <th width="60px">序号</th>
                                    <th>项目名称</th>
                                    <th>项目编号</th>
                                    <th>项目类型</th>
                                    <th>项目性质</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody class="footable_table">
                                <template v-for="(item, index) in page.list">
                                    <tr 
                                        :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                        style="display: table-row;"
                                        :key="item.id">
                                        <td>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</td>
                                        <td>{{ item.projectName }}</td>
                                        <td>{{ item.projectNumber }}</td>
                                        <td>{{ projectTypeMap[item.projectTypeDict] }}</td>
                                        <td>{{ projectNatureMap[item.projectNatureDict] }}</td>
                                        <td style="color: green"><span style="cursor: pointer;" @click="trueSelect(item)">选择</span></td>
                                    </tr>
                                </template>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </pagination-simple>
    </div>
</template>

<script>
import { getDicts } from "@/api/dict";

export default {
    data() {
        return {
            projectTypes: [],
            projectNatures: [],
            page: {},
            otherParam: {
                projectName: '',
                projectNumber: null,
                projectStatusDict: 4           
            },
            officeTreeIndex: -1,
            userMap: {},
            officeNameMap: {},
        };
    },
    props: {
    },
    computed: {
        projectNatureMap: function() {
            return this.projectNatures.array2Obj('value', 'label');
        },
        projectTypeMap: function() {
            return this.projectTypes.array2Obj('value', 'label');
        },
    },
    mounted() {
        getDicts("PROJECT_TYPE_DICT,PROJECT_NATURE_DICT").then((result) => {
            var data = result.data;
            if(data) {
                this.projectTypes = data[0] || [];
                this.projectNatures = data[0] || [];
            }
        });
    },
    methods: {
        handleSearchResult: function(data) {
            if(data){
                this.page = data.page || {};
                this.userMap = data.userMap || {};
                this.officeNameMap = data.officeNameMap || {};
            } else {
                this.page = {};
            }
        },
        trueSelect: function(project) {
            this.$parent.selectProjectAfter(project, this.userMap[project.officeContactUserId], this.officeNameMap[project.officeId]);
        }
    }
};
</script>

<style scoped>
.user-main {
}
.table > thead > tr > th,td {
  text-align: center;
}
.layui-form-label {
  /* width: auto; */
}
.user-main  /deep/ .layui-input-block .layui-input {
    width: 90%;
}
</style>



