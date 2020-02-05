<template>
   <div class="search-box">
        <div 
            v-for="(title, index) in titles"
            :key="title + index"
            class="search-condition-row">
            <span class="title">{{ title }}:</span>
            <template v-for="dict in dicts[index]">
                <span 
                    @click="conditionSelected(paramNames[index], index, dict.value)"
                    :class="{'active': dict.selected}"
                    :key="dict.value">
                    {{ dict.label }}
                </span>
			</template>
            <slot :name="'dict' + index"></slot>
            <!-- <input type="" name="" id="datepicker" value="" class="timeDay stateInput" lay-key="1"> 至
            <input type="" name="" id="datepicker2" value="" class="timeSecond stateInput" lay-key="2">
            <span class="custom">自定义</span> -->
        </div>
        <div class="search-condition-row">
            <slot name="searchBtnBefore"></slot>
            <span @click="search(1, true)" class="active">查询</span>
        </div>
    </div>
</template>
<script>
import request from '@/utils/request';
import bus from '@/assets/js/event.js'

export default {
    data () {
        return {
            searchForm: {
                pageSize: 6,
                pageNo: 1
            },
            searchResult: {},
        }
    },
    props: ['titles', 'dicts', 'paramNames', 'url', 'otherParam'],
    mounted () {
        this.$on('search', (val) => {
            this.search(val);
        });
        bus.$on('gotoPage', (val) => {
            this.search(val);
        });
        this.search(1);
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
               this.$emit('handleSearchResult', response.data); 
            });
        },
        conditionSelected: function(paramName, index, dictValue) {
            this.dicts[index].forEach((element, i) => {
                if(element.value == dictValue){
                    this.$set(this.dicts[index][i], 'selected', 1);
                } else {
                    this.$set(this.dicts[index][i], 'selected', 0);
                }
            });
        	this.searchForm[paramName] = dictValue;
        	//items.push(vm[dataKey][value]);
        	this.search(1);
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
    padding: 0 30px;
    margin: 0 10px;
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
    cursor: none;
    background: none;
    padding: 0;
    /* margin-right: 0.11rem; */
    margin-right: 11px;
    margin-left: 0;
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
/** 查询部分 end*/
</style>


