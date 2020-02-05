<template>
    <div>
        <div class="search-box">
            <slot></slot>
            <div v-if="type == 1" class="layui-card-body" style="padding-bottom: 0px;padding-top: 20px;display: inline-block;width: 100%">
                <div class="layui-form" action="" lay-filter="component-form-element">
                    <div class="layui-row layui-col-space10 layui-form-item" style="margin-bottom: 0px;">
                        <div class="layui-form toolbar">
                            <layui-item>
                                <slot name="searchBtnBefore"></slot>
                                <layui-inline v-if="showBtn">
                                    <button @click="search(1, true)" class="layui-btn icon-btn"><i class="layui-icon"></i>搜索</button>
                                    <button v-if="showResetBtn" @click="reset" class="layui-btn icon-btn"><i class="fa fa-repeat"></i> 重置</button>
                                </layui-inline>
                                <slot name="searchBtnAfter"></slot>
                            </layui-item>
                        </div>
                    </div>
                </div>
            </div>
            <slot name="custom"></slot>
            <div v-if="type == 2 && showBtn" class="search-condition-row">
                <slot name="searchBtnBefore"></slot>
                <template>
                    <button v-if="!btnCenter" @click="search(1, true)" class="layui-btn layui-btn-sm layui-btn-orange">查询</button>
                    <button v-if="!btnCenter && showResetBtn" @click="reset" class="layui-btn layui-btn-sm layui-btn-orange">重置</button>
                    <div v-if="btnCenter" style="text-align: center">
                        <button @click="search(1, true)" class="layui-btn layui-btn-sm layui-btn-orange">查询</button>
                        <button v-if="showResetBtn" @click="reset" class="layui-btn layui-btn-sm layui-btn-orange">重置</button>
                    </div>
                </template>
                <!-- <span @click="search(1, true)" class="active">查询</span> -->
                <slot name="searchBtnAfter"></slot>
            </div>
        </div>
        <slot v-if="show" name="opera"></slot>
        <slot v-if="show" name="main"></slot>
        <div v-if="showEmptyDataMsg && isSendReq && error != true && show && isEmptyList()" class="tr non-info show border-bottom-none">
            <span>没有查询到符合条件的记录</span>
        </div>
        <div v-if="isSendReq && error" class="tr non-info show border-bottom-none">
            <span style="color:red">{{ httpStatus != 403 ? '网络错误' : '无权访问'}}</span>
        </div>
        <div v-if="show && showPage && !error && page && page.totalCount" class="layui-box layui-laypage layui-laypage-default laypage-box" style="float: right;">
            <span v-if="!showSimplePage" class="layui-laypage-count">共 {{ page.totalCount }} 条,共 {{ page.totalPage }} 页</span>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-first': true, 'layui-disabled': page.firstPage}" 
                @click="gotoPage(1, page.firstPage)">首页</a>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-prev': true, 'layui-disabled': page.firstPage}"
                @click="gotoPage(page.pageNo - 1, page.firstPage)">上一页</a>
            <template v-for="(item, index) in (page.end - page.begin + 1)">
                <span 
                    v-if="(index + Number(page.begin)) == page.pageNo" 
                    class="layui-laypage-curr"
                    :key="'sub-page-' + index">
                    <em class="layui-laypage-em"></em>
                    <em>{{ index + Number(page.begin) }}</em>
                </span>
                <a 
                    v-if="(index + Number(page.begin)) != page.pageNo"
                    :key="'sub-page-' + index"
                    href="javascript:;"
                    @click="gotoPage(index + Number(page.begin))">
                    {{ index + Number(page.begin) }}
                </a>
            </template>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-next': true, 'layui-disabled': page.lastPage}"
                @click="gotoPage(Number(page.pageNo) + 1, page.lastPage)"
                >下一页</a>
            <a 
                href="javascript:;" 
                :class="{'layui-laypage-last': true, 'layui-disabled': page.lastPage}" 
                @click="gotoPage(page.totalPage, page.lastPage)">尾页</a>
            <span v-if="!showSimplePage" class="layui-laypage-limits">
                <select lay-ignore="" v-model="searchForm.pageSize">
                    <option value="10" selected="">10 条/页</option>
                    <option value="20">20 条/页</option>
                    <option value="30">30 条/页</option>
                    <option value="40">40 条/页</option>
                    <option value="50">50 条/页</option>
                    <option value="100">100 条/页</option>
                    <option value="200">200 条/页</option>
                </select>
            </span>
            <a v-if="!showSimplePage" href="javascript:;" data-page="1" class="layui-laypage-refresh" @click="refresh(null)">
                <i class="layui-icon layui-icon-refresh"></i>
            </a>
            <span v-if="!showSimplePage" class="layui-laypage-skip layui-hide-xs">到第
                <input v-model="inputPageNo" type="number" min="1" class="layui-input">页
                <button type="button" class="layui-laypage-btn" @click="gotoCustomPage">确定</button>
            </span>
        </div>
        <div style="clear: both"></div>
    </div>
</template>
<script>
import request from '@/utils/request';
import bus from '@/assets/js/event.js'
let _ = require('lodash')

