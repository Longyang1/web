<template>
    <div style="position: relative;">
        <ve-ring 
            :data="chartData"
            :title="title"
            :legend="legend"
            :settings='chartSettings'
            :data-empty="dataEmpty"
            :extend="extend"
            height="300px"
            ref="chart"></ve-ring>
    </div>
</template>

<script>
import personnelChartMixin from '@/mixin/personnelChartMixin'
var echarts = require('echarts/lib/echarts');
import _colors from '@/utils/colors'
import bus from '@/assets/js/event.js'

export default {
    mixins: [personnelChartMixin],
    data () {
        this.title = {
            text: '年龄分布',
            subtext: '',
            x: 'left'
        }
        this.chartSettings = {
            label: {
                formatter: '{b}{d}%',
            },
            roseType: 'radius',
            // offsetY: 150,
            radius : '50%',
            center: ['50%', '40%'],
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
                            let color = this.colors[this.colors.length * .75 - params.dataIndex];
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
        },
        this.legend =  {
            orient: 'vertical',
            x: 'right',
        }
        return {
            text: '年龄',
            count: '人数',
            chartData: {
                columns: ['年龄', '人数'],
                rows: [
                    
                ],
            },
            colors: _colors.sort(function() {
                return .5 - Math.random();
            })
        }
    },
    watch: {
        avg: function() {
            this.$set(this.title, 'text', "年龄分布（" + this.avg + "）")
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
