<template>
    <div>
        <layui-inline-input
            :name="name"
            :label="label"
            v-model="val"
            :readonly="readonly"
            :cssStyle="cssStyle">
                <a @click="add" class="btn-num btn-add" href="javascript:;">+</a>
                <a @click="reduce" class="btn-num btn-reduce" href="javascript:;">-</a>
            </layui-inline-input>
    </div>
</template>

<script>
export default {
    data () {
        return {
           val: this.value 
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Number],
            default: 1
        },
        label: {
            type: String,
            default: ''
        },
        cssStyle: {
            type: Object,
            default: () => {
                return  {
                    'width': '172px',
                    'margin-right': '0px', 
                    'text-align': 'center'
                }
            }
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value: function () {
            this.val = this.value;
        }
    },
    methods: {
        add: function () {
            if (this.readonly) {
                return;
            }
            var val = this.val;
            if (isNaN(val)) {
                val = 0;
            }
            this.val = Number(val) + 1;
            this.$emit('input', this.val);
        },
        reduce: function () {
            if (this.readonly) {
                return;
            }
            var val = this.val;
            if (val && val > 0) {
                this.val = val - 1;
                this.$emit('input', this.val);
            }
        },
    }
}
</script>

<style scoped>
div {
    display: inline-block;
}
div /deep/ .layui-inline {
    margin-right: 34px;
}
a.btn-num {
    top: 0px;
    display: block;
    width: 19px;
    text-align: center;
    height: 19px;
    line-height: 19px;
    overflow: hidden;
    background: #f1f1f1;
    color: #666;
    position: absolute;
    right: -19px;
    border: 1px solid #e6e6e6;
    border-left: none;
}
a.btn-reduce {
    top: 19px;
}
</style>

