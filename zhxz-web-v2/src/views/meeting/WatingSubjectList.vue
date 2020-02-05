<template>
    <div>
        <ul class="sortable-list connectList agile-list agile-list-left ui-sortable">
            <template v-for="item in subjects">
                <li 
                    class="info-element" 
                    style="margin-left: 20px;margin-right: 20px;"
                    :key="item.id">
                    <div class="agile-detail">
                        <layui-simple-checkbox 
                            :label="meetingSubjectTypeMap[item.meetingSubjectTypeDict] + '——' + item.subjectName"
                            :val="item"
                            @clickCheckboxAfter="clickCheckboxAfter"></layui-simple-checkbox>
                        
                        <span style="float:  right;" v-if="item.projectId">牵头部门：{{ officeNameMap[projectOfficeMap[item.projectId]] }}</span>
                        <span style="float:  right;" v-if="!item.projectId">汇报部门：{{ officeNameMap[item.reportOfficeId] }}</span>
                    </div>
                </li>
            </template>
        </ul>
        <div class="layui-form-item layui-layout-admin">
            <div class="layui-input-block">
              <div class="layui-footer" style="left: 0;text-align:center">
                <button @click="trueSelected" class="layui-btn" lay-submit="" lay-filter="component-form-demo1">确定</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            selectedSubjects: []
        }
    },
    props: ['subjects', 'meetingSubjectTypeMap', 'officeNameMap', 'projectOfficeMap'],
    methods: {
        clickCheckboxAfter: function(data){

            if(data.checked){
                this.selectedSubjects.push(data.val);
            } else {
                var index = this.selectedSubjects.indexOf(data.val.id, 'id');
                this.selectedSubjects.splice(index, 1);
            }
        },
        trueSelected: function(){
            this.$parent.trueSelectedSubjects(this.selectedSubjects);
        }
    }

}
</script>

<style scoped>

</style>


