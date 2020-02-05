<template>
    <ve-bar 
        :data="chartData" 
        :title="title"
        :extend="extend"
        :data-empty="dataEmpty"
        :legend-visible="false"
        height="300px"
        ref="chart"></ve-bar>
</template>

<script>
import { getEducationData } from '@/api/personnel/personnelStatistics'
import personnelChartMixin from '@/mixin/personnelChartMixin'
var echarts = require('echarts/lib/echarts');
import _colors from '@/utils/colors'
import bus from '@/assets/js/event.js'

export default {
    mixins: [personnelChartMixin],
    data () {
        this.title = {
            text: '最高学历分布',
            subtext: '',
            x: 'left'
        }
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
                            let color = this.colors[params.dataIndex];
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
            },
            grid: {
                right: '20px'
            }
        }
        // this.chartSettings = {
        //     yAxisType: 'value'
        // }
        return {
            text: '学历',
            count: '人数',
            chartData: {
                columns: ['学历', '人数'],
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
                this.$refs.chart.echarts.resize();
            });
        });

        bus.$on('panelCollapseAfter', () => {
            this.$nextTick(() => {
                this.$refs.chart.echarts.resize();
            });
        });
    }
}
</script>