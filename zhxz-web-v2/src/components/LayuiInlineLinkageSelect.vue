<template>
    <div class="layui-form layui-form-pane">
        <div class="layui-form-item">
            <label :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" style="height: 38px; line-height: 18px;">{{ label }}</label>
            <div class="layui-input-inline">
                <div class="xm-select-parent" :style="{width: width + 'px'}">
                    <div :class="{'xm-form-select': true, ' xm-form-selected ': open}" xm-select-skin="undefined" xm-select-search-type="0">
                        <input class="xm-hide-input" :lay-verify="layVerify"  :value="value" type="text" style="position: absolute;bottom: 0; z-index: -1;width: 100%; height: 100%; border: none; opacity: 0;">
                        <div class="mutil-select-title" :style="{height: '36px', width: width + 'px'}" @click.stop="openOrCloseSelect">
                            <div class="xm-input xm-select">
                                <div class="xm-select-label" style="left: 0px;">
                                    <span v-if="text != null" fsw="xm-select" value="1/12/13">
                                        <font fsw="xm-select">{{ text }}</font>
                                    </span>
                                </div>
                                <i class="xm-select-sj"></i>
                            </div>
                        </div>
                        <dl class="xm-select-dl " style="top: 41px; bottom: auto;">
                            <div class="xm-select-linkage">
                                <template v-for="i in maxGroup">
                                    <div 
                                        :style="{left: (((i - 1) * 100) + 'px')}" 
                                        :class='getGroupClass(i)'
                                        v-if="refresh"
                                        :key="i">
                                        <li 
                                            v-for="item in items.filter(it => { return it.value.length == i})" 
                                            title=""
                                            :class="getItemClass(item, i)"
                                            @click.stop="clickItem(item, i)"
                                            :key="i + '_' + item.value">
                                            <span>{{ item.label }}</span>
                                        </li>
                                    </div>
                                </template>
                                <div style="clear: both; height: 288px;"></div>
                            </div>
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
            curClickItem: null,
            curClickGroup: -1,
            refresh: true,
            open: false,
            text: null
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
            type: [String, Number],
            default: ''
        },
        width: {
            type: Number,
            default: 300
        },
        layVerify: {
            type: String,
            default: ''
        },
    },
    computed: {
        maxGroup: function() {
            var maxGroup = 1;
            this.items.forEach(element => {
                maxGroup = maxGroup > element.value.length ? maxGroup : element.value.length;
            });
            return maxGroup;
        }
    },
    watch: {
        items: function() {
            var index = this.items.indexOf(this.value, 'value');
            if (index != -1) {
                this.curClickItem = this.items[index];
                this.text = this.curClickItem.label;

            }
        },
        value() {
            var index = this.items.indexOf(this.value, 'value');
            if (index != -1) {
                this.curClickItem = this.items[index];
                this.text = this.curClickItem.label;

            }
        }
    },
    mounted () {
        bus.$on('selectClose', (obj) => {
            if(this != obj){
                this.open = false;
            }
        });
        var index = this.items.indexOf(this.value, 'value');
        if (index != -1) {
            this.curClickItem = this.items[index];
            this.text = this.curClickItem.label;

        }
    },
    methods: {
        getGroupClass: function(i) {
            return "xm-select-linkage-group xm-select-linkage-group" + i;
        },
        getItemClass: function(item, group) {
            if (this.curClickItem && (item.value == this.curClickItem.value || this.curClickItem.value.startsWith(item.value))) {
                return "xm-select-this xm-select-active";
            }
            if (group == 1 || this.isChild(item, group) || this.isBrother(item, group)) {
                return "";
            } else {
                return "xm-select-linkage-hide";
            }
            return "xm-select-this xm-select-active";
        },
        isChild: function(item, group) {
            return this.curClickItem && group == this.curClickGroup + 1 && item.value.startsWith(this.curClickItem.value);
        },
        isBrother: function(item, group) {
            return this.curClickItem && group > 1 && this.curClickItem.value.substring(0, this.curClickItem.value.length - 1) == item.value.substring(0, item.value.length - 1);
        },
        clickItem: function(item, group) {
            this.curClickItem = {};
            Object.assign(this.curClickItem, item);
            this.curClickGroup = group;
            if (group == this.maxGroup) {
                this.$emit('input', this.curClickItem.value);
                this.text = this.curClickItem.label;
                this.open = false;
            }
            // this.refresh = false;
            // this.$nextTick(() => {
            //      this.refresh = true;
            // });
        },
        openOrCloseSelect: function() {
            this.open = !this.open;
            if (this.open) {
                bus.$emit('selectClose', this);
            }
        }
    }
}
</script>


<style scoped>
    .mutil-select-title {
        border: 1px solid #e6e6e6
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
