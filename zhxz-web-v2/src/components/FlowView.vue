<template>
    <div v-if="flowRefresh" class="layui-tab layui-tab-brief" style="margin-top: 0px;">
        <ul v-if="enableFlow && businessKey && status > 1" class="layui-tab-title">
            <li class="layui-this">{{ title }}</li>
            <li class="">审批历史</li>
            <li class="">流程图</li>
        </ul>
        <div class="layui-body layui-tab-content" :style="{left: '10px', top: (enableFlow && businessKey && status > 1 ? '46px' : '0px'), 'padding-right': '15px'}">
            <div class="layui-tab-item layui-show">
                <slot></slot>
            </div>
            <div class="layui-tab-item">
                <approval-history
                    v-if="enableFlow && businessKey && status > 1"
                    :processKey="processKey"
                    :businessKey="businessKey"></approval-history>
            </div>
            <div class="layui-tab-item">
                <process-diagram
                    v-if="enableFlow && businessKey && status > 1"
                    :processKey="processKey"
                    :businessKey="businessKey"></process-diagram>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '@/assets/js/event.js'

export default {
    data() {
        return {
            flowRefresh: true
        }
    },
    props: {
        title: {
            type: String,
            default: "基本信息"
        },
        processKey: {
            type: String,
            default: ""
        },
        businessKey: {
            type: String,
            default: ""
        },
        enableFlow: {
            type: Boolean,
            default: false
        },
        status: {
            type: [String, Number],
            default: ""
        }
    },
    mounted() {
        bus.$on('flowRefresh', (data) => {
            if (data.processKey == this.processKey && data.businessKey == this.businessKey) {
                this.refresh();
            }
        });
    },
    methods: {
        refresh() {
            this.flowRefresh = false;
            this.$nextTick(() => {
                this.flowRefresh = true;
            });
        }
    }
}
</script>