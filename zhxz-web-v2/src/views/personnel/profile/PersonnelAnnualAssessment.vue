<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">{{ text }}</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit && userType== 2" @click="add(null)" class="iconfont icon-tianjia">添加</span>
        </div>
        <div class="content-box" v-if="hasAnnualAssessment">
            <div :class="{'top': true}" ref="topYearBox">
                <div class="left_btn">
                    <span :class="{'iconfont icon-lefta': true, 'l-cursor': !page.lastPage}" style="font-size: 24px;" @click="next()"></span>
                    <!-- <img :class="{'l-cursor': page.firstPage}" src="/static/images/arrow_left_new.png" @click="next()"> -->
                </div>
                <div class="mid_text">
                    <ul>
                        <li 
                            v-for="(item, index) in personnelAnnualAssessments"
                            :style="{width: (yearTabWidth + 'px')}"
                            :key="index">{{ item.assessmentYear }}年度</li>
                    </ul>
                </div>
                <div class="right_btn">
                    <span :class="{'iconfont icon-righta': true, 'l-cursor': !page.firstPage}" style="font-size: 24px;" @click="prev()"></span>
                    <!-- <img :class="{'l-cursor': page.lastPage}"  src="/static/images/arrow_right_right.png" @click="prev()"> -->
                </div>
            </div>
            <div class="middle">
                <div 
                    v-for="item in assessmentResults"
                    class="middle_content"
                    :key="item.value">
                    <div class="middle_text">
                        <span :class="'iconfont icon-emoji-copy icon-emoji-copy-' + item.value"></span>
                    </div>
                    <div class="assessment">
                        <ul>
                            <li 
                                v-for="(itemA, index) in personnelAnnualAssessments"
                                :style="{width: (yearTabWidth + 'px'), 'text-align': 'center', 'line-height': '26px'}"
                                :class="getResultClass(item.value, itemA.assessmentResultDict)"
                                @contextmenu.prevent="rightShow($event, index, item.value == itemA.assessmentResultDict)"
                                :key="'a-' + index">
                                <span v-if="item.value == itemA.assessmentResultDict" :class="'iconfont icon-emoji-copy icon-emoji-copy-' + item.value">
                                    <span class="level-txt">{{ item.label }}</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom_content">
                    <div class="bottom_text"></div>
                    <div class="color_all">
                        <span class="ball"></span>说明：考核结果一共分为五档：
                        <span class="color color_A"></span>优秀
                        <span class="color color_B"></span>良好
                        <span class="color color_C"></span>称职
                        <span class="color color_D"></span>需改进
                        <span class="color color_E"></span>不称职
                        <div class="more">
                            <span @click="showMore">查看更多>></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="contextmenu.show" class="m-easyui-menu menu-top menu" :style="{left: contextmenu.pageX + 'px', top: contextmenu.pageY + 'px','z-index': 110025, overflow: 'hidden', height: 'auto'}">
			<div @click="edit()" iconcls="fa fa-pencil-square-o" class="menu-item">
                <div class="menu-text">编辑</div>
            </div>
            <div @click="del()" iconcls="fa fa-trash-o" class="menu-item">
                <div class="menu-text">删除</div>
            </div>
		</div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import personnelProfileMixin from "@/mixin/personnelProfileMixin";
import { getPersonnelAnnualAssessments, del } from "@/api/personnel/personnelAnnualAssessment"
import AnnualAssessmentMoreModal from "@/views/personnel/profile/AnnualAssessmentMoreModal"
import { getAttaments } from "@/api/file";
import Base from "@/views/base/Base"
import bus from '@/assets/js/event.js'
import PersonnelAnnualAssessmentForm from '@/views/personnel/profile/PersonnelAnnualAssessmentForm'

