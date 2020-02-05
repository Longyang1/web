<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data () {
        return {
            checkedList: this.value || [],
        }
    },
    props: {
        value: {
            type: Array,
            default: function() {
                return [];
            }
        },
        sort: {
            type: Boolean,
            default: true
        },
    },
    watch: {
        
    },
    mounted () {
        this.checkedList = this.value || [];
    },
    methods: {
        updateCheckedList: function(val, isChecked, valKey) {
            if (isChecked) {
                this.checkedList.push(val);
                if (this.sort) {
                    this.checkedList = this.checkedList.sort(compare);
                }
            } else {
                var index = this.checkedList.indexOf(val);
                if (index != -1) {
                    this.checkedList.splice(index, 1);
                }
            }
            
            this.$emit('value', this.checkedList);

            this.$emit("clickCheckboxAfter", {
                val: val,
                checked: isChecked
            });

            var compare = function (obj1, obj2) {
                var val1 = obj1.name;
                var val2 = obj2.name;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            }
        }
    }
}
</script>

<style scoped>

</style>
