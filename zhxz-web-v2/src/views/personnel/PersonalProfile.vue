<template>
    <div id="personnelroot" class="view-product personnelroot" ref="content">
        <div class="wrapper wrapper-content">
            <div class="row" style="padding-top: 24px;padding-left: 30px;margin-bottom: 24px;margin-right: 30px;display: flex">
                <div class="box" style="padding-left: 0px;padding-right: 0px;margin-right: 10px;flex: 1">
                    <template v-for="(item, i) in userCompsInfo[userType]">
                        <component 
                            :id="item.name" 
                            :key="i" 
                            v-bind:is="item" 
                            :comIndex='i + 1' 
                            :personnelId='personnelId'
                            :userType="userType"
                            :canEdit="canEdit"
                            :icon="compInfo[item.name].icon"
                            :text="compInfo[item.name].text"></component>
                    </template>
                </div> 
                <div class="box" style="width: 220px;border: none">
                    <ul>
                        <li 
                            v-for="(item, i) in userCompsInfo[userType]" 
                            :class="{active: activeIndex == i}" 
                            @click="rightMenuClick(i)"
                            :key="'menu_' + i">
                            <i :class="'iconfont ' + compInfo[item.name].icon"></i> {{ compInfo[item.name].text }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- <button @click="exportPersonnel(personnelId)" type="button" class="layui-btn kb" title="个人简历下载">
            <i class="iconfont icon-download" style="color:#007fff"></i>
        </button> -->
    </div>
</template>

<script>
import Personnel from '@/views/personnel/profile/Personnel'
import PersonnelFamily from '@/views/personnel/profile/PersonnelFamily'
import PersonnelInterview from '@/views/personnel/profile/PersonnelInterview'
import PersonnelLearningExperience from '@/views/personnel/profile/PersonnelLearningExperience'
import PersonnelProjectExperience from '@/views/personnel/profile/PersonnelProjectExperience'
import PersonnelWorkExperience from '@/views/personnel/profile/PersonnelWorkExperience'
import PersonnelWrittenExamination from '@/views/personnel/profile/PersonnelWrittenExamination'
import PersonnelCertification from '@/views/personnel/profile/PersonnelCertification'
import PersonnelTraining from '@/views/personnel/profile/PersonnelTraining'
import PersonnelRewardPunishment from '@/views/personnel/profile/PersonnelRewardPunishment'
import PersonnelHiJobInfo from '@/views/personnel/profile/PersonnelHiJobInfo'
import PersonnelAnnualAssessment from '@/views/personnel/profile/PersonnelAnnualAssessment'
import Base from "@/views/base/Base"
import { exportPersonInfo } from '@/api/personnel/personnel'

export default {
    name: 'PersonnelProfile',
	extends: Base,
    components: {
        Personnel,
        PersonnelFamily,
        PersonnelInterview,
        PersonnelLearningExperience,
        PersonnelProjectExperience,
        PersonnelWorkExperience,
        PersonnelWrittenExamination,
        PersonnelCertification,
        PersonnelTraining,
        PersonnelRewardPunishment,
        PersonnelHiJobInfo,
        PersonnelAnnualAssessment,
    },
    data () {
        return {
            comps: [], //[Personnel, PersonnelFamily, PersonnelInterview, PersonnelLearningExperience, PersonnelProjectExperience, PersonnelWorkExperience, PersonnelWrittenExamination],
            personnelId: this.$route.params.id,
            compResets: [],
            userCompsInfo: {// PersonnelHiJobInfo
                1: [Personnel, PersonnelAnnualAssessment, PersonnelWorkExperience, PersonnelLearningExperience, PersonnelTraining, PersonnelRewardPunishment, PersonnelCertification, PersonnelFamily],
                2: [Personnel, PersonnelAnnualAssessment, PersonnelWorkExperience, PersonnelLearningExperience, PersonnelProjectExperience, PersonnelTraining, PersonnelRewardPunishment, PersonnelCertification, PersonnelFamily],
            },
            compInfo: {
                'Personnel': {
                    text: '个人基本信息',
                    icon: 'icon-tubiaozhizuomoban',
                },
                'PersonnelFamily': {
                    text: '家庭情况',
                    icon: 'icon-080jiating',
                },
                'PersonnelInterview': {
                    text: '面试情况',
                    icon: 'icon-icon-test1',
                },
                'PersonnelLearningExperience': {
                    text: '教育经历',
                    icon: 'icon-jiaoyu',
                },
                'PersonnelProjectExperience': {
                    text: '研发项目经验',
                    icon: 'icon-xiangmujingyan2',
                },
                'PersonnelWorkExperience': {
                    text: '工作经历',
                    icon: 'icon-icon-test1',
                },
                'PersonnelWrittenExamination': {
                    text: '笔试情况',
                    icon: 'icon-icon-test1',
                },
                'PersonnelCertification': {
                    text: '资质和证书',
                    icon: 'icon-zizhizhengshu'
                },
                'PersonnelTraining': {
                    text: '培训情况',
                    icon: 'icon-peixun'
                },
                'PersonnelRewardPunishment': {
                    text: '奖惩情况',
                    icon: 'icon-jiangli'
                },
                'PersonnelHiJobInfo': {
                    text: '历史岗位信息',
                    icon: 'icon-gangwei',
                },
                'PersonnelAnnualAssessment': {
                    text: '年度考核',
                    icon: 'icon-cz-khdf',
                },
            },
            activeIndex: -1,
            scrVal: 0,
            userType: this.$route.params.userType,
            canEdit: this.$route.params.canEdit
        }
    },
    mounted () {

        this.$nextTick(() => {
            this.$refs.content.addEventListener('scroll', this.handleScroll);
        });
    },
    methods: {
        exportPersonnel: function (personelId) {
            //加载层-风格4
            var layId = layer.msg('个人简历生成中', {
                icon: 16,
                shade: 0.01
            });
            
            exportPersonInfo(personelId, 1, null).then(response => {
                layer.close(layId);
                layId = layer.msg('个人简历导出中', {
                    icon: 16,
                    shade: 0.01
                });

                let blob = new Blob([response.data],{type:"application/vnd.ms-excel"});
                let objectURL =  URL.createObjectURL(blob);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', objectURL);

                a.setAttribute('download', decodeURIComponent(response.fileName));
                a.click();
                URL.revokeObjectURL(objectURL);
                
            });
        },
        handleScroll: function () {
            this.scrVal = document.getElementById('personnelroot').scrollTop;
        },
        rightMenuClick: function (index) {
            this.activeIndex = index;
            var anchor = this.$el.querySelector('#' + this.userCompsInfo[this.userType][index].name);
            // document.getElementById('personnelroot').scrollTop = anchor.offsetTop - 57;
            $("#personnelroot").animate({
                scrollTop: (anchor.offsetTop - 57)
            }, 800);
        }
    }
}
</script>

<style scoped>
.box {
    border: 1px solid #e4e7f0;
}
.main-info {
    display: flex;
    border-bottom: 1px solid #e4e7f0;
    margin-top: 10px;
    background: #fafafa;
}
.jbxi {
   padding: 15px;
   padding-top: 0;
}
.main-info > div {
    display: inline-block;
    height: 180px;
}
.img-responsive {
    display: inline-block;
    height: auto;
    max-width: 100%;
}
hr {
    padding: 0;
    margin-top: 0;
}
td {
    border: 1px solid #e7eaec;
}
ul {
    border: 1px solid #e4e7f0;
    position: fixed;
    width: 220px;
}
ul li {
    cursor: pointer;
    padding-left: 26px;
    height: 50px;
    border-left: 3px solid transparent;
    line-height: 50px;
    font-size: 16px;
    color: #333333;
}
ul li:hover {
    color: #2b64ce;
    /* border-left: 2px solid #2b64ce; */
}
ul li.active {
    color: #2b64ce;
    border-left: 3px solid #2b64ce;
}
button.kb {
    margin: 1rem 0 0;
    padding: 0;
    width: 3.33rem;
    height: 3.33rem;
    line-height: 1;
    color: #909090;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0,0,0,.05);
    cursor: pointer;
    position: fixed;
    bottom: 2rem;
    right: 0.5rem;
    z-index: 9999;
    margin-right: 36px;
}
</style>


