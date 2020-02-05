<template>
    <div class="row">
        <div class="header">
            <h5>多维度数据分析</h5>
        </div>
        <div class="content">
            <div class="layui-row">
                <div class="layui-col-xs12">
                    <div class="layui-tab layui-tab-brief">
                        <ul class="layui-tab-title">
                            <li 
                                v-for="(item, index) in tabConfigs"
                                @click="tabSwitch(index)" 
                                :class="{'layui-this': item.active}"
                                :key="index">{{ item.title }}</li>
                        </ul>
                        <div class="layui-tab-content">
                            <!-- <keep-alive>
                                <component :is="activeComp"></component>
                            </keep-alive> -->
                            <div class="layui-row layui-col-space10" style="padding-top: 20px">
                                <div class="layui-col-xs6">
                                    <ve-bar 
                                        :data="chartData" 
                                        :settings="chartSettings" 
                                        :data-empty="chartData.rows && chartData.rows.length <= 0"
                                        :extend="extend"
                                        :toolbox="toolbox"
                                        ref="bar"></ve-bar>
                                </div>
                                <div class="layui-col-xs6">
                                    <ve-line 
                                        :data="chartTop100Data" 
                                        :settings="chartSettings" 
                                        :data-empty="dataEmpty"
                                        :extend="extendLine"
                                        :toolbox="toolbox"
                                        :dataZoom="dataZoom"
                                        ref="line"></ve-line>
                                </div>
                            </div>
                           
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import 'echarts/lib/component/dataZoom'
var echarts = require('echarts/lib/echarts');
import _colors from '@/utils/colors'
import bus from '@/assets/js/event.js'

