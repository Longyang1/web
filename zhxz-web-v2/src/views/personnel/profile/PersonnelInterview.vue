<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#2b64ce;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">面试情况</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>面试时间</td>
                    <td>面试地点</td>
                    <td>面试小组成员</td>
                    <td>背景调查</td>
                    <td>面试情况</td>
                    <td>综合得分</td>
                    <td>考察结论</td>
                </tr>
                <tr v-for="item in personnelInterviews" :key="item.id">
                    <td>{{ item.interviewTime | moment('YYYY.MM.DD HH:mm') }}</td>
                    <td>{{ item.interviewLocation }}</td>
                    <td>{{ item.interviewPanelMember }}</td>
                    <td>{{ item.backgroundCheck }}</td>
                    <td>{{ item.interviewSituation }}</td>
                    <td>{{ item.score }}</td>
                    <td>{{ item.result }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import * as personnelApi from '@/api/personnel/personnel'
export default {
    name: 'PersonnelInterview',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelInterviews: [],
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelInterviews(this.personnelId).then(res => {
                    this.personnelInterviews = res.data || [];
                });
            }
        }
    }
}
</script>

<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
<style lang="less" scoped>
</style>

