<template>
    <div class="col-sm-5 custom-panel" style="width: 100%">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5><span class="custom-border"><span style="padding-left: 8px;">快捷导航</span></span></h5>
                <div class="ibox-tools">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i class="fa fa-reorder"></i>
                    </a>
                </div>
            </div>
            <div class="ibox-content">
                <div class="btn-two">
                    <slot></slot>
                </div>
                <div class="custom-nav">
                    <template>
                        <a 
                            v-for="(item, index) in sysShortcutPrivileges" 
                            :key="index"
                            @click="toView((privilegeMap[item.privilegeId] ? privilegeMap[item.privilegeId].privilegeUrl : null), {})"
                            class="nav-icon">
                            <img alt="member" src="/img/kjdh.png"/>
                            <p>{{ privilegeMap[item.privilegeId] | pv('privilegeName') }}</p>
                        </a>
                    </template>
                    <a @click="addMore" class="nav-icon nav-add">
                        <i class="fa fa-plus"></i>
                        <p>添加更多</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import MyMenuTree from '@/views/sys/MyMenuTree'
import { getSysShortcutPrivileges } from '@/api/sys/SysShortcutPrivilege'

export default {
	name: 'ShortcutNavigation',
    extends: Base,
    data() {
        return {
           sysShortcutPrivileges: [],
           privilegeMap: {},
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        saveAfter: function() {
            this.initData();
        },
        addMore: function() {
            this.$layer.iframe({
				content: {
					content: MyMenuTree, //传递的组件对象
					parent: this,//当前的vue对象
					data: {
					
					}
				},
				area: ['auto', ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8 + "px")],
				title: "我的菜单",
            });
        },
        initData: function() {
            getSysShortcutPrivileges().then(res => {
                var data = res.data || {};
                this.sysShortcutPrivileges = data.sysShortcutPrivileges || [];
                this.privilegeMap = data.privilegeMap || {};
            });
        }
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
.custom-nav .nav-icon {
    margin-bottom: 5px;
    display: inline-block;
    width: 80px;
    text-align: center;
}

.nav-icon i {
    height: 48px;
    width: 48px;
    display: block;
    background: #1e9fff!important;
    padding: 9px 8px;
    text-align: center;
    font-size: 28px;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
    margin: 0 auto;
}

.nav-icon img {
    width: 48px;
    height: 48px;
    border: 1px solid #1e9fff;
    border-radius: 50%;
    padding: 2px;
}

.nav-icon p {
    margin: 5px 0;
    text-align: center;
    font-size: 12px;
    color: #5a5a5a;
    display: grid;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.nav-add i {
    background: #cccccc!important;
    padding-top: 11px;
}
.btn-two {
    margin-bottom: 30px;
}
</style>