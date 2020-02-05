<template>
    <div class="user-main" style="height: 100%;overflow-y: auto;padding: 10px">
        <layui-form>
            <layui-item style="padding-top: 15px">
                <layui-inline-input
                    label="现岗位" 
                    placeholder="现岗位"
                    :value="curJob"></layui-inline-input>
            </layui-item>
            <layui-item>
                <layui-inline-select
                    label="调整后岗位"
                    v-model="job"
                    valKey="jobCode"
                    labelKey="jobName"
                    :items="personnelJobManages"></layui-inline-select>
            </layui-item>
            <layui-item>
                <layui-inline-date
                    label="调整后岗位开始时间"
                    v-model="jobStartTime"
                    name="jobStartTime"></layui-inline-date>
            </layui-item>
        </layui-form>
                                        
        <div class="layui-form-item layui-layout-admin">
            <div class="layui-input-block">
                <div class="layui-footer" style="text-align: center;width: 100%;left: 0">
                    <button class="layui-btn layui-btn-lg layui-btn-blue" @click="jobAdjustment"><i class="fa fa-level-up"></i> 调整</button>
                    <button @click="close" class="layui-btn layui-btn-lg layui-btn-red"><i class="fa fa-times"></i> 关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from "@/api/dict";
import BaseModal from "@/views/base/BaseModal"
import { get, jobAdjustment } from '@/api/personnel/personnel'
import { getPersonnelJobManages } from '@/api/personnel/personnelJobManage'
import { formatDate } from '@/utils/formatUtils'

export default {
    name: 'PersonnelJobAdjustment',
    extends: BaseModal,
    data() {
        return {
            personnelJobManages: [],
            curJob: '',
            job: '',
            jobStartTime: formatDate(new Date().getTime(), 'YYYY-MM-DD'),
        };
    },
    props: {
        personnelId: {
            type: String,
            default: ''
        },
        userUid: {
            type: String,
            default: ''
        },
        jobCode: {
            type: String,
            default: ''
        },
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
        if (this.jobCode) {
            getPersonnelJobManages({
                jobCode: this.jobCode
            }).then(res => {
                var data = res.data;
                if (data) {
                    var personnelJobManages = Object.assign([], data.personnelJobManages || []);
                    if (personnelJobManages.length > 0) {
                        this.curJob = personnelJobManages[0].jobName;
                    }
                }
            });
        } else {
            this.curJob = '暂无岗位信息';
        }
        getPersonnelJobManages({
            userUid: this.userUid
        }).then(res => {
            var data = res.data;
            if (data) {
                this.personnelJobManages = Object.assign([], data.personnelJobManages || []);
            }
        });         
    },
    methods: {
        jobAdjustment: function() {
            // if (this.curJob == this.job) {
            //     alert("调整的岗位必须与原岗位不同，请重新选择调整后的岗位。");
            //     return;
            // }
            confirm("确定调整行员（" + this.name + "）岗位吗？", () => {
                jobAdjustment(this.personnelId, this.job, this.jobStartTime).then(res => {
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
.user-main /deep/ .layui-form-item {
    text-align: center;
}
</style>