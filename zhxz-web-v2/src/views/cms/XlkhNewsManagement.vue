<template>
    <cms-article-list 
        ref="cal" 
        title="信联动态" 
        text="信联动态" 
        categoryId="337873240252129280" 
        listView="XlkhNewsManagement"
        :simpleMode="true"></cms-article-list>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import CmsArticleList from "@/views/cms/CmsArticleList"

export default {
	name: 'XlkhNewsManagement',
    extends: Base,
    components: {
        CmsArticleList
    },
    data () {
        return {
            
        }
    },
    methods: {
        getPagination: function() {
            return this.$refs.cal.$refs.pagination;
        },
    }
}
</script>