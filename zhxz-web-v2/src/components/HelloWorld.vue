<template>
  <div class="easyui-layout" fit="true" scroll="no">
    <div class="layout-north " region="north">

      <div>
          <li class="logo"></li>
      </div>

	    <div class="hearder-menu">
	        <ul id="menu2" class="navmenu">
	        	<li v-for="menu in menus" class="dropdown" v-bind:key="menu.id">
	        		<a class="menuItem" href="javascript:void(0)" @click="clickTopMenu(menu)">
	        			<i><span :class="menuIconClass(menu.icon)"></span></i>
	        			{{ menu.text }}
	        		</a>
	        	</li>
	        </ul>
	    </div>

	   <ul class="navmenu-right welcome_panel"> 
	       <li>
	        	<a href="javascript:void(0)" id="mb" class="easyui-menubutton"  data-options="menu:'#setting',iconCls:'fa fa-user'">admin</a>
				<div id="setting" style="width:60px;">
					<div data-options="iconCls:'fa fa-sign-out'" onclick="loginOut()">退出系统</div>
					<div class="menu-sep"></div>
					<div data-options="iconCls:'fa fa-cogs'" onclick="sysInfo()">系统配置</div>
				    <div data-options="iconCls:'fa fa-share-alt'" onclick="flowInfo()">流程平台</div>
				    <div class="menu-sep"></div>
					<div data-options="iconCls:'fa fa-cog'">版本号：2.0</div>
				</div>
			</li>
	    </ul>
	  </div>

    <div class="layout-west" region="west" style="overflow:auto;" title="工作空间">
		<div class="sidebar-nav" id="sidebar_menu" >
        <ul id="menu">
          <li v-for="cMenu in curMenu.children" :key="cMenu.id">
          <a  href="javascript:void(0)" @click="clickMenu(cMenu)">
          <i v-if="cMenu.children && cMenu.children.length > 0" class="sidebar-nav-item-icon fa fa-angle-down"></i>
          <i v-if="cMenu.children && cMenu.children.length > 0" class="sidebar-nav-item-icon fa fa-angle-right"></i>
          <span :class="'sidebar-nav-item fa ' + cMenu.icon"><i>{{ cMenu.text }}</i></span>
          </a>
          <!-- <ul :class="{'active':n % 2 == 0,'collapse':n % 2 != 0}"></ul> -->
        </li>
        </ul>
      </div>
    </div>

    <div class="layout-center" id="mainPanel" region="center">
      <div id="tabs2" fit="true" border="false" class="easyui-tabs2 tabs-container easyui-fluid" style="width: 100%; height: 100%;">
        <div class="tabs-header tabs-header-noborder" style="width: 100%;">
          <div @click="tabMove('left')" @mouseover="leftover = true" @mouseout="leftover= false" :class="{'tabs-scroller-left': true, 'tabs-scroller-over': leftover}" style="display: none;"></div>
          <div @click="tabMove('right')" @mouseover="rightover = true" @mouseout="rightover= false" :class="{'tabs-scroller-right': true, 'tabs-scroller-over': rightover}" style="display: none;"></div>
          <div class="tabs-wrap" style="margin-left: 0px; margin-right: 0px; width: 100%;">
            <ul v-if="tabs.length > 0" class="tabs" style="height: 27px;">
              <li :class="{'tabs-selected': tab.checked}" v-for="(tab,index) in tabs" :key="index">
                <a href="javascript:void(0)" class="tabs-inner" style="height: 27px; line-height: 25px;" @click="tabClick(index)">
                  <span class="tabs-title tabs-closable tabs-with-icon">{{ tab.text }}</span>
                  <span class="tabs-icon fa fa-cube"></span>
                </a>
                <a href="javascript:void(0)" class="tabs-close" @click="closeTab(index)"></a>
              </li>
            </ul>
          </div>
        </div>
        <div class="tabs-panels tabs-panels-noborder" style="height: 100%;">
          <div class="panel" style="display: block; width: 100%; height: 100%;overflow-y: auto;padding-bottom: 20px;">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Login from "@/views/Login";
import { menus } from "@/utils/menu.js";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      curComponent: Login,
      tabs: [],
      screenWidth: document.body.clientWidth, // 这里是给到了一个默认值 （这个很重要）
      leftover: false,
      rightover: false,
      moving: false,
      menus: menus,
      curMenu: menus[0]
    };
  },
  mounted() {
    $.parser.parse($("body"));

    this.clickMenu(this.curMenu.children[0]);
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        (that.screenWidth = window.screenWidth), console.log(that.screenWidth);
        that.tabsScroll();
      })();
    };
  },
  watch: {},
  methods: {
    menuIconClass: function(icon) {
      return "icon " + icon;
    },
    tabMove: function(direction) {
      var that = this;
      if (this.moving) {
        return;
      }
      that.moving = true;
      var tabWidth = 0;
      $(".tabs li").each(function(i, item) {
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
      $(".tabs li").animate({ left: left + "px" });
      setTimeout(function() {
        that.moving = false;
      }, 400);
    },
    tabsScroll: function() {
      var tabsWidth = 0;
      $(".tabs li").each(function(i, item) {
        tabsWidth += $(item).width() + 4;
      });
      var tabsContainerWidth = $(".layout-panel-center").width();
      if (tabsWidth > tabsContainerWidth - 80) {
        $(".tabs-scroller-left").css({ display: "block", height: "29px" });
        $(".tabs-scroller-right").css({
          display: "block",
          height: "29px",
          "z-index": 10000
        });
        $(".tabs-wrap").css({ marginLeft: "18px", marginRight: "18px" });
      }
    },
    test: () => {},
    clickTopMenu: function(cMenu) {
      this.menus.forEach(menu => {
        menu.checked = menu.id == cMenu.id;
      });
      this.cMenu = cMenu;
    },
    clickMenu: function(cMenu) {
      // var tabs = $('#tabs');
      // tabs.tabs('add', {
      //   title : n + "子菜单",
      //   iconCls : "fa fa-building",
      //   href : ""
      // });
      // var $tab = $('#tabs').tabs('getTab',  n + "子菜单");
      // $tab.panel('body').css({display:'none'});
      // $tab.panel('body').append('<router-view></router-view>');

      // this.$router.push({path: '/test'});
      this.tabs.forEach(element => {
        element.checked = false;
      });
      var index = this.tabs.indexOf(cMenu.id, "id");
      if (index != -1) {
        this.tabs[index].checked = true;
      } else {
        cMenu.checked = true;
        this.tabs.push(cMenu);
      }
      this.$router.push({
        name: "MeetingList",
        params: { id: 45 }
      });
      this.tabsScroll();
    },
    tabClick: function(index) {
      this.tabs.forEach(element => {
        element.checked = false;
      });
      this.tabs[index].checked = true;
      //this.curComponent = 'Test' + ((index + 1) % 2 == 0 ? 1 : 2);
      this.$router.push({
        name: "MeetingList",
        params: { id: 45 }
      });
    },
    closeTab: function(index) {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url("../../static/css/tab-common.css");
a.menuItem:link {
  color: #ffffff;
}
a.m-btn:link {
  color: #444;
}
</style>
