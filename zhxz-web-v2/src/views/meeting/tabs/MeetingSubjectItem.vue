<template>
    <div v-if="subjectItems.length > 0" class="row row-background left-border vote-result">
        <div class="col-sm-12 explain-sign">
            <fieldset class="layui-elem-field subject-title">
                <legend>
                    <i class="iconfont icon-shixiang" style="color: #1e9fff;"></i> 议题事项
                </legend>
                <div class="layui-field-box">
                    <div class="col-sm-12">
                        <ul class="sortable-list connectList agile-list">
                            <template v-for="(item, index) in subjectItems">
                                <li 
                                    v-if="item.component == 'layui-inline-textarea'"
                                    class="success-element"
                                    :key="index">
                                    <span>
                                        {{ number2Chinese(index + 1) }}、{{ item.title }}
                                    </span>
                                    <div class="agile-detail">
                                        <pre style="background: rgb(252, 252, 252);">{{ item.text }}</pre>
                                    </div>				                                				                                
                                </li>

                                <li 
                                    v-if="item.component == 'number-table'"
                                    class="success-element"
                                    :key="index">
                                    <span>
                                        {{ number2Chinese(index + 1) }}、{{ item.title }}
                                    </span>
                                    <div class="agile-detail">
                                         <table class="subject-child-table">
                                            <tbody>
                                                <tr 
                                                    v-for="childItem in childItemsMap[item.code]"
                                                    :key="childItem.id">
                                                    <td style="width: 50%;">{{ childItem.title }}（万元）</td> 
                                                    <td class="text-roseo">{{ childItem.number }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="ys-total total">总计（万元）</td>
                                                    <td class="ys-total text-roseo total">{{ totalInfo[item.code] }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>								  
            </fieldset>
        </div>
    </div>
   
</template>

<script>
import meetingTabMixin from '@/mixin/meetingTabMixin'
import { mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import { getMeetingSubjectItems } from '@/api/meeting/meetingSubject'
let Big = require('big.js')
import { number2Chinese } from '@/utils/numberUtils'

export default {
    mixins: [meetingTabMixin],
    data () {
        return {
            subjectItems: [],
            childItemsMap: {},
            totalInfo: {},
        }
    },
    props: {

    },
    computed: {
        subject: function(){
            return this.inSelectSubjects[this.subjectSelectedIndex];
        },
    },
    watch: {
        subjectSelectedIndex() {
            getMeetingSubjectItems(this.subject.id).then(res => {
                let data = res.data || {};
                this.subjectItems = data.subjectItems;
                this.childItemsMap = data.childItemsMap || {};
            });
        },
        childItemsMap: {
			handler(oldVal, newVal) {
				for (let code in this.childItemsMap) {
					let childItems = this.childItemsMap[code];
					let total = new Big(0);
					childItems.forEach(item => {
						if (item.number) {
							total = total.plus(item.number);
						}
					})
					
					this.$set(this.totalInfo, code, total);
				}
			},
			deep: true
		}
    },
    mounted() {
        getMeetingSubjectItems(this.subject.id).then(res => {
            let data = res.data || {};
            this.subjectItems = data.subjectItems;
            this.childItemsMap = data.childItemsMap || {};
        });
    },
    methods: {
        number2Chinese(number) {
            return number2Chinese(number)
        },
    }
}
</script>

<style src="../../../assets/css/meeting/screen.css" scoped></style>
<style src="../../../assets/css/meeting/colorbox.css" scoped></style>
<style src="../../../assets//css/meeting/meetingTabCommon.css" scoped></style>
<style lang="less" scoped>
    .vote-result {
        margin-top: 20px;
        padding-bottom: 0;
    }
    .agile-list {
        text-align: left;
    }
    legend {
        width: 100%;
    }
    legend > div {
        display: block;
        padding-right: 40px;
        float: right;
    }
    .subject-vote-result-table tr td {
        width: auto;
    }
    .agile-detail {
        margin-top: 5px;
        font-size: 14px;
    }
    td:first-child {
        font-weight: bold;
    }
    td.total {
        background: #0b92e4;
        color: #fff!important;
        font-weight: bold;
    }
</style>