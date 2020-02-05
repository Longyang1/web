<template>
    <ve-histogram 
        :data="chartData" 
        :settings="chartSettings"
        :title="title"
        :extend="extend"
        :data-empty="dataEmpty"
        :legend-visible="false"
        height="300px"
        ref="chart"></ve-histogram>
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
            text: '现行员级别任职年限分布',
            subtext: '',
            x: 'left'
        }
        this.chartSettings = {
            
        }
        this.extend = {
            series: {
                label: { show: true, position: "top" },
                barWidth: 20,
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 7
                    },
                    normal: {
                        barBorderRadius: 7,
                        color: (params) => {
                            //渐变色算法例子
                            let color = this.colors[this.colors.length - 1 - params.dataIndex];
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
            xAxis: {
                axisLabel: {
                    interval: 0,
                }
            }
        }
        return {
            text: '任职年限',
            count: '人数',
            chartData: {
                columns: ['任职年限', '人数'],
                rows: [
                
                ]
            },
            colors: _colors.sort(function() {
                return .5 - Math.random();
            })
        }
    },
    watch: {
        avg: function() {
            this.$set(this.title, 'text', "现行员级别任职年限分布（" + this.avg + "）")
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