<template>
    <span class="layui-table-sort layui-inline" :lay-sort="order">
        <i @click="fieldSort(true)" class="layui-edge layui-table-sort-asc" title="升序"></i>
        <i @click="fieldSort(false)" class="layui-edge layui-table-sort-desc" title="降序"></i>
    </span>
</template>

<script>
import bus from '@/assets/js/event.js'
export default {
    data () {
        return {
            order: ''
        }
    },
    props: {
        field: {
            type: String,
            default: ''
        },
        orderFieldName: {
            type: String,
            default: 'orderField'
        }
    },
    mounted () {
        bus.$on('fieldOrder', (obj) => {
            
            if (obj.vpage) {
                this.order = obj.vpage._uid == this.$parent._uid ? '' : this.order;
                return;
            }
            if(this.$parent == obj.parent && this != obj.target){
                this.order = '';
            }
        });
    },
    methods: {
        fieldSort: function(asc) {
            this.$parent.searchForm[this.orderFieldName] = this.field;
            this.$parent.searchForm['orderAsc'] = asc;
            this.order = asc ? 'asc' : 'desc';
            bus.$emit('fieldOrder', {
                target: this,
                parent: this.$parent,
            });
            this.$emit('orderBefore', {
                searchForm: this.$parent.searchForm,
                orderFieldName: this.orderFieldName
            });
            this.$parent.refresh();
        }
    }
}
</script>

