<template>
    <ve-pie 
        :data="chartData"
        :title="title"
        :legend="legend"
        :settings='chartSettings'
        :data-empty="dataEmpty"
        :extend="extend"
        height="300px"
        ref="chart"></ve-pie>
</template>

<script>
import { getPoliticalData } from '@/api/personnel/personnelStatistics'
import personnelChartMixin from '@/mixin/personnelChartMixin'
var echarts = require('echarts/lib/echarts');
import _colors from '@/utils/colors'
import bus from '@/assets/js/event.js'

export default {
    mixins: [personnelChartMixin],
    data () {
        this.title = {
            text: '政治面貌分布',
            subtext: '',
            x: 'left'
        }
        this.chartSettings = {
            label: {
                formatter: '{b}{d}%'
            },
            offsetY: 150
        },
        this.legend =  {
            orient: 'vertical',
            x: 'right',
        },
        this.extend = {
            series: {
                label: { show: true, position: "right" },
                barWidth: 14,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 7
                    },
                    normal: {
                        barBorderRadius: 7,
                        color: (params) => {
                            //渐变色算法例子
                            let color = this.colors[this.colors.length * .25 + params.dataIndex];
                            return new echarts.graphic.LinearGradient(
                                0, 0, 1, 0,
                                [
                                    {offset: 0, color: color.start},
						            {offset: 1, color: color.end}

                                ]
                            )
                        }
                    }
                }
            }
        }
        return {
            text: '政治面貌',
            count: '人数',
            chartData: {
                columns: ['政治面貌', '人数'],
                rows: [
                   
                ]
            },
            colors: _colors.sort(function() {
                return .5 - Math.random();
            })
        }
    },
    mounted () {
        bus.$on('panelExpandAfter', () => {
            this.$nextTick(() => {
                if (this.$refs.chart) {
                    this.$refs.chart.echarts.resize();
                }
            });
        });

        bus.$on('panelCollapseAfter', () => {
            this.$nextTick(() => {
                if (this.$refs.chart) {
                    this.$refs.chart.echarts.resize();
                }
            });
        });
    },
    methods: {
        
    }
}
</script>