export default {
    data () {
        return {
            searchForm: {
                pageSize: 10,
                pageNo: 1
            },
            searchResult: {},
            page: {},
            show: false,
            inputPageNo: '',
            error: false,
            isSendReq: false,
            searchType: 1,
            isEmptyData: false,
            httpStatus: -1,
            searchFormBackUp: {},
            reseting: false,
        }
    },
    props: {
        type: {
            type: String,
            default: '1'
        },
        url: {
            type: String,
            default: ''
        },
        otherParam: {
            type: Object,
            default: () => {
                return {};
            }
        },
        dictParam: {
            type: Object,
            default: () => {
                return {};
            }
        },
        dataParamName: {
            type: String,
            default: null
        },
        showPage: {
            type: Boolean,
            default: true
        },
        showSimplePage: {
            type: Boolean,
            default: false
        },
        btnCenter: {
            type: Boolean,
            default: false
        },
        meReset: {
            type: Boolean,
            default: true
        },
        showEmptyDataMsg: {
            type: Boolean,
            default: true
        },
        showBtn: {
            type: Boolean,
            default: true
        },
        showResetBtn: {
            type: Boolean,
            default: true
        },
        autoSearch: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        'searchForm.pageSize': function() {
            this.search(this.searchForm.pageNo);
        },
        otherParam: {
            handler() {
                if (this.autoSearch && !this.reseting) {
                    for (const key in this.otherParam) {
                        if (this.otherParam.hasOwnProperty(key)) {
                            const element = this.otherParam[key];
                            this.searchForm[key] = element;
                        }
                    }
                    this._autoSearch(1, true);
                }
            },
            deep: true
        },
    },
    mounted () {
        console.log("Simple分页组建" + this.url);
        for (const key in this.otherParam) {
            if (this.otherParam.hasOwnProperty(key)) {
                const element = this.otherParam[key];
                this.searchForm[key] = element;
            }
        }
        for (const key in this.dictParam) {
            if (this.dictParam.hasOwnProperty(key)) {
                const element = this.dictParam[key];
                this.searchForm[key] = element;
            }
        }
        this.searchFormBackUp = Object.assign({}, this.searchForm);
        this.$nextTick(() => {
            this.search(1);
            this.show = true;
        });
    },
    methods: {
        _autoSearch: _.debounce(function() {
            this.search(1, true);
        }, 500),
        isEmptyList: function() {
            return !this.dataParamName ? !(this.page && this.page.totalCount > 0) : this.isEmptyData;
        },
        search: function(pageNo, isClickSearchBtn, param, type){
            if(isClickSearchBtn){
                type = 1;
                for (const key in this.otherParam) {
                    if (this.otherParam.hasOwnProperty(key)) {
                        const element = this.otherParam[key];
                        this.searchForm[key] = element;
                    }
                }
            }

            if (param) {
                for (const key in param) {
                    if (param.hasOwnProperty(key)) {
                        const element = param[key];
                        this.searchForm[key] = element;
                    }
                }
            }

            if (type) {
                this.searchType = type;
            } else {
                type = this.searchType;
            }
            this.searchForm['pageNo'] = pageNo;
            var searchForm = JSON.parse(JSON.stringify(this.searchForm));
            if (this.$parent.searchBefore) {
                searchForm = this.$parent.searchBefore(searchForm, isClickSearchBtn, type);
            }
            loading();
        	request.get(this.url, {params: searchForm}).then(response => {
                this.page =  response.data ? ((response.data.pageNo ? response.data : response.data.page) || {}) : {};
                if (this.dataParamName) {
                    this.isEmptyData = false;
                    var paramNames = this.dataParamName.split(".");
                    var val = response;
                    paramNames.forEach(element => {
                        val = val[element];
                        if (!val || val.length <= 0) {
                            this.isEmptyData = true;
                            return;
                        }
                    });
                }
                this.$emit('handleSearchResult', response.data || {}); 
                closeLoading();
                this.isSendReq = true;
                this.error = false;
                if (this.reseting) {
                    this.$nextTick(() => {
                        this.reseting = false;
                    });
                }
            }).catch((err) => {
                this.$emit('handleSearchResult', {
                    page: {}
                });
                this.httpStatus = err.response ? err.response.status : -1;
                this.error = true;
                this.isSendReq = true;
                closeLoading();
            });
        },
        gotoPage: function(pageNo, disabled){
            if (disabled) {
                return;
            }
            this.search(pageNo);
        },
        gotoCustomPage: function() {
            if(checkNumber(this.inputPageNo)) {
                this.gotoPage(Number(this.inputPageNo) > Number(this.page.totalPage) ? this.page.totalPage : this.inputPageNo);
            } else {
                alert("请输入正整数");
            }
            
            function checkNumber(num) {
                var r = /^\+?[1-9][0-9]*$/;　　//正整数
                return r.test(num);
            }
        },
        refresh: function(pageNo) {
            this.search(pageNo || this.searchForm.pageNo);
        },
        reset: function() {
            var listView = this.$parent;
            this.reseting = true;
            while(true) {
                if (!listView) {
                    break;
                }
                if (listView.menuId) {
                    this.searchForm = Object.assign({}, this.searchFormBackUp);
                    if (this.meReset) {
                        listView.reset({
                            otherParam: this.searchFormBackUp
                        });
                    } else {
                        this.$parent.reset(listView);
                    }
                    if (listView.resetSearchBefore) {
                        listView.resetSearchBefore();
                    }
                    this.gotoPage(1);
                    break;
                }
                listView = listView.$parent;
            }
            bus.$emit('fieldOrder', {
                vpage: this
            });
        },
        changePageSize: function(e) {
            this.$set(this.searchForm, 'pageSize', e.target.value);
            this.search(this.searchForm.pageNo);
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
    /* height: 44px; */
    width: 100%;
    padding-top: 8px;
    display: inline-block;
    min-height: 44px;
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
    background: #ff7c4d;
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
div.non-info {
    width: 100%;
    padding-top: 0;
    display: none;
    padding-bottom: 0;
    text-align: center;
    font-size: 18px;
    color: #323232;
}
.laypage-box {
    margin-bottom: 40px;
}
.layui-card-body {
    padding: 0;
}
/** 查询部分 end*/
</style>


