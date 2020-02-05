<template>
    <pagination-simple
        v-if="refreshed"
        type="2"
        :url="url"
        :otherParam="otherParam"
        :dictParam="dictParam"
        :dataParamName="dataParamName"
        :showPage="showPage ? showPage : true"
        :showSimplePage="showSimplePage ? showSimplePage : false"
        @handleSearchResult="handleSearchResult"
        :btnCenter="btnCenter"
        :meReset="false"
        :showBtn="notShowBtn != true"
        :showEmptyDataMsg="showEmptyDataMsg"
        :showResetBtn="showResetBtn == false ? showResetBtn : true"
        :autoSearch="autoSearch == true"
        ref="pagination">
        <template v-if="tabRefreshed">
            <div
                v-for="(title, index) in titles"
                :key="title + index"
                class="search-condition-row">
                <span 
                    v-if="show"
                    class="title" 
                    :style="{'width': (width > 0 ? (width + 'px') : (maxWidth == 0 ? 'auto' : maxWidth + 'px'))}"
                    :ref="'title' + index">{{ title }}：</span>
                <template v-for="(dict) in dicts[index]">
                    <button 
                        :class="{'layui-btn layui-btn-sm': true, 'layui-btn-primary': true, 'layui-btn-orange': dict.selected}"  
                        @click="conditionSelected(paramNames[index], index, dict.value)"
                        :key="dict.value">{{ dict.label }}</button>
                </template>
                <slot v-if="show" :name="'dict' + index"></slot>
            </div>
        </template>
        <template slot="searchBtnTop">
            <slot name="searchBtnTop"></slot>
        </template>
        <template slot="searchBtnBefore">
            <slot name="searchBtnBefore"></slot>
        </template>
        <template slot="searchBtnAfter">
            <slot name="searchBtnAfter"></slot>
        </template>
        <template slot="custom">
            <slot name="custom"></slot>
        </template>
        <template slot="opera">
            <slot name="opera"></slot>
        </template>
        <template slot="main">
            <slot name="main"></slot>
        </template>
    </pagination-simple>
