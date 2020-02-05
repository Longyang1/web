<template>
    <div class="row">
        <div class="header">
            <h5>数据总览</h5>
        </div>
        <div class="layui-fluid content">
            <div class="layui-row">
                <div :class="'layui-col-xs4 num-box-' + i" v-for="(item, i) in personnelNumConfigs" :key="i">
                    <div v-if="i < 3" class="p-item">
                        <div class="p-icon">
                            <img :src="'/static/images/personnel/' + item.icon + '.png'" alt="">
                        </div>
                        <div class="p-detail">
                            <div class="number">{{ item.handlerData ? item.handlerData(statPersonnelInfo[item.field]) : (statPersonnelInfo[item.field] || '0') }}</div>
                            <div class="text">{{ item.text }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-row">
                <div :class="'layui-col-xs4 num-box-' + i" v-for="(item, i) in personnelNumConfigs" :key="i">
                    <div v-if="i >= 3" class="p-item">
                        <div class="p-icon">
                            <img :src="'/static/images/personnel/' + item.icon + '.png'" alt="">
                        </div>
                        <div class="p-detail">
                            <div class="number">{{ item.handlerData ? item.handlerData(statPersonnelInfo[item.field]) : (statPersonnelInfo[item.field] || '0') }}</div>
                            <div class="text">{{ item.text }}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="layui-row layui-col-space10 chart-main light">
                <div class="layui-col-xs4 gender" @mouseenter="enterGenderMove()" @mouseleave="leaveGenderMove()">
                    <gender-chart :data="genderData"></gender-chart>
                </div>
                <div class="layui-col-xs4 age" @mouseenter="enterAgeMove()" @mouseleave="leaveAgeMove()">
                    <age-chart :data="ageData" :avg="statPersonnelInfo.avgAge"></age-chart>
                </div>
                <div class="layui-col-xs4 work" @mouseenter="enterWorkMove()" @mouseleave="leaveWorkMove()">
                    <education-chart :data="educationData"></education-chart>
                </div>
            </div>
            <div class="layui-row layui-col-space10 chart-main" style="padding-top: 20px">
                <div class="layui-col-xs4 political" @mouseenter="enterPoliticalMove()" @mouseleave="leavePoliticalMove()">
                    <political-chart :data="politicalData"></political-chart>
                </div>
                <div class="layui-col-xs4 political" @mouseenter="enterPoliticalMove()" @mouseleave="leavePoliticalMove()">
                    <work-year-chart :data="workData" :avg="statPersonnelInfo.avgWork"></work-year-chart>
                </div>
                <div class="layui-col-xs4 political" @mouseenter="enterPoliticalMove()" @mouseleave="leavePoliticalMove()">
                    <level-year-chart :data="levelData" :avg="statPersonnelInfo.avgLevel"></level-year-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GenderChart from '@/views/personnel/chart/GenderChart'
import AgeChart from '@/views/personnel/chart/AgeChart'
import WorkYearChart from '@/views/personnel/chart/WorkYearChart'
import LevelYearChart from '@/views/personnel/chart/LevelYearChart'
import EducationChart from '@/views/personnel/chart/EducationChart'
import PoliticalChart from '@/views/personnel/chart/PoliticalChart'
import { getDicts } from '@/api/dict'

export default {
    components: {
        GenderChart,
        AgeChart,
        WorkYearChart,
        PoliticalChart,
        EducationChart,
        LevelYearChart
    },
    data () {
        return {
            dicts: [],
            genderData: [],
            educationData: [],
            politicalData: [],
            ageData: [],
            ageMap: {
                '2030': '20-30岁',
                '3135': '31-35岁',
                '3640': '36-40岁',
                '4145': '41-45岁',
                '4650': '46-50岁',
                '5080': '50岁及以上'
            },
            workData: [],
            workMap: {
                '0005': '0-5年',
                '0610': '6-10年',
                '1115': '11-15年',
                '1620': '16-20年',
                '2125': '21-25年',
                '2630': '26-30年',
                '3180': '31年及以上'
            },
            levelData: [],
            levelMap: {
                '0005': '0-5年',
                '0610': '6-10年',
                '1115': '11-15年',
                '1620': '16-20年',
                '2180': '21年及以上'
            },
            configs: [
                {
                    map: 'genderMap',
                    prefix: 'genderDict',
                    arr: 'genderData',
                },
                {
                    map: 'educationMap',
                    prefix: 'educationDict',
                    arr: 'educationData',
                },
                {
                    map: 'politicalMap',
                    prefix: 'religionDict',
                    arr: 'politicalData',
                },
                {
                    map: 'ageMap',
                    prefix: 'age',
                    arr: 'ageData',
                },
                {
                    map: 'workMap',
                    prefix: 'work',
                    arr: 'workData',
                },
                {
                    map: 'levelMap',
                    prefix: 'level',
                    arr: 'levelData',
                },
            ],
            personnelNumConfigs: [
                {
                    text: '期初总人数',
                    field: 'phaseStartTotal',
                    icon: 'social'
                },
                {
                    text: '期间入职人数',
                    field: 'phaseIn',
                    icon: 'businessman',
                },
                {
                    text: '入职率',
                    field: 'phaseInPercent',
                    icon: 'networking',
                    handlerData: function(percent) {
                        if (!percent) {
                            return '0%';
                        }
                        return (percent * 100).toFixed(1) + "%";
                    }
                },
                {
                    text: '期末总人数',
                    field: 'phaseEndTotal',
                    icon: 'social'
                },
                {
                    text: '期间离职人数',
                    field: 'phaseOut',
                    icon: 'businessman',
                },
                {
                    text: '离职率',
                    field: 'phaseOutPercent',
                    icon: 'networking',
                    handlerData: function(percent) {
                        if (!percent) {
                            return '0%';
                        }
                        return (percent * 100).toFixed(1) + "%";
                    }
                }
            ]
        }
    },
    props: {
        statPersonnelInfo: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    computed: {
        educationMap: function(){
    		return (this.dicts[2] || []).array2Obj('value', 'label');
        },
        politicalMap: function() {
            return (this.dicts[1] || []).array2Obj('value', 'label');
        },
        genderMap: function() {
            return (this.dicts[0] || []).array2Obj('value', 'label');  
        },
    },
    watch: {
        statPersonnelInfo: function() {
            this.handlerData();
        }
    },
    mounted () {
        getDicts('GENDER_DICT,RELIGION_DICT,PERSONNEL_EDUCATION_DICT').then(result => {
            var data = result.data;
            if (data) {
                this.dicts = data;
                this.handlerData();
            }
        });
    },
    methods: {
        handlerData: function() {
            this.configs.forEach(c => {
                this[c.arr] = [];
            });
            var statPersonnelInfo = this.statPersonnelInfo;
            for (const key in statPersonnelInfo) {
                if (statPersonnelInfo.hasOwnProperty(key)) {
                    const element = statPersonnelInfo[key];
                    this.configs.forEach(config => {
                        if (key.startsWith(config.prefix)) {
                            var map = this[config['map']];
                            for (const mkey in map) {
                                if (map.hasOwnProperty(mkey) && (config.prefix + mkey) == key) {
                                    this[config.arr].push({
                                        text: map[mkey],
                                        count: element
                                    });
                                }
                            }
                        }
                    });
                }
            }
        },
        enterGenderMove: function() {
            // $('.gender').mouseenter(()=> {
            //     $('.gender').addClass('animated swing')
            // })
        },
        leaveGenderMove: function() {
            // $('.gender').mouseleave(()=> {
            //     $('.gender').removeClass('animated swing')
            // })
        },
        enterAgeMove: function() {
            // $('.age').mouseenter(()=> {
            //     $('.age').addClass('animated swing')
            // })
        },
        leaveAgeMove: function() {
            // $('.age').mouseleave(()=> {
            //     $('.age').removeClass('animated swing')
            // })
        },
        enterWorkMove: function() {
            // $('.work').mouseenter(()=> {
            //     $('.work').addClass('animated swing')
            // })
        },
        leaveWorkMove: function() {
            // $('.work').mouseleave(()=> {
            //     $('.work').removeClass('animated swing')
            // })
        },
        enterEducationMove: function() {
            // $('.education').mouseenter(()=> {
            //     $('.education').addClass('animated swing')
            // })
        },
        leaveEducationMove: function() {
            // $('.education').mouseleave(()=> {
            //     $('.education').removeClass('animated swing')
            // })
        },
        enterPoliticalMove: function() {
            // $('.political').mouseenter(()=> {
            //     $('.political').addClass('animated swing')
            // })
        },
        leavePoliticalMove: function() {
            // $('.political').mouseleave(()=> {
            //     $('.political').removeClass('animated swing')
            // })
        },
        
    }
}
</script>

<style scoped>
.row {
    border: 1px solid #e4e7f0;
    margin-bottom: 20px;
}
.header {
    height: 48px;
    background: #fafafa;
    border-bottom: 1px solid #e4e7f0;
}
.header h5 {
    margin-top: 0px;
    font-size: 16px;
    line-height: 48px;
    padding-left: 20px;
}
.content {
    padding: 26px 20px;
    background: #fff;
}
.p-item {
    height: 85px;
    background: #fafafa;
    border: 1px solid #e8ebf2;
    border-radius: 8px;
    display: inline-block;
    width: 330px;
    margin-bottom: 30px;
    text-align: left;
    box-shadow: 0 1px 10px rgba(0,0,0,0.3);
}
.p-icon, .p-detail {
    display: table-cell;
    vertical-align: middle;
    height: 85px;
}
.p-icon {
    
}
.p-detail {
    padding-left: 16px;
    text-align: left;
}
.p-detail .number {
    font-size: 30px;
    color: #000000;
}
.p-detail .text {
    font-size: 14px;
    color: #666666;
}
.num-box-1, .num-box-4 {
    text-align: center;
}
.num-box-2, .num-box-5 {
    text-align: right;
}
.chart-main > div > div {
    /* -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    box-shadow: 0 1px 2px rgba(0,0,0,0.2); */
    height: 300px;
    background-color: #fafafa;
    -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
    box-shadow: 0 1px 10px rgba(0,0,0,0.3);
}
/* .light {
    position: relative;
} */
.light:after {
    position: absolute;
    left: -100%;
    top: 0;
    width: 15%;
    height: 100%;
    content: "";
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0)0, rgba(255, 255, 255, .2)50%, rgba(255, 255, 255, 0)100%);
    -webkit-transform: skewX(-25deg);
    -webkit-animation: light 2s ease both infinite;
    z-index: 99;
}
@-webkit-keyframes light {
    0% {
        left: -150px;
    }

    100% {
        left: 1920px;
    }
}

@keyframes light {
    0% {
        left: -150px;
    }

    100% {
        left: 1920px;
    }
}
</style>


