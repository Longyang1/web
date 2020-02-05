<template>
    <div>
        <div class="search-box">
            <div 
                v-for="(title, index) in titles"
                :key="title + index"
                class="search-condition-row">
                <span 
                    v-if="show"
                    class="title" 
                    :style="{'width': (width > 0 ? width : (maxWidth == 0 ? 'auto' : maxWidth + 'px'))}"
                    :ref="'title' + index">{{ title }}:</span>
                <template v-for="dict in dicts[index]">
                    <span 
                        @click="conditionSelected(paramNames[index], index, dict.value)"
                        :class="{'active': dict.selected}"
                        :key="dict.value">
                        {{ dict.label }}
                    </span>
                </template>
                <slot v-if="show" :name="'dict' + index"></slot>
            </div>
            <slot name="custom"></slot>
            <div v-if="show" class="search-condition-row">
                <slot name="searchBtnBefore"></slot>
                <span @click="search(1, true)" class="active">查询</span>
                <slot name="searchBtnAfter"></slot>
            </div>
        </div>
        <slot name="opera"></slot>
        <slot v-if="show" name="main"></slot>
        <div v-if="show && page && page.totalCount" class="layui-box layui-laypage layui-laypage-default" id="layui-laypage-10" style="float: right;">
            <span class="layui-laypage-count">共 {{ page.totalCount }} 条,共 {{ page.totalPage }} 页</span>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-first': true, 'layui-disabled': page.firstPage}" 
                @click="gotoPage(1)">首页</a>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-prev': true, 'layui-disabled': page.firstPage}"
                @click="gotoPage(page.pageNo - 1)">上一页</a>
            <template v-for="(item, index) in (page.end - page.begin + 1)">
                <span 
                    v-if="(index + page.begin) == page.pageNo" 
                    class="layui-laypage-curr"
                    :key="'sub-page-' + index">
                    <em class="layui-laypage-em"></em>
                    <em>{{ index + page.begin }}</em>
                </span>
                <a 
                    v-if="(index + page.begin) != page.pageNo"
                    :key="'sub-page-' + index"
                    href="javascript:;"
                    @click="gotoPage(index + page.begin)">
                    {{ index + page.begin }}
                </a>
            </template>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-next': true, 'layui-disabled': page.lastPage}"
                @click="gotoPage(page.pageNo + 1)"
                >下一页</a>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-last': true, 'layui-disabled': page.lastPage}" 
                @click="gotoPage(page.totalPage)">尾页</a>
            <span class="layui-laypage-limits">
                <select lay-ignore="">
                    <option value="10" selected="">10 条/页</option>
                    <option value="20">20 条/页</option>
                    <option value="30">30 条/页</option>
                    <option value="40">40 条/页</option>
                    <option value="50">50 条/页</option>
                </select>
            </span>
            <a href="javascript:;" data-page="1" class="layui-laypage-refresh">
                <i class="layui-icon layui-icon-refresh"></i>
            </a>
            <span class="layui-laypage-skip">到第
                <input type="text" min="1" value="1" class="layui-input">页
                <button type="button" class="layui-laypage-btn">确定</button>
            </span>
        </div>
        <div style="clear: both"></div>
    </div>
</template>
<script>
import request from '@/utils/request';

export default {
    data () {
        return {
            searchForm: {
                pageSize: 10,
                pageNo: 1
            },
            searchResult: {},
            page: {},
            show: true,
            maxWidth: 0,
        }
    },
    props: ['titles', 'dicts', 'paramNames', 'url', 'otherParam', 'width'],
    mounted () {
        // this.$on('search', (val) => {
        //     this.search(val);
        // });
        // bus.$on('gotoPage', (val) => {
        //     this.search(val);
        // });
        console.log("分页组建" + this.url);
        this.search(1);
        this.titles.forEach((t, index) => {
            var width = this.$refs['title' + index][0].offsetWidth;
            if (width > this.maxWidth) {
                this.maxWidth = width + 1;
            }
        });
        this.show = false;
        this.$nextTick(() => {
            this.show = true;
        });
    },
    methods: {
        radioClick: function(val){
            if(this.disabled){
                return;
            }
            this.curVal = val;
            this.$emit('input', val);
        },
        search: function(pageNo, isClickSearchBtn){
            if(isClickSearchBtn){
                for (const key in this.otherParam) {
                    if (this.otherParam.hasOwnProperty(key)) {
                        const element = this.otherParam[key];
                        this.searchForm[key] = element;
                    }
                }
            }
        	this.searchForm['pageNo'] = pageNo;
        	request.get(this.url, {params: this.searchForm}).then(response => {
                this.page =  response.data.page;
                this.$emit('handleSearchResult', response.data);
            });
        },
        gotoPage: function(pageNo){
            this.search(pageNo);
        },
        refresh: function() {
            this.search(this.searchForm.pageNo);
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
                isSearch = this.$parent.handleLevelTab(paramName,dictValue);//分级查询,不用直接返回true
            }
            if (isSearch) {
                this.searchForm[paramName] = dictValue;
                this.search(1, true);
            }
        }
    }
}
</script>
<style scoped>
    /** 查询部分 start*/
.search-box, .search-result-box {
    box-sizing: border-box;
    background: #fff;
    /* margin-bottom: 0.03rem;
    padding: 0 0.3rem;
    margin: 0 0.1rem; */
    margin-bottom: 30px;
    /* padding: 0 30px;
    margin: 0 10px; */
}
.search-box {
    margin-bottom: 5px;
}
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
    text-align: center;
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
.layui-laypage .layui-laypage-curr .layui-laypage-em {
    background-color: #1E9FFF;
}
.layui-laypage a:hover {
    color: #1E9FFF;
}
/** 查询部分 end*/
</style>
