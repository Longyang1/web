<template>
    <layui-item>
        <label :class="{'layui-form-label': true, 'layui-required': layVerify != ''}" :style="{height: ((height + 2) + 'px'), 'line-height': ((height + 2 - 20) + 'px')}">{{ label }}</label>
        <div class="layui-input-block" @click="clickContentArea">
            <div class="xm-select-parent">
                <div class="xm-form-select" :xm-select-skin="skin">
                    <input ref="input" name="type" :lay-verify="layVerify" :value="val" class="hidden" lay-filter="aihao"/>
                    <div class="tag-title " :style="{height: height + 'px'}">
                        <div class="xm-input xm-select" :title="title" :style="{cursor: readonly ? 'default' : 'pointer'}" ref="tagContainer">
                            <div class="xm-select-label" style="left: 0px;">
                                <span
                                    @click.stop="tagClick(index)"
                                    v-for="(item, index) in items"
                                    :key="item[valKey] + ':' + index">
                                    <font>{{ getLabel(item, labelKey) }}</font><i @click.stop="close(index)" class="xm-iconfont icon-close" :style="{cursor: readonly ? 'default' : 'pointer', opacity: 1}"></i>
                                </span>
                                <span 
                                    v-if="!items || items.length <= 0" 
                                    :style="{background: 'none', border: 'none', color: '#8a8585', 'font-size': '12px', 'padding-top': '4px', cursor: readonly ? 'default' : 'pointer'}">
                                    {{ placeholder }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </layui-item>
</template>

<script>
export default {
    data () {
        return {
            items: this.value || [],
            height: 36,
            val: '',
        }
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default: () => {
                return [];
            }
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        valKey: {
            type: String,
            default: 'value'
        },
        cssStyle: {
            type: Object,
            default: function() {
                return {
                    'width': '190px',
                    'margin-right': '8px'
                }
            }
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '点击选择'
        },
        layVerify: {
            type: String,
            default: ''
        },
        block: {
            type: Boolean,
            default: false
        },
        skin: {
            type: String,
            default: 'primary'
        },
    },
    computed: {
        title: function() {
            var title = "";
            this.items.forEach(element => {
                title += element[this.labelKey] + ",";
            });
            return title;
        }
    },
    watch: {
        value: function() {
            this.items = this.value;
            this.$nextTick(() => {
                this.height = this.$refs.tagContainer.offsetHeight;
            });
        },
        items: function() {
            if (!this.layVerify) {
                return;
            }
            this.val = '';
            if (this.items && this.items.length > 0) {
                this.val = 'val';
                this.$refs.input.className = 'hidden';
            } else {
                this.$refs.input.className = 'hidden layui-form-danger';
            }
        }
    },
    mounted () {
        
    },
    methods: {
        clickContentArea: function() {
            if (this.readonly) {
                return;
            }
            this.$emit('clickTagContainerAfter')
        },
        tagClick: function(index) {
            
        },
        close: function(index) {
            if (this.readonly) {
                return;
            }
            this.items.splice(index, 1);
            this.$emit('input', this.items)
        },
        getLabel: function(item, labelKey) {
            if (this.$parent.getTagLabel) {
                return this.$parent.getTagLabel(item, labelKey);
            }
            return item[labelKey];
        }
    }
}
</script>


<style scoped>
    .tag-title {
        border: 1px solid #e6e6e6!important
    }
    .xm-select-parent .tag-title div.xm-select-label>span {position: relative;padding: 2px 5px;background-color: #009688;border-radius: 2px;color: #FFF;display: inline-block;line-height: 18px;height: 18px;margin: 2px 5px 2px 0;cursor: initial;user-select: none;font-size: 14px;padding-right: 25px;-webkit-user-select: none;}
    .xm-select-parent .tag-title div.xm-select-label>span i {position: absolute; margin-left: 8px; font-size: 12px; cursor: pointer; line-height: 20px;}
    /* 颜色相关 */
    div[xm-select-skin] .tag-title div.xm-select-label>span {border: 1px solid #009688}
    div[xm-select-skin] .tag-title div.xm-select-label>span i:hover {opacity: .8;filter: alpha(opacity=80);cursor: pointer}
    div[xm-select-skin=default] .tag-title div.xm-select-label>span {background-color: #F0F2F5;color: #909399;border: 1px solid #F0F2F5}
    div[xm-select-skin=default] .tag-title div.xm-select-label>span i {color: #C0C4CC}
    div[xm-select-skin=default] .tag-title div.xm-select-label>span i:before {content: '\e60b'; font-size: 16px; margin-left: -3px;}
    div[xm-select-skin=primary] .tag-title div.xm-select-label>span {background-color: #009688;color: #FFF;border: 1px solid #009688}
    div[xm-select-skin=primary] .tag-title div.xm-select-label>span i {background-color: #009688; color: #FFF}
    div[xm-select-skin=normal] .tag-title div.xm-select-label>span {background-color: #1E9FFF;color: #FFF;border: 1px solid #1E9FFF}
    div[xm-select-skin=normal] .tag-title div.xm-select-label>span i {background-color: #1E9FFF;color: #FFF}
    div[xm-select-skin=warm] .tag-title div.xm-select-label>span {background-color: #FFB800;color: #FFF;border: 1px solid #FFB800}
    div[xm-select-skin=warm] .tag-title div.xm-select-label>span i {background-color: #FFB800;color: #FFF}
    div[xm-select-skin=danger] .tag-title div.xm-select-label>span {background-color: #FF5722;color: #FFF;border: 1px solid #FF5722}
    div[xm-select-skin=danger] .tag-title div.xm-select-label>span i {background-color: #FF5722;color: #FFF}

    /* 多选联动  */
    .xm-select-parent .layui-form-danger+.tag-title {border-color: #FF5722 !important;}
</style>
