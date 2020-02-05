<template>
    <keep-alive>
        <component v-bind:is="currentComponent" v-on:switch-modal="switchModal"></component>
    </keep-alive>
</template>

<script>
import Base from "@/views/base/Base"
import SysMsgList from '@/views/msg/SysMsgList'
import SysMsgBoard from '@/views/msg/SysMsgBoard'
import { getUserSettingByType, saveOrUpdate } from '@/api/sys/sysUserSetting'


export default {
    name: 'Msg',
	extends: Base,
    components: {
        SysMsgList,
        SysMsgBoard
    },
    data() {
        return {
            currentComponent: null,
        }
    },
    mounted() {
        getUserSettingByType('VIEW_MSG_MODE').then(res => {
            var data = res.data || {};
            var sysUserSettings = data.sysUserSettings;
            var mode = 'list';
            if (sysUserSettings && sysUserSettings.length > 0) {
                var setting = sysUserSettings[0];
                mode = setting.settingValue;
            }
            this.currentComponent = mode != 'board' ? SysMsgList : SysMsgBoard;
        });
    },
    methods: {
        switchModal: function() {
            this.currentComponent = this.currentComponent == SysMsgList ? SysMsgBoard : SysMsgList;
            saveOrUpdate(JSON.stringify({
                userSettingTypeDict: 'VIEW_MSG_MODE',
                settingValue: this.currentComponent == SysMsgList ? 'list' : 'board'
            }));
        }
    }

}
</script>