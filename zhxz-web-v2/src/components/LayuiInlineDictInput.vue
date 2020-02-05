<template>
    <div>
        <layui-inline-input
            :label="label"
            :placeholder="placeholder"
            :layVerify="layVerify"
            v-model="val"
            :block="block">
        </layui-inline-input>
        <span>
            <i @click="openDictSelectModal" class="fa fa-plus text-warning select-pros">
                <label data-v-41bc9d82="">选择</label>
            </i>
        </span>
    </div>
</template>

<script>
import DictSelectList from '@/components/DictSelectList'
export default {
    data() {
        return {
            val: this.value
        }
    },
    props: {
        value: {
            type: String,
            default: ""
        },
        label: {
            type: String,
            default: ""
        },
        dictType: {
            type: String,
            default: ""
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
    },
    watch: {
        value: function() {
            this.val = this.value;
        },
        val: function() {
            this.$emit('input', this.val);
        }
    },
    methods: {
        openDictSelectModal: function() {
            this.$layer.iframe({
				content: {
					content: DictSelectList, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
                        isMultiSelect: false,
                        dictType: this.dictType
					}//props
				},
				area: ['80%', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "选择"
			});
        },
        getSelectItem: function(dict, layid) {
            this.val = dict.label;
            this.$emit('input', dict.label);
            this.$emit('selectOrInputAfter', dict);
            this.$layer.close(layid);
        }
    }
}
</script>

<style scoped>

</style>


