<template>
    <div class="subject-type-list">
        <button @click="createSubject('TransactionSubjectAdd')" class="layui-btn layui-btn-lg layui-btn-blue">事务类</button>
        <button @click="createSubject('ProjectSubjectAdd')" class="layui-btn layui-btn-lg layui-btn-blue">项目类</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    methods: {
        createSubject: function(view) {
            this.$parent.$parent.closeTabByName("ProjectSubjectAdd");
            this.$parent.$parent.closeTabByName("TransactionSubjectAdd");
            this.$nextTick(() => {
                this.$parent.$parent.clickMenu({
                    "checked": false,
                    "icon": "fa-legal",
                    "id": "meeting-subject-add",
                    "name": view,
                    "newWindow": 0,
                    "opened": 1,
                    "parentId": "4",
                    "text": "议题创建",
                    "children": [
    
                    ]
                }, 3);
            });
        }
    }
}
</script>

<style scoped>
    .subject-type-list {
        text-align: center;
        height: 100%;
        padding: 30px 130px;
    }
    .layui-btn {
        height: 45px;
        line-height: 45px;
        padding: 0 30px
    }
    .layui-btn:first-child {
        margin-right: 30px;
    }
</style>


