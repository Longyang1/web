<template>
    <div class="user-main" style="height: 100%;overflow-y: auto;padding: 10px">
        <layui-form>
            <layui-item>
                <layui-inline-select
                    label="调整后级别"
                    v-model="minLevel"
                    :items="levels"></layui-inline-select>
                <layui-inline-date
                    label="调整后级别开始时间"
                    name="level-start-time"
                    v-model="startTime"></layui-inline-date>
            </layui-item>
        </layui-form>
                                        
        <pagination-simple 
            url="./personnel/personnels"
            :otherParam="otherParam"
            @handleSearchResult='handleSearchResult'
            :showPage='false'
            type="3">
            <template slot="main">
                <div class="user-main layui-row layui-col-space1">
                    <div class="layui-col-xs12 user-list">
                        <table class="footable table table-stripped">
                            <thead>
                                <tr>
                                    <th width="60px">序号</th>
                                    <th>姓名</th>
                                    <th>现行员级别</th>
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
                                        <td>{{ item.currentLevelDict }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </pagination-simple>
        <div class="layui-form-item layui-layout-admin">
            <div class="layui-input-block">
                <div class="layui-footer" style="text-align: center;width: 100%;left: 0">
                    <button class="layui-btn layui-btn-lg layui-btn-blue" @click="levelAdjustment"><i class="fa fa-level-up"></i> 调整</button>
                    <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from "@/api/dict";
import BaseModal from "@/views/base/BaseModal"
import { get, levelAdjustment } from '@/api/personnel/personnel'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelLevelAdjustment',
    extends: BaseModal,
    data() {
        return {
            page: {
                
            },
            otherParam: {
                personnelId: this.personnelIds.join(','),
                pageNo: 1,
                pageSize: this.personnelIds.length,
            },
            minLevel: '',
            startTime: formatDate(new Date().getTime(), 'YYYY-MM-DD'),
            levels: [],
        };
    },
    props: {
        personnelIds: {
            type: Array,
            default: [-1]
        },
        layerid: {
            type: String,
            default: ''
        }
    },
    computed: {

    },
    mounted() {
        getDicts('PERSONNEL_LEVEL_DICT').then(result => {
            var data = result.data;
            if (data) {
                this.levels = data[0] || [];
            }
        });
    },
    methods: {
        handleSearchResult: function(data) {
            if (data) {
                this.page = data.page || {};
                this.page.list = data.personnels || [];
                if (this.page.list) {
                    var minLevel = 14;
                    this.page.list.forEach(element => {
                        var currentLevel = element.currentLevelDict;
                        if (currentLevel && Number(currentLevel) < minLevel) {
                            minLevel = currentLevel;
                        }
                    });
                    this.minLevel = minLevel - 1;
                }
            } else {
                this.page = {};
            }
        },
        levelAdjustment: function() {
            var names = [];
            this.page.list.forEach(ele => {
                names.push(ele.name);
            });
            confirm("确定调整行员（" + names.join("，") + "）级别吗？", () => {
                levelAdjustment(this.personnelIds.join(','), this.minLevel, this.startTime).then(res => {
                    alert(res.msg);
                    this.$parent.$refs.pagination.refresh();
                    this.$layer.close(this.layerid);
                });
            });
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