export default {
    name: "PersonnelAnnualAssessment",
    mixins: [personnelProfileMixin],
    extends: Base,
    data() {
        return {
            currentData: [],
            assessmentResults: [],
            personnelAnnualAssessments: [],
            pageNo: 1,
            page: {},
            yearTabWidth: 154,
            hasAnnualAssessment: true,
            contextmenu: {
                annualAssessmentIndex: '',
                pageY: 0,
                pageX: 0,
                show: false
            },
        };
    },
    mounted() {
        this.initData();

        this.$nextTick(() => {
            this.resizeYearTabWidth();
        });

        bus.$on('panelExpandAfter', () => {
            this.resizeYearTabWidth();
        });

        bus.$on('panelCollapseAfter', () => {
            this.resizeYearTabWidth();
        });

        this.globalClick((e) => {
            bus.$emit('contextmenuClose', this);
            bus.$emit('selectClose', this);
            if (this.contextmenu.show) {
                this.$set(this.contextmenu, 'show', false);
            }
        });
    },
    methods: {
        rightShow: function(e, index, canShow = true) {
            if (!canShow) {
                return;
            }
            if (this.userType != 2) {
                return;
            }
            this.$set(this.contextmenu, 'pageX', e.pageX - 330 + 140);
            this.$set(this.contextmenu, 'pageY', e.pageY - 180 + 120);
            this.$set(this.contextmenu, 'annualAssessmentIndex', index);
            this.$set(this.contextmenu, 'show', true);
        },
        resizeYearTabWidth: function() {
            if (this.$refs.topYearBox) {    
                var w = this.$refs.topYearBox.offsetWidth;
                var sw = w - 85 * 2 - 4 * 30;
                this.yearTabWidth = sw / 5;
            } 
        },
        showMore: function() {
            this.$layer.iframe({
                content: {
                    content: AnnualAssessmentMoreModal, //传递的组件对象
                    parent: this, //当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                    }
                },
                area: ["1000px", ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
                title: '年度考核'
            });
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
                pageSize: 5,
                pageNo: this.pageNo
            }).then(res => {
                var data = res.data;
                this.personnelAnnualAssessments = [];
                if (data) {
                    this.page = Object.assign({}, data.page || {}); 
                    this.personnelAnnualAssessments = data.personnelAnnualAssessments || [];
                }
                this.hasAnnualAssessment = this.personnelAnnualAssessments.length > 0;
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
        },
        add: function (personnelAnnualAssessmentId, title) {
            this.$layer.iframe({
                content: {
                    content: PersonnelAnnualAssessmentForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelAnnualAssessmentId: (personnelAnnualAssessmentId || null),
                    }
                },
                area:['730px', 'auto'],
                title: title || "年度考核添加"
			});
        },
        edit() {
            let index = this.contextmenu.annualAssessmentIndex;
            let annualAssessment = this.personnelAnnualAssessments[index];
            if (!annualAssessment) {
                msg("编辑失败");
                return;
            }
            this.add(annualAssessment.id, '年度考核编辑');
        },
        del() {
            let index = this.contextmenu.annualAssessmentIndex;
            let annualAssessment = this.personnelAnnualAssessments[index];
            if (!annualAssessment) {
                msg("删除失败");
                return;
            }
            let { id, assessmentYear} = annualAssessment;
            confirm("确定删除" + assessmentYear + "年度的考核记录吗？", () => {
                del(id).then(res => {
                    this.refreshComp();
                    alert(res.msg)
                });
            });
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
    font-size: 14px;
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
.icon-emoji-copy-A {
    color: rgba(249, 177, 186, 1);
}
.color_B {
    background: rgba(251, 199, 171, 1)!important;
}
.icon-emoji-copy-B {
    color: rgba(251, 199, 171, 1);
}
.color_C {
    background: rgba(153, 204, 153, 1)!important;
}
.icon-emoji-copy-C {
    color: rgba(153, 204, 153, 1);
}
.color_D {
    background: #CCCC33!important;
}
.icon-emoji-copy-D {
    color: #CCCC33;
}
.color_E {
    background: rgba(204, 204, 255, 1)!important;
}
.icon-emoji-copy-E {
    color: rgba(204, 204, 255, 1);
}
.assessment .icon-emoji-copy {
    color: #fff;
}
.assessment .icon-emoji-copy .level-txt {
    font-size: 14px;
    position: relative;
    top: -4px;
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
span.icon-emoji-copy {
    font-size: 26px;
}
.menu-text {
    padding-left: 8px;
    padding-right: 8px;
}
</style>