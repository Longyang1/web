<template>
    <ve-ring 
        :data="chartData"
        :title="title"
        :legend-visible="false"
        :settings='chartSettings'
        :data-empty="dataEmpty"
        :extend="extend"
        height="300px"
        ref="chart"></ve-ring>
</template>

<script>
import { getGenderData } from '@/api/personnel/personnelStatistics'
import personnelChartMixin from '@/mixin/personnelChartMixin'
var echarts = require('echarts/lib/echarts');
import _colors from '@/utils/colors'
import bus from '@/assets/js/event.js'

export default {
    mixins: [personnelChartMixin],
    data () {
        this.title = {
            text: '性别分布',
            subtext: '',
            x:'left'
        }
        this.chartSettings = {
            label: {
                formatter: '{b}{d}%'
            },
            offsetY: 150
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
                            let color = this.colors[this.colors.length / 2 - params.dataIndex];
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
        }
        return {
            text: '性别',
            count: '数量',
            chartData: {
                columns: ['性别', '数量'],
                rows: [
                    
                ]
            },
            colors: _colors.sort(function() {
                return .5 - Math.random();
            })
        }
    },
    mounted () {
        this.$set(this.chartData, 'rows', this.handlerData(this.data, '性别', '数量'));
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
    },
    methods: {
      
    }
}
</script>
