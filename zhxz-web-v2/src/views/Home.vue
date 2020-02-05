<template>
    <div class="easyui-layout" fit="true" scroll="no">
        <div class="layout-north " region="north">
            <div>
                <li class="logo"></li>
            </div>

            <div class="hearder-menu">
                <ul id="menu2" class="navmenu">
                    <li v-for="menu in menus" class="dropdown" v-bind:key="menu.id">
                        <a :class="{'menuItem': true,'menuActive': curMenu.id == menu.id}" href="javascript:void(0)"
                            @click="clickTopMenu(menu)">
                            <i style="margin-bottom: 5px;margin-top: 12px;"><img :src="'/img/menu/' + menu.icon + (curMenu.id == menu.id ? '2' : '1') + '.png'"/></i>
                            {{ menu.text }}
                        </a>
                    </li>
                </ul>
            </div>

            <ul class="navmenu-right welcome_panel">
                <li>
                    <a href="javascript:void(0)" id="mb" class="easyui-menubutton" data-options="menu:'#setting',iconCls:'fa fa-user'">{{ user.realName }}</a>
                    <div id="setting" style="width:60px;">
                        <div data-options="iconCls:'fa fa-wrench'" @click="updatePwd()">修改密码</div>
                        <div class="menu-sep"></div>
                        <div data-options="iconCls:'fa fa-sign-out'" @click="logout()">退出系统</div>
                          <!-- <div data-options="iconCls:'fa fa-cogs'" onclick="sysInfo()">系统配置</div>
                          <div data-options="iconCls:'fa fa-share-alt'" onclick="flowInfo()">流程平台</div>
                          <div class="menu-sep"></div>
                          <div data-options="iconCls:'fa fa-cog'">版本号：2.0</div> -->
                    </div>
                </li>
            </ul>
        </div>

        <div v-if="curMenu" id="west" class="layout-west" region="west" :title="curMenu.text">
            <div class="sidebar-nav" id="sidebar_menu">
                <ul id="menu">
                    <li v-for="cMenu in curMenu.children" :key="cMenu.name + cMenu.id">
                        <a href="javascript:void(0)" @click="clickMenu(cMenu, 2)" :class="{'active': cMenu.checked}">
                            <i v-if="cMenu.children && cMenu.children.length > 0 && cMenu.opened" class="sidebar-nav-item-icon fa fa-angle-down"></i>
                            <i v-if="cMenu.children && cMenu.children.length > 0 && !cMenu.opened" class="sidebar-nav-item-icon fa fa-angle-right"></i>
                            <img v-if="cMenu.icon" :src="'/img/menu/child/' + cMenu.icon + '.png'"/> {{ cMenu.text }}
                            <!-- <span :class="'sidebar-nav-item fa ' + cMenu.icon"><i>{{ cMenu.text }}</i></span> -->
                            <span v-if="refresh && cMenu.children.length == 0 && cMenu.num" class="menu-num-text">({{ cMenu.num }})</span>
                        </a>
                        <ul v-if="cMenu.opened">
                            <li v-for="level3Menu in cMenu.children" :key="level3Menu.id">
                                <a href="javascript:void(0)" @click="clickMenu(level3Menu, 3)" :class="{'active': level3Menu.checked}">
                                    <i v-if="level3Menu.children && level3Menu.children.length > 0 && level3Menu.opened"
                                        class="sidebar-nav-item-icon fa fa-angle-down"></i>
                                    <i v-if="level3Menu.children && level3Menu.children.length > 0 && !level3Menu.opened"
                                        class="sidebar-nav-item-icon fa fa-angle-right"></i>
                                    <img v-if="level3Menu.icon" :src="'/img/menu/child/' + level3Menu.icon + '3.png'"/> {{ level3Menu.text }}
                                    <!-- <span :class="'sidebar-nav-item fa ' + level3Menu.icon"><i>{{ level3Menu.text }}</i></span> -->
                                    <span v-if="level3Menu.num" class="menu-num-text">({{ level3Menu.num }})</span>
                                </a>
                                <!-- <ul :class="{'active':n % 2 == 0,'collapse':n % 2 != 0}"></ul> -->
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>


        <div v-if="contextmenu.show" class="m-easyui-menu menu-top menu" :style="{left: contextmenu.pageX + 'px', top: contextmenu.pageY + 'px','z-index': 110025, overflow: 'hidden', width: '150px', height: '132px'}"><div class="menu-line" style="height: 130px;"></div>
			<div id="tab-refresh" iconcls="fa fa-refresh" class="menu-item" @click="tabRefresh">
                <div class="menu-text">刷新</div><div class="menu-icon fa fa-refresh" style="padding-top: 2px;padding-left: 3px;"></div>
            </div>
			<div class="menu-sep"></div>
			<div id="tab-close-right" iconcls="fa fa-angle-double-right" class="menu-item" @click="closeTabs('right')">
                <div class="menu-text">关闭右侧标签页</div><div class="menu-icon fa fa-angle-double-right" style="padding-top: 2px;padding-left: 3px;"></div>
            </div>
			<div id="tab-close-left" iconcls="fa fa-angle-double-left" class="menu-item" @click="closeTabs('left')">
                <div class="menu-text">关闭左侧标签页</div><div class="menu-icon fa fa-angle-double-left" style="padding-top: 2px;padding-left: 3px;"></div>
            </div>
			<div class="menu-sep"></div>
			<div id="tab-close-other" iconcls="fa fa-times-circle-o" class="menu-item" @click="closeTabs('other')">
                <div class="menu-text">关闭其它标签页</div><div class="menu-icon fa fa-times-circle-o" style="padding-top: 2px;padding-left: 3px;"></div>
            </div>
			<div id="tab-close-all" iconcls="fa fa-times-circle" class="menu-item"  @click="closeTabs('all')">
                <div class="menu-text">关闭全部标签页</div><div class="menu-icon fa fa-times-circle" style="padding-top: 2px;padding-left: 3px;"></div>
            </div>
		</div>

        <div class="layout-center" id="mainPanel" region="center">
            <div id="tabs2" fit="true" border="false" class="easyui-tabs2 tabs-container easyui-fluid" style="width: 100%; height: 100%;">
                <div class="tabs-header tabs-header-noborder" style="width: 100%;">
                    <div @click="tabMove('left')" @mouseover="leftover = true" @mouseout="leftover= false" :class="{'tabs-scroller-left': true, 'tabs-scroller-over': leftover}"
                        style="display: none;"></div>
                    <div @click="tabMove('right')" @mouseover="rightover = true" @mouseout="rightover= false" :class="{'tabs-scroller-right': true, 'tabs-scroller-over': rightover}"
                        style="display: none;"></div>
                    <div class="tabs-wrap" style="margin-left: 0px; margin-right: 0px; width: 100%;">
                        <ul v-if="tabs.length > 0" class="tabs" style="height: 27px;">
                            <li :class="{'tabs-selected': tab.checked}" v-for="(tab,index) in tabs" :key="index">
                                <a href="javascript:void(0)" class="tabs-inner" style="height: 27px; line-height: 25px;"
                                    @click="tabClick(index)"
                                    @contextmenu.prevent="rightShow($event, index)">
                                    <span class="tabs-title tabs-closable tabs-with-icon">{{ tab.text }}</span>
                                    <span :class="'tabs-icon fa ' + tab.icon"></span>
                                </a>
                                <a href="javascript:void(0)" class="tabs-close" @click="closeTab(index)"></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="tabs-panels tabs-panels-noborder" style="height: 100%;">
                    <div class="panel" style="display: block; width: 100%; height: 100%;overflow-y: auto;padding-bottom: 20px;">
                        <keep-alive :include="cacheComponents">
                            <router-view v-if="tabs.length > 0 && $route.meta.keepAlive"></router-view>
                        </keep-alive>
                        <router-view v-if="tabs.length > 0 && !$route.meta.keepAlive" :menu-id="curMenu.id"></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import bus from '@/assets/js/event.js'
    import Login from "@/views/Login"
    import UpdatePwd from "@/views/UpdatePwd"
    import {
        getMenus, getChildrenMenuNum
    } from '@/api/user'
    import {
        mapGetters,
        mapState,
        mapMutations,
        mapActions
    } from 'vuex';
    let _ = require('lodash')

    export default {
        name: "Home",
        data() {
            return {
                curComponent: Login,
                tabs: [],
                screenWidth: document.body.clientWidth, // 这里是给到了一个默认值 （这个很重要）
                leftover: false,
                rightover: false,
                moving: false,
                menus: [],
                curMenu: {
                  text: '加载中。。。'
                },
                user: (JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : {
                    'realName': "***"
                }),
                isRouterAlive: true,
                contextmenu: {
                    tabIndex: '',
                    pageY: 0,
                    pageX: 0,
                    tabName: '',
                    show: false
                },
                needNumMenus: ['work', 'msg', 'workflow-service'],
                refresh: true,
                includedComponents: ['MeetingSubjectList']
            };
        },
        computed: {
            activeMenuIds: function () {
                return this.$store.state.home.activeMenuIds;
            },
            cacheComponents: function() {
                var cacheComponents = [];
                this.activeMenuIds.forEach(menu => {
                    cacheComponents.push(menu.menuId);
                });
                return cacheComponents;
            }
        },
        watch: {
            activeMenuIds: function () {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true))
            },
        },
        mounted() {

            $.parser.parse($("body"));
            
            getMenus().then(result => {
                var data = result.data || {};
                this.menus = data.menus || [];
                var authorities = data.authorities || [];
                this.$store.commit('home/SET_AUTHORITIES', authorities);
                if (this.menus.length > 0) {
                    this.curMenu = this.menus[0];

                    this.clickTopMenu(this.curMenu);
                    // $(".panel-title").html(this.curMenu.text);
                    // this.clickMenu(this.curMenu.children[0], 3, {});

                    var viewName = this.$route.query.toPath || "MyWorkSpace";
                    var menu = this.getMenu(viewName, null);
                    this.clickMenu(menu, 3, {});

                    var u = navigator.userAgent;
                    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                    var isMobile = u.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
                    if (isMobile) {
                        var menu = this.getMenu('MeetingList', null);
                        this.clickMenu(menu, 3, {});
                    }
                    $(".layout-west").layout('collapse', 'east');
                }
            }).catch(error => {
                if (error.msg == '初始化密码必须修改') {
                    alert("初始化密码必须修改");
                    this. updatePwd();
                }
            });

            //$.parser.parse($("body"));
            //this.user = JSON.parse(sessionStorage.getItem('user')); 


            const that = this;
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    (that.screenWidth = window.screenWidth), console.log(that.screenWidth);
                    that.tabsScroll();
                })();
            };

            this.globalClick((e) => {
                bus.$emit('selectClose', this);
                if (this.contextmenu.show) {
                    this.$set(this.contextmenu, 'show', false);
                }
            });

            layui.use('element', function(){
                var element = layui.element;
            });
            
            $("#west").panel({
                onExpand: function() {
                    setTimeout(() => {
                        bus.$emit('panelExpandAfter'); 
                    }, 500);
                },
                onCollapse: function() {
                    bus.$emit('panelCollapseAfter');
                },
            });
        },
        methods: {
            rightShow: function(e, index) {
                this.tabClick(index);
                this.$set(this.contextmenu, 'pageX', e.pageX);
                this.$set(this.contextmenu, 'pageY', e.pageY);
                this.$set(this.contextmenu, 'tabName', this.tabs[index].name);
                this.$set(this.contextmenu, 'tabIndex', index);
                this.$set(this.contextmenu, 'show', true);
            },
            logout: function () {
                confirm('确定退出吗？', () => {
                    this.$store.dispatch('user/LOGOUT').then(() => {
                        location.href = "/";
                        // this.$router.push({
                        //     path: '/login',
                        // })
                    }).catch(() => {
    
                    })
                });
            },
            updatePwd: function () {
                this.$layer.iframe({
                    content: {
                        content: UpdatePwd,
                        parent: this,//当前的vue对象
                        data: [
                            
                        ]
                    },
                    area:['580px', ("388px")],
                    title: "修改密码",
                });
            },
            menuIconClass: function (icon) {
                return "icon " + (icon || 'admin-group');
            },
            tabMove: function (direction) {
                var that = this;
                if (this.moving) {
                    return;
                }
                that.moving = true;
                var tabWidth = 0;
                $(".tabs li").each(function (i, item) {
                    tabWidth += $(this).width() + 4;
                });
                var left = $(".tabs li:eq(0)").css("left");
                left = left ? left.substr(0, left.length - 2) : 0;
                //$(item).css({'left': (Number(left) + (direction == "left" ? -10 : 10)) + 'px'})
                left = Number(left) + (direction == "left" ? -50 : 50);
                var w = tabWidth - $(".layout-panel-center").width();
                console.log(left);
                if (direction == "right") {
                    if (left > 0) {
                        that.moving = false;
                        return;
                    }
                } else {
                    console.log(w + left);
                    if (left <= -(w + 100)) {
                        that.moving = false;
                        return;
                    }
                }
                $(".tabs li").animate({
                    left: left + "px"
                });
                setTimeout(function () {
                    that.moving = false;
                }, 400);
            },
            tabsScroll: function () {
                var tabsWidth = 0;
                $(".tabs li").each(function (i, item) {
                    tabsWidth += $(item).width() + 4;
                });
                var tabsContainerWidth = $(".layout-panel-center").width();
                if (tabsWidth > tabsContainerWidth - 80) {
                    $(".tabs-scroller-left").css({
                        display: "block",
                        height: "29px"
                    });
                    $(".tabs-scroller-right").css({
                        display: "block",
                        height: "29px",
                        "z-index": 10000
                    });
                    $(".tabs-wrap").css({
                        marginLeft: "18px",
                        marginRight: "18px"
                    });
                }
            },
            updateMenuNum: function(name, operType, num, children) {
                var menus = children == null ? this.menus : children;
                menus.forEach(menu => {
                    if (menu.name == name) {
                        if (!menu.num) {
                            menu.num = 0;
                        }
                        menu.num = operType == "add" ?  (Number(menu.num) + num) :  (menu.num - num);
                        if (menu.num < 0) {
                            menu.num = 0;
                        }
                        this.refresh = false;
                        this.$nextTick(() => {
                            this.refresh = true;
                        });
                        return;
                    }
                    
                    this.updateMenuNum(name, operType, num, menu.children);
                });
            },
            getMenu: function(name, children) {
                var menus = children == null ? this.menus : children;
                for(var i = 0; i < menus.length; i++) {
                    var menu = menus[i];
                    if (menu.name == name) {
                        return menu;
                    }
                    menu = this.getMenu(name, menu.children);
                    if (menu) {
                        return menu;
                    }
                }
                return null;
            },
            updateChildrenMenuNum:  _.debounce(function (name, func){
                getChildrenMenuNum(name).then(res => {
                    var data = res.data;
                    func(data);
                }).catch(error => {
                    this.$set(this.curMenu, 'id', this.curMenu.id);
                });
            }, 500),
            clickTopMenu: function (cMenu) {
                // this.menus.forEach(menu => {
                //   menu.checked = menu.id == cMenu.id;
                // });
                $(".panel-title").html(cMenu.text);
                this.curMenu = cMenu;
                this.$set(this.curMenu, 'id', this.curMenu.id);
                this.$nextTick(() => {
                    // if($(".layout-button-right").length <= 0 && $(".layout-button-left").length <= 0){
                    //     $.parser.parse($("body"));
                    // }
                    setTimeout(() => {
                        
                        if ($(".layout-button-right").length > 0 && $('.layout-expand').is(':visible')) {
                            $(".layout-button-right").trigger('click');
                        }
                    }, 500);
                });
                // 模拟
                var name = this.curMenu.name;
                if (this.needNumMenus.indexOf(name) != -1) {
                    this.$set(this.curMenu, 'id', this.curMenu.id);
                    this.updateChildrenMenuNum(name, (data) => {
                        if (data) {
                            this.curMenu.children.forEach(menu => {
                                menu['num'] = data[menu.name];
                            });
                        }
                        this.refresh = false;
                        this.$nextTick(() => {
                            this.refresh = true;
                        });
                    });
                } else {
                    this.$set(this.curMenu, 'id', this.curMenu.id);
                }
                var childMenu = this.curMenu.children[0];
                if (!childMenu.opened) {
                    this.clickMenu(childMenu, 2);
                }
                if (childMenu.children && childMenu.children.length > 0) {
                    this.clickMenu(childMenu.children[0], 3);
                }
            },
            clickMenu: function (cMenu, level, params, tabIndex, needDestory) {
                if (!cMenu) {
                    return;
                }
                this.$nextTick(() => {
                    if (!cMenu.icon && cMenu.name) {
                        var m = this.getMenu(cMenu.name, null);
                        if (!m) {
                            m = this.getInfoFromRoutes(this.$router.options.routes, cMenu.name);
                        }
                        Object.assign(cMenu, m);
                    }
                    cMenu['params'] = params;
                    if (!cMenu.name && level != 2) {
                        //alert("无效菜单，请先到后台配置地址");
                        return;
                    }
                    if (level == 2 && cMenu.children.length > 0) {
                        // 模拟
                        var name = cMenu.name;
                        if (cMenu.opened == false && this.needNumMenus.indexOf(name) != -1) {
                            cMenu.opened = !cMenu.opened;
                            this.refresh = false;
                            this.$nextTick(() => {
                                this.refresh = true;
                            });
                            this.updateChildrenMenuNum(name, (data) => {
                                if (data) {
                                    cMenu.children.forEach(menu => {
                                        menu['num'] = data[menu.name];
                                    });
                                    this.refresh = false;
                                    this.$nextTick(() => {
                                        this.refresh = true;
                                    });
                                }
                            });
                        } else {
                            cMenu.opened = !cMenu.opened;
                        }
                        return;
                    } else {
                        this.tabs.forEach(element => {
                            element.checked = false;
                        });
                    }
                    
                    var index = this.tabs.indexOf(cMenu.name, "name");
                    if (needDestory == false) {
                        tabIndex = tabIndex || index;
                        index = -1;
                    }
                    if (index != -1) {
                       
                        if (this.tabs[index].id != cMenu.id) {
                            this.closeTabByName(cMenu.name);
                            cMenu.checked = true;
                            this.tabs.forEach(element => {
                                element.checked = false;
                            });
                            this.tabs.push(cMenu);
                        } else {
                            this.tabs[index].checked = true;
                            this.closeTab(index);
                            this.clickMenu(cMenu, null, cMenu.params, index);
                            return;
                        }
                    } else {
                        cMenu.checked = true;
                        if (tabIndex >= 0) {
                            var howmany = this.tabs[tabIndex] ? (this.tabs[tabIndex].name == cMenu.name ? 1 : 0) : 0;
                            this.tabs.splice(tabIndex, howmany, cMenu);
                        } else {
                            this.tabs.push(cMenu);
                        }
                    }
                    this.$nextTick(() => {
                        this.$store.commit('home/ADD_ACTIVE_MENU_ID', cMenu.name);
                        this.$router.push({
                            name: cMenu.name,
                            params: params
                        });
                        this.tabsScroll();
                    });
                });
            },
            getInfoFromRoutes(routes, name) {
                if (!routes) {
                    return;
                }
                for (let i = 0; i < routes.length; i++) {
                    var route = routes[i];
                    if (route.name == name) {
                        if (!(route.meta.text || route.meta.icon)) {
                            console.warn('请配置路由' + name + ', meta: {text: 配置, icon: 配置}');
                        }
                        return route.meta || {};
                    } else {
                        let meta = this.getInfoFromRoutes(route.children, name);
                        if (meta) {
                            return meta;
                        }
                    }
                }
                return {};
            },
            tabClick: function (index) {
                this.tabs.forEach(element => {
                    element.checked = false;
                });
                this.tabs[index].checked = true;
                //this.curComponent = 'Test' + ((index + 1) % 2 == 0 ? 1 : 2);
                this.$router.push({
                    name: this.tabs[index].name,
                    params: this.tabs[index].params
                });

            },
            closeTab: function (index, needClick) {
                this.$store.commit('home/REMOVE_ACTIVE_MENU_ID', this.tabs[index].name);
                if (needClick != false) {
                    if (index > 0) {
                        this.tabClick(index - 1);
                    } else if (index < (this.tabs.length - 1)) {
                        this.tabClick(index + 1);
                    }
                }
                this.tabs.splice(index, 1);
            },
            tabRefresh: function() {
                var index = this.contextmenu.tabIndex;
                var tab = this.tabs[index];
                this.closeTab(index);
                this.clickMenu(tab, null, tab.params, index);
                this.$set(this.contextmenu, 'show', false);
            },
            tabRefreshByName: function(name) {
                var index = this.tabs.indexOf(name, 'name');
                if (index != -1) {
                    var tab = this.tabs[index];
                    this.closeTab(index);
                    this.clickMenu(tab, null, tab.params, index);
                }
            },
            closeTabs: function(closeType) {
                if (closeType !== "all" && this.tabs.length == 1) {
                    this.$set(this.contextmenu, 'show', false);
                    return;
                }
                var index = 0;
                if (closeType == 'left') {
                    index = 0;
                    if (this.tabs[0].name == this.contextmenu.tabName) {
                        this.$set(this.contextmenu, 'show', false);
                        return;
                    }
                } else if (closeType == "right") {
                    index = this.tabs.length - 1;
                    if (this.tabs[this.tabs.length - 1].name == this.contextmenu.tabName) {
                        this.$set(this.contextmenu, 'show', false);
                        return;
                    }
                } else if (closeType == "other") {
                    index = 0;
                    if (this.tabs[0].name == this.contextmenu.tabName) {
                        index = 1;
                    }
                } else if (closeType == "all") {
                    index = 0;
                }
                if (this.tabs.length == 0) {
                    this.$set(this.contextmenu, 'show', false);
                    return;
                }
                this.closeTab(index);
                this.$nextTick(() => {
                    this.closeTabs(closeType);
                });
            },
            closeTabByName: function(name) {
                var index = this.tabs.indexOf(name, 'name');
                if (index != -1) {
                    this.closeTab(index);
                }
            },
            refreshTabByName: function(name, needDestory, params, func) {
                var index = this.tabs.indexOf(name, 'name');
                if (index == -1) {
                    return;
                }
                var tab = this.tabs[index];
                if (needDestory) {
                    this.closeTab(index, false);
                }
                this.clickMenu(tab, null, tab.params, index, needDestory);
                this.$nextTick(() => {
                    if (needDestory == false) {
                        this.$store.commit('home/SET_CUR_REFRESH_TABLE_TAB_ID', name);
                    }
                });
            },
            backView: function(formViewName, listViewName) {
                var index = this.tabs.indexOf(formViewName, "name");
                if (index == -1) {
                    return;
                }
                this.closeTab(index);
                this.$nextTick(() => {
                    var listIndex = this.tabs.indexOf(listViewName, "name");
                    if (index == 0) {
                        return;
                    }
                    this.tabClick(listIndex == -1 ? (index -1) : listIndex);
                })
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import url("/css/tab-common.css");
    .hearder-menu {
        width: 65%;
    }

    a.menuItem:link {
        color: #ffffff;
    }

    a.m-btn:link {
        color: #444;
    }

    .sidebar-nav a {
        line-height: normal;
    }

    .menu-item:hover {
        background-color: #0081C2;
        border-color: #0081C2;
        color: #fff;
    }
    .menu-num-text {
        float:  right;
        color: #0ab8ed;
    }
    #sidebar_menu ul > li  {
        font-size: 14px;
    }
    .l-cursor {
        cursor: pointer;
    }
</style>