</template>
<script>
export default {
    data () {
        return {
            show: true,
            maxWidth: 0,
            refreshed: false,
            searchParamsBackup: {},
            dictParam: null,
            tabRefreshed: true,
        }
    },
    props: ['titles', 'dicts', 'paramNames', 'url', 'otherParam', 'width',  'dataParamName', 'showSimplePage', "btnCenter", "showEmptyDataMsg", "notShowBtn", "showPage", "showResetBtn", "autoSearch"],
    watch: {
        'dicts': function () {
            if (!this.searchParamsBackup.dicts) {
                this.searchParamsBackup.dicts = Object.assign([], JSON.parse(JSON.stringify(this.dicts)));
            }
            var dictParam = {};
            for (let index = 0; index <  this.dicts.length; index++) {
                this.dicts[index].forEach((element, i) => {
                    if(element.selected == 1){
                        dictParam[this.paramNames[index]] = element.value;
                        return;
                    }
                });
            }
            this.dictParam = dictParam;
        }
    },
    mounted () {
        console.log("分页组建" + this.url);
        this.$nextTick(() => {
            var dictParam = {};
            for (let index = 0; index <  this.dicts.length; index++) {
                this.dicts[index].forEach((element, i) => {
                    if(element.selected == 1){
                        dictParam[this.paramNames[index]] = element.value;
                        return;
                    }
                });
            }
            this.dictParam = dictParam;
            this.refreshed = true;
            this.$nextTick(() => {
                this.titles = this.titles || [];
                this.titles.forEach((t, index) => {
                    if (this.$refs['title' + index]) {
                        var width = this.$refs['title' + index][0].offsetWidth;
                        if (width > this.maxWidth) {
                            this.maxWidth = width + 1;
                        }
                    }
                });
            });
        });
       

        this.searchParamsBackup.titles = Object.assign([], this.titles);
        this.searchParamsBackup.paramNames = Object.assign([], this.paramNames);
        this.searchParamsBackup.otherParam = Object.assign({}, JSON.parse(JSON.stringify(this.otherParam)));
        if (this.dicts && this.dicts.length > 0) {
            this.searchParamsBackup.dicts = Object.assign([], JSON.parse(JSON.stringify(this.dicts || [])));
        }
    },
    methods: {
        handleSearchResult: function(data) {
            this.$emit("handleSearchResult", data);
        },
        search: function(pageNo, isClickSearchBtn, param) {
            this.$refs.pagination.search(pageNo, isClickSearchBtn, param);
        },
        gotoPage: function(pageNo){
            this.$refs.pagination.search(pageNo);
        },
        refresh: function(pageNo) {
            this.$refs.pagination.refresh(pageNo);
        },
        conditionSelected: function(paramName, index, dictValue) {
            this.dicts[index].forEach((element, i) => {
                if(element.value == dictValue){
                    this.$set(this.dicts[index][i], 'selected', 1);
                } else {
                    this.$set(this.dicts[index][i], 'selected', 0);
                }
            });

            var isSearch = true;
        	if(this.$parent.handleLevelTab) {
                // 分级查询,不用直接返回true
                isSearch = this.$parent.handleLevelTab(paramName, dictValue);
                if (isSearch) {
                    if (this.$parent.resetNextLevel) {
                        var reset = this.$parent.resetNextLevel(paramName);
                        if (reset) {
                            var i = this.paramNames.indexOf(paramName);
                            if (this.paramNames.length > (i + 1)) {
                                this.$refs.pagination.searchForm[this.paramNames[i + 1]] = "";
                            }
                        }
                    }
                }
                this.$refs.pagination.searchForm[paramName] = dictValue;
            }
            
            this.tabRefreshed = false;
            this.$nextTick(() => {
                this.tabRefreshed = true;
            });
            if (isSearch) {
                this.$refs.pagination.searchForm[paramName] = dictValue;
                this.gotoPage(1);
            }
        },
        reset: function(listView) {
            listView.reset(this.searchParamsBackup);
        }
    }
}
</script>
<style scoped>
.search-condition-row {
    font-size: 12px;
    color: #333;
    box-sizing: border-box;
    border-bottom: 1px dashed #f2f2f2;
    /* height: 0.44rem;
    width: 100%;
    padding-top: 0.08rem;
     */
    height: 44px;
    width: 100%;
    padding-top: 8px
}
.search-condition-row > span {
    /* margin: 0 0.05rem;
    font-size: 12px;
    height: 0.28rem;
    line-height: 0.28rem;
    color: #595e66;
    padding: 0.05rem 0.1rem; */
    background: #eceff3;
    cursor: pointer;
    margin: 0 5px;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    color: #595e66;
    padding: 5px 10px;
}
.search-condition-row > span.title {
    cursor: default;
    background: none;
    padding: 0;
    /* margin-right: 0.11rem; */
    margin-right: 11px;
    margin-left: 0;
    display: inline-block;
    text-align: right;
}
.search-condition-row > span.active, .search-condition-row > span:hover {
    background: #15c2ed;
    color: #fff;
}
.search-condition-row > span.title:hover {
    background: none;
    color: #333;
}
.search-condition-row input{
    /* padding: 0 0.1rem;
    height: 0.26rem;
    line-height: 0.28rem; */
    color: #595e56;
    font-size: 12px;
    border: 1px solid #ced2d7;
    /* margin-right: 0.1rem; */
    margin-right: 10px;
    padding: 0 10px;
    height: 26px;
    line-height: 28px;
}
.search-condition-row .condition-item:first-child {
    padding-left: 0;
}

.search-condition-row .layui-btn-primary:hover {
    border: 1px solid #ff7c4d;
    color: #ff7c4d;
}

.search-condition-row .layui-btn-orange, .search-condition-row .layui-btn-orange:hover {
    color: #fff;
    border: 1px solid #ff7c4d;
    background: #ff7c4d;
}
button {
    cursor: pointer;
}
/** 查询部分 end*/
</style>
