<template>
 <div id="tabs2" fit="true" border="false" class="easyui-tabs2 tabs-container easyui-fluid" style="width: 1893px; height: 359px;">
    <div class="tabs-header tabs-header-noborder" style="width: 1893px;">
      <div class="tabs-scroller-left" style="display: none;"></div>
      <div class="tabs-scroller-right" style="display: none;"></div>
      <div class="tabs-wrap" style="margin-left: 0px; margin-right: 0px; width: 1893px;">
        <ul class="tabs" style="height: 27px;">
          <li class="">
            <a href="javascript:void(0)" class="tabs-inner" style="height: 27px; line-height: 25px;">
              <span class="tabs-title"></span>
              <span class="tabs-icon"></span>
            </a>
          </li>
          <li class="tabs-selected">
            <a href="javascript:void(0)" class="tabs-inner" style="height: 27px; line-height: 25px;">
              <span class="tabs-title tabs-with-icon">1子菜单</span>
              <span class="tabs-icon fa fa-building"></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="tabs-panels tabs-panels-noborder" style="height: 327px; width: 1893px;">
      <div class="panel" style="display: none; width: 1721px;">
        <component :is="curComponent"></component>
      </div>
    </div>
</template>
