<template>
    <div class="user-main" style="height: 100%;overflow-y: auto;padding: 10px">
        <div class="user-main layui-row layui-col-space1">
            <div class="layui-col-xs12 user-list">
                <table class="footable table table-stripped">
                    <thead>
                        <tr>
                            <th width="60px">序号</th>
                            <th>级别</th>
                            <th>开始时间</th>
                            <th>结束时间</th>
                        </tr>
                    </thead>
                    <tbody class="footable_table">
                        <template v-for="(item, index) in hiLevels">
                            <tr 
                                :class="{'footable-even': index % 2 === 0,'footable-odd': index % 2 !== 0}" 
                                style="display: table-row;"
                                :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.level }}</td>
                                <td>{{ item.startTime | moment('YYYY-MM-DD') }}</td>
                                <td>{{ item.endTime | moment('YYYY-MM-DD') }}</td>
                            </tr>
                        </template>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from "@/api/dict";
import BaseModal from "@/views/base/BaseModal"
import { getPersonnelHiLevelInfos } from '@/api/personnel/personnel'

export default {
    name: 'HiLevelList',
    extends: BaseModal,
    data() {
        return {
            hiLevels: [],
        };
    },
    props: {
        personnelId: {
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
        getPersonnelHiLevelInfos(this.personnelId).then(res => {
            this.hiLevels = res.data || [];
        });
    },
    methods: {
        
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