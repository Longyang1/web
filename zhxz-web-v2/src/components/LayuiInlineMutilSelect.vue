<template>
    <div class="layui-form layui-form-pane">
        <div class="layui-form-item">
            <label :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" :style="{height: ((height + 2) + 'px'), 'line-height': ((height + 2 - 20) + 'px')}">{{ label }}</label>
            <div class="layui-input-inline">
                <div class="xm-select-parent" :style="{width: width + 'px'}">
                    <div :class="{'xm-form-select': true, ' xm-form-selected ': open}" xm-select-skin="undefined" xm-select-search-type="0">
                        <input class="xm-hide-input" :lay-verify="layVerify" type="text" style="position: absolute;bottom: 0; z-index: -1;width: 100%; height: 100%; border: none; opacity: 0;">
                        <div class="mutil-select-title" :style="{height: height + 'px'}" @click.stop="openOrCloseSelect">
                            <div class="xm-input xm-select" title="title" ref="tagContainer">
                                <div class="xm-select-label" style="left: 0px;">
                                    <span 
                                        v-if="!checkedVals || checkedVals.length <= 0" 
                                        style="background: none; border: none; color: rgb(138, 133, 133); font-size: 12px; padding-top: 4px; cursor: pointer;">{{ placeholder }}</span>
                                    <span
                                        v-for="(item, index) in checkedVals"
                                        :key="item + ':' + index">
                                        <font>{{ getLabel(items[items.indexOf(item, valKey)], labelKey) }}</font><i @click.stop="remove(index)" class="xm-iconfont icon-close"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <dl xid="select2" class="xm-select-dl " style="top: 41px; bottom: auto;" @click.stop="stopGlobalClick">
                            <dd lay-value="" class="xm-select-tips" style="background-color: #FFF!important;">
                                <div class="xm-cz-group" show="null" style="max-width: -54px;">
                                    <div @click.stop="checkedAll" class="xm-cz" method="全选" title="全选" style="margin-right: 30px">
                                        <i class="xm-iconfont icon-quanxuan"></i>
                                        <span>全选</span>
                                    </div>
                                    <div @click.stop="clearAll" class="xm-cz" method="清空" title="清空" style="margin-right: 30px">
                                        <i class="xm-iconfont icon-qingkong"></i>
                                        <span>清空</span>
                                    </div>
                                    <div @click="checkedAll('fx')" class="xm-cz" method="反选" title="反选" style="margin-right: 30px">
                                        <i class="xm-iconfont icon-fanxuan"></i><span>反选</span>
                                    </div>
                                </div>
                                <div class="xm-cz" method="" title="">
                                    <i class="xm-iconfont icon-caidan"></i>
                                    <span></span>
                                </div>
                            </dd>
                            <dd lay-value="" class="xm-select-tips xm-dl-input" style="background-color: rgb(255, 255, 255) !important; display: none;">
                                <i class="xm-iconfont icon-sousuo"></i>
                                <input type="text" class="xm-input xm-select-input" placeholder="请搜索">
                            </dd>
                            <template v-if="refresh">
                                <dd 
                                    v-for="(item, index) in items"
                                    :key="index"
                                    :class="{'xm-select-this': checkedVals.indexOf(item[valKey]) != -1}">
                                    <div @click="checked(item)" class="xm-unselect xm-form-checkbox " style="margin-left: 0px">
                                        <i class="xm-iconfont"></i>
                                        <span>{{ getLabel(item, labelKey) }}</span>
                                    </div>
                                </dd>
                            </template>
                            <dt style="display:none;"> </dt>
                            <dd class="xm-select-tips xm-select-none ">没有选项</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '@/assets/js/event.js'
