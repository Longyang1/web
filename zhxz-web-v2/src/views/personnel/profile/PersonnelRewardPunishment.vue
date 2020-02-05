<template>
    <div class="table-box">
        <div>
            <div style="display: inline-block;padding-bottom: 0;background:#05afef;">
                <p :class="'iconfont ' + icon" style="padding-left: 10px"></p>
                <p style="padding-right: 10px">奖惩情况</p>
                <i class="triangle"></i>
            </div>
            <span v-if="canEdit" @click="add(null)" class="iconfont icon-tianjia"> 添加</span>
        </div>
        <div>
            <table>
                <tr>
                    <td>获得时间</td>
                    <td style="min-width: 100px;">奖惩类型</td>
                    <td>奖惩名称</td>
                    <td>颁发单位</td>
                    <td>情况说明</td>
                    <td>相关文件</td>
                    <td v-if="canEdit">操作</td>
                </tr>
                <tr v-for="(item, index) in personnelRewardPunishments" :key="item.id">
                    <td>{{ item.getTime | moment('YYYY.MM.DD') }}</td>
                    <td>{{ rpMap[item.rpType] }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.issuingUnit }}</td>
                    <td>{{ item.statement }}</td>
                    <td><a v-if="attaMap[item.id]" :href="'/api/file/pub/' + attaMap[item.id].attachmentSavePath" target="_blank">{{ attaMap[item.id].attachmentName }}</a></td>
                    <td v-if="canEdit" class="oper-td" style="width: 124px">
                        <span @click="add(item.id, '奖惩情况编辑')" class="iconfont icon-xiugai" style="color: #2b64ce;font-size: 14px"> 编辑</span>
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
import PersonnelRewardPunishmentForm from '@/views/personnel/profile/PersonnelRewardPunishmentForm'
import { del } from '@/api/personnel/personnelRewardPunishment'
import { getAttaments } from '@/api/file'
import { getDicts } from '@/api/dict'

export default {
    name: 'PersonnelRewardPunishment',
    mixins: [personnelProfileMixin],
    data () {
        return {
            personnelRewardPunishments: [],
            attas: [],
            rpTypes: [],
        }
    },
    computed: {
        attaMap: function() {
            var attaMap = {};
            this.attas.forEach(ele => {
                attaMap[ele.attachmentBusinessId] = ele;
            });
            return attaMap;
        },
        rpMap: function() {
            return this.rpTypes.array2Obj('value', 'label');
        }
    },
    mounted () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (this.personnelId) {
                personnelApi.getPersonnelRewardPunishments(this.personnelId).then(res => {
                    this.personnelRewardPunishments = Object.assign([], res.data || []);
                    var rpIds = [];
                    this.personnelRewardPunishments.forEach(ele => {
                        rpIds.push(ele.id);
                    });
                    if (rpIds.length > 0) {
                        getAttaments({
                            businessIds: rpIds.join(','),
                            attachmentBusinessType: 'personnel_reward_punishment'
                        }).then(res => {
                            var data = res.data;
                            if (data) {
                                this.attas = Object.assign([], data.attachmentInfos || []);
                            }
                        });
                    }
                });
            }

            getDicts('REWARD_PUNISHMENT_DICT').then(result => {
                var data = result.data;
                if(data){
                    this.rpTypes = data[0] || [];
                }
            });
        },
        add: function (rewardPunishmentId, title) {
            var order =  1 + (this.personnelRewardPunishments.length > 0 ? Number(this.personnelRewardPunishments[this.personnelRewardPunishments.length - 1].rpOrder || 0) : 0);
            this.$layer.iframe({
                content: {
                    content: PersonnelRewardPunishmentForm, //传递的组件对象
                    parent: this,//当前的vue对象
                    data: {
                        personnelId: this.personnelId,
                        personnelRewardPunishmentId: (rewardPunishmentId || null),
                        order: (rewardPunishmentId ? '' : order)
                    }
                },
                area:['722px', 'auto'],
                title: title || ("奖惩情况" + (rewardPunishmentId ? '编辑' : '添加'))
			});
        },
        del: function (personnelRewardPunishmentId, index) {
            confirm("确定删除该条记录吗？", () => {
                del(personnelRewardPunishmentId).then(res => {
                    this.personnelRewardPunishments.splice(index, 1);
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
