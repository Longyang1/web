<template>
    <div>
        <input ref="input" name="type" :lay-verify="layVerify" :value="selectedValue" class="hidden" lay-filter="aihao"/>
        <div ref="select" :class="{'layui-unselect layui-form-select': true, 'layui-form-selected': selected, 'layui-form-selectup': selectup}">
            <div class="layui-select-title">
                <input v-if="!selected" @click.stop="selectClick" type="text" :placeholder="placeholder" :value="selectedLabel" :title="selectedLabel" readonly="" :class="{'visible-lg-block layui-input layui-unselect': true, 'readonly': readonly}">
                <input v-show="selected" ref="inputKey" @click.stop="selectClick(false)" type="text" :placeholder="placeholder" :title="key" v-model="key" :class="{'layui-input layui-unselect': true, 'readonly': readonly}">
                <i v-if="!readonly" @click.stop="selectClick" class="layui-edge"></i>
            </div>
            <dl v-if="!readonly" class="layui-anim">
                <dd @click.stop="optionSelected(-1)" lay-value="" :class="{'layui-this': '' == selectedValue}">请选择</dd>
                <template v-for="(item, index) in items">
                    <dd v-if="item[label].indexOf(key) != -1" @click.stop="optionSelected(index)" :key="item[valKey] + index" :lay-value="item[valKey]" :class="{'layui-this': item[valKey] == selectedValue}">{{ item[label] }}</dd>
                </template>
            </dl>
            <input type="hidden" :value="selectedValue"/>
        </div>
    </div>
</template>

<script>
import bus from '@/assets/js/event.js'
export default {
    data () {
        return {
            selected: false,
            selectedValue: this.value,
            selectedLabel: '',
            selectup: this.up,
            key: ''
        }
    },
    props: {
        items: {
            type: Array,
            default: function() {
                return [];
            }
        },
        label: {
            type: String,
            default: 'label'
        },
        valKey: {
            type: String,
            default: 'value'
        },
        value: {
            type: [String, Number],
            default: ''
        },
        layVerify: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        up: {
            type: Boolean,
            default: false
        },
        verifyName: {
            type: String,
            default: ''
        }
    },
    watch: {
        items: function() {
  
            var index = -1;
            if((index = this.items.indexOf(this.value, this.valKey)) != -1){
                this.selectedLabel = this.items[index][this.label];
                this.selectedValue = this.value;
                //this.selected = true;
            } else {
                this.selectedLabel = "";
                this.selectedValue = "";
            }
        },
        value: function() {

            var index = -1;
            if((index = this.items.indexOf(this.value, this.valKey)) != -1){
                this.selectedLabel = this.items[index][this.label];
                this.selectedValue = this.value;
                //this.selected = true;
            } else {
                this.selectedLabel = "";
                this.selectedValue = "";
            }
        },
        selectedValue: function() {
            if (!this.layVerify) {
                return;
            }
            if (this.selectedValue) {
                this.$refs.input.className = 'hidden';
            } else {
                this.$refs.input.className = 'hidden layui-form-danger';
            }
        },
        selected: function() {
            if (!this.selected) {
                this.key = '';
            }
        }
    },
    mounted () {
        bus.$on('selectClose', (obj) => {
            
            if(this != obj){
                this.selected = false;
            }
        });

        if (this.layVerify) {
            bus.$on('startVerify', (verifyName) => {
                
                if(verifyName == this.verifyName && this.$refs.input && this.$refs.input.className){
                    if (this.selectedValue) {
                        this.$refs.input.className = 'hidden';
                    } else {
                        this.$refs.input.className = 'hidden layui-form-danger';
                        bus.$emit('verifyNotPass', verifyName);
                    }
                }
            });
        }
        var index = -1;
        if((index = this.items.indexOf(this.value, this.valKey)) != -1){
            this.selectedLabel = this.items[index][this.label];
            this.selectedValue = this.value;
            //this.selected = true;
        }
    },
    methods: {
        selectClick: function(flag) {
            if (flag === false) {
                this.key = '';
                return;
            }
            this.selected = !this.selected;
            if (this.selected && !this.selectup) {
                // layui-form-selectup
                var subHeight = document.documentElement.clientHeight - this.$refs.select.offsetTop;
                if (subHeight <= 200) {
                    this.selectup = true;
                } else {
                    this.selectup = false;
                }
            }

            bus.$emit('selectClose', this);
            
            if (this.selected) {
                this.$nextTick(() => {
                    this.$refs.inputKey.focus();
                });
            }
        },
        optionSelected: function(index) {
            if (this.readonly) {
                return;
            }
            if(-1 != index){
                this.selectedValue = this.items[index][this.valKey];
                this.selectedLabel = this.items[index][this.label];
            } else {
                this.selectedValue = '';
                this.selectedLabel = '请选择';
            }
            this.selected = !this.selected;
            this.$emit('input', this.selectedValue);
        }
    }
}
</script>

<style scoped>
    .layui-form-select .layui-input.readonly {
        cursor: default;
    }
    ul li {
        float: left;
        width: 205px;
    }
    ul li > div {
        padding: 10px;
        border: 1px solid red;
        text-align: center

    }
    ul li > div:first-child {
        padding-bottom: 10px;
    }
    .share-total {
        padding: 10px; 
        border: 1px solid red;
        text-align: right
    }
</style>