export default {
    components: {},
    data () {
        this.toolbox = {
            feature: {
                // magicType: {type: ['line', 'bar']},
                // saveAsImage: {}
            }
        },
        this.extend = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '40px',
                containLabel: true
            },
            xAxis: {
                axisLabel: {
                    interval: 0,
                    // rotate: 90,
                }
            },
            series: {
                // label: { show: true, position: "right" },
                barWidth: 14,
                type: 'bar',
                label: {
                    normal: {
                        position:'right',
                        show: true,
                        textStyle:{
                            color:'#000',
                        },
                        formatter: (params) => {
                            //  console.log(this);
                            // console.log(params)
                            // console.log(params.name)
                            // console.log(params.seriesName)
                            // console.log(params.dataIndex);
                            // console.log(params.data);
                            var _chartsViews = this.$refs.bar.echarts._chartsViews;

                            var columns = this.chartData.columns;
                            var rowData = this.chartData.rows[params.dataIndex];
                            var total = -1;
                            var _column = "";

                            for (var i = columns.length - 1; i > 0; i--) {
                                var column = columns[i];
                                var v = _chartsViews[0].__model.parentModel._seriesIndicesMap.data[i - 1];
                                if ((!v && v != 0) || v < 0) {
                                    continue;
                                }
                                if (rowData[column]) {
                                    _column = column;
                                    break;
                                }
                            }

                            if (_column == params.seriesName) {
                                total = 0;
                                for (const key in rowData) {
                                    var index = columns.indexOf(key);
                                    if (rowData.hasOwnProperty(key) && index > 0 && _chartsViews[0].__model.parentModel._seriesIndicesMap.data[index - 1 + ""] >= 0) {
                                        const element = rowData[key];
                                        total += Number(element);
                                    }
                                }
                            }
                            return total == -1 ? "" : total;
                        }
                    }
                }
            },
        },
        this.extendLine = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '40px',
                containLabel: true
            },
            xAxis: {
                axisLabel: {
                    interval: 0,
                    // rotate: 90,
                }
            },
            series: {
                // label: { show: true, position: "right" },
                barWidth: 14,
                type: 'line',
            },
        },
        this.dataZoom = [
            {
                type: 'slider',
                // start: '2018年',
                // end: new Date().getFullYear() + "年",
                bottom: '10px'
            }
        ]
        return {
            chartSettings: {
                stack: { }
            },
            chartData: {
                columns: [],
                rows: [
                  
                ]
            },
            colors: _colors.sort(function() {
                return .5 - Math.random();
            }),
            chartTop100Data: {
                columns: [],
                rows: [
                  
                ]
            },
            activeComp: null, //GenderChart,
            tabConfigs: [
                {
                    title: '性别数据',
                    type: '性别',
                    // comp: GenderChart,
                    active: true,
                    data: 'genderData',
                    data2: 'genderData2',
                    map: 'genderMap'
                },
                {
                    title: '年龄数据',
                    type: '年龄',
                    // comp: AgeChart,
                    active: false,
                    data: 'ageData',
                    map: 'ageMap'
                },
                {
                    title: '工作年限',
                    type: '工作年限',
                    // comp: WorkYearChart,
                    active: false,
                    data: 'workData',
                    map: 'workMap',
                    columns: ["0-5年", "6-10年", "11-15年", "16-20年", "21-25年", "26-30年", "31年及以上"]
                },
                {
                    title: '最高学历',
                    type: '最高学历',
                    // comp: EducationChart,
                    active: false,
                    data: 'educationData',
                    map: 'educationMap'
                },
                {
                    title: '政治面貌',
                    type: '政治面貌',
                    // comp: AgeChart,
                    active: false,
                    data: 'politicalData',
                    map: 'politicalMap2',
                    columns: ["中共党员", "共青团员", "群众", "其他"]
                },
                {
                    title: '现行员级别任职年限',
                    type: '现行员级别任职年限',
                    // comp: LevelYearChart,
                    active: false,
                    data: 'levelData',
                    map: 'levelMap',
                    columns: ["0-5年", "6-10年", "11-15年", "21年及以上"]
                },
            ],
            politicalMap2: {
                '01': "中共党员",
                // '02': "中共预备党员",
                '03': "共青团员",
                '13': "群众",
                "14": '其他'
            },
            dicts: [],
            genderData: [],
            genderData2: [],
            educationData: [],
            politicalData: [],
            ageData: [],
            ageMap: {
                '2030': '20-30岁',
                '3135': '31-35岁',
                '3640': '36-40岁',
                '4145': '41-45岁',
                '4650': '46-50岁',
                '5180': '50岁及以上'
            },
            workData: [],
            workMap: {
                '0005': '0-5年',
                '0610': '6-10年',
                '1115': '11-15年',
                '1620': '16-20年',
                '2125': '21-25年',
                '2630': '26-30年',
                '3180': '31年及以上',
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
                    arr2: 'genderData2'
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
            dataEmpty: true,
            activeIndex: 0,
            legends: []
        }
    },
    props: {
        items: {
            type: Array,
            default: () => {
                return [];
            }
        },
        top100StatPersonnelInfos: {
            type: Array,
            default: () => {
                return [];
            }
        },
        xType: {
            type: String,
            default: '中心'
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
        items: function() {
            this.handlerData('items', 'arr');
            this.setChartData(this.activeIndex, 'chartData', 'data');
        },
        top100StatPersonnelInfos: function() {
            this.handlerData('top100StatPersonnelInfos', 'arr2');
            this.setChartData(this.activeIndex, 'chartTop100Data', 'data2');
        },
    },
    mounted () {
        getDicts('GENDER_DICT,RELIGION_DICT,PERSONNEL_EDUCATION_DICT').then(result => {
            var data = result.data;
            if (data) {
                this.dicts = data;
                this.handlerData();
            }
        });

        bus.$on('panelExpandAfter', () => {
            this.$nextTick(() => {
                this.$refs.bar.echarts.resize();
                this.$refs.line.echarts.resize();
            });
        });

        bus.$on('panelCollapseAfter', () => {
            this.$nextTick(() => {
                this.$refs.bar.echarts.resize();
                this.$refs.line.echarts.resize();
            });
        });

        this.$nextTick(() => {
            this.$refs.bar.echarts.on('legendselectchanged', (obj) => {
                console.log("AAAAAAAAAAAAAAAAAAAaa")
                
                var selected = obj.selected;
                var legend = obj.name;
                // if (selected[legend]) {
                //     var index = this.legends.indexOf(legend);
                //     this.legends.splice(index, 1);
                // } else {
                //     this.legends.push(legend);
                // }
                var index = this.legends.indexOf(legend);
                this.legends.splice(index, 1);
            });
            this.$refs.bar.echarts.on('legendunselected', (obj) => {
                var selected = obj.selected;
                var legend = obj.name;
                this.legends.push(legend);
            });

            this.$refs.bar.echarts.on('click', function (params) {
                console.log(params);
            });

        });

    },
    methods: {
        tabSwitch: function(index) {
            // this.activeComp = this.tabConfigs[index].comp;
            this.activeIndex = index;
            this.setChartData(this.activeIndex, 'chartData', 'data');
            this.setChartData(this.activeIndex, 'chartTop100Data', 'data2');
        },
        handlerData: function(arrName, configArrName) {
            this.configs.forEach(c => {
                this[c[configArrName]] = [];
            });
            var statPersonnelInfo = this.statPersonnelInfo;
            for (let index = 0; index < this[arrName].length; index++) {
                const statPersonnelInfo = this[arrName][index];    
                for (const key in statPersonnelInfo) {
                    if (statPersonnelInfo.hasOwnProperty(key)) {
                        const element = statPersonnelInfo[key];
                        this.configs.forEach(config => {
                            if (key.startsWith(config.prefix)) {
                                var map = this[config['map']];
                                for (const mkey in map) {
                                    if (map.hasOwnProperty(mkey) && (config.prefix + mkey) == key) {
                                        var index = this[config[configArrName]].indexOf(statPersonnelInfo.officeName, this.xType);
                                        var item = {};
                                        if (index == -1) {
                                            this[config[configArrName]].push(item);
                                        } else {
                                            item = this[config[configArrName]][index];
                                        }
                                        
                                        item[this.xType] = statPersonnelInfo.officeName;
                                        item[map[mkey]] = element;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        },
        setChartData: function(index, chartDataName, dataName) {
            var config = this.tabConfigs[index];
            if (!config) {
                return;
            }
            var stack = {

            };
            
            var arr = config.columns || [];
            if (arr.length == 0) {
                for (const key in this[config.map]) {
                    console.log(key)
                    if (this[config.map].hasOwnProperty(key)) {
                        const element = this[config.map][key];
                        arr.push(element);
                    }
                }
            }
            stack[config.type] = arr;
            this.chartSettings = {
                stack
            }
            var data = this[config[dataName]];
            var columns =  [];
            columns.push(this.xType);
            arr.forEach(ele => {
                columns.push(ele);
            });
            this.$set(this[chartDataName], 'columns', columns);
            this.$set(this[chartDataName], 'rows', data);
            
            if (index != -1 && data) {
                this.dataEmpty = data.length <= ('chartTop100Data' == chartDataName ? 1 : 0);
            } else {
                this.dataEmpty = true;
            }
        }
    }
}
</script>

<style scoped>
.row {
    border: 1px solid #e4e7f0;
    margin-bottom: 40px;
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
    padding-top: 0;
}
.layui-tab-content > div > div > div {
    /* -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    box-shadow: 0 1px 2px rgba(0,0,0,0.2); */
    background-color: #f9f9f9;
    -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
    box-shadow: 0 1px 10px rgba(0,0,0,0.3);
}
</style>


