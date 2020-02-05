<template>
    <div class="col-sm-7 custom-panel" style="width: 100%">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5><span class="custom-border"><span style="padding-left: 8px;">我的待办</span></span></h5>
                <div class="ibox-tools"></div>
            </div>
            <div class="ibox-content">
                <div class="layui-row layui-col-space10 panel_box">
                    <div
                        v-for="(item, index) in items" 
                        class="panel layui-col-xs12 layui-col-sm6 layui-col-md4"
                        :key="index">
                        <a href="javascript:;" @click="toView(item.viewName, {})">
                            <div :class="'panel_icon ' + item.color">
                                <i :class="'layui-icon ' + item.icon"></i>
                            </div>
                            <div class="panel_word">
                                <span>{{ item.num }}</span>
                                <cite>{{ item.label }}</cite>
                            </div>
                        </a>
                    </div>
                </div>
                <hr class="layui-bg-gray">

                <div class="system-msg">
                    <div class="marquee-msg">
                        <div class="marquee-title">
                            <span><i class="fa fa-exclamation-circle"></i> 系统消息：</span>
                        </div>
                        <div class="marquee-box">
                            <ul class="marquee-list">
                                <li>
                                    <span class="marquee-text"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getChildrenMenuNum } from '@/api/user'
import Base from "@/views/base/Base"
export default {
    name: 'MyTodo',
	extends: Base, 
    data() {
        return {
            currentComponent: null,
            items: [
                {
                    service: 'msg',
                    menuKey: 'Msg',
                    viewName: 'Msg',
                    label: '消息提醒',
                    icon: 'layui-icon-notice',
                    color: 'layui-bg-blue',
                    num: '',
                },
                {
                    service: 'workflow-service',
                    menuKey: 'ToProcessed',
                    viewName: 'ToProcessed',
                    label: '待处理',
                    icon: 'layui-icon-ok-circle',
                    color: 'layui-bg-red',
                    num: '',
                },
                {
                    service: 'msg',
                    menuKey: 'msg',
                    viewName: 'Msg',
                    label: '待我阅读',
                    icon: 'layui-icon-read',
                    color: 'layui-bg-orange',
                    num: '',
                },
            ]
        }
    },
    mounted() {
        this.items.forEach(item => {
            getChildrenMenuNum(item.service).then(res => {
                var data = res.data || {};
                item.num = data[item.menuKey] || 0;
            });
        });
    }

}
</script>

<style scoped>
.ibox {
    margin-bottom: 10px;
}

.custom-panel {
    padding-left: 5px;
    padding-right: 5px;
}

.custom-panel .ibox-title {
    height: 32px;
    padding: 8px 10px;
    color: #305894;
    font-family: "Tahoma";
    font-weight: 500;
}

.ibox-title .custom-border {
    background: url(/img/title_tb.jpg) no-repeat left;
    margin-right: 6px;
}

.custom-panel .ibox-content {
    padding: 10px;
}
.panel_box {
    margin-bottom: 5px;
}

.panel {
    text-align: center;
    height: 121px;
    margin-bottom: 0;
}

.panel_box a {
    display: block;
    border-radius: 5px;
    overflow: hidden;
    height: 110px;
    background-color: #f2f2f2 !important;
}

.panel_icon {
    width: 45%;
    display: inline-block;
    line-height: 110px;
    float: left;
    position: relative;
    height: 100%;
}

.panel_icon i {
    font-size: 45px !important;
    color: #fff;
    display: inline-block;
}

.panel_word {
    width: 55%;
    display: inline-block;
    float: right;
    margin: 30px 0;
}

.panel_word span {
    font-size: 28px;
    display: block;
    height: 34px;
    font-weight: 600;
    color: #5a5a5a;
}

.panel_word cite {
    font-size: 12px;
    color: #888;
}

.panel_word .end-unit {
    color: #5a5a5a;
}

.system-msg {
    display: block;
    overflow: hidden;
    background-color: #f2f2f2 !important;
    border: 1px solid #dee5e7;
    border-radius: 5px;
    font-size: 12px;
    color: #888;
    padding: 5px;
}

.marquee-msg {
    width: 100%;
    line-height: 18px;
    align-items: center;
    display: flex;
    box-sizing: border-box;
}

.marquee-title {
    line-height: 18px;
    align-items: center;
    color: #1890ff;
    width: 80px;
}

.marquee-box {
    display: block;
    position: relative;
    width: 84%;
    height: 18px;
    overflow: hidden;
}

.marquee-list {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}

.marquee_top {
    transition: all 0.5s;
    margin-top: -18px
}

.marquee-list li {
    height: 18px;
    line-height: 18px;
    cursor: pointer;
}

.marquee-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}
</style>