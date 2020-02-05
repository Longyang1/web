<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">教育经历</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>毕业院校</td>
                    <td>专业</td>
                    <td>学历</td>
                    <td>学位</td>
                    <td>学习形式</td>
                    <td>起止年月</td>
                    <td>相关证明文件</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelLearningExperiences" :key="item.id">
                    <td>{{ item.graduatedSchool }}</td>
                    <td>{{ item.major }}</td>
                    <td>{{ educationMap[item.educationDict] }}</td>
                    <td>{{ degreeMap[item.degreeDict] }}</td>
                    <td>{{ learningWayMap[item.learningWayDict] }}</td>
                    <td>{{ item.startTime | moment('YYYY.MM') }}--{{ item.endTime | moment('YYYY.MM') }}</td>
                    <td><a v-if="attaMap[item.id]" :href="'/api/file/pub/' + attaMap[item.id].attachmentSavePath" target="_blank">{{ attaMap[item.id].attachmentName }}</a></td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '教育经历编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
                        <span @click="del(item.id, index)" style="color: red"><i class="fa fa-trash" aria-hidden="true"></i> 删除</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import personnelProfileMixin from '@/mixin/personnelProfileMixin'
import * as personnelApi from '@/api/personnel/personnel'
import PersonnelLearningExperienceForm from '@/views/personnel/profile/PersonnelLearningExperienceForm'
import { del } from '@/api/personnel/personnelLearningExperience'
import { getDicts } from '@/api/dict'
import { getAttaments } from '@/api/file'

export default {
    name: 'PersonnelLearningExperience',
    mixins: [personnelProfileMixin],
    data () {
        return {
            learningWayDicts: [],
            educations: [],
            degrees: [],
            personnelLearningExperiences: [],
            attas: [],
        }
    },
    computed: {
        learningWayMap: function() {
            return this.learningWayDicts.array2Obj('value', 'label');
        },
        attaMap: function() {
            var attaMap = {};
            this.attas.forEach(ele => {
                attaMap[ele.attachmentBusinessId] = ele;
            });
            return attaMap;
        },
        educationMap: function() {
            return this.educations.array2Obj('value', 'label');
        },
        degreeMap: function() {
            return this.degrees.array2Obj('value', 'label');
        },
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelLearningExperiences(this.personnelId).then(res => {
                    this.personnelLearningExperiences = Object.assign([], res.data || []);
                    var learningIds = [];
                    this.personnelLearningExperiences.forEach(ele => {
                        learningIds.push(ele.id);
                    });
                    if (learningIds.length > 0) {
                        getAttaments({
                            businessIds: learningIds.join(','),
                            attachmentBusinessType: 'personnel_learning_experience'
                        }).then(res => {
                            var data = res.data;
                            if (data) {
                                this.attas = Object.assign([], data.attachmentInfos || []);
                            }
                        });
                    }
                });
            }

            getDicts('LEARNING_TYPE_DICT,PERSONNEL_EDUCATION_DICT,PERSONNEL_DEGREE_DICT').then(result => {
                var data = result.data;
                if(data){
                    this.learningWayDicts = result.data[0] || [];
                    this.educations = result.data[1] || [];
                    this.degrees = result.data[2] || [];
                }
            });
        },
        add: function (personnelLearningExperienceId, title) {
            var order =  1 + (this.personnelLearningExperiences.length > 0 ? Number(this.personnelLearningExperiences[this.personnelLearningExperiences.length - 1].learnOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelLearningExperienceForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelLearningExperienceId: personnelLearningExperienceId || null,
                        order: (personnelLearningExperienceId ? '' : order)
                    }
                },
                area:['742px', 'auto'],
                title: title || "教育经历添加"
			});
        },
        del: function (personnelLearningExperienceId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelLearningExperienceId).then(res => {
                    this.personnelLearningExperiences.splice(index, 1);
                    alert(res.msg)
                });
            });
        }
    }
}
</script>

<style src="../../../assets/css/personnel/personnelTableProfile.css" scoped></style>
<style lang="less" scoped>
</style>

