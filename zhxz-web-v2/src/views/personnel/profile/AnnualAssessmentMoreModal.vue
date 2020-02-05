<template>
   <div class="table-box">
        <table class="layui-table" style="text-align: center;margin-bottom: 0;">
            <colgroup>
            </colgroup>
            <thead>
                <tr style="background: #e0f4fb">
                    <th rowspan="2"  style="text-align: center;vertical-align:middle">序号</th>
                    <th rowspan="2"  style="text-align: center;vertical-align:middle">考核年度</th>
                    <th colspan="5"  style="text-align: center;">考核结果</th>
                </tr>
                <tr class="level-tr" style="background: rgb(224, 244, 251);">
                    <th 
                        v-for="item in assessmentResults"
                        style="text-align: center"
                        :key="item.value"><span :class="'color color_' + item.value"></span>{{ item.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(item, index) in personnelAnnualAssessments"
                    :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.assessmentYear }}年</td>
                    <td
                        v-for="itemA in assessmentResults"
                        :class="getResultClass(itemA.value, item.assessmentResultDict)"
                        :key="'a-' + itemA.value">
                        <span v-if="itemA.value == item.assessmentResultDict" :class="'iconfont icon-emoji-copy icon-emoji-copy-' + itemA.value"><span class="level-txt">{{ itemA.label }}</span></span>    
                    </td>

                </tr>
                <tr v-if="personnelAnnualAssessments">
                    <td colspan="2">总计</td>
                    <td v-for="item in assessmentResults" :key="'zj-' + item.value">
                        <span :class="'ccolor_' + item.value">{{ getTjCount(item.value) }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import personnelProfileMixin from "@/mixin/personnelProfileMixin";
import { getPersonnelAnnualAssessments } from "@/api/personnel/personnelAnnualAssessment";
import { del } from "@/api/personnel/personnelTraining";
import { getAttaments } from "@/api/file";
import BaseModal from "@/views/base/BaseModal"

export default {
    name: "AnnualAssessmentMoreModal",
    mixins: [personnelProfileMixin],
    extends: BaseModal,
    data() {
        return {
            assessmentResults: [],
            personnelAnnualAssessments: [],
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        getTjCount: function(r) {
            return this.personnelAnnualAssessments.filter(item => {
                return item.assessmentResultDict == r;
            }).length;
        },
        getResultClass: function(value, assessmentResultDict) {
            if (value == assessmentResultDict) {
                return 'color_' + value;
            }
            return "";
        },
        getPageData: function(pageNo) {
            this.pageNo = pageNo || this.pageNo;
            getPersonnelAnnualAssessments({
                personnelId: this.personnelId,
            }).then(res => {
                var data = res.data;
                this.personnelAnnualAssessments = [];
                if (data) {
                    this.personnelAnnualAssessments = data.personnelAnnualAssessments || [];
                }
            });
        },
        initData: function() {
            if (this.personnelId) {
                this.getPageData();
            }

            getDicts('ASSESSMENT_RESULT_DICT').then(result => {
                var data = result.data;
                if (data) {
                    this.assessmentResults = data[0] || [];
                }
            });
        },
        next: function() {
            var page = this.page;
            if (page && !page.lastPage) {
                this.getPageData(Number(page.pageNo) + 1);
            }
        },
        prev: function() {
            var page = this.page;
            if (page && !page.firstPage) {
                this.getPageData(Number(page.pageNo) - 1);
            }
        }
    }
};
</script>
<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
<style lang="less" scoped>
.content-box {
    width: 100%;
    height: 100%;
    border: 1px solid #dce8fd;
}
.top {
    padding-bottom: 45px;
    border-bottom: 1px dashed #dfe3e8;
}
.top .left_btn {
    padding: 10px 0px 6px 30px;
    float: left;
}
.top .right_btn {
    padding: 10px 30px 6px 30px;
    float: right;
}
.top .mid_text ul li {
    float: left;
    width: 177px;
    height: 40px;
    background: rgba(185, 215, 251, 1);
    border-radius: 0px 0px 10px 10px;
    margin-left: 30px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
}
.middle .middle_text {
    float: left;
    width: 54px;
    height: 26px;
    line-height: 26px;
    text-align: right;
    font-size: 16px;
}
.middle .middle_content:first-child {
    margin-top: 15px;
}
.middle .middle_content {
    margin-bottom: 10px;
    width: 100%;
    height: 26px;
}
.middle .middle_content:last-child {
    margin-bottom: 0;
}
.middle div ul li {
    float: left;
    width: 177px;
    height: 26px;
    border: 1px solid #e6eaef;
    margin-left: 30px;
}
.bottom {
    height: 48px;
}
.bottom .ball {
    margin-left: 30px;
    display: inline-block;
    width: 10px;
    height: 10px;
    background: rgba(0, 171, 240, 1);
    border-radius: 50%;
    margin-right: 5px;
}
.bottom .bottom_text {
    width: 54px;
    height: 26px;
    float: left;
}
.bottom .bottom_content{
    height: 48px;
    line-height: 48px;
}
.bottom .bottom_content .color {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid rgba(204, 204, 204, 1);
    margin-left: 15px;
    margin-right: 5px;
}
.color_A {
    background: rgba(249, 177, 186, 1)!important;
}
.color_B {
    background: rgba(251, 199, 171, 1)!important;
}
.color_C {
    background: rgba(153, 204, 153, 1)!important;
}
.color_D {
    background: #CCCC33!important;
}
.color_E {
    background: rgba(204, 204, 255, 1)!important;
}
.ccolor_A {
    color: rgba(249, 177, 186, 1)!important;
}
.ccolor_B {
    color: rgba(251, 199, 171, 1)!important;
}
.ccolor_C {
    color: rgba(153, 204, 153, 1)!important;
}
.ccolor_D {
    color: #CCCC33!important;
}
.ccolor_E {
    color: rgba(204, 204, 255, 1)!important;
}
.bottom .more {
    /* padding: 8px 10px;
    background: rgba(142, 180, 227, 1); */
    color: #fff;
    float: right;
    margin-right: 86px;
}
.bottom .more span {
    background: rgba(142, 180, 227, 1);
    /* height: 32px; */
    display: inline-block;
    line-height: 32px;
    padding: 2px 10px;
    cursor: pointer;
}
.bottom .color_all {
    /* height: 26px; */
}
span.l-cursor:hover {
    color: #2b64ce;
}
table tr:nth-child(odd) {
    background: #fff;
}
table tr:first-child td {
    background: #fff;
}

.bottom {
    height: 48px;
}
.bottom .ball {
    /* margin-left: 30px; */
    display: inline-block;
    width: 10px;
    height: 10px;
    background: rgba(0, 171, 240, 1);
    border-radius: 50%;
    margin-right: 5px;
}
.bottom .bottom_text {
    width: 54px;
    height: 26px;
    float: left;
}
.bottom .bottom_content{
    height: 48px;
    line-height: 48px;
}
.bottom .bottom_content .color {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid rgba(204, 204, 204, 1);
    margin-left: 15px;
    margin-right: 5px;
}
.level-tr .color {
    display: inline-block;
    width: 12px;
    height: 10px;
    border: 1px solid rgba(204, 204, 204, 1);
    /* margin-left: 15px; */
    margin-right: 5px;
}
.icon-emoji-copy .level-txt {
    font-size: 14px;
    position: relative;
    top: -4px;
}
span.icon-emoji-copy {
    font-size: 26px;
    color: #fff;
}
.layui-table td, .layui-table th {
    position: relative;
    padding: 4px 15px;
    min-height: 28px;
    line-height: 28px;
    font-size: 14px;
    padding-bottom: 0;
}
</style>