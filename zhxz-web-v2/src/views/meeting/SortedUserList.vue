<template>
    <div>
        <ul class="sortable-list connectList agile-list agile-list-left ui-sortable">
            <li 
                :init-index="index" 
                class="info-element" 
                style="margin-left: 20px;margin-right: 20px;"
                v-for="(item,index) in sortedMembers" 
                v-dragging="{ item: item, list: members, group: 'color' }"
                :key="item.userId">
                <div class="agile-detail">
                    <div class="layui-unselect layui-form-checkbox" lay-skin="primary">
                        <span>{{ index + 1 }} - {{ userMap[item.userId] }}</span>
                    </div>
                    <span style="float:  right;">角色：{{ memberTypeMap[item.meetingMemberTypeDict] }}</span>
                </div>
            </li>
        </ul>
        <div class="layui-form-item layui-layout-admin">
            <div class="layui-input-block">
              <div class="layui-footer" style="left: 0;text-align:center">
                <button @click="trueSorted" class="layui-btn" lay-submit="" lay-filter="component-form-demo1">确定</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            sortedMembers: []
        }
    },
    props: ['members', 'userMap', 'memberTypeMap'],
    mounted () {
        this.sortedMembers = this.members;

        this.$dragging.$on('dragged', ({ value }) => {
            // console.log(value.item)
            // console.log(value.list)
            // console.log(value.otherData)
        })
        this.$dragging.$on('dragend', () => {
            
        })
    },
    methods: {
        trueSorted: function(){
            this.$parent.orderAfter(this.sortedMembers);
        }
    }
}
</script>


<style scoped>

</style>

