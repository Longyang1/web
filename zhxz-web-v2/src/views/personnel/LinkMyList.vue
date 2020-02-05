<template>
    <div class="user-main" style="height: 100%;overflow-y: auto;padding: 10px">
        <pagination-simple 
            url="./personnel/personnels/getNoLinks"
            :otherParam="otherParam"
            @handleSearchResult='handleSearchResult'
            :showSimplePage='true'
            type="3">
            <template slot="main">
                <div class="user-main layui-row layui-col-space1">
                    <div class="layui-col-xs12 user-list">
                        <table class="footable table table-stripped">
                            <thead>
                                <tr>
                                    <th width="60px">序号</th>
                                    <th>姓名</th>
                                    <th>员工ID</th>
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
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.employeeId }}</td>
                                        <td style="color: green"><span v-if="!item.userId" style="cursor: pointer;" @click="link(item.id)">关联</span></td>
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
import BaseModal from "@/views/base/BaseModal"
import { link } from '@/api/personnel/personnel'

export default {
    name: 'LinkMyList',
    extends: BaseModal,
    data() {
        return {
            page: {
                
            },
            otherParam: {
                name: this.name,
                linkStatus: 'n',
                pageNo: 1    
            },
        };
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        layerid: {
            type: String,
            default: ''
        }
    },
    computed: {

    },
    mounted() {
        
    },
    methods: {
        handleSearchResult: function(data) {
            if(data){
                this.page = data.page || {};
                this.page.list = data.personnels || [];
            } else {
                this.page = {};
            }
        },
        link: function(personnelId) {
            confirm("确定关联吗？", () => {

                link(personnelId).then(res => {
                    alert(res.msg);
                    this.$parent.$parent.refreshTabByName('ServiceNavigation');
                    this.$layer.close(this.layerid);
                });
            });
        }
   
    }
};
</script>

<style scoped>
.table > thead > tr > th,td {
  text-align: center;
}
.user-main  /deep/ .layui-input-block .layui-input {
    width: 90%;
}
</style>