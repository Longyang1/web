<template>
    <div class="layui-inline">
        <label v-if="label" :class="{'layui-form-label': true, 'layui-required': layVerify != ''}">{{ label }}</label>
        <div :class="{'layui-input-block': label}" :style="cssStyle">
            <layui-checkbox-group
                v-if="items.length > 0"  
                v-model="checkedVals"
                @clickCheckboxAfter="clickCheckboxAfter">
                <layui-checkbox 
                    v-for="item in items"
                    :laySkin="laySkin"
                    :key="item[valKey]"
                    :name="name"
                    :label="labelMap ? labelMap[item[valKey]] : item[labelKey]"
                    :val="item[valKey]"
                    :checkedVals="checkedVals"
                    :disabled="readonly"
                    :sort="sort"></layui-checkbox>
            </layui-checkbox-group>
        </div>
        <input type="hidden">
    </div>
</template>

<script>
export default {
    data () {
        return {
            checkedVals: this.value || [],
        }
    },
    props: {
        items: {
            type: Array,
            default: []
        },
        label: {
            type: String,
            default: null
        },
        valKey: {
            type: String,
            default: 'value'
        },
        labelKey: {
            type: String,
            default: 'label'
        },
        value: {
            type: Array,
            default: function() {
                return [];
            }
        },
        name: {
            type: String,
            default: ''
        },
        cssStyle: {
            type: Object,
            default: function() {
                return {
                    'margin-right': '50px'
                }
            }
        },
        sort: {
            type: Boolean,
            default: true
        },
        labelMap: {
            type: Object,
            default: function() {
                return null;
            }
        },
        laySkin: {
            type: String,
            default: ''
        },
        layVerify: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value: function() {
            this.checkedVals = this.value;
        }
    },
    methods: {
        clickCheckboxAfter: function(param) {
            this.$emit('clickCheckboxAfter', param);
        }
    }
}
</script>