export default {
    data () {
        return {
            checkedVals: this.value || [],
            refresh: true,
            open: false,
            text: null,
            height: 36
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        items: {
            type: Array,
            default: () => {
                return [];
            }
        },
        value: {
            type: Array,
            default: () => {
                return [];
            }
        },
        width: {
            type: Number,
            default: 300
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        valKey: {
            type: String,
            default: 'value'
        },
        layVerify: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '点击选择'
        },
    },
    computed: {
       
    },
    watch: {
        items: function() {
            this.refresh = false;
            this.$nextTick(() => {
                this.refresh = true;
            });
        },
        value() {
            this.checkedVals = this.value || [];
            this.$nextTick(() => {
                this.height = this.$refs.tagContainer.offsetHeight;
            });
        },
        checkedVals() {
            this.$emit('input', this.checkedVals);
        }
    },
    mounted () {
        bus.$on('selectClose', (obj) => {
            if(this != obj){
                this.open = false;
            }
        });
        
    },
    methods: {
        stopGlobalClick: () => {

        },
        clickItem: function(item, group) {
           
        },
        checkedAll: function(type) {
            var oldCheckedVals = [];
            if (type == 'fx') {
                oldCheckedVals = this.checkedVals;
            } 
            this.checkedVals = [];
            this.items.forEach(element => {
                if (oldCheckedVals.indexOf(element[this.valKey]) == -1) {
                    this.checkedVals.push(element[this.valKey]);
                }
            });
        },
        clearAll: function() {
            this.checkedVals = [];
        },
        openOrCloseSelect: function() {
            this.open = !this.open;
            if (this.open) {
                bus.$emit('selectClose', this);
            }
        },
        getLabel: function(item, labelKey) {
            if (!item) {
                return;
            }
            if (this.$parent.getTagLabel) {
                return this.$parent.getTagLabel(item, labelKey);
            }
            return item[labelKey];
        },
        checked: function(item) {
            var index = this.checkedVals.indexOf(item[this.valKey]);
            if (index != -1) {
                this.checkedVals.splice(index, 1);
            } else {
                this.checkedVals.push(item[this.valKey]);
            }
        },
        remove: function(index) {
            this.checkedVals.splice(index, 1);
        }
    }
}
</script>


<style scoped>
    .mutil-select-title {
        border: 1px solid #e6e6e6!important
    }
    .xm-select-parent .mutil-select-title div.xm-select-label>span {position: relative;padding: 2px 5px;background-color: #009688;border-radius: 2px;color: #FFF;display: inline-block;line-height: 18px;height: 18px;margin: 2px 5px 2px 0;cursor: initial;user-select: none;font-size: 14px;padding-right: 25px;-webkit-user-select: none;}
    .xm-select-parent .mutil-select-title div.xm-select-label>span i {position: absolute; margin-left: 8px; font-size: 12px; cursor: pointer; line-height: 20px;}
    /* 颜色相关 */
    div[xm-select-skin] .mutil-select-title div.xm-select-label>span {border: 1px solid #009688}
    div[xm-select-skin] .mutil-select-title div.xm-select-label>span i:hover {opacity: .8;filter: alpha(opacity=80);cursor: pointer}
    div[xm-select-skin=default] .mutil-select-title div.xm-select-label>span {background-color: #F0F2F5;color: #909399;border: 1px solid #F0F2F5}
    div[xm-select-skin=default] .mutil-select-title div.xm-select-label>span i {color: #C0C4CC}
    div[xm-select-skin=default] .mutil-select-title div.xm-select-label>span i:before {content: '\e60b'; font-size: 16px; margin-left: -3px;}
    div[xm-select-skin=primary] .mutil-select-title div.xm-select-label>span {background-color: #009688;color: #FFF;border: 1px solid #009688}
    div[xm-select-skin=primary] .mutil-select-title div.xm-select-label>span i {background-color: #009688; color: #FFF}
    div[xm-select-skin=normal] .mutil-select-title div.xm-select-label>span {background-color: #1E9FFF;color: #FFF;border: 1px solid #1E9FFF}
    div[xm-select-skin=normal] .mutil-select-title div.xm-select-label>span i {background-color: #1E9FFF;color: #FFF}
    div[xm-select-skin=warm] .mutil-select-title div.xm-select-label>span {background-color: #FFB800;color: #FFF;border: 1px solid #FFB800}
    div[xm-select-skin=warm] .mutil-select-title div.xm-select-label>span i {background-color: #FFB800;color: #FFF}
    div[xm-select-skin=danger] .mutil-select-title div.xm-select-label>span {background-color: #FF5722;color: #FFF;border: 1px solid #FF5722}
    div[xm-select-skin=danger] .mutil-select-title div.xm-select-label>span i {background-color: #FF5722;color: #FFF}

    /* 多选联动  */
    .xm-select-parent .layui-form-danger+.mutil-select-title .xm-select {border-color: #FF5722 !important;}
</style>
