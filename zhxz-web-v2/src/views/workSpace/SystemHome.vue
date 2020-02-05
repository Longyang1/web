<template>
     <!-- 工作空间-我的工作空间 -->
    <div class="view-product">
        <div class="row" style="width: 50%;float: left">
            <my-todo></my-todo>
            <article-view-top categoryId='1' viewName="Notice"></article-view-top>
            <article-view-top categoryName="制度信息" categoryId='282737714280374276' viewName="SystemInformation" :enableKnow="true"></article-view-top>
        </div>
        <div class="row" style="width: 50%;float: right">
            <shortcut-navigation>
                <span
                    v-authorize="'ITIM.PERSONNEL.MYADDRESS'"
                    @click="toView('PersonnelAddressBookList', {})"
                    class="tongxunlu"
                    style="background-color: #1E9FFF;">
                    <img src="/img/tongxunlu1.png" alt="">通讯录</span>
            </shortcut-navigation>
            <article-view-top categoryId='337873240252129280' viewName="XlkhNews"></article-view-top>
        </div>
    </div>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import MyTodo from '@/views/workSpace/MyTodo'
import ShortcutNavigation from '@/views/sys/ShortcutNavigation'
import ArticleViewTop from '@/views/cms/ArticleViewTop'
export default {
    name: "SystemHome",
    extends: Base,
    components: {
        MyTodo,
        ShortcutNavigation,
        ArticleViewTop
    },
    data() {
        return {
  
        }
    },
    mounted() {
        
    }
    
}
</script>

<style scoped>
    .view-product {
        padding: 5px 0;
    }

    .row {
        margin: 0;
    }

    .view-product /deep/ .custom-panel {
        padding-left: 5px;
        padding-right: 5px;
    }
    .tongxunlu {
        padding: 8px 23px;
        margin-right: 8px;
        color: #fff;
        display: inline-block;
        cursor: pointer;
        border-radius: 5px;
    }
    img {
        vertical-align: top;
        margin-right: 8px;
    }
</style>
